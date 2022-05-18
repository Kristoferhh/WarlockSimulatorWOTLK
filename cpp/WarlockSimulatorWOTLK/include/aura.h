#pragma once
#include <string>

struct Stat;
struct Entity;
#include <vector>

struct Aura {
  virtual ~Aura() = default;
  Entity& entity;
  std::vector<Stat> stats;
  std::vector<Stat> stats_per_stack;
  std::string name;
  int duration              = 0;
  double duration_remaining = 0;
  bool is_active            = false;
  bool has_duration         = true;
  bool group_wide           = false;  // true if it's an aura that applies to everyone in the group
  // (will apply to pets as well then)
  // dots
  int tick_timer_total        = 0;
  double tick_timer_remaining = 0;
  int ticks_remaining         = 0;
  int ticks_total             = 0;
  int stacks                  = 0;
  int max_stacks              = 0;
  // ISB
  double modifier = 1;
  // Bloodlust
  double haste_modifier = 0;

  explicit Aura(Entity& entity_param);
  virtual void Setup();
  virtual void Tick(double kTime);
  virtual void Apply();
  void Fade();
  virtual void DecrementStacks();  // ISB
};

struct ImprovedShadowBoltAura final : Aura {
  explicit ImprovedShadowBoltAura(Entity& entity_param);
  void Apply() override;
  void DecrementStacks() override;
};

struct CurseOfTheElementsAura final : Aura {
  explicit CurseOfTheElementsAura(Entity& entity_param);
};

struct ShadowTranceAura final : Aura {
  explicit ShadowTranceAura(Entity& entity_param);
};

struct PowerInfusionAura final : Aura {
  explicit PowerInfusionAura(Entity& entity_param);
};

struct FlameCapAura final : Aura {
  explicit FlameCapAura(Entity& entity_param);
};

struct BloodFuryAura final : Aura {
  explicit BloodFuryAura(Entity& entity_param);
};

struct BloodlustAura final : Aura {
  explicit BloodlustAura(Entity& entity_param);
};

struct TheLightningCapacitorAura final : Aura {
  explicit TheLightningCapacitorAura(Entity& entity_param);
};

struct AmplifyCurseAura final : Aura {
  explicit AmplifyCurseAura(Entity& entity_param);
};

struct InnervateAura final : Aura {
  explicit InnervateAura(Entity& entity_param);
};

struct DemonicFrenzyAura final : Aura {
  explicit DemonicFrenzyAura(Entity& entity_param);
};

struct BlackBookAura final : Aura {
  explicit BlackBookAura(Entity& entity_param);
};

struct HauntAura final : Aura {
  explicit HauntAura(Entity& entity_param);
};
