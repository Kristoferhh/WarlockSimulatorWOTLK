#include "../include/on_dot_tick_proc.h"

#include "../include/damage_over_time.h"
#include "../include/entity.h"
#include "../include/player.h"

OnDotTickProc::OnDotTickProc(Player& player, const std::string& kName, const std::shared_ptr<Aura>& kAura)
    : SpellProc(player, kName, kAura) {
  if (on_dot_tick_procs_enabled) {
    entity.on_dot_tick_procs.push_back(this);
  }

  procs_on_dot_ticks = true;
}

bool OnDotTickProc::ShouldProc(DamageOverTime*) {
  return true;
}

ExtractOfNecromanticPower::ExtractOfNecromanticPower(Player& player)
    : OnDotTickProc(player, "Extract of Necromantic Power") {
  min_dmg      = 788;
  max_dmg      = 1312;
  does_damage  = true;
  proc_chance  = 10;
  cooldown     = 15;
  can_crit     = true;
  spell_school = SpellSchool::kShadow;
  attack_type  = AttackType::kMagical;
}

PhylacteryOfTheNamelessLich::PhylacteryOfTheNamelessLich(Player& player, std::shared_ptr<Aura> kAura)
    : OnDotTickProc(player, "Phylactery of the Nameless Lich") {
  cooldown    = 60;
  proc_chance = 30;
}
