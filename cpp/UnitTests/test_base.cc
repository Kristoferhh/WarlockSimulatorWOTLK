// clang-format off
#include "pch.h"
// clang-format on
#include "test_base.h"

#include "../WarlockSimulatorWOTLK/include/aura_selection.h"
#include "../WarlockSimulatorWOTLK/include/item_slot.h"
#include "../WarlockSimulatorWOTLK/include/player.h"
#include "../WarlockSimulatorWOTLK/include/player_settings.h"
#include "../WarlockSimulatorWOTLK/include/sets.h"
#include "../WarlockSimulatorWOTLK/include/simulation.h"
#include "../WarlockSimulatorWOTLK/include/simulation_settings.h"
#include "../WarlockSimulatorWOTLK/include/spell.h"
#include "../WarlockSimulatorWOTLK/include/stat.h"
#include "../WarlockSimulatorWOTLK/include/talents.h"
#include "../WarlockSimulatorWOTLK/include/trinket.h"

Player TestBase::SetUpPlayer(std::shared_ptr<PlayerSettings> player_settings) {
  if (player_settings == nullptr) {
    player_settings = std::make_shared<PlayerSettings>(GetDefaultPlayerSettings());
  }

  return Player(*player_settings);
}

Simulation TestBase::SetUpSimulation(const std::shared_ptr<Player> kPlayer,
                                     std::shared_ptr<SimulationSettings> simulation_settings) {
  if (simulation_settings == nullptr) {
    simulation_settings = std::make_shared<SimulationSettings>(GetDefaultSimulationSettings());
  }

  return {*kPlayer, *simulation_settings};
}

PlayerSettings TestBase::GetDefaultPlayerSettings(std::shared_ptr<AuraSelection> auras,
                                                  std::shared_ptr<Talents> talents,
                                                  std::shared_ptr<Sets> sets,
                                                  std::shared_ptr<CharacterStats> stats,
                                                  std::shared_ptr<ItemSlot> items,
                                                  std::vector<int> glyphs) {
  if (auras == nullptr) {
    auras = std::make_shared<AuraSelection>(GetDefaultAuras());
  }

  if (talents == nullptr) {
    talents = std::make_shared<Talents>(GetDefaultTalents());
  }

  if (sets == nullptr) {
    sets = std::make_shared<Sets>(GetDefaultSets());
  }

  if (stats == nullptr) {
    stats = std::make_shared<CharacterStats>(GetDefaultStats());
  }

  if (items == nullptr) {
    items = std::make_shared<ItemSlot>(GetDefaultItems());
  }

  if (glyphs.empty()) {
    glyphs = std::vector<int>{GlyphId::kQuickDecay, GlyphId::kLifeTap, GlyphId::kHaunt};
  }

  auto player_settings                           = PlayerSettings(*auras, *talents, *sets, *stats, *items, glyphs);
  player_settings.enemy_amount                   = 5;
  player_settings.enemy_armor                    = 7700;
  player_settings.enemy_level                    = 83;
  player_settings.equipped_item_simulation       = true;
  player_settings.fight_type                     = EmbindConstant::kSingleTarget;
  player_settings.has_conflagrate                = true;
  player_settings.has_corruption                 = true;
  player_settings.has_curse_of_agony             = true;
  player_settings.has_curse_of_doom              = true;
  player_settings.has_curse_of_the_elements      = true;
  player_settings.has_dark_pact                  = true;
  player_settings.has_death_coil                 = true;
  player_settings.has_haunt                      = true;
  player_settings.has_hellfire                   = true;
  player_settings.has_immolate                   = true;
  player_settings.has_incinerate                 = true;
  player_settings.has_shadowfury                 = true;
  player_settings.has_shadow_bolt                = true;
  player_settings.has_shadow_burn                = true;
  player_settings.has_rain_of_fire               = true;
  player_settings.has_searing_pain               = true;
  player_settings.has_seed_of_corruption         = true;
  player_settings.has_unstable_affliction        = true;
  player_settings.recording_combat_log_breakdown = true;
  player_settings.power_infusion_amount          = 2;
  player_settings.auras.bloodlust                = true;
  player_settings.auras.power_infusion           = true;
  player_settings.selected_pet                   = EmbindConstant::kImp;
  player_settings.innervate_amount               = 2;
  player_settings.auras.innervate                = true;
  player_settings.race                           = EmbindConstant::kOrc;
  player_settings.auras.flame_cap                = true;

  return player_settings;
}

SimulationSettings TestBase::GetDefaultSimulationSettings() {
  auto simulation_settings            = SimulationSettings();
  simulation_settings.iterations      = 30000;
  simulation_settings.min_time        = 150;
  simulation_settings.max_time        = 210;
  simulation_settings.simulation_type = SimulationType::kNormal;

  return simulation_settings;
}

AuraSelection TestBase::GetDefaultAuras() {
  auto auras      = AuraSelection();
  auras.bloodlust = true;

  return auras;
}

Talents TestBase::GetDefaultTalents() {
  return {};
}

Sets TestBase::GetDefaultSets() {
  return {};
}

CharacterStats TestBase::GetDefaultStats() {
  auto stats = CharacterStats();
  stats.mana = 10000;

  return stats;
}

ItemSlot TestBase::GetDefaultItems() {
  return {};
}

std::unique_ptr<Spell> TestBase::CreateSpell() {
  const auto kPlayerSettings = std::make_shared<PlayerSettings>(GetDefaultPlayerSettings());
  const auto kPlayer         = std::make_shared<Player>(*kPlayerSettings);

  return std::make_unique<Spell>(*kPlayer);
}
