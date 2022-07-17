// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/pet.h"

#include <iostream>

#include "../include/aura.h"
#include "../include/aura_selection.h"
#include "../include/common.h"
#include "../include/item_slot.h"
#include "../include/on_crit_proc.h"
#include "../include/on_hit_proc.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/spell.h"
#include "../include/stat.h"
#include "../include/talents.h"

Pet::Pet(Player& player, const EmbindConstant kSelectedPet)
    : Entity(&player, player.settings, EntityType::kPet),
      glancing_blow_multiplier(1 - (0.1 + (player.settings.enemy_level * 5 - kLevel * 5) / 100.0)),
      glancing_blow_chance(std::max(0.0, 6 + (player.settings.enemy_level * 5 - kLevel * 5) * 1.2)) {
  infinite_mana = player.settings.infinite_pet_mana;

  if (kSelectedPet == EmbindConstant::kImp) {
    name     = "Imp";
    pet_name = PetName::kImp;
    pet_type = PetType::kRanged;
    stats.stamina += 118;
    stats.intellect += 369;
    stats.spirit += 367;
    stats.strength += 297;
    stats.agility += 79;
    stats.damage_modifier *= 1 + 0.1 * player.talents.empowered_imp;
  } else if (kSelectedPet == EmbindConstant::kSuccubus) {
    name     = "Succubus";
    pet_name = PetName::kSuccubus;
    pet_type = PetType::kMelee;
    stats.stamina += 328;
    stats.intellect += 150;
    stats.spirit += 209;
    stats.strength += 314;
    stats.agility += 90;
  } else if (kSelectedPet == EmbindConstant::kFelguard) {
    name     = "Felguard";
    pet_type = PetType::kMelee;
    pet_name = PetName::kFelguard;
    stats.stamina += 328;
    stats.strength += 314;
    stats.agility += 90;
    stats.intellect += 150;
    stats.spirit += 209;
  } else if (kSelectedPet == EmbindConstant::kFelhunter) {
    name     = "Felhunter";
    pet_type = PetType::kMelee;
    pet_name = PetName::kFelhunter;
    stats.stamina += 328;
    stats.intellect += 150;
    stats.agility += 90;
    stats.strength += 314;
    stats.spirit += 209;
  }

  CalculateStatsFromAuras();
}

void Pet::Initialize(Simulation* simulation_ptr) {
  Entity::Initialize(simulation_ptr);
  pet = shared_from_this();

  if (pet_name == PetName::kImp) {
    spells.firebolt = std::make_shared<ImpFirebolt>(*this);
  } else {
    spells.melee = std::make_shared<PetMelee>(*this);

    if (pet_name == PetName::kSuccubus) {
      spells.lash_of_pain = std::make_shared<SuccubusLashOfPain>(*this);
    } else if (pet_name == PetName::kFelguard) {
      spells.cleave         = std::make_shared<FelguardCleave>(*this);
      auras.demonic_frenzy  = std::make_shared<DemonicFrenzyAura>(*this);
      spells.demonic_frenzy = std::make_shared<DemonicFrenzy>(*this, auras.demonic_frenzy);
    }
  }

  if (player->settings.prepop_black_book) {
    auras.black_book = std::make_shared<BlackBookAura>(*this);
  }

  if (player->auras.demonic_pact != nullptr) {
    spells.demonic_pact = std::make_shared<DemonicPact>(*this, player->auras.demonic_pact);
  }

  if (player->talents.demonic_empowerment == 1) {
    auras.demonic_empowerment          = std::make_shared<DemonicEmpowermentAura>(*this);
    player->spells.demonic_empowerment = std::make_shared<DemonicEmpowerment>(*player, auras.demonic_empowerment);
  }

  if (player->auras.empowered_imp != nullptr) {
    spells.empowered_imp = std::make_shared<EmpoweredImp>(*this, player->auras.empowered_imp);
  }
}

void Pet::CalculateStatsFromAuras() {
  // Calculate melee hit chance
  // Formula from https://wowwiki-archive.fandom.com/wiki/Hit?oldid=1584399
  const int kLevelDifference = player->settings.enemy_level - player->kLevel;
  stats.hit_chance           = 100;

  if (kLevelDifference <= 2) {
    stats.hit_chance -= 5 + kLevelDifference * 0.5;
  } else {
    stats.hit_chance -= 7 + (kLevelDifference - 2) * 2;
  }

  // Auras
  if (player->selected_auras.pet_blessing_of_kings) {
    stats.stamina_modifier *= 1.1;
    stats.intellect_modifier *= 1.1;
    stats.agility_modifier *= 1.1;
    stats.strength_modifier *= 1.1;
    stats.spirit_modifier *= 1.1;
  }

  if (player->selected_auras.pet_blessing_of_wisdom) {
    stats.mp5 += 41;
  }

  if (player->selected_auras.mana_spring_totem) {
    stats.mp5 += 50;
  }

  if (player->selected_auras.wrath_of_air_totem) {
    stats.spell_power += 101;
  }

  if (player->selected_auras.misery) {
    constexpr double kDamageModifier = 1.05;

    stats.shadow_modifier *= kDamageModifier;
    stats.fire_modifier *= kDamageModifier;
  }

  if (player->selected_auras.shadow_weaving) {
    stats.shadow_modifier *= 1.1;
  }

  if (player->selected_auras.improved_scorch) {
    stats.fire_modifier *= 1.15;
  }

  if (player->selected_auras.blood_frenzy) {
    stats.physical_modifier *= 1.04;
  }

  stats.crit_chance += 2 * player->talents.demonic_tactics;
  stats.crit_chance += 2 * player->talents.demonic_tactics;
  stats.attack_power += GetDebuffAttackPower();

  // todo improved motw
  if (player->selected_auras.pet_mark_of_the_wild) {
    constexpr int kStatIncrease = 14;

    stats.stamina += kStatIncrease;
    stats.intellect += kStatIncrease;
    stats.strength += kStatIncrease;
    stats.agility += kStatIncrease;
    stats.spirit += kStatIncrease;
  }

  if (player->selected_auras.pet_arcane_intellect) {
    stats.intellect += 40;
  }

  if (player->selected_auras.pet_prayer_of_fortitude) {
    stats.stamina += 79;
  }

  if (player->selected_auras.pet_prayer_of_spirit) {
    stats.spirit += 50;
  }

  if (player->selected_auras.faerie_fire && player->settings.improved_faerie_fire) {
    stats.hit_chance += 3;
  }

  if (player->selected_auras.pet_heroic_presence) {
    stats.hit_chance++;
  }

  if (player->selected_auras.pet_blessing_of_might) {
    stats.attack_power += 220;
  }

  if (player->selected_auras.pet_strength_of_earth_totem) {
    stats.strength += 86;
  }

  if (player->selected_auras.pet_battle_shout) {
    stats.attack_power += 306;
  }

  if (player->selected_auras.pet_trueshot_aura) {
    stats.attack_power += 300;
  }

  if (player->selected_auras.pet_leader_of_the_pack) {
    stats.crit_chance += 5;
  }

  if (player->selected_auras.pet_unleashed_rage) {
    stats.attack_power_modifier *= 1.1;
  }

  if (player->selected_auras.pet_stamina_scroll) {
    stats.stamina += 20;
  }

  if (player->selected_auras.pet_intellect_scroll) {
    stats.intellect += 20;
  }

  if (player->selected_auras.pet_strength_scroll) {
    stats.strength += 20;
  }

  if (player->selected_auras.pet_agility_scroll) {
    stats.agility += 20;
  }

  if (player->selected_auras.pet_spirit_scroll) {
    stats.spirit += 20;
  }

  if (player->selected_auras.pet_kiblers_bits) {
    stats.strength += 20;
    stats.spirit += 20;
  }

  if (player->settings.race == EmbindConstant::kOrc) {
    stats.damage_modifier *= 1.05;
  }

  // Hidden attack power modifiers (source: Max on warlock discord)
  if (pet_name == PetName::kFelguard) {
    stats.attack_power_modifier *= 1.1;
  } else if (pet_name == PetName::kSuccubus) {
    stats.attack_power_modifier *= 1.05;
  }

  // TODO correct?
  if (pet_name == PetName::kFelguard && player->has_glyph_of_felguard) {
    stats.attack_power_modifier *= 1.2;
  }

  // Calculate armor
  if (pet_type == PetType::kMelee) {
    // Formula from
    // https://wowwiki-archive.fandom.com/wiki/Damage_reduction?oldid=807810
    enemy_damage_reduction_from_armor = 1.0;

    if (player->settings.enemy_level >= 60) {
      enemy_damage_reduction_from_armor = 1 - player->settings.enemy_armor / (player->settings.enemy_armor - 22167.5 +
                                                                              467.5 * player->settings.enemy_level);
    } else {
      enemy_damage_reduction_from_armor =
          1 - player->settings.enemy_armor / (player->settings.enemy_armor + 400.0 + 85 * player->settings.enemy_level);
    }

    enemy_damage_reduction_from_armor = std::max(0.25, enemy_damage_reduction_from_armor);
  }

  stats.stamina_modifier *= 1 + 0.05 * player->talents.fel_vitality;
  stats.intellect_modifier *= 1 + 0.05 * player->talents.fel_vitality;
  stats.max_mana = CalculateMaxMana();
}

double Pet::GetPlayerSpellPower() const {
  return player->GetSpellPower() + std::max(player->stats.shadow_power, player->stats.fire_power);
}

double Pet::GetStamina() {
  return (stats.stamina + 0.3 * player->GetStamina()) * stats.stamina_modifier;
}

double Pet::GetIntellect() {
  return (stats.intellect + 0.3 * player->GetIntellect()) * stats.intellect_modifier;
}

double Pet::GetSpellPower(SpellSchool) {
  return stats.spell_power + GetPlayerSpellPower() * 0.15;
}

double Pet::CalculateMaxMana() {
  auto max_mana = GetIntellect();

  if (pet_type == PetType::kMelee) {
    max_mana *= 11.555;
  } else if (pet_name == PetName::kImp) {
    max_mana *= 4.95;
  }

  if (pet_name == PetName::kImp) {
    max_mana += 756;
  } else if (pet_name == PetName::kSuccubus) {
    max_mana += 849;
  } else if (pet_name == PetName::kFelguard) {
    max_mana += 893;
  }

  return max_mana;
}

void Pet::Reset() {
  Entity::Reset();
  stats.mana = CalculateMaxMana();
}

double Pet::GetSpellCritChance() {
  return 0.0125 * GetIntellect() + 0.91 + stats.crit_chance;
}

double Pet::GetMeleeCritChance() {
  auto crit_chance = Entity::GetMeleeCritChance();

  if (player->talents.improved_demonic_tactics > 0) {
    crit_chance += player->GetSpellCritChance() * 0.1 * player->talents.improved_demonic_tactics;
  }

  return crit_chance;
}

double Pet::GetHastePercent() {
  if (pet_type == PetType::kMelee) {
    return stats.haste_percent;
  }

  return stats.haste_percent;
}

double Pet::GetAttackPower() const {
  // Remove AP from debuffs on the boss before multiplying by the AP multiplier
  // since it doesn't affect those debuffs
  const auto kAttackPowerFromDebuffs = GetDebuffAttackPower();
  auto attack_power =
      (GetStrength() * 2 - 20 + GetPlayerSpellPower() * 0.57 - kAttackPowerFromDebuffs + stats.attack_power) *
      stats.attack_power_modifier;

  if (auras.demonic_frenzy != nullptr) {
    // TODO confirm this is calculated correctly
    attack_power *= 1 + (0.05 + 0.01 * player->talents.demonic_brutality) * auras.demonic_frenzy->stacks;
  }

  return attack_power + kAttackPowerFromDebuffs;
}

double Pet::GetDebuffAttackPower() const {
  auto debuff_attack_power = 0.0;

  if (player->selected_auras.improved_hunters_mark) {
    debuff_attack_power += 110;
  }

  return debuff_attack_power;
}

double Pet::GetStrength() const {
  return stats.strength * stats.strength_modifier;
}

double Pet::GetAgility() const {
  return stats.agility * stats.agility_modifier;
}

void Pet::Tick(const double kTime) {
  Entity::Tick(kTime);

  // MP5
  if (mp5_timer_remaining <= 0) {
    auto mana_gain      = stats.mp5;
    mp5_timer_remaining = 5;

    // Formulas from Max on the warlock discord
    // https://discord.com/channels/253210018697052162/823476479550816266/836007015762886707
    // &
    // https://discord.com/channels/253210018697052162/823476479550816266/839484387741138994
    // Mana regen from spirit
    if (five_second_rule_timer_remaining <= 0) {
      if (pet_name == PetName::kImp) {
        mana_gain += GetSpirit() + 0.7 * GetIntellect() - 258;
      } else if (pet_name == PetName::kFelguard || pet_name == PetName::kSuccubus) {
        mana_gain += 0.75 * GetSpirit() + 0.62 * GetIntellect() - 108;
      }
    }
    // Mana regen while the 5 second spirit regen timer is active (no bonus from
    // spirit)
    else {
      if (pet_name == PetName::kImp) {
        mana_gain += 0.375 * GetIntellect() - 123;
      } else if (pet_name == PetName::kFelguard || pet_name == PetName::kSuccubus) {
        mana_gain += 0.365 * GetIntellect() - 48;
      }
    }

    const auto current_mana = stats.mana;
    stats.mana              = std::min(CalculateMaxMana(), stats.mana + static_cast<int>(mana_gain));
    if (stats.mana > current_mana && ShouldWriteToCombatLog()) {
      CombatLog(name + " gains " + DoubleToString(round(mana_gain)) + " mana from Mp5/Spirit regeneration (" +
                DoubleToString(round(current_mana)) + " -> " + DoubleToString(stats.mana) + ")");
    }
  }
}
