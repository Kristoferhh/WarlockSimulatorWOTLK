#include "../include/on_crit_proc.h"

#include <utility>

#include "../include/aura.h"
#include "../include/entity.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/talents.h"

OnCritProc::OnCritProc(Entity& entity_param, std::shared_ptr<Aura> aura) : SpellProc(entity_param, std::move(aura)) {
  procs_on_crit = true;
}

void OnCritProc::Setup() {
  SpellProc::Setup();

  if (procs_on_crit && on_crit_procs_enabled) {
    entity.on_crit_procs.push_back(this);
  }
}

DemonicPact::DemonicPact(Pet& pet, std::shared_ptr<Aura> aura) : OnCritProc(pet, std::move(aura)) {
  name        = SpellName::kDemonicPact;
  cooldown    = 20;
  proc_chance = 100;
  OnCritProc::Setup();
}

Pyroclasm::Pyroclasm(Player& player, std::shared_ptr<Aura> aura) : OnCritProc(player, std::move(aura)) {
  name        = SpellName::kPyroclasm;
  proc_chance = 100;
  OnCritProc::Setup();
}

EmpoweredImp::EmpoweredImp(Pet& pet, std::shared_ptr<Aura> aura) : OnCritProc(pet, std::move(aura)) {
  name        = SpellName::kEmpoweredImp;
  proc_chance = pet.player->talents.empowered_imp == 1   ? 33
                : pet.player->talents.empowered_imp == 2 ? 66
                : pet.player->talents.empowered_imp == 3 ? 100
                                                         : 0;
  OnCritProc::Setup();
}

SoulOfTheDead::SoulOfTheDead(Player& player) : OnCritProc(player) {
  name              = "Soul of the Dead";
  proc_chance       = 25;
  cooldown          = 45;
  gain_mana_on_cast = true;
  mana_gain         = 900;
  OnCritProc::Setup();
}

MoteOfFlame::MoteOfFlame(Player& player, std::shared_ptr<Aura> aura) : OnCritProc(player, std::move(aura)) {
  name        = "Mote of Flame";
  proc_chance = 100;
  cooldown    = 2;
  OnCritProc::Setup();
}
