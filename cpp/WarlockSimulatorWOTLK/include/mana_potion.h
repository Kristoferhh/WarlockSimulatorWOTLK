#pragma once
#include "spell.h"

struct Player;

struct ManaPotion : Spell {
  bool benefits_from_alchemists_stone = true;

  explicit ManaPotion(Player& player);
  void Cast() override;
};

struct RunicManaPotion final : ManaPotion {
  explicit RunicManaPotion(Player& player);
};

struct DemonicRune final : ManaPotion {
  explicit DemonicRune(Player& player);
};
