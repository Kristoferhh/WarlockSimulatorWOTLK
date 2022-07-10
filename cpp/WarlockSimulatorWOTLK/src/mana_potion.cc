#include "../include/mana_potion.h"

#include <iostream>

#include "../include/combat_log_breakdown.h"
#include "../include/common.h"
#include "../include/player.h"
#include "../include/player_settings.h"

// TODO create a Potion class and inherit from that
ManaPotion::ManaPotion(Player& player) : Spell(player) {
  cooldown                  = 60;
  is_item                   = true;
  on_gcd                    = false;
  limited_amount_of_casts   = true;
  amount_of_casts_per_fight = 1;

  if (benefits_from_alchemists_stone && player.alchemists_stone_effect_active) {
    min_mana_gain = static_cast<int>(min_mana_gain * 1.4);
    max_mana_gain = static_cast<int>(max_mana_gain * 1.4);
    mana_gain *= 1.4;
  }
}

void ManaPotion::Cast() {
  Spell::Cast();
  const double kCurrentPlayerMana = entity.stats.mana;
  const double kManaGain          = entity.player->settings.randomize_values && min_mana_gain > 0 && max_mana_gain > 0
                                        ? entity.player->rng.Range(min_mana_gain, max_mana_gain)
                                        : mana_gain;

  entity.stats.mana        = std::min(entity.stats.max_mana, kCurrentPlayerMana + kManaGain);
  const double kManaGained = entity.stats.mana - kCurrentPlayerMana;

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->iteration_mana_gain += kManaGained;
  }

  if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog("Player gains " + DoubleToString(kManaGained) + " mana from " + name + " (" +
                     DoubleToString(round(kCurrentPlayerMana)) + " -> " + DoubleToString(round(entity.stats.mana)) +
                     ")");
  }
}

RunicManaPotion::RunicManaPotion(Player& player) : ManaPotion(player) {
  name          = WarlockSimulatorConstants::kRunicManaPotion;
  min_mana_gain = 4200;
  max_mana_gain = 4400;
  Spell::Setup();
}

DemonicRune::DemonicRune(Player& player) : ManaPotion(player) {
  name                           = WarlockSimulatorConstants::kDemonicRune;
  min_mana_gain                  = 900;
  max_mana_gain                  = 1500;
  cooldown                       = 900;
  benefits_from_alchemists_stone = false;
  Spell::Setup();
}
