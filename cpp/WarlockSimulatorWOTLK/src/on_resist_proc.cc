#include "../include/on_resist_proc.h"

#include <utility>

#include "../include/player.h"

OnResistProc::OnResistProc(Player& player, std::shared_ptr<Aura> aura) : SpellProc(player, std::move(aura)) {
  procs_on_resist = true;
}

void OnResistProc::Setup() {
  SpellProc::Setup();

  if (procs_on_resist && on_resist_procs_enabled) {
    entity.on_resist_procs.push_back(this);
  }
}
