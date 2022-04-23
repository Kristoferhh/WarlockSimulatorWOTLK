#pragma once
#include "spell_proc.h"

struct Player;

struct OnDamageProc : SpellProc {
  explicit OnDamageProc(Player& player, const std::shared_ptr<Aura>& kAura = nullptr);
  void Setup() override;
};
