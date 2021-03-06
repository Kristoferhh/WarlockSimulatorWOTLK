// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/stat.h"

#include "../include/common.h"
#include "../include/entity.h"

Stat::Stat(Entity& entity, double& character_stat, const double kValue)
    : entity(entity), character_stat(character_stat), value(kValue) {}

void Stat::AddStat(const int kStackAmount) const {
  ModifyStat("add", kStackAmount);
}

void Stat::RemoveStat(const int kStacks) const {
  ModifyStat("remove", kStacks);
}

void Stat::ModifyStat(const std::string& kAction, const int kStacks) const {
  const double kCurrentStatValue = character_stat;
  auto new_stat_value            = kCurrentStatValue;

  if (calculation_type == CalculationType::kAdditive) {
    new_stat_value += value * kStacks * (kAction == "remove" ? -1 : kAction == "add" ? 1 : 0);
  } else if (calculation_type == CalculationType::kMultiplicative) {
    if (kAction == "add") {
      new_stat_value *= value * kStacks;
    } else if (kAction == "remove") {
      new_stat_value /= value * kStacks;
    }
  }

  character_stat = new_stat_value;

  if (entity.ShouldWriteToCombatLog()) {
    auto msg = entity.name + " " + name + " ";

    if (kAction == "add") {
      if (calculation_type == CalculationType::kAdditive) {
        msg += "+";
      } else {
        msg += "*";
      }
    } else {
      if (calculation_type == CalculationType::kAdditive) {
        msg += "-";
      } else {
        msg += "/";
      }
    }

    msg += " " + DoubleToString(value * kStacks, combat_log_decimal_places) + " (" +
           DoubleToString(kCurrentStatValue, combat_log_decimal_places) + " -> " +
           DoubleToString(new_stat_value, combat_log_decimal_places) + ")";

    entity.CombatLog(msg);
  }
}

SpellPower::SpellPower(Entity& entity, const double kValue) : Stat(entity, entity.stats.spell_power, kValue) {
  name             = WarlockSimulatorConstants::kSpellPower;
  calculation_type = CalculationType::kAdditive;
}

ShadowPower::ShadowPower(Entity& entity, const double kValue) : Stat(entity, entity.stats.shadow_power, kValue) {
  name             = WarlockSimulatorConstants::kShadowPower;
  calculation_type = CalculationType::kAdditive;
}

FirePower::FirePower(Entity& entity, const double kValue) : Stat(entity, entity.stats.fire_power, kValue) {
  name             = WarlockSimulatorConstants::kFirePower;
  calculation_type = CalculationType::kAdditive;
}

HasteRating::HasteRating(Entity& entity, const double kValue) : Stat(entity, entity.stats.haste_rating, kValue) {
  name             = WarlockSimulatorConstants::kHasteRating;
  calculation_type = CalculationType::kAdditive;
}

HastePercent::HastePercent(Entity& entity, const double kValue) : Stat(entity, entity.stats.haste_percent, kValue) {
  name                      = WarlockSimulatorConstants::kHastePercent;
  calculation_type          = CalculationType::kMultiplicative;
  combat_log_decimal_places = 4;
}

ManaCostModifier::ManaCostModifier(Entity& entity, const double kValue)
    : Stat(entity, entity.stats.mana_cost_modifier, kValue) {
  name                      = WarlockSimulatorConstants::kManaCostModifier;
  calculation_type          = CalculationType::kMultiplicative;
  combat_log_decimal_places = 2;
}

CritChance::CritChance(Entity& entity, const double kValue) : Stat(entity, entity.stats.crit_chance, kValue) {
  name                      = WarlockSimulatorConstants::kCritChance;
  calculation_type          = CalculationType::kAdditive;
  combat_log_decimal_places = 2;
}

CritRating::CritRating(Entity& entity, const double kValue) : Stat(entity, entity.stats.crit_rating, kValue) {
  name             = WarlockSimulatorConstants::kCritRating;
  calculation_type = CalculationType::kAdditive;
}

AttackPower::AttackPower(Entity& entity, const double kValue) : Stat(entity, entity.stats.attack_power, kValue) {
  name             = WarlockSimulatorConstants::kAttackPower;
  calculation_type = CalculationType::kAdditive;
}

AttackPowerModifier::AttackPowerModifier(Entity& entity, const double kValue)
    : Stat(entity, entity.stats.attack_power_modifier, kValue) {
  name             = WarlockSimulatorConstants::kAttackPowerModifier;
  calculation_type = CalculationType::kMultiplicative;
}

DamageModifier::DamageModifier(Entity& entity, const double kValue)
    : Stat(entity, entity.stats.damage_modifier, kValue) {
  name                      = WarlockSimulatorConstants::kDamageModifier;
  calculation_type          = CalculationType::kMultiplicative;
  combat_log_decimal_places = 2;
}

ShadowModifier::ShadowModifier(Entity& entity, const double kValue)
    : Stat(entity, entity.stats.shadow_modifier, kValue) {
  name             = WarlockSimulatorConstants::kDamageModifier;
  calculation_type = CalculationType::kMultiplicative;
}

FireModifier::FireModifier(Entity& entity, const double kValue) : Stat(entity, entity.stats.fire_modifier, kValue) {
  name             = WarlockSimulatorConstants::kDamageModifier;
  calculation_type = CalculationType::kMultiplicative;
}

ManaPer5::ManaPer5(Entity& entity, const double kValue) : Stat(entity, entity.stats.mp5, kValue) {
  name             = WarlockSimulatorConstants::kMp5;
  calculation_type = CalculationType::kAdditive;
}

Spirit::Spirit(Entity& entity, const double kValue) : Stat(entity, entity.stats.spirit, kValue) {
  name             = WarlockSimulatorConstants::kSpirit;
  calculation_type = CalculationType::kAdditive;
}

Intellect::Intellect(Entity& entity, const double kValue) : Stat(entity, entity.stats.intellect, kValue) {
  name             = "Intellect";
  calculation_type = CalculationType::kAdditive;
}
