#pragma once
#include "spell_proc.h"

struct Player;

struct OnDotTickProc : SpellProc {
  explicit OnDotTickProc(Player& player, const std::string& kName, const std::shared_ptr<Aura>& kAura = nullptr);
  virtual bool ShouldProc(DamageOverTime* spell);
};

struct ExtractOfNecromanticPower : OnDotTickProc {
  explicit ExtractOfNecromanticPower(Player& player);
};

struct PhylacteryOfTheNamelessLich : OnDotTickProc {
  explicit PhylacteryOfTheNamelessLich(Player& player, std::shared_ptr<Aura> kAura);
};
