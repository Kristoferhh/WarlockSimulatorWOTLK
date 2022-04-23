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
