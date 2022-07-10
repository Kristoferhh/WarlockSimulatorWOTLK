#include "../include/spell.h"

#include <iostream>
#include <utility>

#include "../include/aura.h"
#include "../include/aura_selection.h"
#include "../include/combat_log_breakdown.h"
#include "../include/common.h"
#include "../include/damage_over_time.h"
#include "../include/entity.h"
#include "../include/item_slot.h"
#include "../include/on_cast_proc.h"
#include "../include/on_crit_proc.h"
#include "../include/on_damage_proc.h"
#include "../include/on_hit_proc.h"
#include "../include/on_resist_proc.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/sets.h"
#include "../include/simulation.h"
#include "../include/talents.h"

Spell::Spell(Entity& entity, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot)
    : entity(entity),
      aura_effect(std::move(aura)),
      dot_effect(std::move(dot)),
      spell_school(SpellSchool::kNoSchool),
      attack_type(AttackType::kNoAttackType),
      spell_type(SpellType::kNoSpellType) {}

void Spell::Setup() {
  if (min_dmg > 0 && max_dmg > 0) {
    base_damage = (min_dmg + max_dmg) / 2.0;
  }

  if (min_mana_gain > 0 && max_mana_gain > 0) {
    mana_gain = (min_mana_gain + max_mana_gain) / 2;
  }

  // If the mana cost is between 0 and 1 then it's a percentage of the entity's base mana
  if (mana_cost > 0 && mana_cost <= 1) {
    mana_cost *= entity.kBaseMana;
  }

  if (entity.recording_combat_log_breakdown && !entity.combat_log_breakdown.contains(name)) {
    entity.combat_log_breakdown.insert({name, std::make_shared<CombatLogBreakdown>(name)});
  }

  if (entity.type == EntityType::kPlayer) {
    bonus_hit_chance += entity.player->talents.suppression;

    if (attack_type == AttackType::kMagical && entity.type == EntityType::kPlayer) {
      multiplicative_modifier *= 1 + 0.01 * entity.player->talents.malediction;
    }

    if (spell_type == SpellType::kDestruction) {
      mana_cost *= 1 - (entity.player->talents.cataclysm == 1   ? 0.04
                        : entity.player->talents.cataclysm == 2 ? 0.07
                        : entity.player->talents.cataclysm == 3 ? 0.1
                                                                : 0);
      bonus_crit_chance += 5 * entity.player->talents.devastation;
    } else if (spell_type == SpellType::kAffliction) {
      mana_cost *= 1 - 0.02 * entity.player->talents.suppression;
    }

    if (entity.player->sets.t6 >= 4 && (name == SpellName::kShadowBolt || name == SpellName::kIncinerate)) {
      additive_modifier += 0.06;
    }

    // TODO does curse of doom still not benefit from SM?
    if (spell_school == SpellSchool::kShadow && name != SpellName::kCurseOfDoom) {
      additive_modifier += 0.03 * entity.player->talents.shadow_mastery;
    }

    if (name == SpellName::kCurseOfAgony || name == SpellName::kCorruption || name == SpellName::kSeedOfCorruption) {
      additive_modifier += 0.01 * entity.player->talents.contagion;
    }

    if (spell_school == SpellSchool::kFire) {
      additive_modifier += 0.03 * entity.player->talents.emberstorm;
    }

    if (name == SpellName::kImmolate) {
      additive_modifier += 0.1 * entity.player->talents.improved_immolate;  // TODO does this also apply to the dot
    }

    if (entity.player->settings.meta_gem_id == 34220) {
      crit_damage_multiplier *= 1.03;
    }

    if ((spell_type == SpellType::kDestruction || name == SpellName::kFirebolt) && entity.player->talents.ruin > 0) {
      // Ruin doubles the *bonus* of your crits, not the Damage of the crit itself
      // So if your crit Damage % is e.g. 154.5% it would become 209% because
      // the 54.5% is being doubled
      crit_damage_multiplier -= 1;
      crit_damage_multiplier *= 1 + 0.2 * entity.player->talents.ruin;
      crit_damage_multiplier += 1;
    }

    if (name == SpellName::kDemonicEmpowerment || name == SpellName::kMetamorphosis) {
      // TODO confirm this is calculated correctly
      cooldown /= entity.player->talents.nemesis == 1   ? 1.1
                  : entity.player->talents.nemesis == 2 ? 1.2
                  : entity.player->talents.nemesis == 3 ? 1.3
                                                        : 1;
    }
  } else if (entity.type == EntityType::kPet) {
    additive_modifier += 0.04 * entity.player->talents.unholy_power;
  }

  entity.spell_list.push_back(this);
}

void Spell::Reset() {
  casting                    = false;
  cooldown_remaining         = 0;
  amount_of_casts_this_fight = 0;
}

bool Spell::Ready() {
  return CanCast() && HasEnoughMana();
}

bool Spell::HasEnoughMana() const {
  return GetManaCost() <= entity.stats.mana;
}

// TODO make this easier to read :-)
bool Spell::CanCast() {
  return (entity.auras.drain_soul == nullptr || !entity.auras.drain_soul->is_active) && cooldown_remaining <= 0 &&
         (is_non_warlock_ability ||
          (!on_gcd || entity.gcd_remaining <= 0) && (is_proc || entity.cast_time_remaining <= 0)) &&
         (!limited_amount_of_casts || amount_of_casts_this_fight < amount_of_casts_per_fight);
}

double Spell::GetManaCost() const {
  auto true_mana_cost = mana_cost * entity.stats.mana_cost_modifier;

  if (entity.type == EntityType::kPlayer && (entity.player->items.trinket_1 == ItemId::kSparkOfHope ||
                                             entity.player->items.trinket_2 == ItemId::kSparkOfHope)) {
    true_mana_cost -= 42;
  }

  return true_mana_cost;
}

double Spell::GetCastTime() {
  auto true_cast_time = cast_time / entity.GetHastePercent();

  if (name == SpellName::kIncinerate && entity.player->auras.molten_core != nullptr &&
      entity.player->auras.molten_core->is_active) {
    true_cast_time /= 1.3;
  }

  if (name == SpellName::kSoulFire && entity.player->auras.decimation != nullptr &&
      entity.player->auras.decimation->is_active) {
    true_cast_time /= 1 + 0.2 * entity.player->talents.decimation;
  }

  if (spell_type == SpellType::kDestruction && entity.auras.backdraft != nullptr) {
    true_cast_time /= 1 + 0.1 * entity.player->talents.backdraft;
  }

  return true_cast_time;
}

void Spell::Tick(const double kTime) {
  if (cooldown_remaining > 0 && cooldown_remaining - kTime <= 0) {
    if (name == SpellName::kPowerInfusion) {
      entity.player->power_infusions_ready++;
    }

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(entity.name + "'s " + name + " off cooldown");
    }
  }

  cooldown_remaining -= kTime;

  if (casting && entity.cast_time_remaining <= 0) {
    Cast();
  }
}

double Spell::GetCooldown() {
  return cooldown;
}

void Spell::Cast() {
  const double kCurrentMana = entity.stats.mana;
  const double kManaCost    = GetManaCost();
  cooldown_remaining        = GetCooldown();
  casting                   = false;
  amount_of_casts_this_fight++;

  OnCastProcs();

  for (auto& spell_name : shared_cooldown_spells) {
    for (const auto& kPlayerSpell : entity.spell_list) {
      if (kPlayerSpell->name == spell_name) {
        kPlayerSpell->cooldown_remaining = cooldown;
      }
    }
  }

  if (name == SpellName::kPowerInfusion) {
    entity.player->power_infusions_ready--;
  }

  if (name == SpellName::kIncinerate || name == SpellName::kSoulFire && entity.player->auras.molten_core != nullptr &&
                                            entity.player->auras.molten_core->is_active) {
    entity.player->auras.molten_core->DecrementStacks();
  }

  if ((name == SpellName::kShadowBolt || name == SpellName::kIncinerate || name == SpellName::kSoulFire) &&
      entity.player->auras.decimation != nullptr && entity.simulation->GetEnemyHealthPercent() <= 35) {
    entity.player->auras.decimation->Apply();
  }

  if (aura_effect == nullptr && entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->casts++;
  }

  if (mana_cost > 0 && !entity.infinite_mana) {
    entity.stats.mana -= kManaCost;
    entity.five_second_rule_timer_remaining = 5;

    if (entity.auras.meteorite_crystal != nullptr && entity.auras.meteorite_crystal->is_active) {
      entity.auras.meteoric_inspiration->Apply();
    }
  }

  if (cast_time > 0 && entity.ShouldWriteToCombatLog()) {
    auto msg = entity.name + " finished casting " + name;
    msg += " - Mana: " + DoubleToString(kCurrentMana) + " -> " + DoubleToString(entity.stats.mana);
    msg += " - Mana Cost: " + DoubleToString(round(kManaCost));

    if (entity.type == EntityType::kPlayer) {
      msg += " - Mana Cost Modifier: " + DoubleToString(round(entity.stats.mana_cost_modifier * 100)) + "%";
    }

    entity.CombatLog(msg);
  }

  if (gain_mana_on_cast) {
    ManaGainOnCast();
  }

  const SpellCastResult kSpellCastResult =
      attack_type == AttackType::kPhysical ? PhysicalSpellCast() : MagicSpellCast();

  if (kSpellCastResult.is_miss || kSpellCastResult.is_dodge) {
    return;
  }

  OnSpellHit(kSpellCastResult);
}

void Spell::Damage(const bool kIsCrit, const bool kIsGlancing) {
  const std::vector<double> kConstantDamage = GetConstantDamage();
  const double kBaseDamage                  = kConstantDamage[0];
  auto total_damage                         = kConstantDamage[1];
  const double kDamageModifier              = kConstantDamage[2];
  const double kPartialResistMultiplier     = kConstantDamage[3];
  const double kSpellPower                  = kConstantDamage[4];

  if (kIsCrit) {
    total_damage *= crit_damage_multiplier;
    OnCritProcs();
  }

  if (kIsGlancing) {
    total_damage *= entity.pet->glancing_blow_multiplier;
  }

  OnDamageProcs();
  entity.player->iteration_damage += total_damage;

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->iteration_damage += total_damage;
  }

  if (entity.ShouldWriteToCombatLog()) {
    CombatLogDamage(kIsCrit,
                    kIsGlancing,
                    total_damage,
                    kBaseDamage,
                    kSpellPower,
                    crit_damage_multiplier,
                    kDamageModifier,
                    kPartialResistMultiplier);
  }
}

// Returns the non-RNG Damage of the spell (basically just the base Damage +
// spell power + Damage modifiers, no crit/miss etc.)
std::vector<double> Spell::GetConstantDamage() {
  auto total_damage                     = GetBaseDamage();
  const double kBaseDamage              = total_damage;
  const double kSpellPower              = entity.GetSpellPower(spell_school);
  const double kDamageModifier          = GetDamageModifier();
  const double kPartialResistMultiplier = GetPartialResistMultiplier();

  // If casting Incinerate and Immolate is up, add the bonus Damage
  if (name == SpellName::kIncinerate && entity.player->auras.immolate != nullptr &&
      entity.player->auras.immolate->is_active) {
    if (entity.player->settings.randomize_values && bonus_damage_from_immolate_min > 0 &&
        bonus_damage_from_immolate_max > 0) {
      total_damage += entity.player->rng.Range(bonus_damage_from_immolate_min, bonus_damage_from_immolate_max);
    } else {
      total_damage += bonus_damage_from_immolate;
    }
  }

  if (attack_type == AttackType::kMagical) {
    total_damage += kSpellPower * coefficient;
  }

  total_damage *= kDamageModifier;

  if (attack_type == AttackType::kMagical) {
    total_damage *= kPartialResistMultiplier;
  }

  if (attack_type == AttackType::kPhysical) {
    total_damage *= entity.pet->enemy_damage_reduction_from_armor;
  }

  return std::vector{kBaseDamage, total_damage, kDamageModifier, kPartialResistMultiplier, kSpellPower};
}

double Spell::GetBaseDamage() {
  if (entity.player->settings.randomize_values && min_dmg > 0 && max_dmg > 0) {
    return entity.player->rng.Range(min_dmg, max_dmg);
  }

  return base_damage;
}

double Spell::GetCritChance() const {
  auto crit_chance = bonus_crit_chance + (attack_type == AttackType::kMagical    ? entity.GetSpellCritChance()
                                          : attack_type == AttackType::kPhysical ? entity.GetMeleeCritChance()
                                                                                 : 0);

  if (entity.pet != nullptr && (spell_school == SpellSchool::kFire && entity.pet->pet_name == PetName::kImp ||
                                spell_school == SpellSchool::kShadow && entity.pet->pet_name == PetName::kSuccubus)) {
    crit_chance += entity.player->talents.master_demonologist;
  }

  if (name == SpellName::kSoulFire && entity.player->auras.molten_core != nullptr &&
      entity.player->auras.molten_core->is_active) {
    crit_chance += 15;
  }

  return crit_chance;
}

double Spell::PredictDamage() {
  const std::vector<double> kConstantDamage = GetConstantDamage();
  const double kNormalDamage                = kConstantDamage[1];
  auto crit_damage                          = 0.0;
  auto crit_chance                          = 0.0;
  auto chance_to_not_crit                   = 0.0;

  if (can_crit) {
    crit_damage        = kNormalDamage * crit_damage_multiplier;
    crit_chance        = GetCritChance() / 100.0;
    chance_to_not_crit = 1 - crit_chance;
  }

  const auto kHitChance = GetHitChance() / 100.0;
  auto estimated_damage = can_crit ? kNormalDamage * chance_to_not_crit + crit_damage * crit_chance : kNormalDamage;

  // Add the predicted Damage of the DoT over its full duration
  if (dot_effect != nullptr) {
    estimated_damage += dot_effect->PredictDamage();
  }

  return estimated_damage * kHitChance / std::max(entity.GetGcdValue(), GetCastTime());
}

void Spell::OnCritProcs() {
  for (const auto& kProc : entity.on_crit_procs) {
    if (kProc->Ready() && kProc->ShouldProc(this) && entity.player->RollRng(kProc->proc_chance)) {
      kProc->StartCast();
    }
  }

  if (entity.auras.nevermelting_ice_crystal != nullptr && entity.auras.nevermelting_ice_crystal->is_active) {
    entity.auras.nevermelting_ice_crystal->DecrementStacks();
  }
}

void Spell::OnResistProcs() {
  for (const auto& kProc : entity.on_resist_procs) {
    if (kProc->Ready() && kProc->ShouldProc(this) && entity.player->RollRng(kProc->proc_chance)) {
      kProc->StartCast();
    }
  }
}

void Spell::OnDamageProcs() {
  for (const auto& kProc : entity.on_damage_procs) {
    if (kProc->Ready() && kProc->ShouldProc(this) && entity.player->RollRng(kProc->proc_chance)) {
      kProc->StartCast();
    }
  }
}

void Spell::OnHitProcs() {
  for (const auto& kProc : entity.on_hit_procs) {
    if (kProc->Ready() && kProc->ShouldProc(this) && entity.player->RollRng(kProc->proc_chance)) {
      kProc->StartCast();
    }
  }

  if (entity.type == EntityType::kPlayer &&
      (name == SpellName::kDrainSoul || name == SpellName::kShadowBolt || name == SpellName::kHaunt) &&
      entity.auras.corruption != nullptr && entity.auras.corruption->is_active &&
      entity.player->RollRng(20 * entity.player->talents.everlasting_affliction)) {
    entity.auras.corruption->ticks_remaining      = entity.auras.corruption->ticks_total;
    entity.auras.corruption->tick_timer_remaining = entity.auras.corruption->tick_timer_total;
  }
}

void Spell::OnCastProcs() {
  for (const auto& kProc : entity.on_cast_procs) {
    if (kProc->Ready() && kProc->ShouldProc(this) && entity.player->RollRng(kProc->proc_chance)) {
      kProc->StartCast();
    }
  }
}

void Spell::StartCast(const double kPredictedDamage) {
  if (on_gcd && !is_non_warlock_ability) {
    // Error: Casting a spell while GCD is active
    if (entity.gcd_remaining > 0) {
      entity.player->ThrowError(entity.name + " attempting to cast " + name + " while " + entity.name +
                                "'s GCD is at " + std::to_string(entity.gcd_remaining) + " seconds remaining");
    }

    entity.gcd_remaining = entity.GetGcdValue();

    // TODO improve
    if (entity.player->talents.amplify_curse == 1 &&
        (name == SpellName::kCurseOfTheElements || name == SpellName::kCurseOfDoom ||
         name == SpellName::kCurseOfAgony)) {
      entity.gcd_remaining = std::max(0.0, entity.gcd_remaining - 0.5);
    }

    if (entity.player->auras.backdraft != nullptr && entity.player->auras.backdraft->is_active &&
        spell_type == SpellType::kDestruction) {
      entity.gcd_remaining = std::max(0.0, entity.gcd_remaining / (1 + 0.1 * entity.player->talents.backdraft));
      entity.auras.backdraft->DecrementStacks();
    }
  }

  // Error: Starting to Cast a spell while casting another spell
  if (entity.cast_time_remaining > 0 && !is_non_warlock_ability && !is_proc) {
    entity.player->ThrowError(entity.name + " attempting to cast " + name + " while " + entity.name +
                              "'s cast time remaining is at " + std::to_string(entity.cast_time_remaining) + " sec");
  }

  // Error: Casting a spell while it's on cooldown
  if (cooldown > 0 && cooldown_remaining > 0) {
    entity.player->ThrowError(entity.name + " attempting to cast " + name + " while it's still on cooldown (" +
                              std::to_string(cooldown_remaining) + " seconds remaining)");
  }

  std::string combat_log_message;
  if (cast_time > 0) {
    casting                    = true;
    entity.cast_time_remaining = GetCastTime();

    if (!is_proc && entity.ShouldWriteToCombatLog()) {
      combat_log_message.append(entity.name + " started casting " + name +
                                " - Cast time: " + DoubleToString(entity.cast_time_remaining, 4) + " (" +
                                DoubleToString((entity.GetHastePercent() - 1) * 100, 4) +
                                "% haste at a base Cast speed of " + DoubleToString(cast_time, 2) + ")");
    }
  } else {
    if (!is_proc && entity.ShouldWriteToCombatLog()) {
      combat_log_message.append(entity.name + " casts " + name);

      if (name == SpellName::kMelee) {
        combat_log_message.append(" - Attack Speed: " + DoubleToString(GetCooldown(), 2) + " (" +
                                  DoubleToString(round(entity.GetHastePercent() * 10000) / 100.0 - 100, 4) +
                                  "% haste at a base attack speed of " + DoubleToString(cooldown, 2) + ")");
      }
    }

    Cast();
  }

  if (on_gcd && !is_non_warlock_ability && entity.ShouldWriteToCombatLog()) {
    combat_log_message.append(" - Global cooldown: " + DoubleToString(entity.gcd_remaining, 4));
  }

  if (kPredictedDamage > 0 && entity.ShouldWriteToCombatLog()) {
    combat_log_message.append(" - Estimated Damage / Cast time: " + DoubleToString(round(kPredictedDamage)));
  }

  if (combat_log_message.length() > 0) {
    entity.CombatLog(combat_log_message);
  }
}

bool Spell::IsCrit() const {
  if (entity.auras.empowered_imp != nullptr && entity.auras.empowered_imp->is_active) {
    entity.auras.empowered_imp->Fade();
    return true;
  }

  return entity.player->RollRng(GetCritChance());
}

bool Spell::IsHit() const {
  return entity.player->RollRng(GetHitChance());
}

double Spell::GetHitChance() const {
  if (attack_type == AttackType::kMagical) {
    return entity.stats.spell_hit_chance + entity.stats.extra_spell_hit_chance;
  }

  if (attack_type == AttackType::kPhysical) {
    return entity.stats.melee_hit_chance;
  }

  return 0;
}

SpellCastResult Spell::MagicSpellCast() {
  auto is_crit         = false;
  const auto kIsResist = can_miss && !IsHit();

  if (can_crit) {
    is_crit = IsCrit();

    if (is_crit && entity.recording_combat_log_breakdown) {
      // Increment the crit counter whether the spell hits or not so that the
      // crit % on the Damage breakdown is correct. Otherwise the crit % will be
      // lower due to lost crits when the spell misses.
      entity.combat_log_breakdown.at(name)->crits++;
    }
  }

  if (kIsResist) {
    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(name + " *resist*");
    }

    if (entity.recording_combat_log_breakdown) {
      entity.combat_log_breakdown.at(name)->misses++;
    }

    OnResistProcs();
  }

  return {kIsResist, is_crit};
}

double Spell::GetPartialResistMultiplier() const {
  auto enemy_resist = spell_school == SpellSchool::kShadow ? entity.settings.enemy_shadow_resist
                      : spell_school == SpellSchool::kFire ? entity.settings.enemy_fire_resist
                                                           : 0;

  enemy_resist = std::max(enemy_resist - static_cast<int>(entity.stats.spell_penetration),
                          entity.enemy_level_difference_resistance);

  if (enemy_resist <= 0) {
    return 1;
  }

  return 1.0 - 75.0 * enemy_resist / (entity.kLevel * 5) / 100.0;
}

double Spell::GetDamageModifier() const {
  auto damage_modifier        = entity.stats.damage_modifier * multiplicative_modifier;
  auto true_additive_modifier = additive_modifier;

  if (spell_school == SpellSchool::kShadow) {
    damage_modifier *= entity.stats.shadow_modifier;

    if (entity.type == EntityType::kPlayer && entity.simulation->GetEnemyHealthPercent() <= 35) {
      damage_modifier *= 1 + 0.04 * entity.player->talents.deaths_embrace;
    }
  } else if (spell_school == SpellSchool::kFire) {
    damage_modifier *= entity.stats.fire_modifier;

    if ((name == SpellName::kIncinerate || name == SpellName::kSoulFire) &&
        entity.player->auras.molten_core != nullptr && entity.player->auras.molten_core->is_active) {
      damage_modifier *= 1.18;
    }

    if ((name == SpellName::kIncinerate || name == SpellName::kChaosBolt) && entity.auras.immolate != nullptr &&
        entity.auras.immolate->is_active) {
      true_additive_modifier += 0.02 * entity.player->talents.fire_and_brimstone;
    }
  }

  if (attack_type == AttackType::kPhysical) {
    damage_modifier *= entity.stats.physical_modifier;
  }

  return true_additive_modifier * damage_modifier;
}

SpellCastResult Spell::PhysicalSpellCast() const {
  auto is_crit     = false;
  auto is_glancing = false;
  auto is_miss     = false;
  auto is_dodge    = false;
  const auto kCritChance =
      can_crit ? static_cast<int>((entity.GetMeleeCritChance() * entity.kFloatNumberMultiplier)) : 0;
  const auto kDodgeChance =
      kCritChance + static_cast<int>(StatConstant::kBaseEnemyDodgeChance * entity.kFloatNumberMultiplier);
  const auto kMissChance =
      kDodgeChance + static_cast<int>((100 - entity.stats.melee_hit_chance) * entity.kFloatNumberMultiplier);
  auto glancing_chance = kMissChance;

  // Only check for a glancing if it's a normal melee attack
  if (name == SpellName::kMelee) {
    glancing_chance += static_cast<int>(entity.pet->glancing_blow_chance * entity.kFloatNumberMultiplier);
  }

  // Check whether the roll is a crit, dodge, miss, glancing, or just a normal hit.

  // Crit
  if (const auto kAttackRoll = entity.player->GetRand(); can_crit && kAttackRoll <= kCritChance) {
    is_crit = true;

    if (entity.recording_combat_log_breakdown) {
      entity.combat_log_breakdown.at(name)->crits++;
    }
  }
  // Dodge
  else if (kAttackRoll <= kDodgeChance) {
    is_dodge = true;

    if (entity.recording_combat_log_breakdown) {
      entity.combat_log_breakdown.at(name)->dodge++;
    }

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(entity.name + " " + name + " *dodge*");
    }
  }
  // Miss
  else if (kAttackRoll <= kMissChance) {
    is_miss = true;

    if (entity.recording_combat_log_breakdown) {
      entity.combat_log_breakdown.at(name)->misses++;
    }

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(entity.name + " " + name + " *miss*");
    }
  }
  // Glancing Blow
  else if (kAttackRoll <= glancing_chance && name == SpellName::kMelee) {
    is_glancing = true;

    if (entity.recording_combat_log_breakdown) {
      entity.combat_log_breakdown.at(name)->glancing_blows++;
    }
  }

  return {is_miss, is_crit, is_glancing, is_dodge};
}

void Spell::OnSpellHit(const SpellCastResult& kSpellCastResult) {
  if (aura_effect != nullptr) {
    aura_effect->Apply();
  }

  if (dot_effect != nullptr) {
    dot_effect->Apply();
  }

  if (does_damage) {
    Damage(kSpellCastResult.is_crit, kSpellCastResult.is_glancing);
  }

  if (!is_item && !is_proc && !is_non_warlock_ability) {
    OnHitProcs();
  }
}

void Spell::CombatLogDamage(const bool kIsCrit,
                            const bool kIsGlancing,
                            const double kTotalDamage,
                            const double kSpellBaseDamage,
                            const double kSpellPower,
                            const double kCritMultiplier,
                            const double kDamageModifier,
                            const double kPartialResistMultiplier) const {
  auto msg = name + " ";

  if (kIsCrit) {
    msg += "*";
  }

  msg += DoubleToString(round(kTotalDamage));

  if (kIsCrit) {
    msg += "*";
  }

  if (kIsGlancing) {
    msg += " Glancing";
  }

  msg += " (" + DoubleToString(kSpellBaseDamage, 1) + " Base Damage";

  if (attack_type == AttackType::kMagical) {
    msg += " - " + DoubleToString(round(coefficient * 1000) / 1000, 3) + " Coefficient";
    msg += " - " + DoubleToString(round(kSpellPower)) + " Spell Power";
    msg += " - " + DoubleToString(round(kPartialResistMultiplier * 1000) / 10) + "% Partial Resist Multiplier)";
  } else if (attack_type == AttackType::kPhysical) {
    if (kIsGlancing) {
      msg += " - " + DoubleToString(entity.pet->glancing_blow_multiplier * 100, 1) + "% Glancing Blow Multiplier";
    }
    msg += " - " + DoubleToString(round(entity.pet->GetAttackPower())) + " Attack Power";
    msg += " - " + DoubleToString(round(entity.pet->enemy_damage_reduction_from_armor * 10000) / 100.0, 2) +
           "% Damage Modifier (Armor)";
  }

  if (kIsCrit) {
    msg += " - " + DoubleToString(kCritMultiplier * 100, 3) + "% Crit Multiplier";
  }

  msg += " - " + DoubleToString(round(kDamageModifier * 10000) / 100, 2) + "% Damage Modifier";

  entity.CombatLog(msg);
}

void Spell::ManaGainOnCast() const {
  const double kCurrentMana = entity.stats.mana;

  entity.stats.mana        = std::min(entity.stats.max_mana, kCurrentMana + mana_gain);
  const double kManaGained = entity.stats.mana - kCurrentMana;

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->iteration_mana_gain += kManaGained;
  }

  if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog("Player gains " + DoubleToString(kManaGained) + " mana from " + name + " (" +
                     DoubleToString(kCurrentMana) + " -> " + DoubleToString(entity.stats.mana) + ")");
  }
}

ShadowBolt::ShadowBolt(Player& player) : Spell(player) {
  name         = SpellName::kShadowBolt;
  cast_time    = CalculateCastTime();
  mana_cost    = 0.17;
  coefficient  = 3 / 3.5 + 0.04 * player.talents.shadow_and_flame;
  min_dmg      = 690;
  max_dmg      = 770;
  does_damage  = true;
  can_crit     = true;
  can_miss     = true;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kDestruction;
  attack_type  = AttackType::kMagical;
  additive_modifier += 0.02 * player.talents.improved_shadow_bolt;
  Spell::Setup();
}

void ShadowBolt::StartCast(double) {
  const bool kHasShadowTrance = entity.player->auras.shadow_trance != nullptr;

  if (kHasShadowTrance && entity.player->auras.shadow_trance->is_active) {
    cast_time = 0;
  }

  Spell::StartCast();

  if (kHasShadowTrance && entity.player->auras.shadow_trance->is_active) {
    cast_time = CalculateCastTime();
    entity.player->auras.shadow_trance->Fade();
  }
}

double ShadowBolt::CalculateCastTime() const {
  return 3 - 0.1 * entity.player->talents.bane;
}

Incinerate::Incinerate(Player& player) : Spell(player) {
  name                           = SpellName::kIncinerate;
  cast_time                      = 2.5 - 0.05 * player.talents.emberstorm;
  mana_cost                      = 0.14;
  coefficient                    = 2.5 / 3.5 + 0.04 * player.talents.shadow_and_flame;
  min_dmg                        = 582;
  max_dmg                        = 676;
  bonus_damage_from_immolate_min = 111;
  bonus_damage_from_immolate_max = 128;
  bonus_damage_from_immolate     = (bonus_damage_from_immolate_min + bonus_damage_from_immolate_max) / 2.0;
  does_damage                    = true;
  can_crit                       = true;
  can_miss                       = true;
  spell_school                   = SpellSchool::kFire;
  spell_type                     = SpellType::kDestruction;
  attack_type                    = AttackType::kMagical;
  Spell::Setup();
}

SearingPain::SearingPain(Player& player) : Spell(player) {
  name              = SpellName::kSearingPain;
  cast_time         = 1.5;
  mana_cost         = 0.08;
  coefficient       = 1.5 / 3.5;
  min_dmg           = 343;
  max_dmg           = 405;
  bonus_crit_chance = player.talents.improved_searing_pain == 1   ? 4
                      : player.talents.improved_searing_pain == 2 ? 7
                      : player.talents.improved_searing_pain == 3 ? 10
                                                                  : 0;
  does_damage       = true;
  can_crit          = true;
  can_miss          = true;
  spell_school      = SpellSchool::kFire;
  spell_type        = SpellType::kDestruction;
  attack_type       = AttackType::kMagical;
  Spell::Setup();
}

SoulFire::SoulFire(Player& player) : Spell(player) {
  name         = SpellName::kSoulFire;
  cast_time    = 6 - 0.4 * player.talents.bane;
  mana_cost    = 0.09;
  coefficient  = 1.15;
  min_dmg      = 1323;
  max_dmg      = 1657;
  does_damage  = true;
  can_crit     = true;
  can_miss     = true;
  spell_school = SpellSchool::kFire;
  spell_type   = SpellType::kDestruction;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

Shadowburn::Shadowburn(Player& player) : Spell(player) {
  name         = SpellName::kShadowburn;
  cooldown     = 15;
  mana_cost    = 0.2;
  coefficient  = 0.22 + 0.04 * player.talents.shadow_and_flame;
  min_dmg      = 775;
  max_dmg      = 865;
  does_damage  = true;
  can_crit     = true;
  is_finisher  = true;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kDestruction;
  can_miss     = true;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

DeathCoil::DeathCoil(Player& player) : Spell(player) {
  name         = SpellName::kDeathCoil;
  cooldown     = 120;
  mana_cost    = 0.23;
  coefficient  = 1.5 / 3.5;
  base_damage  = 790;
  does_damage  = true;
  is_finisher  = true;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kAffliction;
  can_miss     = true;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

Shadowfury::Shadowfury(Player& player) : Spell(player) {
  name         = SpellName::kShadowfury;
  cast_time    = 0.5;
  mana_cost    = 0.27;
  min_dmg      = 968;
  max_dmg      = 1152;
  does_damage  = true;
  can_crit     = true;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kDestruction;
  cooldown     = 20;
  coefficient  = 0.195;
  can_miss     = true;
  on_gcd       = false;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

SeedOfCorruption::SeedOfCorruption(Player& player) : Spell(player), aoe_cap(13580) {
  name         = SpellName::kSeedOfCorruption;
  min_dmg      = 1110;
  max_dmg      = 1290;
  mana_cost    = 0.34;
  cast_time    = 2;
  does_damage  = true;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kAffliction;
  coefficient  = 0.214;
  can_miss     = true;
  attack_type  = AttackType::kMagical;
  bonus_crit_chance += player.talents.improved_corruption;
  additive_modifier += 0.05 * player.talents.siphon_life;
  Spell::Setup();
}

void SeedOfCorruption::Damage(bool, bool) {
  const double kBaseDamage = entity.player->settings.randomize_values && min_dmg > 0 && max_dmg > 0
                                 ? entity.player->rng.Range(min_dmg, max_dmg)
                                 : base_damage;
  const int kEnemyAmount   = entity.player->settings.enemy_amount - 1;  // Minus one because the enemy that Seed is
                                                                        // being Cast on doesn't get hit
  const double kSpellPower = entity.GetSpellPower(spell_school);
  auto resist_amount       = 0;
  auto crit_amount         = 0;
  auto internal_modifier   = GetDamageModifier();
  auto external_modifier   = 1.0;

  // Remove debuffs from the modifier since they ignore the AOE cap, so we'll
  // add the debuff % modifiers after the Damage has been calculated.
  if (entity.player->selected_auras.curse_of_the_elements) {
    constexpr double kModifier = 1.13;
    internal_modifier /= kModifier;
    external_modifier *= kModifier;
  }
  if (entity.player->selected_auras.shadow_weaving) {
    constexpr double kModifier = 1.1;
    internal_modifier /= kModifier;
    external_modifier *= kModifier;
  }
  if (entity.player->selected_auras.misery) {
    constexpr double kModifier = 1.05;
    internal_modifier /= kModifier;
    external_modifier *= kModifier;
  }

  for (int i = 0; i < kEnemyAmount; i++) {
    if (IsHit()) {
      resist_amount++;
      OnResistProcs();
    } else {
      OnDamageProcs();

      if (IsCrit()) {
        crit_amount++;
        OnCritProcs();
      }
    }
  }

  const int kEnemiesHit       = kEnemyAmount - resist_amount;
  auto individual_seed_damage = (kBaseDamage + kSpellPower * coefficient) * internal_modifier;
  auto total_seed_damage      = individual_seed_damage * kEnemiesHit;
  // Because of the Seed bug explained below, we need to use this formula to
  // calculate the actual aoe cap for the amount of mobs that will be hit by the
  // spell. Explained by Tesram on the TBC Warlock discord
  // https://discord.com/channels/253210018697052162/825310481358651432/903413703595143218
  // If the total Damage goes above the aoe cap then we need to reduce the
  // amount of each seed's Damage
  if (const auto kTrueAoeCap = aoe_cap * kEnemiesHit / (kEnemiesHit + 1); total_seed_damage > kTrueAoeCap) {
    // Set the Damage of each individual seed to the "true" aoe cap divided by
    // the amount of enemies hit There's a bug with Seed of Corruption where if
    // you hit the AoE cap, the number used to divide here is 1 higher because
    // it's including the enemy that Seed is being Cast on, even though that
    // enemy doesn't actually get damaged by the Seed. Nice game :)
    individual_seed_damage = kTrueAoeCap / kEnemiesHit;
    // Re-calculate the total Damage done by all seed hits
    total_seed_damage = individual_seed_damage * kEnemiesHit;
  }
  // Add Damage from Seed crits
  if (crit_amount > 0) {
    const double kIndividualSeedCrit  = individual_seed_damage * crit_damage_multiplier;
    const double kBonusDamageFromCrit = kIndividualSeedCrit - individual_seed_damage;
    total_seed_damage += kBonusDamageFromCrit * crit_amount;
  }
  // Partial resists (probably need to calculate a partial resist for each seed
  // hit, not sure how it interacts for the aoe cap)
  const double kPartialResistMultiplier = GetPartialResistMultiplier();
  total_seed_damage *= kPartialResistMultiplier;

  // Add Damage from debuffs
  total_seed_damage *= external_modifier;

  entity.player->iteration_damage += total_seed_damage;

  if (entity.ShouldWriteToCombatLog()) {
    auto msg = name + " " + DoubleToString(round(total_seed_damage)) + " (" + std::to_string(kEnemyAmount) +
               " Enemies (" + std::to_string(resist_amount) + " Resists & " + std::to_string(crit_amount) +
               " Crits) - " + DoubleToString(kBaseDamage, 1) + " Base Damage - " + DoubleToString(coefficient, 3) +
               " Coefficient - " + DoubleToString(kSpellPower) + " Spell Power - " +
               DoubleToString(round(internal_modifier * external_modifier * 1000) / 10, 1) + "% Modifier - ";

    if (crit_amount > 0) {
      msg += DoubleToString(crit_damage_multiplier, 3) + "% Crit Multiplier";
    }

    msg += " - " + DoubleToString(round(kPartialResistMultiplier * 1000) / 10) + "% Partial Resist Multiplier)";
    entity.CombatLog(msg);
  }
  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->iteration_damage += total_seed_damage;
    entity.combat_log_breakdown.at(name)->crits += crit_amount;
    entity.combat_log_breakdown.at(name)->misses += resist_amount;
    // the Cast() function already adds 1 to the amount of casts so we only need
    // to add enemiesHit - 1 to the Cast amount
    entity.combat_log_breakdown.at(name)->casts += kEnemiesHit - 1;
  }
}

Corruption::Corruption(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot)
    : Spell(player, std::move(aura), std::move(dot)) {
  name         = SpellName::kCorruption;
  mana_cost    = 0.14;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kAffliction;
  can_miss     = true;
  attack_type  = AttackType::kMagical;
  additive_modifier += 0.05 * player.talents.siphon_life;
  bonus_crit_chance += 3 * player.talents.malediction;
  Spell::Setup();
}

UnstableAffliction::UnstableAffliction(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot)
    : Spell(player, std::move(aura), std::move(dot)) {
  name         = SpellName::kUnstableAffliction;
  mana_cost    = 0.15;
  cast_time    = 1.5;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kAffliction;
  can_miss     = true;
  attack_type  = AttackType::kMagical;
  additive_modifier += 0.05 * player.talents.siphon_life;
  bonus_crit_chance += 3 * player.talents.malediction;
  Spell::Setup();
}

Immolate::Immolate(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot)
    : Spell(player, std::move(aura), std::move(dot)) {
  name         = SpellName::kImmolate;
  mana_cost    = 0.17;
  cast_time    = 2 - 0.1 * player.talents.bane;
  does_damage  = true;
  can_crit     = true;
  can_miss     = true;
  base_damage  = 460;
  coefficient  = 0.2;
  spell_school = SpellSchool::kFire;
  spell_type   = SpellType::kDestruction;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

CurseOfAgony::CurseOfAgony(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot)
    : Spell(player, std::move(aura), std::move(dot)) {
  name         = SpellName::kCurseOfAgony;
  mana_cost    = 0.1;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kAffliction;
  can_miss     = true;
  attack_type  = AttackType::kMagical;
  additive_modifier += 0.05 * entity.player->talents.improved_curse_of_agony;
  Spell::Setup();
}

CurseOfTheElements::CurseOfTheElements(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name         = SpellName::kCurseOfTheElements;
  mana_cost    = 0.1;
  spell_type   = SpellType::kAffliction;
  spell_school = SpellSchool::kShadow;
  can_miss     = true;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

CurseOfDoom::CurseOfDoom(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot)
    : Spell(player, std::move(aura), std::move(dot)) {
  name         = SpellName::kCurseOfDoom;
  mana_cost    = 0.15;
  cooldown     = 60;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kAffliction;
  can_miss     = true;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

// TODO
Conflagrate::Conflagrate(Player& player) : Spell(player) {
  name        = SpellName::kConflagrate;
  mana_cost   = 0.16;
  cooldown    = 10;
  coefficient = 1.5 / 3.5;
  does_damage = true;
  can_crit    = true;
  can_miss    = true;
  bonus_crit_chance += 5 * player.talents.fire_and_brimstone;
  spell_school = SpellSchool::kFire;
  spell_type   = SpellType::kDestruction;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

bool Conflagrate::CanCast() {
  return entity.player->auras.immolate != nullptr && entity.player->auras.immolate->is_active && Spell::CanCast();
}

void Conflagrate::Cast() {
  Spell::Cast();
  entity.player->auras.immolate->Fade();

  if (entity.player->auras.backdraft != nullptr) {
    entity.player->auras.backdraft->Apply();
  }
}

FlameCap::FlameCap(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name     = SpellName::kFlameCap;
  cooldown = 180;
  is_item  = true;
  on_gcd   = false;
  Spell::Setup();
}

BloodFury::BloodFury(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name     = SpellName::kBloodFury;
  cooldown = 120;
  on_gcd   = false;
  is_item  = true;  // TODO create some other property for spells like this instead of making them items
  Spell::Setup();
}

Bloodlust::Bloodlust(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name                   = SpellName::kBloodlust;
  cooldown               = 600;
  is_item                = true;
  on_gcd                 = false;
  is_non_warlock_ability = true;
  Spell::Setup();
}

PowerInfusion::PowerInfusion(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name                   = SpellName::kPowerInfusion;
  cooldown               = 180;
  on_gcd                 = false;
  is_non_warlock_ability = true;
  Spell::Setup();
}

Innervate::Innervate(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name                   = SpellName::kInnervate;
  cooldown               = 360;
  on_gcd                 = false;
  is_non_warlock_ability = true;
  Spell::Setup();
}

ManaTideTotem::ManaTideTotem(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name                   = SpellName::kManaTideTotem;
  cooldown               = 300;
  is_non_warlock_ability = true;
  Spell::Setup();
}

ImpFirebolt::ImpFirebolt(Pet& pet) : Spell(pet) {
  name         = SpellName::kFirebolt;
  cast_time    = 2.5 - 0.25 * pet.player->talents.demonic_power;
  mana_cost    = 180;
  base_damage  = 211 * (1 + 0.1 * pet.player->talents.improved_imp);
  coefficient  = 2 / 3.5;
  spell_school = SpellSchool::kFire;
  attack_type  = AttackType::kMagical;
  can_crit     = true;
  does_damage  = true;
  can_miss     = true;
  Spell::Setup();
}

PetMelee::PetMelee(Pet& pet) : Spell(pet) {
  name        = SpellName::kMelee;
  attack_type = AttackType::kPhysical;
  cooldown    = 2;
  on_gcd      = false;
  can_crit    = true;
  does_damage = true;
  can_miss    = true;
  Spell::Setup();
}

double PetMelee::GetBaseDamage() {
  return (entity.pet->GetAttackPower() / 14 + 51.7) * entity.pet->kBaseMeleeSpeed;
}

double PetMelee::GetCooldown() {
  return cooldown / entity.GetHastePercent();
}

FelguardCleave::FelguardCleave(Pet& pet) : Spell(pet) {
  name        = SpellName::kCleave;
  cooldown    = 6;
  mana_cost   = 0.1;
  attack_type = AttackType::kPhysical;
  can_crit    = true;
  does_damage = true;
  can_miss    = true;
  Spell::Setup();
}

double FelguardCleave::GetBaseDamage() {
  return entity.pet->spells.melee->GetBaseDamage() + 78;
}

SuccubusLashOfPain::SuccubusLashOfPain(Pet& pet) : Spell(pet) {
  name         = SpellName::kLashOfPain;
  cooldown     = 12 - 3 * pet.player->talents.demonic_power;
  mana_cost    = 250;
  base_damage  = 123;
  spell_school = SpellSchool::kShadow;
  coefficient  = 0.429;
  attack_type  = AttackType::kMagical;
  can_crit     = true;
  can_crit     = true;
  does_damage  = true;
  can_miss     = true;
  Spell::Setup();
}

ChaosBolt::ChaosBolt(Player& player) : Spell(player) {
  name         = SpellName::kChaosBolt;
  cooldown     = 12;
  cast_time    = 2.5 - 0.1 * player.talents.bane;
  mana_cost    = 0.07;
  min_dmg      = 1429;
  max_dmg      = 1813;
  spell_school = SpellSchool::kFire;
  attack_type  = AttackType::kMagical;
  coefficient  = 2.5 / 3.5 + 0.04 * player.talents.shadow_and_flame;
  can_crit     = true;
  can_miss     = true;
  does_damage  = true;
  Spell::Setup();
}

Haunt::Haunt(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name         = SpellName::kHaunt;
  mana_cost    = 0.12;
  cooldown     = 8;
  cast_time    = 1.5;
  coefficient  = 1.5 / 3.5;
  min_dmg      = 645;
  max_dmg      = 753;
  can_miss     = true;
  does_damage  = true;
  can_crit     = true;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kAffliction;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

Shadowflame::Shadowflame(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot)
    : Spell(player, std::move(aura), std::move(dot)) {
  name         = SpellName::kShadowflame;
  mana_cost    = 0.25;
  cooldown     = 15;
  coefficient  = 1 / 9.375;
  min_dmg      = 615;
  max_dmg      = 671;
  can_miss     = true;  // TODO confirm
  can_crit     = true;
  does_damage  = true;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kDestruction;
  Spell::Setup();
}

DrainSoul::DrainSoul(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot)
    : Spell(player, std::move(aura), std::move(dot)) {
  name         = SpellName::kDrainSoul;
  mana_cost    = 0.14;
  can_miss     = true;
  spell_school = SpellSchool::kShadow;
  spell_type   = SpellType::kAffliction;
  attack_type  = AttackType::kMagical;
  Spell::Setup();
}

DemonicEmpowerment::DemonicEmpowerment(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name      = SpellName::kDemonicEmpowerment;
  mana_cost = 0.06;
  cooldown  = 60;
  on_gcd    = false;  // TODO confirm
  is_item   = true;
  Spell::Setup();
}

Metamorphosis::Metamorphosis(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name     = SpellName::kMetamorphosis;
  cooldown = 180;
  on_gcd   = false;
  is_item  = true;
  Spell::Setup();
}

GnomishLightningGenerator::GnomishLightningGenerator(Player& player) : Spell(player) {
  name         = "Gnomish Lightning Generator";
  cooldown     = 60;
  on_gcd       = false;  // TODO confirm
  is_item      = true;
  min_dmg      = 1530;
  max_dmg      = 1870;
  does_damage  = true;
  can_crit     = true;
  spell_school = SpellSchool::kNature;
  Spell::Setup();
}

FigurineSapphireOwl::FigurineSapphireOwl(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name     = "Figurine - Sapphire Owl";
  cooldown = 300;
  on_gcd   = false;  // TODO confirm
  is_item  = true;
  Spell::Setup();
}

DarkmoonCardIllusion::DarkmoonCardIllusion(Player& player) : Spell(player) {
  name              = "Darkmoon Card: Illusion";
  cooldown          = 300;
  mana_gain         = 1500;
  gain_mana_on_cast = true;
  on_gcd            = false;
  is_item           = true;
  Spell::Setup();
}

MeteoriteCrystal::MeteoriteCrystal(Player& player, std::shared_ptr<Aura> aura) : Spell(player, std::move(aura)) {
  name     = "Meteorite Crystal";
  cooldown = 120;
  on_gcd   = false;
  is_item  = true;
  Spell::Setup();
}

ReignOfTheUnliving::ReignOfTheUnliving(Player& player) : Spell(player) {
  name         = "Reign of the Unliving";
  on_gcd       = false;
  is_item      = true;
  min_dmg      = 1741;
  max_dmg      = 2023;
  can_crit     = true;
  spell_school = SpellSchool::kFire;
  does_damage  = true;
  Spell::Setup();
}

ReignOfTheUnlivingHeroic::ReignOfTheUnlivingHeroic(Player& player) : Spell(player) {
  name         = "Reign of the Unliving";
  on_gcd       = false;
  is_item      = true;
  min_dmg      = 1959;
  max_dmg      = 2275;
  can_crit     = true;
  spell_school = SpellSchool::kFire;
  does_damage  = true;
  Spell::Setup();
}

TalismanOfVolatilePower::TalismanOfVolatilePower(Player& player, std::shared_ptr<Aura> aura)
    : Spell(player, std::move(aura)) {
  name     = "Talisman of Volatile Power";
  on_gcd   = false;
  is_item  = true;
  cooldown = 120;
  Spell::Setup();
}

NevermeltingIceCrystal::NevermeltingIceCrystal(Player& player, std::shared_ptr<Aura> aura)
    : Spell(player, std::move(aura)) {
  name     = "Nevermelting Ice Crystal";
  cooldown = 180;
  on_gcd   = false;
  is_item  = true;
  Spell::Setup();
}

SliverOfPureIce::SliverOfPureIce(Player& player) : Spell(player) {
  name              = "Sliver of Pure Ice";
  cooldown          = 120;
  on_gcd            = false;
  is_item           = true;
  gain_mana_on_cast = true;
  mana_gain         = 1625;
}

SliverOfPureIceHeroic::SliverOfPureIceHeroic(Player& player) : Spell(player) {
  name              = "Sliver of Pure Ice";
  cooldown          = 120;
  on_gcd            = false;
  is_item           = true;
  gain_mana_on_cast = true;
  mana_gain         = 1830;
}
