#pragma once
#include "spell_proc.h"

struct Player;

struct OnResistProc : SpellProc {
  explicit OnResistProc(Player& player, const std::string& kName, std::shared_ptr<Aura> aura = nullptr);
};
