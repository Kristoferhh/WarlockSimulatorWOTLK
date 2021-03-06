#pragma once
#include "spell_proc.h"

struct OnHitProc : SpellProc {
  explicit OnHitProc(Entity& entity,
                     const std::string& kName,
                     std::shared_ptr<Aura> aura = nullptr,
                     int kCooldown              = 0,
                     double kMinDmg             = 0,
                     double kMaxDmg             = 0,
                     double kMinManaGain        = 0,
                     double kMaxManaGain        = 0,
                     SpellSchool spell_school   = SpellSchool::kNoSchool,
                     AttackType attack_type     = AttackType::kNoAttackType,
                     SpellType spell_type       = SpellType::kNoSpellType);
};

struct JudgementOfWisdom final : OnHitProc {
  explicit JudgementOfWisdom(Entity& entity);
};

struct DemonicFrenzy final : OnHitProc {
  explicit DemonicFrenzy(Pet& pet, std::shared_ptr<Aura> aura);
};

struct ImprovedShadowBolt final : OnHitProc {
  explicit ImprovedShadowBolt(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct SoulLeech final : OnHitProc {
  explicit SoulLeech(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct PendulumOfTelluricCurrents final : OnHitProc {
  explicit PendulumOfTelluricCurrents(Player& player);
  bool ShouldProc(Spell* spell) override;
};

struct JoustersFury final : OnHitProc {
  explicit JoustersFury(Player& player, std::shared_ptr<Aura> aura);
};
