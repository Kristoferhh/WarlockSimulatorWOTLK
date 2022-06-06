#include "../include/entity.h"

#include <iostream>

#include "../include/aura.h"
#include "../include/aura_selection.h"
#include "../include/bindings.h"
#include "../include/combat_log_breakdown.h"
#include "../include/common.h"
#include "../include/damage_over_time.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/sets.h"
#include "../include/simulation.h"
#include "../include/spell.h"
#include "../include/talents.h"

Entity::Entity(Player* player, PlayerSettings& player_settings, const EntityType kEntityType)
    : player(player),
      settings(player_settings),
      stats(kEntityType == EntityType::kPlayer ? player_settings.stats : CharacterStats()),
      entity_type(kEntityType),
      recording_combat_log_breakdown(player_settings.recording_combat_log_breakdown &&
                                     player_settings.equipped_item_simulation),
      equipped_item_simulation(player_settings.equipped_item_simulation),
      enemy_shadow_resist(player_settings.enemy_shadow_resist),
      enemy_fire_resist(player_settings.enemy_fire_resist),
      // I don't know if this formula only works for bosses or not, so for the
      // moment I'm only using it for targets 3+ levels above.
      // TODO
      enemy_level_difference_resistance(player_settings.enemy_level >= kLevel + 3 ? 6 * kLevel * 5 / 75 : 0) {
  // Crit chance
  if (kEntityType == EntityType::kPlayer) {
    stats.spell_crit_chance = StatConstant::kBaseCritChancePercent + player_settings.talents.backlash +
                              2 * player_settings.talents.demonic_tactics;
  }

  if (player_settings.auras.moonkin_aura) {
    stats.spell_crit_chance += 5;
  }

  if (player_settings.auras.totem_of_wrath) {
    stats.spell_crit_chance += 3;
  }

  // Hit chance
  if (kEntityType == EntityType::kPlayer) {
    stats.extra_spell_hit_chance = stats.spell_hit_rating / StatConstant::kHitRatingPerPercent;
  }

  if (player_settings.auras.totem_of_wrath) {
    stats.extra_spell_hit_chance += 3;
  }

  if (player_settings.auras.inspiring_presence) {
    stats.extra_spell_hit_chance++;
  }

  stats.spell_hit_chance = GetBaseSpellHitChance(kLevel, settings.enemy_level);

  // TODO does this still stack
  if (player_settings.auras.ferocious_inspiration) {
    stats.damage_modifier *= std::pow(1.03, settings.ferocious_inspiration_amount);
  }

  if (player_settings.auras.blood_pact) {
    if (kEntityType == EntityType::kPet) {
      // Only add 70 stam if it's a pet since it's added to the player's stats in the client.
      stats.stamina += 70;
    }

    auto improved_imp_points = settings.improved_imp;

    if (settings.selected_pet == EmbindConstant::kImp && player_settings.talents.improved_imp > improved_imp_points) {
      improved_imp_points = player_settings.talents.improved_imp;
    }

    stats.stamina += 70 * 0.1 * improved_imp_points;
  }

  if (player->settings.selected_pet == EmbindConstant::kImp) {
    stats.fire_modifier *= 1 + 0.01 * player->talents.master_demonologist;
  } else if (player->settings.selected_pet == EmbindConstant::kSuccubus) {
    stats.shadow_modifier *= 1 + 0.01 * player->talents.master_demonologist;
  } else if (player->settings.selected_pet == EmbindConstant::kFelguard) {
    stats.damage_modifier *= 1 + 0.01 * player->talents.master_demonologist;
  }

  stats.shadow_modifier *= 1 + 0.02 * player_settings.talents.demonic_pact;
  stats.fire_modifier *= 1 + 0.02 * player_settings.talents.demonic_pact;
}

void Entity::PostIterationDamageAndMana(const std::string& kSpellName) const {
  PostCombatLogBreakdownVector(kSpellName.c_str(), combat_log_breakdown.at(kSpellName)->iteration_mana_gain,
                               combat_log_breakdown.at(kSpellName)->iteration_damage);
  combat_log_breakdown.at(kSpellName)->iteration_damage    = 0;
  combat_log_breakdown.at(kSpellName)->iteration_mana_gain = 0;
}

void Entity::EndAuras() {
  for (const auto& kAura : aura_list) {
    if (kAura->is_active) {
      kAura->Fade();
    }
  }
}

void Entity::Reset() {
  cast_time_remaining              = 0;
  gcd_remaining                    = 0;
  mp5_timer_remaining              = 5;
  five_second_rule_timer_remaining = 5;

  for (const auto& kSpell : spell_list) {
    kSpell->Reset();
  }
}

void Entity::Initialize(Simulation* simulation_ptr) {
  simulation = simulation_ptr;
}

void Entity::SendCombatLogBreakdown() const {
  for (const auto& [kSpellName, kSpell] : combat_log_breakdown) {
    if (kSpell->iteration_damage > 0 || kSpell->iteration_mana_gain > 0) {
      PostIterationDamageAndMana(kSpellName);
    }

    PostCombatLogBreakdown(kSpell->name.c_str(), kSpell->casts, kSpell->crits, kSpell->misses, kSpell->count,
                           kSpell->uptime_in_seconds, kSpell->dodge, kSpell->glancing_blows);
  }
}

double Entity::GetStamina() {
  return stats.stamina * stats.stamina_modifier;
}

double Entity::GetIntellect() {
  return stats.intellect * stats.intellect_modifier;
}

double Entity::GetSpirit() const {
  return stats.spirit * stats.spirit_modifier;
}

bool Entity::ShouldWriteToCombatLog() const {
  return simulation->iteration == 0 && equipped_item_simulation;
}

void Entity::CombatLog(const std::string& kEntry) const {
  player->combat_log_entries.push_back("|" + DoubleToString(simulation->current_fight_time, 4) + "| " + kEntry);
}

double Entity::FindTimeUntilNextAction() {
  auto time = cast_time_remaining;

  if (time <= 0) {
    time = gcd_remaining;
  }

  if (time <= 0 || mp5_timer_remaining < time && mp5_timer_remaining > 0) {
    time = mp5_timer_remaining;
  }

  if (five_second_rule_timer_remaining > 0 && five_second_rule_timer_remaining < time) {
    time = five_second_rule_timer_remaining;
  }

  for (const auto& kSpell : spell_list) {
    if (kSpell->cooldown_remaining < time && kSpell->cooldown_remaining > 0) {
      time = kSpell->cooldown_remaining;
    }
  }

  for (const auto& kAura : aura_list) {
    if (kAura->is_active && kAura->has_duration) {
      if (kAura->duration_remaining < time) {
        time = kAura->duration_remaining;
      }

      if (kAura->tick_timer_remaining > 0 && kAura->tick_timer_remaining < time) {
        time = kAura->tick_timer_remaining;
      }
    }
  }

  // TODO make DamageOverTime inherit from Aura and combine dot_list and aura_list
  for (const auto& kDot : dot_list) {
    if (kDot->is_active && kDot->tick_timer_remaining < time) {
      time = kDot->tick_timer_remaining;
    }
  }

  return time;
}

double Entity::GetGcdValue() {
  return std::max(kMinimumGcdValue, kGcdValue / GetHastePercent());
}

// formula from
// https://web.archive.org/web/20161015101615/https://dwarfpriest.wordpress.com/2008/01/07/spell-hit-spell-penetration-and-resistances/
// && https://royalgiraffe.github.io/resist-guide
double Entity::GetBaseSpellHitChance(const int kEntityLevel, const int kEnemyLevel) const {
  if (const int kLevelDifference = kEnemyLevel - kEntityLevel; kLevelDifference <= 2) {
    return std::min(99, 100 - kLevelDifference - 4);
  } else {
    if (kLevelDifference == 3) {
      return 83;
    }

    return 83 - 11 * kLevelDifference;
  }
}

double Entity::GetMeleeCritChance() {
  return pet->GetAgility() * 0.04 + 0.65 + stats.melee_crit_chance - StatConstant::kMeleeCritChanceSuppression;
}

void Entity::Tick(const double kTime) {
  cast_time_remaining -= kTime;
  gcd_remaining -= kTime;
  five_second_rule_timer_remaining -= kTime;
  mp5_timer_remaining -= kTime;

  // Auras need to tick before Spells because otherwise you'll, for example,
  // finish casting Corruption and then immediately afterwards, in the same
  // millisecond, immediately tick down the aura This was also causing buffs like
  // e.g. the t4 4pc buffs to expire sooner than they should.
  for (const auto& kAura : aura_list) {
    if (kAura->is_active && kAura->duration_remaining > 0) {
      kAura->Tick(kTime);
    }
  }

  for (const auto& kDot : dot_list) {
    if (kDot->is_active && kDot->tick_timer_remaining > 0) {
      kDot->Tick(kTime);
    }
  }

  // TLC needs to tick before other spells because otherwise a spell might proc TLC and then later in the same loop,
  // during the same millisecond of the fight, tick down TLC's cooldown
  // TODO find a better solution for this since this might occur for other spells as well.
  // Maybe check if the applied_at value is the current fight time
  if (spells.the_lightning_capacitor != nullptr && spells.the_lightning_capacitor->cooldown_remaining > 0) {
    spells.the_lightning_capacitor->Tick(kTime);
  }

  for (const auto& kSpell : spell_list) {
    if (kSpell->name != SpellName::kTheLightningCapacitor && (kSpell->cooldown_remaining > 0 || kSpell->casting)) {
      kSpell->Tick(kTime);
    }
  }
}
