#pragma once
#include "spell.h"

struct Player;

struct ManaPotion : Spell {
  explicit ManaPotion(Player& player);
  void Cast() override;
};

struct RunicManaPotion final : ManaPotion {
  explicit RunicManaPotion(Player& player);
};

struct DemonicRune final : ManaPotion {
  explicit DemonicRune(Player& player);
};
