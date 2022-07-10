// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/trinket.h"

#include <memory>

#include "../include/combat_log_breakdown.h"
#include "../include/player.h"
#include "../include/simulation.h"
#include "../include/stat.h"

Trinket::Trinket(Player& player) : player(player) {}

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

ShiftingNaaruSliver::ShiftingNaaruSliver(Player& player) : Trinket(player) {
  name     = "Shifting Naaru Sliver";
  cooldown = 90;
  duration = 15;
  stats.push_back(SpellPower(player, 320));
  Setup();
}

SkullOfGuldan::SkullOfGuldan(Player& player) : Trinket(player) {
  name     = "The Skull of Gul'dan";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 175));
  Setup();
}

TomeOfArcanePhenomena::TomeOfArcanePhenomena(Player& player) : Trinket(player) {
  name     = "Tome of Arcane Phenomena";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 256));
  Setup();
}

ForgeEmber::ForgeEmber(Player& player) : Trinket(player) {
  name     = "Forge Ember";
  cooldown = 120;
  duration = 10;
  stats.push_back(SpellPower(player, 512));
  Setup();
}

WingedTalisman::WingedTalisman(Player& player) : Trinket(player) {
  name     = "Winged Talisman";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 346));
  Setup();
}

MarkOfTheWarPrisoner::MarkOfTheWarPrisoner(Player& player) : Trinket(player) {
  name     = "Mark of the War Prisoner";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 346));
  Setup();
}

MendicantsCharm::MendicantsCharm(Player& player) : Trinket(player) {
  name     = "Mendicant's Charm";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 145));
  Setup();
}

InsigniaOfBloodyFire::InsigniaOfBloodyFire(Player& player) : Trinket(player) {
  name     = "Insignia of Bloody Fire";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 145));
  Setup();
}

FuturesightRune::FuturesightRune(Player& player) : Trinket(player) {
  name     = "Futuresight Rune";
  cooldown = 120;
  duration = 20;
  stats.push_back(Spirit(player, 184));
  Setup();
}

RuneOfFiniteVariation::RuneOfFiniteVariation(Player& player) : Trinket(player) {
  name     = "Rune of Finite Variation";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 208));
  Setup();
}

RuneOfInfinitePower::RuneOfInfinitePower(Player& player) : Trinket(player) {
  name     = "Rune of Infinite Power";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 202));
  Setup();
}

SpiritWordGlass::SpiritWordGlass(Player& player) : Trinket(player) {
  name     = "Spirit-Word Glass";
  cooldown = 120;
  duration = 20;
  stats.push_back(Spirit(player, 336));
  Setup();
}

BadgeOfTheInfiltrator::BadgeOfTheInfiltrator(Player& player) : Trinket(player) {
  name     = "Badge of the Infiltrator";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 183));
  Setup();
}

SpiritistsFocus::SpiritistsFocus(Player& player) : Trinket(player) {
  name     = "Spiritist's Focus";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 145));
  Setup();
}

FigurineTwilightSerpent::FigurineTwilightSerpent(Player& player) : Trinket(player) {
  name     = "Figurine - Twilight Serpent";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 292));
  Setup();
}

ThornyRoseBrooch::ThornyRoseBrooch(Player& player) : Trinket(player) {
  name     = "Thorny Rose Brooch";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 212));
  Setup();
}

SoftlyGlowingOrb::SoftlyGlowingOrb(Player& player) : Trinket(player) {
  name     = "Softly Glowing Orb";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 281));
  Setup();
}

LivingFlame::LivingFlame(Player& player) : Trinket(player) {
  name     = "Living Flame";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 505));
  Setup();
}

EnergySiphon::EnergySiphon(Player& player) : Trinket(player) {
  name     = "Energy Siphon";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 408));
  Setup();
}

ScaleOfFates::ScaleOfFates(Player& player) : Trinket(player) {
  name     = "Scale of Fates";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 432));
  Setup();
}

PlatinumDisksOfSorcery::PlatinumDisksOfSorcery(Player& player) : Trinket(player) {
  name     = "Platinum Discs of Sorcery";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 440));
  Setup();
}

PlatinumDisksOfSwiftness::PlatinumDisksOfSwiftness(Player& player) : Trinket(player) {
  name     = "Platinum Disks of Swiftness";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 375));
  Setup();
}

ShardOfTheCrystalHeart::ShardOfTheCrystalHeart(Player& player) : Trinket(player) {
  name     = "Shard of the Crystal Heart";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 512));
  Setup();
}

TalismanOfResurgence::TalismanOfResurgence(Player& player) : Trinket(player) {
  name     = "Talisman of Resurgence";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 599));
  Setup();
}

EphemeralSnowflake::EphemeralSnowflake(Player& player) : Trinket(player) {
  name     = "Ephemeral Snowflake";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellHasteRating(player, 464));
  Setup();
}

MaghiasMisguidedQuill::MaghiasMisguidedQuill(Player& player) : Trinket(player) {
  name     = "Maghia's Misguided Quill";
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 716));
  Setup();
}
