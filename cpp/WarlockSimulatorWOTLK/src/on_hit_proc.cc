// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/on_hit_proc.h"

#include <utility>

#include "../include/entity.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/sets.h"
#include "../include/talents.h"

OnHitProc::OnHitProc(Entity& entity, const std::string& kName, std::shared_ptr<Aura> aura)
    : SpellProc(entity, kName, std::move(aura)) {
  if (on_hit_procs_enabled) {
    entity.on_hit_procs.push_back(this);
  }

  procs_on_hit = true;
}

JudgementOfWisdom::JudgementOfWisdom(Entity& entity) : OnHitProc(entity, "Judgement of Wisdom") {
  mana_gain         = 74;
  gain_mana_on_cast = true;
  proc_chance       = 50;
}

DemonicFrenzy::DemonicFrenzy(Pet& pet, std::shared_ptr<Aura> aura) : OnHitProc(pet, "Demonic Frenzy", std::move(aura)) {
  proc_chance = 100;
}

ImprovedShadowBolt::ImprovedShadowBolt(Player& player, std::shared_ptr<Aura> aura)
    : OnHitProc(player, "Improved Shadow Bolt", std::move(aura)) {
  name        = "Improved Shadow Bolt";
  proc_chance = 20 * player.talents.improved_shadow_bolt;
}

bool ImprovedShadowBolt::ShouldProc(Spell* spell) {
  return spell->name == WarlockSimulatorConstants::kShadowBolt;
}

SoulLeech::SoulLeech(Player& player, std::shared_ptr<Aura> aura) : OnHitProc(player, "Soul Leech", std::move(aura)) {
  proc_chance = 10 * player.talents.soul_leech;
}

bool SoulLeech::ShouldProc(Spell* spell) {
  return spell->name == WarlockSimulatorConstants::kShadowBolt ||
         spell->name == WarlockSimulatorConstants::kShadowburn ||
         spell->name == WarlockSimulatorConstants::kChaosBolt || spell->name == WarlockSimulatorConstants::kSoulFire ||
         spell->name == WarlockSimulatorConstants::kIncinerate ||
         spell->name == WarlockSimulatorConstants::kSearingPain ||
         spell->name == WarlockSimulatorConstants::kConflagrate;
}

PendulumOfTelluricCurrents::PendulumOfTelluricCurrents(Player& player)
    : OnHitProc(player, "Pendulum of Telluric Currents") {
  proc_chance  = 15;
  cooldown     = 45;
  does_damage  = true;
  is_harmful   = true;
  min_dmg      = 1168;
  max_dmg      = 1752;
  can_crit     = true;
  spell_school = SpellSchool::kShadow;
  attack_type  = AttackType::kMagical;
}

bool PendulumOfTelluricCurrents::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

JoustersFury::JoustersFury(Player& player, std::shared_ptr<Aura> aura)
    : OnHitProc(player, "Jouster's Fury", std::move(aura)) {
  proc_chance = 10;
  cooldown    = 45;
}
