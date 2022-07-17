#pragma once
#include "spell_proc.h"

struct Player;

struct OnCritProc : SpellProc {
  explicit OnCritProc(Entity& entity,
                      const std::string& kName,
                      std::shared_ptr<Aura> aura          = nullptr,
                      std::shared_ptr<DamageOverTime> dot = nullptr,
                      double kMinDmg                      = 0,
                      double kMaxDmg                      = 0,
                      int kMinManaGain                    = 0,
                      int kMaxManaGain                    = 0,
                      double kManaCost                    = 0,
                      int kCooldown                       = 0,
                      SpellSchool spell_school            = SpellSchool::kNoSchool,
                      AttackType attack_type              = AttackType::kNoAttackType,
                      SpellType spell_type                = SpellType::kNoSpellType);
};

struct DemonicPact final : OnCritProc {
  explicit DemonicPact(Pet& pet, std::shared_ptr<Aura> aura);
};

struct Pyroclasm final : OnCritProc {
  explicit Pyroclasm(Player& player, std::shared_ptr<Aura> aura);
};

struct EmpoweredImp final : OnCritProc {
  explicit EmpoweredImp(Pet& pet, std::shared_ptr<Aura> aura);
};

struct SoulOfTheDead final : OnCritProc {
  explicit SoulOfTheDead(Player& player);
};

struct MoteOfFlame final : OnCritProc {
  explicit MoteOfFlame(Player& player, std::shared_ptr<Aura> aura);
};
