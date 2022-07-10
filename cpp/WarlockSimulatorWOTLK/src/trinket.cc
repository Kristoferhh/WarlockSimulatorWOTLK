#include "../include/trinket.h"

#include <memory>

#include "../include/combat_log_breakdown.h"
#include "../include/player.h"
#include "../include/simulation.h"
#include "../include/stat.h"

Trinket::Trinket(Player& player_param) : player(player_param) {}

bool Trinket::Ready() const {
  return cooldown_remaining <= 0;
}

void Trinket::Reset() {
  cooldown_remaining = 0;
}

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

  is_active          = true;
  duration_remaining = duration;
  cooldown_remaining = cooldown;
}

void Trinket::Fade() {
  if (player.ShouldWriteToCombatLog()) {
    player.CombatLog(name + " faded");
  }

  if (player.recording_combat_log_breakdown) {
    player.combat_log_breakdown.at(name)->uptime_in_seconds +=
        player.simulation->current_fight_time - player.combat_log_breakdown.at(name)->applied_at;
  }

  for (auto& stat : stats) {
    stat.RemoveStat();
  }

  is_active = false;
}

void Trinket::Tick(const double kTime) {
  if (player.ShouldWriteToCombatLog() && cooldown_remaining > 0 && cooldown_remaining - kTime <= 0) {
    player.CombatLog(name + " off cooldown");
  }
  cooldown_remaining -= kTime;
  duration_remaining -= kTime;
  if (is_active && duration_remaining <= 0) {
    Fade();
  }
}

ShiftingNaaruSliver::ShiftingNaaruSliver(Player& player_param) : Trinket(player_param) {
  name     = "Shifting Naaru Sliver";
  cooldown = 90;
  duration = 15;
  stats.push_back(SpellPower(player_param, 320));
  Setup();
}

SkullOfGuldan::SkullOfGuldan(Player& player_param) : Trinket(player_param) {
  name     = "The Skull of Gul'dan";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player_param, 175));
  Setup();
}

TomeOfArcanePhenomena::TomeOfArcanePhenomena(Player& player_param) : Trinket(player_param) {
  name     = "Tome of Arcane Phenomena";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player_param, 256));
  Setup();
}

ForgeEmber::ForgeEmber(Player& player_param) : Trinket(player_param) {
  name     = "Forge Ember";
  cooldown = 120;
  duration = 10;
  stats.push_back(SpellPower(player_param, 512));
  Setup();
}

WingedTalisman::WingedTalisman(Player& player_param) : Trinket(player_param) {
  name     = "Winged Talisman";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 346));
  Setup();
}

MarkOfTheWarPrisoner::MarkOfTheWarPrisoner(Player& player_param) : Trinket(player_param) {
  name     = "Mark of the War Prisoner";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 346));
  Setup();
}

MendicantsCharm::MendicantsCharm(Player& player_param) : Trinket(player_param) {
  name     = "Mendicant's Charm";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 145));
  Setup();
}

InsigniaOfBloodyFire::InsigniaOfBloodyFire(Player& player_param) : Trinket(player_param) {
  name     = "Insignia of Bloody Fire";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 145));
  Setup();
}

FuturesightRune::FuturesightRune(Player& player_param) : Trinket(player_param) {
  name     = "Futuresight Rune";
  cooldown = 120;
  duration = 20;
  stats.push_back(Spirit(player_param, 184));
  Setup();
}

RuneOfFiniteVariation::RuneOfFiniteVariation(Player& player_param) : Trinket(player_param) {
  name     = "Rune of Finite Variation";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player_param, 208));
  Setup();
}

RuneOfInfinitePower::RuneOfInfinitePower(Player& player_param) : Trinket(player_param) {
  name     = "Rune of Infinite Power";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 202));
  Setup();
}

SpiritWordGlass::SpiritWordGlass(Player& player_param) : Trinket(player_param) {
  name     = "Spirit-Word Glass";
  cooldown = 120;
  duration = 20;
  stats.push_back(Spirit(player_param, 336));
  Setup();
}

BadgeOfTheInfiltrator::BadgeOfTheInfiltrator(Player& player_param) : Trinket(player_param) {
  name     = "Badge of the Infiltrator";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 183));
  Setup();
}

SpiritistsFocus::SpiritistsFocus(Player& player_param) : Trinket(player_param) {
  name     = "Spiritist's Focus";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 145));
  Setup();
}

FigurineTwilightSerpent::FigurineTwilightSerpent(Player& player_param) : Trinket(player_param) {
  name     = "Figurine - Twilight Serpent";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 292));
  Setup();
}

ThornyRoseBrooch::ThornyRoseBrooch(Player& player_param) : Trinket(player_param) {
  name     = "Thorny Rose Brooch";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player_param, 212));
  Setup();
}

SoftlyGlowingOrb::SoftlyGlowingOrb(Player& player_param) : Trinket(player_param) {
  name     = "Softly Glowing Orb";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 281));
  Setup();
}

LivingFlame::LivingFlame(Player& player_param) : Trinket(player_param) {
  name     = "Living Flame";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 505));
  Setup();
}

EnergySiphon::EnergySiphon(Player& player_param) : Trinket(player_param) {
  name     = "Energy Siphon";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 408));
  Setup();
}

ScaleOfFates::ScaleOfFates(Player& player_param) : Trinket(player_param) {
  name     = "Scale of Fates";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player_param, 432));
  Setup();
}

PlatinumDisksOfSorcery::PlatinumDisksOfSorcery(Player& player_param) : Trinket(player_param) {
  name     = "Platinum Discs of Sorcery";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 440));
  Setup();
}

PlatinumDisksOfSwiftness::PlatinumDisksOfSwiftness(Player& player_param) : Trinket(player_param) {
  name     = "Platinum Disks of Swiftness";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player_param, 375));
  Setup();
}

ShardOfTheCrystalHeart::ShardOfTheCrystalHeart(Player& player_param) : Trinket(player_param) {
  name     = "Shard of the Crystal Heart";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player_param, 512));
  Setup();
}

TalismanOfResurgence::TalismanOfResurgence(Player& player_param) : Trinket(player_param) {
  name     = "Talisman of Resurgence";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 599));
  Setup();
}

EphemeralSnowflake::EphemeralSnowflake(Player& player_param) : Trinket(player_param) {
  name     = "Ephemeral Snowflake";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player_param, 464));
  Setup();
}

MaghiasMisguidedQuill::MaghiasMisguidedQuill(Player& player_param) : Trinket(player_param) {
  name     = "Maghia's Misguided Quill";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player_param, 716));
  Setup();
}
