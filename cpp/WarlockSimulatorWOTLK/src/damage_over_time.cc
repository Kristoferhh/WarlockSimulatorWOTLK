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

DamageOverTime::DamageOverTime(Player& player_param) : player(player_param), school(SpellSchool::kNoSchool) {}

void DamageOverTime::Setup() {
  ticks_total = duration / tick_timer_total;

  if (player.recording_combat_log_breakdown && !player.combat_log_breakdown.contains(name)) {
    player.combat_log_breakdown.insert({name, std::make_shared<CombatLogBreakdown>(name)});
  }

  if (player.talents.pandemic == 1) {
    if (name == SpellName::kCorruption || name == SpellName::kUnstableAffliction) {
      crit_damage_multiplier = 2.0;
    } else if (name == SpellName::kHaunt) {
      crit_damage_multiplier -= 1;
      crit_damage_multiplier *= 2;
      crit_damage_multiplier += 1;
    }
  }

  player.dot_list.push_back(this);
}

void DamageOverTime::Apply() {
  const bool kIsAlreadyActive = is_active == true;

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

  if (name == SpellName::kDrainSoul && player.simulation->GetEnemyHealthPercent() <= 25) {
    total_damage *= 4;
  }

  if (name == SpellName::kCorruption) {
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
    damage_modifier *= 1.2;
  }

  // TODO maybe additive
  if (name == SpellName::kDrainSoul && player.talents.soul_siphon > 0) {
    damage_modifier *= 1 + std::min(0.18, 0.03 * player.GetActiveAfflictionEffectsCount() * player.talents.soul_siphon);
  }

  if (school == SpellSchool::kShadow && player.auras.shadow_embrace != nullptr &&
      player.auras.shadow_embrace->is_active) {
    damage_modifier *= 1 + 0.01 * player.auras.shadow_embrace->stacks * player.talents.shadow_embrace;
  }

  if (name == SpellName::kImmolate && player.talents.aftermath > 0) {
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
    if (name == SpellName::kCorruption && player.talents.nightfall > 0) {
      if (player.RollRng(player.talents.nightfall * 2)) {
        player.auras.shadow_trance->Apply();
      }
    }

    // TODO this can maybe be changed into a OnDotTickProc
    if (name == SpellName::kCorruption && player.auras.eradication != nullptr && player.RollRng(6)) {
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

CorruptionDot::CorruptionDot(Player& player_param) : DamageOverTime(player_param) {
  name             = SpellName::kCorruption;
  duration         = 18;
  tick_timer_total = 3;
  base_damage      = 1080;
  school           = SpellSchool::kShadow;
  coefficient      = 3.0 / 15.0 + 0.12 * player_param.talents.empowered_corruption +
                0.01 * player_param.talents.everlasting_affliction + 0.05 * player_param.talents.siphon_life;
  Setup();
}

UnstableAfflictionDot::UnstableAfflictionDot(Player& player_param) : DamageOverTime(player_param) {
  name             = SpellName::kUnstableAffliction;
  duration         = 15;
  tick_timer_total = 3;
  base_damage      = 1380;
  school           = SpellSchool::kShadow;
  coefficient      = 1.2 + 0.01 * player_param.talents.everlasting_affliction + 0.05 * player_param.talents.siphon_life;
  Setup();
}

ImmolateDot::ImmolateDot(Player& player_param) : DamageOverTime(player_param) {
  name             = SpellName::kImmolate;
  duration         = 15 + 3 * player_param.talents.molten_core;
  tick_timer_total = 3;
  base_damage      = 785;
  school           = SpellSchool::kFire;
  coefficient      = 0.2;
  Setup();
}

CurseOfAgonyDot::CurseOfAgonyDot(Player& player_param) : DamageOverTime(player_param) {
  name             = SpellName::kCurseOfAgony;
  duration         = 24;
  tick_timer_total = 3;
  base_damage      = 1740;
  school           = SpellSchool::kShadow;
  coefficient      = 1.2;
  Setup();
}

CurseOfDoomDot::CurseOfDoomDot(Player& player_param) : DamageOverTime(player_param) {
  name             = SpellName::kCurseOfDoom;
  duration         = 60;
  tick_timer_total = 60;
  base_damage      = 7300;
  school           = SpellSchool::kShadow;
  coefficient      = 2;
  Setup();
}

ShadowflameDot::ShadowflameDot(Player& player_param) : DamageOverTime(player_param) {
  name             = SpellName::kShadowflame;
  duration         = 8;
  tick_timer_total = 2;
  base_damage      = 512;
  school           = SpellSchool::kFire;
  coefficient      = 1.0 / 15.0;
  Setup();
}

ConflagrateDot::ConflagrateDot(Player& player_param) : DamageOverTime(player_param) {
  name             = SpellName::kConflagrate;
  duration         = 6;
  tick_timer_total = 2;
  school           = SpellSchool::kFire;
  Setup();
}

DrainSoulDot::DrainSoulDot(Player& player_param) : DamageOverTime(player_param) {
  name             = SpellName::kDrainSoul;
  duration         = 15;  // TODO drain soul's duration is reduced with haste
  tick_timer_total = 3;
  base_damage      = 710;
  coefficient      = 0.429;
  school           = SpellSchool::kShadow;
  Setup();
}
