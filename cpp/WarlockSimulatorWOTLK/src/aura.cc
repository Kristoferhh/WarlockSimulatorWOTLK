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

Aura::Aura(Entity& player) : entity(player) {}

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

    for (auto& stat : stats) {
      stat.AddStat();
    }

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(name + " applied");
    }

    is_active = true;
  }

  if (stacks < max_stacks) {
    if (applies_with_max_stacks) {
      stacks = max_stacks;
    } else {
      stacks++;

      for (auto& stat : stats_per_stack) {
        stat.AddStat();
      }
    }

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(name + " (" + std::to_string(stacks) + ")");
    }
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

  for (auto& stat : stats) {
    stat.RemoveStat();
  }

  if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " faded");
  }

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->uptime_in_seconds +=
        entity.simulation->current_fight_time - entity.combat_log_breakdown.at(name)->applied_at;
  }

  if (stacks > 0) {
    for (auto& stat : stats_per_stack) {
      stat.RemoveStat(stacks);
    }
  }

  is_active = false;
  stacks    = 0;
}

void Aura::DecrementStacks() {
  stacks--;

  if (stacks <= 0) {
    Fade();
  } else if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " (" + std::to_string(stacks) + ")");
  }
}

CurseOfTheElementsAura::CurseOfTheElementsAura(Player& player) : Aura(player) {
  name     = SpellName::kCurseOfTheElements;
  duration = 300;
  Aura::Setup();
}

ShadowTranceAura::ShadowTranceAura(Player& player) : Aura(player) {
  name     = SpellName::kNightfall;
  duration = 10;
  Aura::Setup();
}

PowerInfusionAura::PowerInfusionAura(Player& player) : Aura(player) {
  name     = SpellName::kPowerInfusion;
  duration = 15;
  stats.push_back(SpellHastePercent(player, 1.2));
  stats.push_back(ManaCostModifier(player, 0.8));
  Aura::Setup();
}

FlameCapAura::FlameCapAura(Player& player) : Aura(player) {
  name     = SpellName::kFlameCap;
  duration = 60;
  stats.push_back(FirePower(player, 80));
  Aura::Setup();
}

BloodFuryAura::BloodFuryAura(Player& player) : Aura(player) {
  name     = SpellName::kBloodFury;
  duration = 15;
  stats.push_back(SpellPower(player, 163));
  Aura::Setup();
}

BloodlustAura::BloodlustAura(Player& player) : Aura(player) {
  name       = SpellName::kBloodlust;
  duration   = 40;
  group_wide = true;
  stats.push_back(SpellHastePercent(player, 1.3));
  if (player.pet != nullptr) {
    stats.push_back(SpellHastePercent(*player.pet, 1.3));
    stats.push_back(MeleeHastePercent(*player.pet, 1.3));
  }
  Aura::Setup();
}

TheLightningCapacitorAura::TheLightningCapacitorAura(Player& player) : Aura(player) {
  name         = SpellName::kTheLightningCapacitor;
  has_duration = false;
  max_stacks   = 3;
  Aura::Setup();
}

InnervateAura::InnervateAura(Player& player) : Aura(player) {
  name     = SpellName::kInnervate;
  duration = 20;
  Aura::Setup();
}

DemonicFrenzyAura::DemonicFrenzyAura(Pet& pet) : Aura(pet) {
  name       = SpellName::kDemonicFrenzy;
  duration   = 10;
  max_stacks = 10;
  Aura::Setup();
}

BlackBookAura::BlackBookAura(Pet& pet) : Aura(pet) {
  name     = SpellName::kBlackBook;
  duration = 30;
  stats.push_back(SpellPower(pet, 200));
  stats.push_back(AttackPower(pet, 325));
  Aura::Setup();
}

HauntAura::HauntAura(Player& player) : Aura(player) {
  name     = SpellName::kHaunt;
  duration = 12;
  Aura::Setup();
}

ShadowEmbraceAura::ShadowEmbraceAura(Player& player) : Aura(player) {
  name       = SpellName::kShadowEmbrace;
  duration   = 12;
  max_stacks = 3;
  Aura::Setup();
}

EradicationAura::EradicationAura(Player& player) : Aura(player) {
  name     = SpellName::kEradication;
  duration = 10;
  stats.push_back(SpellHastePercent(player, player.talents.eradication == 1   ? 1.06
                                            : player.talents.eradication == 2 ? 1.12
                                            : player.talents.eradication == 3 ? 1.2
                                                                              : 1));
  Aura::Setup();
}

MoltenCoreAura::MoltenCoreAura(Player& player) : Aura(player) {
  name                    = SpellName::kMoltenCore;
  duration                = 15;
  max_stacks              = 3;
  applies_with_max_stacks = true;
  Aura::Setup();
}

DemonicEmpowermentAura::DemonicEmpowermentAura(Pet& pet) : Aura(pet) {
  name = SpellName::kDemonicEmpowerment;

  if (pet.pet_name == PetName::kImp) {
    duration = 30;
    stats.push_back(SpellCritChance(pet, 1.2));
  } else if (pet.pet_name == PetName::kFelguard) {
    duration = 15;
    stats.push_back(MeleeHastePercent(pet, 1.2));
  }

  Aura::Setup();
}

DecimationAura::DecimationAura(Player& player) : Aura(player) {
  name     = SpellName::kDecimation;
  duration = 10;
  Aura::Setup();
}

// TODO does the pet get the aura
DemonicPactAura::DemonicPactAura(Player& player) : Aura(player) {
  name     = SpellName::kDemonicPact;
  duration = 45;
  Aura::Setup();
}

MetamorphosisAura::MetamorphosisAura(Player& player) : Aura(player) {
  name     = SpellName::kMetamorphosis;
  duration = 30;
  stats.push_back(DamageModifier(player, 1.2));
  Aura::Setup();
}

ShadowMasteryAura::ShadowMasteryAura(Player& player) : Aura(player) {
  name     = SpellName::kShadowMastery;
  duration = 30;
  stats.push_back(SpellCritChance(player, 5));
  stats.push_back(SpellCritChance(*player.pet, 5));
  Aura::Setup();
}

PyroclasmAura::PyroclasmAura(Player& player) : Aura(player) {
  name     = SpellName::kPyroclasm;
  duration = 10;
  stats.push_back(ShadowModifier(player, 1 + 0.02 * player.talents.pyroclasm));
  stats.push_back(FireModifier(player, 1 + 0.02 * player.talents.pyroclasm));
  Aura::Setup();
}

ImprovedSoulLeechAura::ImprovedSoulLeechAura(Player& player) : Aura(player) {
  name     = SpellName::kImprovedSoulLeech;
  duration = 15;
  stats.push_back(ManaPer5(player, player.stats.max_mana * 0.01));  // TODO does it also affect pet
  Aura::Setup();
}

void ImprovedSoulLeechAura::Apply() {
  Aura::Apply();
  // TODO does it give the pet 2% of *your* maximum mana or its maximum mana
  auto improved_soul_leech_modifier = 0.01 * entity.player->talents.improved_soul_leech;
  entity.player->stats.mana =
      std::min(entity.player->stats.mana + entity.player->stats.max_mana * improved_soul_leech_modifier,
               entity.player->stats.max_mana);
  entity.pet->stats.mana = std::min(entity.pet->stats.mana + entity.pet->stats.max_mana * improved_soul_leech_modifier,
                                    entity.pet->stats.max_mana);
}

BackdraftAura::BackdraftAura(Player& player) : Aura(player) {
  name                    = SpellName::kBackdraft;
  duration                = 15;
  max_stacks              = 3;
  applies_with_max_stacks = true;
  Aura::Setup();
}

EmpoweredImpAura::EmpoweredImpAura(Player& player) : Aura(player) {
  name     = SpellName::kEmpoweredImp;
  duration = 8;
  Aura::Setup();
}
