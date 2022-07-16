#pragma once
#include "enums.h"

struct Entity;

struct Stat {
  Entity& entity;
  double& character_stat;
  CalculationType calculation_type = CalculationType::kNoType;
  std::string name;
  double value;
  int combat_log_decimal_places = 0;

  Stat(Entity& entity, double& character_stat, double kValue);
  void AddStat(int kStackAmount = 1) const;
  void RemoveStat(int kStacks = 1) const;

 private:
  void ModifyStat(const std::string& kAction, int kStacks = 1) const;
};

struct SpellPower : Stat {
  SpellPower(Entity& entity, double kValue);
};

struct ShadowPower : Stat {
  ShadowPower(Entity& entity, double kValue);
};

struct FirePower : Stat {
  FirePower(Entity& entity, double kValue);
};

struct HasteRating : Stat {
  HasteRating(Entity& entity, double kValue);
};

struct HastePercent : Stat {
  HastePercent(Entity& entity, double kValue);
};

struct ManaCostModifier : Stat {
  ManaCostModifier(Entity& entity, double kValue);
};

struct CritChance : Stat {
  CritChance(Entity& entity, double kValue);
};

struct CritRating : Stat {
  CritRating(Entity& entity, double kValue);
};

struct AttackPower : Stat {
  AttackPower(Entity& entity, double kValue);
};

struct AttackPowerModifier : Stat {
  AttackPowerModifier(Entity& entity, double kValue);
};

struct DamageModifier : Stat {
  DamageModifier(Entity& entity, double kValue);
};

struct ShadowModifier : Stat {
  ShadowModifier(Entity& entity, double kValue);
};

struct FireModifier : Stat {
  FireModifier(Entity& entity, double kValue);
};

struct ManaPer5 : Stat {
  ManaPer5(Entity& entity, double kValue);
};

struct Spirit : Stat {
  Spirit(Entity& entity, double kValue);
};

struct Intellect : Stat {
  Intellect(Entity& entity, double kValue);
};
