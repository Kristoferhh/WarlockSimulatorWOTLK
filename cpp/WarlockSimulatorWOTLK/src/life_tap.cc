// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/life_tap.h"

#include <iostream>

#include "../include/aura.h"
#include "../include/combat_log_breakdown.h"
#include "../include/common.h"
#include "../include/entity.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/talents.h"

// TODO make a class a parent to life tap and dark pact instead of life tap being a parent to dark pact
LifeTap::LifeTap(Entity& entity, const std::string& kName)
    : Spell(entity, kName, nullptr, nullptr, 0, 0, 0, 0, 0, 0, SpellSchool::kShadow),
      mana_return(2400),
      modifier(1 * (1 + 0.1 * entity.player->talents.improved_life_tap)) {
  coefficient = 0.6;
}

double LifeTap::ManaGain() const {
  return (mana_return + entity.GetSpellPower(spell_school) * coefficient) * modifier;
}

void LifeTap::Cast() {
  const double kCurrentPlayerMana = entity.stats.mana;
  const double kManaGain          = this->ManaGain();

  entity.stats.mana        = std::min(entity.stats.max_mana, entity.stats.mana + kManaGain);
  const double kManaGained = entity.stats.mana - kCurrentPlayerMana;

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->casts++;
    entity.combat_log_breakdown.at(name)->iteration_mana_gain += kManaGained;
  }

  if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " " + DoubleToString(kManaGained) + " (" +
                     DoubleToString(entity.GetSpellPower(spell_school)) + " Spell Power - " +
                     DoubleToString(coefficient, 3) + " Coefficient - " + DoubleToString(modifier * 100, 2) +
                     "% Modifier)");

    if (kCurrentPlayerMana + kManaGain > entity.stats.max_mana) {
      entity.CombatLog(name + " used at too high mana (mana wasted)");
    }
  }

  if (entity.player->talents.mana_feed == 1 && entity.pet != nullptr) {
    const double kCurrentPetMana = entity.pet->stats.mana;

    entity.pet->stats.mana = std::min(kCurrentPetMana + kManaGain, entity.pet->CalculateMaxMana());

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(entity.pet->name + " gains " + DoubleToString(entity.pet->stats.mana - kCurrentPetMana) +
                       " mana from Mana Feed");
    }
  }

  if (name == WarlockSimulatorConstants::kDarkPact) {
    entity.pet->stats.mana = std::max(0.0, entity.pet->stats.mana - kManaGain);
  }

  if (entity.player->auras.glyph_of_life_tap != nullptr) {
    entity.player->auras.glyph_of_life_tap->Apply();
  }
}

DarkPact::DarkPact(Entity& entity) : LifeTap(entity, WarlockSimulatorConstants::kDarkPact) {
  mana_return = 1200;
  coefficient = 0.96;
  modifier    = 1;
}

bool DarkPact::Ready() {
  return Spell::Ready() && entity.pet->stats.mana >= ManaGain();
}
