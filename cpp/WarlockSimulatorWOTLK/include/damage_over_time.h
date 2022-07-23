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
  double duration         = 0.0;  // Total duration of the dot
  double tick_timer_total = 3.0;  // Total duration of each tick (default is 3 seconds
  bool scales_with_haste;
  int original_duration;          // For when a dot's duration scales with haste.
  int original_tick_timer_total;  // For when a dot's duration scales with haste.
  // between ticks)
  double tick_timer_remaining   = 0;  // Time until next tick
  int ticks_remaining           = 0;  // Amount of ticks remaining before the dot expires
  int ticks_total               = 0;
  double spell_power            = 0;  // Spell Power amount when dot was applied
  double base_damage            = 0;
  double coefficient            = 0;
  bool is_active                = false;
  double crit_damage_multiplier = 2;
  std::string name;
  bool should_reset_duration_on_next_tick = false;  // Corruption - Everlasting Affliction
  double bonus_crit_chance                = 0;
  bool can_crit                           = false;

  explicit DamageOverTime(
      Player& player, const std::string& kName, SpellSchool kSpellSchool, double kDuration, double kTickTimerTotal);
  virtual void Apply();
  void Fade();
  virtual void Tick(double kTime);
  bool IsCrit() const;
  double GetCritChance() const;
  [[nodiscard]] std::vector<double> GetConstantDamage() const;
  [[nodiscard]] double PredictDamage() const;
  [[nodiscard]] double GetDamageModifier() const;
};

struct CorruptionDot final : DamageOverTime {
  explicit CorruptionDot(Player& player);
  void Tick(double kTime) override;
};

struct UnstableAfflictionDot final : DamageOverTime {
  explicit UnstableAfflictionDot(Player& player);
};

struct ImmolateDot final : DamageOverTime {
  explicit ImmolateDot(Player& player);
};

struct CurseOfAgonyDot final : DamageOverTime {
  explicit CurseOfAgonyDot(Player& player);
};

struct CurseOfDoomDot final : DamageOverTime {
  explicit CurseOfDoomDot(Player& player);
};

struct ShadowflameDot final : DamageOverTime {
  explicit ShadowflameDot(Player& player);
};

struct ConflagrateDot final : DamageOverTime {
  explicit ConflagrateDot(Player& player);
};

// TODO turn this into a channeled spell or something instead of being a dot, maybe
struct DrainSoulDot final : DamageOverTime {
  explicit DrainSoulDot(Player& player);
};
