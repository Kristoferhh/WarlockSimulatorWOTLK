#include "../include/aura.h"

#include <memory>

#include "../include/combat_log_breakdown.h"
#include "../include/entity.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/simulation.h"
#include "../include/stat.h"
#include "../include/talents.h"

Aura::Aura(Entity& entity_param) : entity(entity_param) {}

void Aura::Setup() {
  if (entity.recording_combat_log_breakdown && !entity.combat_log_breakdown.contains(name)) {
    entity.combat_log_breakdown.insert({name, std::make_shared<CombatLogBreakdown>(name)});
  }

  entity.aura_list.push_back(this);
}

void Aura::Tick(const double kTime) {
  if (has_duration) {
    duration_remaining -= kTime;

    if (duration_remaining <= 0) {
      Fade();
    }
  }
}

void Aura::Apply() {
  if (is_active && entity.ShouldWriteToCombatLog() && stacks == max_stacks) {
    entity.CombatLog(name + " refreshed");
  } else if (!is_active) {
    if (entity.recording_combat_log_breakdown) {
      entity.combat_log_breakdown.at(name)->applied_at = entity.simulation->current_fight_time;
    }

    for (auto& stat : stats) { stat.AddStat(); }

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(name + " applied");
    }

    is_active = true;
  }

  if (stacks < max_stacks) {
    stacks++;

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(name + " (" + std::to_string(stacks) + ")");
    }

    for (auto& stat : stats_per_stack) { stat.AddStat(); }
  }

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->count++;
  }

  duration_remaining = duration;
}

void Aura::Fade() {
  if (!is_active) {
    entity.player->ThrowError("Attempting to fade " + name + " when it isn't is_active");
  }

  for (auto& stat : stats) { stat.RemoveStat(); }

  if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " faded");
  }

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->uptime_in_seconds +=
        entity.simulation->current_fight_time - entity.combat_log_breakdown.at(name)->applied_at;
  }

  if (stacks > 0) {
    for (auto& stat : stats_per_stack) { stat.RemoveStat(stacks); }
  }

  is_active = false;
  stacks    = 0;
}

void Aura::DecrementStacks() {}

ImprovedShadowBoltAura::ImprovedShadowBoltAura(Entity& entity_param) : Aura(entity_param) {
  name       = SpellName::kImprovedShadowBolt;
  duration   = 12;
  max_stacks = 4;
  modifier   = 1 + entity_param.player->talents.improved_shadow_bolt * 0.04;
  Aura::Setup();
}

void ImprovedShadowBoltAura::Apply() {
  Aura::Apply();
  stacks = max_stacks;
}

void ImprovedShadowBoltAura::DecrementStacks() {
  stacks--;

  if (stacks <= 0) {
    Fade();
  } else if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " (" + std::to_string(stacks) + ")");
  }
}

CurseOfTheElementsAura::CurseOfTheElementsAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kCurseOfTheElements;
  duration = 300;
  Aura::Setup();
}

ShadowTranceAura::ShadowTranceAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kNightfall;
  duration = 10;
  Aura::Setup();
}

PowerInfusionAura::PowerInfusionAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kPowerInfusion;
  duration = 15;
  stats.push_back(SpellHastePercent(entity_param, 1.2));
  stats.push_back(ManaCostModifier(entity_param, 0.8));
  Aura::Setup();
}

FlameCapAura::FlameCapAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kFlameCap;
  duration = 60;
  stats.push_back(FirePower(entity_param, 80));
  Aura::Setup();
}

BloodFuryAura::BloodFuryAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kBloodFury;
  duration = 15;
  stats.push_back(SpellPower(entity_param, 163));
  Aura::Setup();
}

BloodlustAura::BloodlustAura(Entity& entity_param) : Aura(entity_param) {
  name       = SpellName::kBloodlust;
  duration   = 40;
  group_wide = true;
  stats.push_back(SpellHastePercent(entity_param, 1.3));
  if (entity_param.pet != nullptr) {
    stats.push_back(SpellHastePercent(*entity_param.pet, 1.3));
    stats.push_back(MeleeHastePercent(*entity_param.pet, 1.3));
  }
  Aura::Setup();
}

TheLightningCapacitorAura::TheLightningCapacitorAura(Entity& entity_param) : Aura(entity_param) {
  name         = SpellName::kTheLightningCapacitor;
  has_duration = false;
  max_stacks   = 3;
  Aura::Setup();
}

AmplifyCurseAura::AmplifyCurseAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kAmplifyCurse;
  duration = 30;
  Aura::Setup();
}

InnervateAura::InnervateAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kInnervate;
  duration = 20;
  Aura::Setup();
}

DemonicFrenzyAura::DemonicFrenzyAura(Entity& entity_param) : Aura(entity_param) {
  name       = SpellName::kDemonicFrenzy;
  duration   = 10;
  max_stacks = 10;
  Aura::Setup();
}

BlackBookAura::BlackBookAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kBlackBook;
  duration = 30;
  stats.push_back(SpellPower(entity_param, 200));
  stats.push_back(AttackPower(entity_param, 325));
  Aura::Setup();
}

HauntAura::HauntAura(Entity& entity_param) : Aura(entity_param) {
  name     = SpellName::kHaunt;
  duration = 12;
  Aura::Setup();
}
