#pragma once
#include "aura.h"

struct ManaOverTime : Aura {
  double mana_per_tick;

  explicit ManaOverTime(Entity& entity, const std::string& kName, int kDuration, int kTickTimerTotal);
  void Apply() override;
  void Tick(double kTime) override;
  virtual double GetManaGain();
};

struct ManaTideTotemAura final : ManaOverTime {
  explicit ManaTideTotemAura(Entity& entity);
  double GetManaGain() override;
};

struct FigurineSapphireOwlAura final : ManaOverTime {
  explicit FigurineSapphireOwlAura(Player& player);
};
