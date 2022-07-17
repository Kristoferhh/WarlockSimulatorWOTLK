#include "../include/mana_potion.h"

#include "../include/combat_log_breakdown.h"
#include "../include/common.h"
#include "../include/player.h"
#include "../include/player_settings.h"

// TODO create a Potion class and inherit from that
ManaPotion::ManaPotion(Player& player,
                       const std::string& kName,
                       const int kMinManaGain,
                       const int kMaxManaGain,
                       const int kCooldown,
                       const bool kBenefitsFromAlchemistsStone)
    : Spell(player,
            kName,
            nullptr,
            nullptr,
            0,
            0,
            static_cast<int>(kMinManaGain * (kBenefitsFromAlchemistsStone && player.alchemists_stone_effect_active
                                                 ? WarlockSimulatorConstants::kAlchemistsStoneModifier
                                                 : 1)),
            static_cast<int>(kMaxManaGain * (kBenefitsFromAlchemistsStone && player.alchemists_stone_effect_active
                                                 ? WarlockSimulatorConstants::kAlchemistsStoneModifier
                                                 : 1)),
            0,
            kCooldown) {
  is_item                   = true;
  on_gcd                    = false;
  limited_amount_of_casts   = true;
  amount_of_casts_per_fight = 1;
}

void ManaPotion::Cast() {
  Spell::Cast();
  const double kCurrentPlayerMana = entity.stats.mana;
  const double kManaGain =
      entity.player->settings.randomize_values && min_mana_gain > 0 && max_mana_gain > 0
          ? entity.player->rng.Range(static_cast<int>(min_mana_gain), static_cast<int>(max_mana_gain))
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

RunicManaPotion::RunicManaPotion(Player& player) : ManaPotion(player, "Runic Mana Potion", 4200, 4400) {}

DemonicRune::DemonicRune(Player& player) : ManaPotion(player, "Demonic Rune", 900, 1500, 900, false) {}
