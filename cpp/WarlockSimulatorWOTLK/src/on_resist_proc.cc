#include "../include/on_resist_proc.h"

#include <utility>

#include "../include/player.h"

OnResistProc::OnResistProc(Player& player, const std::string& kName, std::shared_ptr<Aura> aura)
    : SpellProc(player, kName, std::move(aura)) {
  if (on_resist_procs_enabled) {
    entity.on_resist_procs.push_back(this);
  }

  procs_on_resist = true;
}
