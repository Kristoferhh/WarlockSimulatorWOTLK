#pragma once
#include "spell_proc.h"

struct Player;

struct OnDotTickProc : SpellProc {
  explicit OnDotTickProc(Player& player, const std::shared_ptr<Aura>& kAura = nullptr);
  void Setup() override;
  virtual bool ShouldProc(DamageOverTime* spell);
};
