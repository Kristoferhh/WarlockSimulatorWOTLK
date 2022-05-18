#include "../include/on_crit_proc.h"

#include <utility>

#include "../include/aura.h"
#include "../include/entity.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/talents.h"

OnCritProc::OnCritProc(Player& player, std::shared_ptr<Aura> aura) : SpellProc(player, std::move(aura)) {
  procs_on_crit = true;
}

void OnCritProc::Setup() {
  SpellProc::Setup();

  if (procs_on_crit && on_crit_procs_enabled) {
    entity.on_crit_procs.push_back(this);
  }
}

ImprovedShadowBolt::ImprovedShadowBolt(Player& player, std::shared_ptr<Aura> aura)
    : OnCritProc(player, std::move(aura)) {
  name                  = SpellName::kImprovedShadowBolt;
  proc_chance           = 100;
  on_crit_procs_enabled = !player.settings.using_custom_isb_uptime && player.talents.improved_shadow_bolt > 0;
  OnCritProc::Setup();
}

bool ImprovedShadowBolt::ShouldProc(Spell* spell) {
  return spell->name == SpellName::kShadowBolt;
}

TheLightningCapacitor::TheLightningCapacitor(Player& player) : OnCritProc(player) {
  name        = SpellName::kTheLightningCapacitor;
  cooldown    = 2.5;
  min_dmg     = 694;
  max_dmg     = 806;
  proc_chance = 100;
  does_damage = true;
  can_crit    = true;
  can_miss    = true;
  OnCritProc::Setup();
}

void TheLightningCapacitor::StartCast(double) {
  if (cooldown_remaining <= 0) {
    entity.player->auras.the_lightning_capacitor->Apply();
    if (entity.player->auras.the_lightning_capacitor->stacks ==
        entity.player->auras.the_lightning_capacitor->max_stacks) {
      Spell::StartCast();
      entity.player->auras.the_lightning_capacitor->Fade();
    }
  }
}
