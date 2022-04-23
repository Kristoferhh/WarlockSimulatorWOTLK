#pragma once
#include "spell_proc.h"

struct OnHitProc : SpellProc {
  explicit OnHitProc(Entity& entity, std::shared_ptr<Aura> aura = nullptr);
  void Setup() override;
};

struct JudgementOfWisdom final : OnHitProc {
  explicit JudgementOfWisdom(Entity& entity);
};

struct DemonicFrenzy final : OnHitProc {
  explicit DemonicFrenzy(Entity& entity, std::shared_ptr<Aura> aura);
};
