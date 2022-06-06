#pragma once
#include "spell.h"

struct LifeTap : Spell {
  int mana_return;
  double modifier;

  explicit LifeTap(Entity& entity_param);
  [[nodiscard]] double ManaGain() const;
  void Cast() override;
};

struct DarkPact final : LifeTap {
  explicit DarkPact(Entity& entity_param);
  bool Ready() override;
};
