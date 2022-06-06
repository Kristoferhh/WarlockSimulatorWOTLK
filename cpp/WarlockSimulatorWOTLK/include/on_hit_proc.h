#pragma once
#include "spell_proc.h"

struct OnHitProc : SpellProc {
  explicit OnHitProc(Entity& entity_param, std::shared_ptr<Aura> aura = nullptr);
  void Setup() override;
};

struct JudgementOfWisdom final : OnHitProc {
  explicit JudgementOfWisdom(Entity& entity_param);
};

struct DemonicFrenzy final : OnHitProc {
  explicit DemonicFrenzy(Pet& pet, std::shared_ptr<Aura> aura);
};

struct ImprovedShadowBolt final : OnHitProc {
  explicit ImprovedShadowBolt(Player& player, std::shared_ptr<Aura> aura);
};

struct SoulLeech final : OnHitProc {
  explicit SoulLeech(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};
