// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/on_hit_proc.h"

#include <utility>

#include "../include/entity.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/sets.h"
#include "../include/talents.h"

OnHitProc::OnHitProc(Entity& entity, std::shared_ptr<Aura> aura) : SpellProc(entity, std::move(aura)) {
  procs_on_hit = true;
}

void OnHitProc::Setup() {
  SpellProc::Setup();

  if (procs_on_hit && on_hit_procs_enabled) {
    entity.on_hit_procs.push_back(this);
  }
}

JudgementOfWisdom::JudgementOfWisdom(Entity& entity) : OnHitProc(entity) {
  name              = SpellName::kJudgementOfWisdom;
  mana_gain         = 74;
  gain_mana_on_cast = true;
  proc_chance       = 50;
  OnHitProc::Setup();
}

DemonicFrenzy::DemonicFrenzy(Pet& pet, std::shared_ptr<Aura> aura) : OnHitProc(pet, std::move(aura)) {
  name        = SpellName::kDemonicFrenzy;
  proc_chance = 100;
  OnHitProc::Setup();
}

ImprovedShadowBolt::ImprovedShadowBolt(Player& player, std::shared_ptr<Aura> aura)
    : OnHitProc(player, std::move(aura)) {
  name        = SpellName::kImprovedShadowBolt;
  proc_chance = 20 * player.talents.improved_shadow_bolt;
  OnHitProc::Setup();
}

SoulLeech::SoulLeech(Player& player, std::shared_ptr<Aura> aura) : OnHitProc(player, std::move(aura)) {
  name        = SpellName::kSoulLeech;
  proc_chance = 10 * player.talents.soul_leech;
  OnHitProc::Setup();
}

bool SoulLeech::ShouldProc(Spell* spell) {
  return spell->name == SpellName::kShadowBolt || spell->name == SpellName::kShadowburn ||
         spell->name == SpellName::kChaosBolt || spell->name == SpellName::kSoulFire ||
         spell->name == SpellName::kIncinerate || spell->name == SpellName::kSearingPain ||
         spell->name == SpellName::kConflagrate;
}

PendulumOfTelluricCurrents::PendulumOfTelluricCurrents(Player& player) : OnHitProc(player) {
  name         = SpellName::kPendulumOfTelluricCurrents;
  proc_chance  = 15;
  cooldown     = 45;
  does_damage  = true;
  is_harmful   = true;
  min_dmg      = 1168;
  max_dmg      = 1752;
  can_crit     = true;
  spell_school = SpellSchool::kShadow;
  attack_type  = AttackType::kMagical;
  OnHitProc::Setup();
}

bool PendulumOfTelluricCurrents::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

JoustersFury::JoustersFury(Player& player, std::shared_ptr<Aura> aura) : OnHitProc(player, std::move(aura)) {
  name        = "Jouster's Fury";
  proc_chance = 10;
  cooldown    = 45;
  OnHitProc::Setup();
}
