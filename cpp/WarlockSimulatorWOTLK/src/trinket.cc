// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/trinket.h"

#include <memory>

#include "../include/combat_log_breakdown.h"
#include "../include/player.h"
#include "../include/simulation.h"
#include "../include/stat.h"

Trinket::Trinket(Player& player, const std::string& kName) : player(player), name(kName) {
  if (player.recording_combat_log_breakdown && !player.combat_log_breakdown.contains(kName)) {
    player.combat_log_breakdown.insert({kName, std::make_shared<CombatLogBreakdown>(kName)});
  }
}

bool Trinket::Ready() const {
  return cooldown_remaining <= 0;
}

void Trinket::Reset() {
  cooldown_remaining = 0;
}

void Trinket::Use() {
  if (player.ShouldWriteToCombatLog()) {
    player.CombatLog(name + " used");
  }

  if (player.recording_combat_log_breakdown) {
    player.combat_log_breakdown.at(name)->applied_at = player.simulation->current_fight_time;
    player.combat_log_breakdown.at(name)->count++;
  }

  for (auto& stat : stats) { stat.AddStat(); }

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

  for (auto& stat : stats) { stat.RemoveStat(); }

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

ShiftingNaaruSliver::ShiftingNaaruSliver(Player& player) : Trinket(player, "Shifting Naaru Sliver") {
  cooldown = 90;
  duration = 15;
  stats.push_back(SpellPower(player, 320));
}

SkullOfGuldan::SkullOfGuldan(Player& player) : Trinket(player, "The Skull of Gul'dan") {
  cooldown = 120;
  duration = 20;
  stats.push_back(HasteRating(player, 175));
}

TomeOfArcanePhenomena::TomeOfArcanePhenomena(Player& player) : Trinket(player, "Tome of Arcane Phenomena") {
  cooldown = 120;
  duration = 20;
  stats.push_back(HasteRating(player, 256));
}

ForgeEmber::ForgeEmber(Player& player) : Trinket(player, "Forge Ember") {
  cooldown = 120;
  duration = 10;
  stats.push_back(SpellPower(player, 512));
}

WingedTalisman::WingedTalisman(Player& player) : Trinket(player, "Winged Talisman") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 346));
}

MarkOfTheWarPrisoner::MarkOfTheWarPrisoner(Player& player) : Trinket(player, "Mark of the War Prisoner") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 346));
}

MendicantsCharm::MendicantsCharm(Player& player) : Trinket(player, "Mendicant's Charm") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 145));
}

InsigniaOfBloodyFire::InsigniaOfBloodyFire(Player& player) : Trinket(player, "Insignia of Bloody Fire") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 145));
}

FuturesightRune::FuturesightRune(Player& player) : Trinket(player, "Futuresight Rune") {
  cooldown = 120;
  duration = 20;
  stats.push_back(Spirit(player, 184));
}

RuneOfFiniteVariation::RuneOfFiniteVariation(Player& player) : Trinket(player, "Rune of Finite Variation") {
  cooldown = 120;
  duration = 20;
  stats.push_back(HasteRating(player, 208));
}

RuneOfInfinitePower::RuneOfInfinitePower(Player& player) : Trinket(player, "Rune of Infinite Power") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 202));
}

SpiritWorldGlass::SpiritWorldGlass(Player& player) : Trinket(player, "Spirit-World Glass") {
  cooldown = 120;
  duration = 20;
  stats.push_back(Spirit(player, 336));
}

BadgeOfTheInfiltrator::BadgeOfTheInfiltrator(Player& player) : Trinket(player, "Badge of the Infiltrator") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 183));
}

SpiritistsFocus::SpiritistsFocus(Player& player) : Trinket(player, "Spiritist's Focus") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 145));
}

FigurineTwilightSerpent::FigurineTwilightSerpent(Player& player) : Trinket(player, "Figurine - Twilight Serpent") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 292));
}

ThornyRoseBrooch::ThornyRoseBrooch(Player& player) : Trinket(player, "Thorny Rose Brooch") {
  cooldown = 120;
  duration = 20;
  stats.push_back(HasteRating(player, 212));
}

SoftlyGlowingOrb::SoftlyGlowingOrb(Player& player) : Trinket(player, "Softly Glowing Orb") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 281));
}

LivingFlame::LivingFlame(Player& player) : Trinket(player, "Living Flame") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 505));
}

EnergySiphon::EnergySiphon(Player& player) : Trinket(player, "Energy Siphon") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 408));
}

ScaleOfFates::ScaleOfFates(Player& player) : Trinket(player, "Scale of Fates") {
  cooldown = 120;
  duration = 20;
  stats.push_back(HasteRating(player, 432));
}

PlatinumDisksOfSorcery::PlatinumDisksOfSorcery(Player& player) : Trinket(player, "Platinum Discs of Sorcery") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 440));
}

PlatinumDisksOfSwiftness::PlatinumDisksOfSwiftness(Player& player) : Trinket(player, "Platinum Disks of Swiftness") {
  cooldown = 120;
  duration = 20;
  stats.push_back(HasteRating(player, 375));
}

ShardOfTheCrystalHeart::ShardOfTheCrystalHeart(Player& player) : Trinket(player, "Shard of the Crystal Heart") {
  cooldown = 120;
  duration = 20;
  stats.push_back(HasteRating(player, 512));
}

TalismanOfResurgence::TalismanOfResurgence(Player& player) : Trinket(player, "Talisman of Resurgence") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 599));
}

EphemeralSnowflake::EphemeralSnowflake(Player& player) : Trinket(player, "Ephemeral Snowflake") {
  cooldown = 120;
  duration = 20;
  stats.push_back(HasteRating(player, 464));
}

MaghiasMisguidedQuill::MaghiasMisguidedQuill(Player& player) : Trinket(player, "Maghia's Misguided Quill") {
  cooldown = 120;
  duration = 20;
  stats.push_back(SpellPower(player, 716));
}
