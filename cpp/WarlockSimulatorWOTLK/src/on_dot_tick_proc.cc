#include "../include/on_dot_tick_proc.h"

#include "../include/damage_over_time.h"
#include "../include/entity.h"
#include "../include/player.h"

OnDotTickProc::OnDotTickProc(Player& player, const std::shared_ptr<Aura>& kAura) : SpellProc(player, kAura) {
  procs_on_dot_ticks = true;
}

bool OnDotTickProc::ShouldProc(DamageOverTime*) {
  return true;
}

void OnDotTickProc::Setup() {
  SpellProc::Setup();

  if (procs_on_dot_ticks && on_dot_tick_procs_enabled) {
    entity.on_dot_tick_procs.push_back(this);
  }
}

ExtractOfNecromanticPower::ExtractOfNecromanticPower(Player& player) : OnDotTickProc(player) {
  name         = "Extract of Necromantic Power";
  min_dmg      = 788;
  max_dmg      = 1312;
  does_damage  = true;
  proc_chance  = 10;
  cooldown     = 15;
  can_crit     = true;
  spell_school = SpellSchool::kShadow;
  attack_type  = AttackType::kMagical;
  OnDotTickProc::Setup();
}

PhylacteryOfTheNamelessLich::PhylacteryOfTheNamelessLich(Player& player, std::shared_ptr<Aura> kAura)
    : OnDotTickProc(player) {
  name        = "Phylactery of the Nameless Lich";
  cooldown    = 60;
  proc_chance = 30;
  OnDotTickProc::Setup();
}
