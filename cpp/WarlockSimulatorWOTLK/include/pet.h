#pragma once
#include "entity.h"

enum class EmbindConstant;
struct Player;

struct Pet final : Entity, std::enable_shared_from_this<Pet> {
  const double kBaseMeleeSpeed = 2;
  PetName pet_name             = PetName::kNoName;
  PetType pet_type             = PetType::kNoPetType;
  double glancing_blow_multiplier;
  double glancing_blow_chance;
  double enemy_damage_reduction_from_armor = 0;  // TODO move to an enemy struct

  Pet(Player& player, EmbindConstant kSelectedPet);
  void Initialize(Simulation* simulation_ptr) override;
  void CalculateStatsFromAuras();
  void Reset() override;
  void Tick(double kTime) override;
  double GetAttackPower() const;
  double GetHastePercent() override;
  double GetSpellCritChance() override;
  double GetStamina() override;
  double GetIntellect() override;
  double GetMeleeCritChance() override;
  double GetAgility() const;
  double GetStrength() const;
  double GetPlayerSpellPower() const;
  double GetSpellPower(SpellSchool spell_school = SpellSchool::kNoSchool) override;
  double GetDebuffAttackPower() const;
  double CalculateMaxMana();
};
