#include "../include/trinket.h"

#include <memory>

#include "../include/combat_log_breakdown.h"
#include "../include/player.h"
#include "../include/simulation.h"
#include "../include/stat.h"

Trinket::Trinket(Player& player) : player(player) {}

bool Trinket::Ready() const { return cooldown_remaining <= 0; }

void Trinket::Reset() { cooldown_remaining = 0; }

void Trinket::Setup() {
  if (player.recording_combat_log_breakdown && !player.combat_log_breakdown.contains(name)) {
    player.combat_log_breakdown.insert({name, std::make_shared<CombatLogBreakdown>(name)});
  }
}

void Trinket::Use() {
  if (player.ShouldWriteToCombatLog()) {
    player.CombatLog(name + " used");
  }

  if (player.recording_combat_log_breakdown) {
    player.combat_log_breakdown.at(name)->applied_at = player.simulation->current_fight_time;
    player.combat_log_breakdown.at(name)->count++;
  }

  for (auto& stat : stats) {
    stat.AddStat();
  }

  active = true;
  duration_remaining = duration;
  cooldown_remaining = cooldown;
}

void Trinket::Fade() {
  if (player.ShouldWriteToCombatLog()) {
    player.CombatLog(name + " faded");
  }

  if (player.recording_combat_log_breakdown) {
    player.combat_log_breakdown.at(name)->uptime +=
        player.simulation->current_fight_time - player.combat_log_breakdown.at(name)->applied_at;
  }

  for (auto& stat : stats) {
    stat.RemoveStat();
  }

  active = false;
}

void Trinket::Tick(const double kTime) {
  if (player.ShouldWriteToCombatLog() && cooldown_remaining > 0 && cooldown_remaining - kTime <= 0) {
    player.CombatLog(name + " off cooldown");
  }
  cooldown_remaining -= kTime;
  duration_remaining -= kTime;
  if (active && duration_remaining <= 0) {
    Fade();
  }
}

ShiftingNaaruSliver::ShiftingNaaruSliver(Player& player) : Trinket(player) {
  name = "Shifting Naaru Sliver";
  cooldown = 90;
  duration = 15;
  stats.push_back(SpellPower(player, 320));
  Setup();
}

SkullOfGuldan::SkullOfGuldan(Player& player) : Trinket(player) {
  name = "The Skull of Gul'dan";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 175));
  Setup();
}
