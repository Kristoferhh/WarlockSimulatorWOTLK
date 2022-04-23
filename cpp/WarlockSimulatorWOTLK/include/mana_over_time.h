#pragma once
#include "aura.h"

struct ManaOverTime : Aura {
  explicit ManaOverTime(Entity& entity);
  void Apply() override;
  void Tick(double kTime) override;
  void Setup() override;
  virtual double GetManaGain() = 0;
};

struct ManaTideTotemAura final : ManaOverTime {
  explicit ManaTideTotemAura(Entity& entity);
  double GetManaGain() override;
};
