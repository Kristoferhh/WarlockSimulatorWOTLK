#pragma once
#include "spell_proc.h"

struct Player;

struct OnDamageProc : SpellProc {
  explicit OnDamageProc(Player& player, const std::shared_ptr<Aura>& kAura = nullptr);
  void Setup() override;
};

struct DarkmoonCardBerserker final : OnDamageProc {
  explicit DarkmoonCardBerserker(Player& player, const std::shared_ptr<Aura>& kAura);
};

struct DarkmoonCardDeath final : OnDamageProc {
  explicit DarkmoonCardDeath(Player& player);
};

struct DarkmoonCardGreatness final : OnDamageProc {
  explicit DarkmoonCardGreatness(Player& player, const std::shared_ptr<Aura>& kAura);
};

struct MuradinsSpyglass final : OnDamageProc {
  explicit MuradinsSpyglass(Player& player, const std::shared_ptr<Aura>& kAura);
};
