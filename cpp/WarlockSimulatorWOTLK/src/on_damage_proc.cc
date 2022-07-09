#include "../include/on_damage_proc.h"

#include "../include/entity.h"
#include "../include/player.h"
#include "../include/player_settings.h"

OnDamageProc::OnDamageProc(Player& player, const std::shared_ptr<Aura>& kAura) : SpellProc(player, kAura) {
  procs_on_damage = true;
}

void OnDamageProc::Setup() {
  SpellProc::Setup();

  if (procs_on_damage && on_damage_procs_enabled) {
    entity.on_damage_procs.push_back(this);
  }
}

DarkmoonCardBerserker::DarkmoonCardBerserker(Player& player, const std::shared_ptr<Aura>& kAura)
    : OnDamageProc(player, kAura) {
  name        = "Darkmoon Card: Berserker!";
  proc_chance = 50;
  OnDamageProc::Setup();
}

DarkmoonCardDeath::DarkmoonCardDeath(Player& player) : OnDamageProc(player) {
  name         = "Darkmoon Card: Death";
  proc_chance  = 15;
  cooldown     = 45;
  spell_school = SpellSchool::kShadow;
  does_damage  = true;
  can_crit     = true;
  min_dmg      = 1750;
  max_dmg      = 2250;
  attack_type  = AttackType::kMagical;
  OnDamageProc::Setup();
}

DarkmoonCardGreatness::DarkmoonCardGreatness(Player& player, const std::shared_ptr<Aura>& kAura)
    : OnDamageProc(player, kAura) {
  name        = "Darkmoon Card: Greatness";
  proc_chance = 35;
  cooldown    = 45;
  OnDamageProc::Setup();
}

MuradinsSpyglass::MuradinsSpyglass(Player& player, const std::shared_ptr<Aura>& kAura) : OnDamageProc(player, kAura) {
  name        = "Muradin's Spyglass";
  proc_chance = 100;
  OnDamageProc::Setup();
}
