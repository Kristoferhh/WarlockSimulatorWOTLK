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

  if (procs_on_dot_ticks && on_dot_tick_procs_enabled) { entity.on_dot_tick_procs.push_back(this); }
}
