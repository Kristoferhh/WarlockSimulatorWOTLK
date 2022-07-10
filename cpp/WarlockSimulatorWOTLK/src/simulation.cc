#include "../include/simulation.h"

#include <chrono>
#include <iostream>

#include "../include/aura.h"
#include "../include/bindings.h"
#include "../include/common.h"
#include "../include/damage_over_time.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/simulation_settings.h"
#include "../include/spell.h"
#include "../include/trinket.h"

Simulation::Simulation(Player& player, const SimulationSettings& kSimulationSettings)
    : player(player), kSettings(kSimulationSettings) {}

void Simulation::Start() {
  player.total_fight_duration = 0;
  player.Initialize(this);
  min_dps           = std::numeric_limits<double>::max();
  max_dps           = 0;
  const auto kStart = std::chrono::high_resolution_clock::now();

  for (iteration = 0; iteration < kSettings.iterations; iteration++) {
    iteration_fight_length = player.rng.Range(kSettings.min_time, kSettings.max_time);

    IterationReset();

    while (current_fight_time < iteration_fight_length) {
      fight_time_remaining = iteration_fight_length - current_fight_time;

      CastNonPlayerCooldowns();

      if (player.cast_time_remaining <= 0) {
        CastNonGcdSpells();

        if (player.gcd_remaining <= 0) {
          CastGcdSpells();
        }
      }

      if (player.pet != nullptr && player.settings.pet_mode == EmbindConstant::kAggressive) {
        CastPetSpells();
      }

      if (PassTime() <= 0) {
        std::cout << "Iteration " << std::to_string(iteration) << " fightTime: " << std::to_string(current_fight_time)
                  << "/" << std::to_string(iteration_fight_length) << " PassTime() returned <= 0" << std::endl;
        player.ThrowError(
            "The simulation got stuck in an endless loop. If you'd like to help with fixing this bug then please "
            "export your current settings and post it in the #sim-bug-report channel on the Warlock Classic discord.");
      }
    }

    IterationEnd();
  }

  const auto kEnd          = std::chrono::high_resolution_clock::now();
  const auto kMicroseconds = std::chrono::duration_cast<std::chrono::microseconds>(kEnd - kStart).count();

  SimulationEnd(kMicroseconds);
}

double Simulation::PassTime() {
  auto time_until_next_action = player.FindTimeUntilNextAction();

  time_until_next_action = std::min(time_until_next_action, fight_time_remaining);

  Tick(time_until_next_action);

  return time_until_next_action;
}

void Simulation::SelectedSpellHandler(const std::shared_ptr<Spell>& kSpell,
                                      std::map<std::shared_ptr<Spell>, double>& predicted_damage_of_spells) const {
  if ((player.settings.rotation_option == EmbindConstant::kSimChooses || kSpell->is_finisher) &&
      !predicted_damage_of_spells.contains(kSpell)) {
    predicted_damage_of_spells.insert({kSpell, kSpell->PredictDamage()});
  } else if (kSpell->HasEnoughMana()) {
    CastSelectedSpell(kSpell);
  } else {
    player.CastLifeTapOrDarkPact();
  }
}

void Simulation::CastSelectedSpell(const std::shared_ptr<Spell>& kSpell, const double kPredictedDamage) const {
  player.UseCooldowns();
  kSpell->StartCast(kPredictedDamage);
}

void Simulation::Tick(const double kTime) {
  current_fight_time += kTime;
  player.Tick(kTime);
  if (player.pet != nullptr) {
    player.pet->Tick(kTime);
  }
}

void Simulation::IterationReset() {
  current_fight_time = 0;

  player.Reset();
  if (player.pet != nullptr) {
    player.pet->Reset();
  }

  player.rng.Seed(player.settings.random_seeds[iteration]);

  if (player.ShouldWriteToCombatLog()) {
    player.CombatLog("Fight length: " + DoubleToString(iteration_fight_length) + " seconds");
  }

  if (player.pet != nullptr) {
    if (player.settings.prepop_black_book && player.pet->auras.black_book != nullptr) {
      // If the player only has one on-use trinket equipped or if the first trinket doesn't share cooldowns with other
      // trinkets, then assume that Black Book is equipped in the second trinket slot, otherwise the first slot

      if (const auto kBlackBookTrinketSlot = player.trinkets.size() == 1 || !player.trinkets[0].shares_cooldown ? 1 : 0;
          player.trinkets.size() > kBlackBookTrinketSlot) {
        player.trinkets[kBlackBookTrinketSlot].cooldown_remaining = player.pet->auras.black_book->duration;
      }

      player.pet->auras.black_book->Apply();
    }
  }
}

void Simulation::CastNonPlayerCooldowns() const {
  // Use Bloodlust
  if (player.spells.bloodlust != nullptr && !player.auras.bloodlust->is_active && player.spells.bloodlust->Ready()) {
    player.spells.bloodlust->StartCast();
  }

  // Use Mana Tide Totem if there's <= 12 sec remaining or the player's mana
  // is at 50% or lower
  if (player.spells.mana_tide_totem != nullptr && player.spells.mana_tide_totem->Ready() &&
      (fight_time_remaining <= player.auras.mana_tide_totem->duration ||
       player.stats.mana / player.stats.max_mana <= 0.50)) {
    player.spells.mana_tide_totem->StartCast();
  }
}

void Simulation::CastNonGcdSpells() const {
  // Demonic Rune
  if ((current_fight_time > 5 || player.stats.mp5 == 0.0) && player.spells.demonic_rune != nullptr &&
      player.stats.max_mana - player.stats.mana > player.spells.demonic_rune->max_mana_gain &&
      player.spells.demonic_rune->Ready()) {
    player.spells.demonic_rune->StartCast();
  }

  // Mana Potion
  if ((current_fight_time > 5 || player.stats.mp5 == 0.0) && player.spells.runic_mana_potion != nullptr &&
      player.stats.max_mana - player.stats.mana > player.spells.runic_mana_potion->max_mana_gain &&
      player.spells.runic_mana_potion->Ready()) {
    player.spells.runic_mana_potion->StartCast();
  }
}

void Simulation::CastGcdSpells() const {
  if (player.settings.fight_type == EmbindConstant::kSingleTarget) {
    const bool kNotEnoughTimeForFillerSpell = fight_time_remaining < player.filler->GetCastTime();

    // Map of spells with their predicted Damage as the value. This is
    // used by the sim to determine what the best spell to Cast is.
    std::map<std::shared_ptr<Spell>, double> predicted_damage_of_spells;

    // If the sim is choosing the rotation for the user then predict the
    // damage of the three filler spells if they're available
    if (player.settings.rotation_option == EmbindConstant::kSimChooses) {
      if (fight_time_remaining >= player.spells.shadow_bolt->GetCastTime()) {
        predicted_damage_of_spells.insert({player.spells.shadow_bolt, player.spells.shadow_bolt->PredictDamage()});
      }

      if (fight_time_remaining >= player.spells.incinerate->GetCastTime()) {
        predicted_damage_of_spells.insert({player.spells.incinerate, player.spells.incinerate->PredictDamage()});
      }

      if (fight_time_remaining >= player.spells.searing_pain->GetCastTime()) {
        predicted_damage_of_spells.insert({player.spells.searing_pain, player.spells.searing_pain->PredictDamage()});
      }
    }

    // Cast Conflagrate if there's not enough time for another filler
    // and Immolate is up
    if (kNotEnoughTimeForFillerSpell && player.spells.conflagrate != nullptr && player.spells.conflagrate->CanCast()) {
      SelectedSpellHandler(player.spells.conflagrate, predicted_damage_of_spells);
    }

    // Cast Shadowburn if there's not enough time for another filler
    if (player.gcd_remaining <= 0 && kNotEnoughTimeForFillerSpell && player.spells.shadowburn != nullptr &&
        player.spells.shadowburn->CanCast()) {
      SelectedSpellHandler(player.spells.shadowburn, predicted_damage_of_spells);
    }

    // Cast Death Coil if there's not enough time for another filler
    if (player.gcd_remaining <= 0 && kNotEnoughTimeForFillerSpell && player.spells.death_coil != nullptr &&
        player.spells.death_coil->CanCast()) {
      SelectedSpellHandler(player.spells.death_coil, predicted_damage_of_spells);
    }

    // Cast Curse of the Elements if it's the selected curse and it's not active
    if (fight_time_remaining >= 5 && player.gcd_remaining <= 0 && player.curse_spell != nullptr &&
        player.curse_spell->name == SpellName::kCurseOfTheElements && !player.curse_aura->is_active &&
        player.curse_spell->CanCast()) {
      if (player.curse_spell->HasEnoughMana()) {
        player.curse_spell->StartCast();
      } else {
        player.CastLifeTapOrDarkPact();
      }
    }

    // Cast Haunt if it's ready and there's at least 12 sec left of the fight
    if (player.gcd_remaining <= 0 && player.spells.haunt != nullptr && player.spells.haunt->CanCast() &&
        fight_time_remaining - player.spells.haunt->GetCastTime() >= player.auras.haunt->duration) {
      SelectedSpellHandler(player.spells.haunt, predicted_damage_of_spells);
    }

    // Cast Corruption if it's not active and there's at least
    if (player.gcd_remaining <= 0 && player.auras.corruption != nullptr && !player.auras.corruption->is_active &&
        fight_time_remaining >= player.auras.corruption->duration && player.spells.corruption->CanCast()) {
      SelectedSpellHandler(player.spells.corruption, predicted_damage_of_spells);
    }

    // Cast Unstable Affliction if it's not up or if it's about to
    // expire
    if (player.gcd_remaining <= 0 && player.auras.unstable_affliction != nullptr &&
        (!player.auras.unstable_affliction->is_active || player.auras.unstable_affliction->ticks_remaining == 1 &&
                                                             player.auras.unstable_affliction->tick_timer_remaining <
                                                                 player.spells.unstable_affliction->GetCastTime()) &&
        fight_time_remaining - player.spells.unstable_affliction->GetCastTime() >=
            player.auras.unstable_affliction->duration &&
        player.spells.unstable_affliction->CanCast()) {
      SelectedSpellHandler(player.spells.unstable_affliction, predicted_damage_of_spells);
    }

    // Cast Curse of Agony if CoA is the selected curse or if Curse of
    // Doom is the selected curse and there's less than 60 seconds
    // remaining of the fight
    if (player.gcd_remaining <= 0 && player.auras.curse_of_agony != nullptr &&
        !player.auras.curse_of_agony->is_active && player.spells.curse_of_agony->CanCast() &&
        fight_time_remaining > player.auras.curse_of_agony->duration &&
        (player.curse_spell->name == SpellName::kCurseOfDoom && !player.auras.curse_of_doom->is_active &&
             (player.spells.curse_of_doom->cooldown_remaining > player.auras.curse_of_agony->duration ||
              fight_time_remaining < 60) ||
         player.curse_spell->name == SpellName::kCurseOfAgony)) {
      SelectedSpellHandler(player.spells.curse_of_agony, predicted_damage_of_spells);
    }

    // Cast Curse of Doom if it's the selected curse and there's more
    // than 60 seconds remaining
    if (player.gcd_remaining <= 0 && fight_time_remaining > 60 && player.curse_spell != nullptr &&
        player.curse_spell->name == SpellName::kCurseOfDoom && !player.auras.curse_of_doom->is_active &&
        player.spells.curse_of_doom->CanCast()) {
      SelectedSpellHandler(player.spells.curse_of_doom, predicted_damage_of_spells);
    }

    // Cast Shadow Bolt if Shadow Trance (Nightfall) is active and
    // Corruption is active as well to avoid potentially wasting another
    // Nightfall proc
    if (player.gcd_remaining <= 0 && player.spells.shadow_bolt != nullptr && player.auras.shadow_trance != nullptr &&
        player.auras.shadow_trance->is_active && player.auras.corruption->is_active &&
        player.spells.shadow_bolt->CanCast()) {
      SelectedSpellHandler(player.spells.shadow_bolt, predicted_damage_of_spells);
    }

    // Cast Immolate if it's not up or about to expire
    /*if (player.gcd_remaining <= 0 && player.spells.immolate != nullptr && player.spells.immolate->CanCast() &&
        (!player.auras.immolate->is_active ||
         player.auras.immolate->ticks_remaining == 1 &&
             player.auras.immolate->tick_timer_remaining < player.spells.immolate->GetCastTime()) &&
        fight_time_remaining - player.spells.immolate->GetCastTime() >= player.auras.immolate->duration) {
      SelectedSpellHandler(player.spells.immolate, predicted_damage_of_spells);
    }*/

    // Cast Shadow Bolt if Shadow Trance (Nightfall) is active
    if (player.gcd_remaining <= 0 && player.spells.shadow_bolt != nullptr && player.auras.shadow_trance != nullptr &&
        player.auras.shadow_trance->is_active && player.spells.shadow_bolt->CanCast()) {
      SelectedSpellHandler(player.spells.shadow_bolt, predicted_damage_of_spells);
    }

    // Cast Drain Soul if the boss is at or below 25% hp (25% time left of the fight, might have to rethink this :|)
    if (player.gcd_remaining <= 0 && player.auras.drain_soul != nullptr && !player.auras.drain_soul->is_active &&
        player.spells.drain_soul->CanCast() && player.simulation->GetEnemyHealthPercent() <= 25) {
      SelectedSpellHandler(player.spells.drain_soul, predicted_damage_of_spells);
    }

    // Cast Shadowfury
    if (player.gcd_remaining <= 0 && player.spells.shadowfury != nullptr && player.spells.shadowfury->CanCast()) {
      SelectedSpellHandler(player.spells.shadowfury, predicted_damage_of_spells);
    }

    // Cast filler spell if sim is not choosing the rotation for the
    // user or if the predicted_damage_of_spells map is empty
    if (player.gcd_remaining <= 0 &&
        (!kNotEnoughTimeForFillerSpell && player.settings.rotation_option == EmbindConstant::kUserChooses ||
         predicted_damage_of_spells.empty()) &&
        player.filler->CanCast()) {
      SelectedSpellHandler(player.filler, predicted_damage_of_spells);
    }

    // If the predicted_damage_of_spells map is not empty then check now
    // which spell would be the best to Cast
    if (player.gcd_remaining <= 0 && player.cast_time_remaining <= 0 && !predicted_damage_of_spells.empty()) {
      std::shared_ptr<Spell> max_damage_spell;
      auto max_damage_spell_value = 0.0;

      for (const auto& [kSpell, kDamage] : predicted_damage_of_spells) {
        if (kDamage > max_damage_spell_value &&
            (fight_time_remaining > player.GetGcdValue() || kSpell->HasEnoughMana())) {
          max_damage_spell       = kSpell;
          max_damage_spell_value = kDamage;
        }
      }

      // If a max Damage spell was not found or if the max Damage spell
      // isn't Ready (no mana), then Cast Life Tap
      if (max_damage_spell != nullptr && max_damage_spell->HasEnoughMana()) {
        CastSelectedSpell(max_damage_spell, max_damage_spell_value);
      } else {
        player.CastLifeTapOrDarkPact();
      }
    }
  }
  // AoE (currently just does Seed of Corruption by default)
  else {
    if (player.spells.seed_of_corruption->Ready()) {
      player.UseCooldowns();
      player.spells.seed_of_corruption->StartCast();
    } else {
      player.CastLifeTapOrDarkPact();
    }
  }
}

void Simulation::CastPetSpells() const {
  // Auto Attack
  if (player.pet->spells.melee != nullptr && player.pet->spells.melee->Ready()) {
    player.pet->spells.melee->StartCast();
  }

  // Felguard Cleave
  if (player.pet->spells.cleave != nullptr && player.pet->spells.cleave->Ready()) {
    player.pet->spells.cleave->StartCast();
  }

  // Succubus Lash of Pain
  if (player.pet->spells.lash_of_pain != nullptr && player.pet->spells.lash_of_pain->Ready()) {
    player.pet->spells.lash_of_pain->StartCast();
  }

  // Imp Firebolt
  if (player.pet->spells.firebolt != nullptr && player.pet->spells.firebolt->Ready()) {
    player.pet->spells.firebolt->StartCast();
  }
}

void Simulation::IterationEnd() {
  auto dps = player.iteration_damage / iteration_fight_length;

  player.EndAuras();

  if (player.pet != nullptr) {
    player.pet->EndAuras();
  }

  if (player.ShouldWriteToCombatLog()) {
    player.CombatLog("Fight end");
  }

  player.total_fight_duration += iteration_fight_length;

  if (dps > max_dps) {
    max_dps = dps;
  }

  if (dps < min_dps) {
    min_dps = dps;
  }

  dps_vector.push_back(dps);

  // Only send the iteration's dps to the web worker if we're doing a normal
  // simulation (this is just for the dps histogram)
  if (kSettings.simulation_type == SimulationType::kNormal && player.custom_stat == "normal") {
    DpsUpdate(dps);
  }

  if (iteration % static_cast<int>(std::floor(kSettings.iterations / 100.0)) == 0) {
    SimulationUpdate(
        iteration, kSettings.iterations, Median(dps_vector), player.settings.item_id, player.custom_stat.c_str());
  }
}

void Simulation::SimulationEnd(const long long kSimulationDuration) const {
  // Send the contents of the combat log to the web worker
  if (player.equipped_item_simulation) {
    player.SendCombatLogEntries();
  }

  // Send the combat log breakdown info
  if (player.recording_combat_log_breakdown) {
    player.SendCombatLogBreakdown();

    if (player.pet != nullptr) {
      player.pet->SendCombatLogBreakdown();
    }
  }

  SendSimulationResults(Median(dps_vector),
                        min_dps,
                        max_dps,
                        player.settings.item_id,
                        kSettings.iterations,
                        static_cast<int>(player.total_fight_duration),
                        player.custom_stat.c_str(),
                        kSimulationDuration);
}

// TODO :-)
int Simulation::GetEnemyHealthPercent() const {
  return static_cast<int>(std::ceil(fight_time_remaining / iteration_fight_length));
}
