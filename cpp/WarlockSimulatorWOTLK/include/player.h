#pragma once
#include <memory>
#include <string>
#include <vector>

#include "entity.h"
#include "enums.h"
#include "rng.h"

struct AuraSelection;
struct Simulation;
struct Aura;
struct Spell;
struct Trinket;
struct PlayerSettings;
struct ItemSlot;
struct Sets;
struct Talents;

struct Player final : Entity {
  AuraSelection& selected_auras;
  Talents& talents;
  Sets& sets;
  ItemSlot& items;
  std::vector<Trinket> trinkets;
  std::shared_ptr<Spell> filler;
  std::shared_ptr<Spell> curse_spell;
  std::shared_ptr<Aura> curse_aura;
  std::vector<std::string> combat_log_entries;
  std::string custom_stat;
  Rng rng;
  double total_fight_duration;
  double iteration_damage;
  int power_infusions_ready;
  bool alchemists_stone_effect_active   = false;
  bool has_glyph_of_quick_decay         = false;
  bool has_glyph_of_life_tap            = false;
  bool has_glyph_of_haunt               = false;
  bool has_glyph_of_curse_of_agony      = false;
  bool has_glyph_of_corruption          = false;
  bool has_glyph_of_shadow_bolt         = false;
  bool has_glyph_of_unstable_affliction = false;
  bool has_glyph_of_felguard            = false;
  bool has_glyph_of_immolate            = false;
  bool has_glyph_of_imp                 = false;
  bool has_glyph_of_incinerate          = false;
  bool has_glyph_of_metamorphosis       = false;
  bool has_glyph_of_searing_pain        = false;
  bool has_glyph_of_shadowburn          = false;
  bool has_glyph_of_chaos_bolt          = false;
  bool has_glyph_of_conflagrate         = false;

  explicit Player(PlayerSettings& player_settings);
  void Initialize(Simulation* simulation_ptr) override;
  void InitializeTrinkets();
  void InitializeAuras();
  void InitializeSpells();
  void Reset() override;
  void EndAuras() override;
  void ThrowError(const std::string& kError) const;
  void CastLifeTapOrDarkPact() const;
  void UseCooldowns();
  void SendCombatLogEntries() const;
  void SendPlayerInfoToCombatLog();
  void Tick(double kTime) override;
  double GetSpellPower(SpellSchool kSchool = SpellSchool::kNoSchool) override;
  double GetHastePercent() override;
  double GetSpellCritChance() override;
  double FindTimeUntilNextAction() override;
  int GetRand();
  bool RollRng(double kChance);
  [[nodiscard]] int GetActiveAfflictionEffectsCount() const;
  void RollEverlastingAfflictionProc();
};
