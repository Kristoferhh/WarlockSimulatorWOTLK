#include "../include/on_hit_proc.h"

#include <utility>

#include "../include/entity.h"
#include "../include/player.h"
#include "../include/sets.h"

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

DemonicFrenzy::DemonicFrenzy(Entity& entity, std::shared_ptr<Aura> aura) : OnHitProc(entity, std::move(aura)) {
  name        = SpellName::kDemonicFrenzy;
  proc_chance = 100;
  OnHitProc::Setup();
}
