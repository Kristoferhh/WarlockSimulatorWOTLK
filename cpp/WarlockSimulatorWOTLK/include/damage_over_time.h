#pragma once
#include <memory>
#include <string>
#include <vector>

enum class SpellSchool;
struct Player;
struct Spell;

struct DamageOverTime {
  virtual ~DamageOverTime() = default;
  Player& player;
  std::shared_ptr<Spell> parent_spell;
  SpellSchool school;
  int duration         = 0;  // Total duration of the dot
  int tick_timer_total = 3;  // Total duration of each tick (default is 3 seconds
  // between ticks)
  double tick_timer_remaining   = 0;  // Time until next tick
  int ticks_remaining           = 0;  // Amount of ticks remaining before the dot expires
  int ticks_total               = 0;
  double spell_power            = 0;  // Spell Power amount when dot was applied
  double base_damage            = 0;
  double coefficient            = 0;
  bool is_active                = false;
  double crit_damage_multiplier = 1.5;
  std::string name;

  explicit DamageOverTime(Player& player_param);
  void Setup();
  virtual void Apply();
  void Fade();
  void Tick(double kTime);
  [[nodiscard]] std::vector<double> GetConstantDamage() const;
  [[nodiscard]] double PredictDamage() const;
  double GetDamageModifier() const;
};

struct CorruptionDot final : DamageOverTime {
  explicit CorruptionDot(Player& player_param);
};

struct UnstableAfflictionDot final : DamageOverTime {
  explicit UnstableAfflictionDot(Player& player_param);
};

struct ImmolateDot final : DamageOverTime {
  explicit ImmolateDot(Player& player_param);
};

struct CurseOfAgonyDot final : DamageOverTime {
  explicit CurseOfAgonyDot(Player& player_param);
};

struct CurseOfDoomDot final : DamageOverTime {
  explicit CurseOfDoomDot(Player& player_param);
};

struct ShadowflameDot final : DamageOverTime {
  explicit ShadowflameDot(Player& player_param);
};

struct ConflagrateDot final : DamageOverTime {
  explicit ConflagrateDot(Player& player_param);
};

// TODO turn this into a channeled spell or something instead of being a dot
struct DrainSoulDot final : DamageOverTime {
  explicit DrainSoulDot(Player& player_param);
};
