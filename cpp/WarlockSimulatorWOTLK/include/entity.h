#pragma once
#include <memory>
#include <string>
#include <vector>

#include "auras.h"
#include "character_stats.h"
#include "enums.h"
#include "spells.h"

struct OnCastProc;
struct DamageOverTime;
struct Spell;
struct Aura;
enum class SpellSchool;
struct OnResistProc;
struct OnDamageProc;
struct OnDotTickProc;
struct OnCritProc;
struct OnHitProc;
struct CombatLogBreakdown;
enum class EntityType;
struct PlayerSettings;
struct Player;
struct Pet;
struct Simulation;

#include <map>

struct Entity {
  virtual ~Entity()                = default;
  const int kFloatNumberMultiplier = 1000;  // Multiply doubles such as hit and crit chance with this since we need an
  // integer when calling player.rng.range()
  const int kLevel              = 80;
  const double kGcdValue        = 1.5;
  const double kMinimumGcdValue = 1;
  const double kBaseMana        = 3856;
  Simulation* simulation;
  Player* player;
  PlayerSettings& settings;
  Auras auras   = Auras();
  Spells spells = Spells();
  std::shared_ptr<Pet> pet;
  CharacterStats stats;
  EntityType type;
  std::string name;
  std::map<std::string, std::shared_ptr<CombatLogBreakdown>> combat_log_breakdown;
  std::vector<Aura*> aura_list;
  std::vector<Spell*> spell_list;
  std::vector<DamageOverTime*> dot_list;
  std::vector<OnHitProc*> on_hit_procs;
  std::vector<OnCritProc*> on_crit_procs;
  std::vector<OnDotTickProc*> on_dot_tick_procs;
  std::vector<OnDamageProc*> on_damage_procs;
  std::vector<OnResistProc*> on_resist_procs;
  std::vector<OnCastProc*> on_cast_procs;
  double cast_time_remaining              = 0;
  double gcd_remaining                    = 0;
  double five_second_rule_timer_remaining = 5;
  double mp5_timer_remaining              = 5;
  bool recording_combat_log_breakdown;
  bool equipped_item_simulation;
  bool infinite_mana;
  int enemy_shadow_resist;  // TODO move these to an Enemy struct
  int enemy_fire_resist;
  int enemy_level_difference_resistance;

  Entity(Player* player, PlayerSettings& player_settings, EntityType kEntityType);
  virtual double GetIntellect();
  virtual double GetStamina();
  virtual double GetHastePercent() = 0;
  virtual double FindTimeUntilNextAction();
  virtual void Tick(double kTime);
  virtual void EndAuras();
  virtual void Reset();
  virtual void Initialize(Simulation* simulation_ptr);
  virtual double GetSpellPower(SpellSchool spell_school) = 0;
  virtual double GetSpellCritChance()                    = 0;
  virtual double GetMeleeCritChance();
  [[nodiscard]] double GetSpirit() const;
  double GetGcdValue();
  [[nodiscard]] double GetBaseSpellHitChance(int kEntityLevel, int kEnemyLevel) const;
  void SendCombatLogBreakdown() const;
  void CombatLog(const std::string& kEntry) const;
  [[nodiscard]] bool ShouldWriteToCombatLog() const;
  void PostIterationDamageAndMana(const std::string& kSpellName) const;
};
