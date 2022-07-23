// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/damage_over_time.h"

#include "../include/aura.h"
#include "../include/combat_log_breakdown.h"
#include "../include/common.h"
#include "../include/on_dot_tick_proc.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/sets.h"
#include "../include/simulation.h"
#include "../include/talents.h"

DamageOverTime::DamageOverTime(Player& player,
                               const std::string& kName,
                               const SpellSchool kSpellSchool,
                               const double kDuration,
                               const double kTickTimerTotal)
    : player(player),
      school(kSpellSchool),
      duration(kDuration),
      tick_timer_total(kTickTimerTotal),
      scales_with_haste(false),
      original_duration(kDuration),
      original_tick_timer_total(kTickTimerTotal),
      ticks_total(static_cast<int>(kDuration) / static_cast<int>(kTickTimerTotal)),
      name(kName) {
  if (player.recording_combat_log_breakdown && !player.combat_log_breakdown.contains(kName)) {
    player.combat_log_breakdown.insert({kName, std::make_shared<CombatLogBreakdown>(kName)});
  }

  if (player.talents.pandemic == 1) {
    if (kName == WarlockSimulatorConstants::kCorruption || kName == WarlockSimulatorConstants::kUnstableAffliction) {
      crit_damage_multiplier = 2.0;
    } else if (kName == WarlockSimulatorConstants::kHaunt) {
      crit_damage_multiplier -= 1;
      crit_damage_multiplier *= 2;
      crit_damage_multiplier += 1;
    }
  }

  player.dot_list.push_back(this);
}

void DamageOverTime::Apply() {
  const bool kIsAlreadyActive = is_active == true;

  if (scales_with_haste) {
    duration = original_duration / player.GetHastePercent();
    CalculateTickTimerTotal();
  }

  if (kIsAlreadyActive && player.ShouldWriteToCombatLog()) {
    player.CombatLog(name + " refreshed before letting it expire");
  } else if (!kIsAlreadyActive && player.recording_combat_log_breakdown) {
    player.combat_log_breakdown.at(name)->applied_at = player.simulation->current_fight_time;
  }

  spell_power          = player.GetSpellPower(school);
  is_active            = true;
  tick_timer_remaining = tick_timer_total;
  ticks_remaining      = ticks_total;

  if (player.recording_combat_log_breakdown) {
    player.combat_log_breakdown.at(name)->count++;
  }

  if (player.ShouldWriteToCombatLog()) {
    player.CombatLog(name + " " + (kIsAlreadyActive ? "refreshed" : "applied") + " (" + DoubleToString(spell_power) +
                     " Spell Power)");
  }
}

void DamageOverTime::CalculateTickTimerTotal() {
  tick_timer_total = duration / (static_cast<double>(original_duration) / original_tick_timer_total);
}

void DamageOverTime::Fade() {
  is_active            = false;
  tick_timer_remaining = 0;
  ticks_remaining      = 0;

  if (player.recording_combat_log_breakdown) {
    player.combat_log_breakdown.at(name)->uptime_in_seconds +=
        player.simulation->current_fight_time - player.combat_log_breakdown.at(name)->applied_at;
  }

  if (player.ShouldWriteToCombatLog()) {
    player.CombatLog(name + " faded");
  }
}

std::vector<double> DamageOverTime::GetConstantDamage() const {
  const auto kCurrentSpellPower       = is_active ? spell_power : player.GetSpellPower(school);
  const auto kModifier                = GetDamageModifier();
  const auto kPartialResistMultiplier = parent_spell->GetPartialResistMultiplier();
  auto dmg                            = base_damage;
  auto total_damage                   = dmg;

  total_damage += kCurrentSpellPower * coefficient;
  total_damage *= kModifier * kPartialResistMultiplier;

  if (name == WarlockSimulatorConstants::kDrainSoul && player.simulation->GetEnemyHealthPercent() <= 25) {
    total_damage *= 4;
  }

  if (name == WarlockSimulatorConstants::kCorruption) {
    total_damage *= 1 + 0.02 * player.talents.improved_corruption;
  }

  return std::vector{dmg, total_damage, kCurrentSpellPower, kModifier, kPartialResistMultiplier};
}

double DamageOverTime::PredictDamage() const {
  return GetConstantDamage()[1];
}

double DamageOverTime::GetDamageModifier() const {
  auto damage_modifier = parent_spell->GetDamageModifier();

  if (school == SpellSchool::kShadow && player.auras.haunt != nullptr && player.auras.haunt->is_active) {
    damage_modifier *= 1.2 + (player.has_glyph_of_haunt ? 0.03 : 0);  // TODO additive or multiplicative?
  }

  if (name == WarlockSimulatorConstants::kImmolate && player.has_glyph_of_immolate) {
    damage_modifier *= 1.1;  // TODO additive or multiplicative?
  }

  // TODO maybe additive
  if (name == WarlockSimulatorConstants::kDrainSoul && player.talents.soul_siphon > 0) {
    damage_modifier *= 1 + std::min(0.18, 0.03 * player.GetActiveAfflictionEffectsCount() * player.talents.soul_siphon);
  }

  if (school == SpellSchool::kShadow && player.auras.shadow_embrace != nullptr &&
      player.auras.shadow_embrace->is_active) {
    damage_modifier *= 1 + 0.01 * player.auras.shadow_embrace->stacks * player.talents.shadow_embrace;
  }

  if (name == WarlockSimulatorConstants::kImmolate && player.talents.aftermath > 0) {
    damage_modifier *= 1 + 0.03 * player.talents.aftermath;
  }

  return damage_modifier;
}

void DamageOverTime::Tick(const double kTime) {
  tick_timer_remaining -= kTime;

  if (tick_timer_remaining <= 0) {
    const std::vector<double> kConstantDamage = GetConstantDamage();
    const double kBaseDamage                  = kConstantDamage[0];
    const double kDamage                      = kConstantDamage[1] / (static_cast<double>(duration) / tick_timer_total);
    const double kSpellPower                  = kConstantDamage[2];
    const double kModifier                    = kConstantDamage[3];
    const double kPartialResistMultiplier     = kConstantDamage[4];

    // Check for Nightfall proc
    // TODO OnDotTickProc
    if (name == WarlockSimulatorConstants::kCorruption && player.talents.nightfall > 0) {
      if (player.RollRng(player.talents.nightfall * 2)) {
        player.auras.shadow_trance->Apply();
      }
    }

    if (name == WarlockSimulatorConstants::kCorruption && player.has_glyph_of_corruption) {
      if (player.RollRng(WarlockSimulatorConstants::GlyphOfCorruptionProcChance)) {
        player.auras.shadow_trance->Apply();
      }
    }

    // TODO this can maybe be changed into a OnDotTickProc
    if (name == WarlockSimulatorConstants::kCorruption && player.auras.eradication != nullptr && player.RollRng(6)) {
      player.auras.eradication->Apply();
    }

    player.iteration_damage += kDamage;
    ticks_remaining--;
    tick_timer_remaining = tick_timer_total;

    if (player.recording_combat_log_breakdown) {
      player.combat_log_breakdown.at(name)->iteration_damage += kDamage;
    }

    if (player.ShouldWriteToCombatLog()) {
      player.CombatLog(name + " Tick " + DoubleToString(round(kDamage)) + " (" + DoubleToString(kBaseDamage) +
                       " Base Damage - " + DoubleToString(kSpellPower) + " Spell Power - " +
                       DoubleToString(coefficient, 3) + " Coefficient - " +
                       DoubleToString(round(kModifier * 10000) / 100, 3) + "% Damage Modifier - " +
                       DoubleToString(round(kPartialResistMultiplier * 1000) / 10) + "% Partial Resist Multiplier)");
    }

    for (const auto& kProc : player.on_dot_tick_procs) {
      if (kProc->Ready() && kProc->ShouldProc(this) && player.RollRng(kProc->proc_chance)) {
        kProc->StartCast();
      }
    }

    if (ticks_remaining <= 0) {
      Fade();
    }
  }
}

CorruptionDot::CorruptionDot(Player& player)
    : DamageOverTime(player, WarlockSimulatorConstants::kCorruption, SpellSchool::kShadow, 18, 3) {
  base_damage = 1080;
  coefficient = 3.0 / 15.0 + 0.12 * player.talents.empowered_corruption + 0.01 * player.talents.everlasting_affliction +
                0.05 * player.talents.siphon_life;
  scales_with_haste = player.has_glyph_of_quick_decay;
}

void CorruptionDot::Tick(const double kTime) {
  DamageOverTime::Tick(kTime);

  if (should_reset_duration_on_next_tick) {
    should_reset_duration_on_next_tick = false;
    ticks_remaining                    = ticks_total;
  }
}

UnstableAfflictionDot::UnstableAfflictionDot(Player& player)
    : DamageOverTime(player, WarlockSimulatorConstants::kUnstableAffliction, SpellSchool::kShadow, 15, 3) {
  base_damage = 1380;
  coefficient = 1.2 + 0.01 * player.talents.everlasting_affliction + 0.05 * player.talents.siphon_life;
}

ImmolateDot::ImmolateDot(Player& player)
    : DamageOverTime(
          player, WarlockSimulatorConstants::kImmolate, SpellSchool::kFire, 15 + 3 * player.talents.molten_core, 3) {
  base_damage = 785;
  coefficient = 0.2;
}

CurseOfAgonyDot::CurseOfAgonyDot(Player& player)
    : DamageOverTime(player,
                     WarlockSimulatorConstants::kCurseOfAgony,
                     SpellSchool::kShadow,
                     24 + (player.has_glyph_of_curse_of_agony ? 4 : 0),
                     3) {
  base_damage = 1740;
  coefficient = 1.2;
}

CurseOfDoomDot::CurseOfDoomDot(Player& player)
    : DamageOverTime(player, WarlockSimulatorConstants::kCurseOfDoom, SpellSchool::kShadow, 60, 60) {
  base_damage = 7300;
  coefficient = 2;
}

ShadowflameDot::ShadowflameDot(Player& player) : DamageOverTime(player, "Shadowflame", SpellSchool::kFire, 8, 2) {
  base_damage = 512;
  coefficient = 1.0 / 15.0;
}

ConflagrateDot::ConflagrateDot(Player& player)
    : DamageOverTime(player, WarlockSimulatorConstants::kConflagrate, SpellSchool::kFire, 6, 2) {}

DrainSoulDot::DrainSoulDot(Player& player)
    : DamageOverTime(player, WarlockSimulatorConstants::kDrainSoul, SpellSchool::kShadow, 15, 3) {
  base_damage       = 710;
  coefficient       = 0.429;
  scales_with_haste = true;
}
