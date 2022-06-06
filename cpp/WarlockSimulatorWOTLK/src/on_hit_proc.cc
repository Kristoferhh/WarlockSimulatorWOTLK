#include "../include/on_hit_proc.h"

#include <utility>

#include "../include/entity.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/sets.h"
#include "../include/talents.h"

OnHitProc::OnHitProc(Entity& entity_param, std::shared_ptr<Aura> aura) : SpellProc(entity_param, std::move(aura)) {
  procs_on_hit = true;
}

void OnHitProc::Setup() {
  SpellProc::Setup();

  if (procs_on_hit && on_hit_procs_enabled) {
    entity.on_hit_procs.push_back(this);
  }
}

JudgementOfWisdom::JudgementOfWisdom(Entity& entity_param) : OnHitProc(entity_param) {
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
