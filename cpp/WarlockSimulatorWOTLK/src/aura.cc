#include "../include/aura.h"

#include <memory>

#include "../include/combat_log_breakdown.h"
#include "../include/entity.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/simulation.h"
#include "../include/spell.h"
#include "../include/stat.h"
#include "../include/talents.h"

Aura::Aura(Entity& entity, const std::string& kName) : entity(entity), name(kName) {
  if (entity.recording_combat_log_breakdown && !entity.combat_log_breakdown.contains(kName)) {
    entity.combat_log_breakdown.insert({kName, std::make_shared<CombatLogBreakdown>(kName)});
  }

  entity.aura_list.push_back(this);
}

void Aura::Tick(const double kTime) {
  if (has_duration) {
    duration_remaining -= kTime;

    if (duration_remaining <= 0) {
      Fade();
    }
  }
}

void Aura::Apply() {
  if (is_active && entity.ShouldWriteToCombatLog() && stacks == max_stacks) {
    entity.CombatLog(name + " refreshed");
  } else if (!is_active) {
    if (entity.recording_combat_log_breakdown) {
      entity.combat_log_breakdown.at(name)->applied_at = entity.simulation->current_fight_time;
    }

    for (auto& stat : stats) { stat.AddStat(); }

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(name + " applied");
    }

    is_active = true;
  }

  if (stacks < max_stacks) {
    if (applies_with_max_stacks) {
      IncrementStacks(max_stacks);
    } else {
      IncrementStacks();
    }

    if (entity.ShouldWriteToCombatLog()) {
      entity.CombatLog(name + " (" + std::to_string(stacks) + ")");
    }
  }

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->count++;
  }

  duration_remaining = duration;
}

void Aura::Fade() {
  if (!is_active) {
    entity.player->ThrowError("Attempting to fade " + name + " when it isn't active");
  }

  for (auto& stat : stats) { stat.RemoveStat(); }

  if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " faded");
  }

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->uptime_in_seconds +=
        entity.simulation->current_fight_time - entity.combat_log_breakdown.at(name)->applied_at;
  }

  if (stacks > 0) {
    for (auto& stat : stats_per_stack) { stat.RemoveStat(stacks); }
  }

  is_active = false;
  stacks    = 0;
}

void Aura::IncrementStacks(const int kStackAmount) {
  stacks += kStackAmount;

  for (auto& stat : stats_per_stack) { stat.AddStat(kStackAmount); }
}

void Aura::DecrementStacks() {
  stacks--;

  if (stacks <= 0) {
    Fade();
  } else if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " (" + std::to_string(stacks) + ")");
  }
}

CurseOfTheElementsAura::CurseOfTheElementsAura(Player& player) : Aura(player, "Curse of the Elements") {
  duration = 300;
}

ShadowTranceAura::ShadowTranceAura(Player& player) : Aura(player, "Nightfall") {
  duration = 10;
}

PowerInfusionAura::PowerInfusionAura(Player& player) : Aura(player, "Power Infusion") {
  duration = 15;
  stats.push_back(HastePercent(player, 1.2));
  stats.push_back(ManaCostModifier(player, 0.8));
}

FlameCapAura::FlameCapAura(Player& player) : Aura(player, "Flame Cap") {
  duration = 60;
  stats.push_back(FirePower(player, 80));
}

BloodFuryAura::BloodFuryAura(Player& player) : Aura(player, "Blood Fury") {
  duration = 15;
  stats.push_back(SpellPower(player, 163));
}

BloodlustAura::BloodlustAura(Player& player) : Aura(player, "Bloodlust") {
  duration   = 40;
  group_wide = true;
  stats.push_back(HastePercent(player, 1.3));
  if (player.pet != nullptr) {
    stats.push_back(HastePercent(*player.pet, 1.3));
    stats.push_back(HastePercent(*player.pet, 1.3));
  }
}

InnervateAura::InnervateAura(Player& player) : Aura(player, "Innervate") {
  duration = 20;
}

DemonicFrenzyAura::DemonicFrenzyAura(Pet& pet) : Aura(pet, "Demonic Frenzy") {
  duration   = 10;
  max_stacks = 10;
}

BlackBookAura::BlackBookAura(Pet& pet) : Aura(pet, "Black Book") {
  duration = 30;
  stats.push_back(SpellPower(pet, 200));
  stats.push_back(AttackPower(pet, 325));
}

HauntAura::HauntAura(Player& player) : Aura(player, "Haunt") {
  duration = 12;
}

ShadowEmbraceAura::ShadowEmbraceAura(Player& player) : Aura(player, "Shadow Embrace") {
  duration   = 12;
  max_stacks = 3;
}

EradicationAura::EradicationAura(Player& player) : Aura(player, "Eradication") {
  duration = 10;
  stats.push_back(HastePercent(player,
                               player.talents.eradication == 1   ? 1.06
                               : player.talents.eradication == 2 ? 1.12
                               : player.talents.eradication == 3 ? 1.2
                                                                 : 1));
}

MoltenCoreAura::MoltenCoreAura(Player& player) : Aura(player, "Molten Core") {
  duration                = 15;
  max_stacks              = 3;
  applies_with_max_stacks = true;
}

DemonicEmpowermentAura::DemonicEmpowermentAura(Pet& pet) : Aura(pet, "Demonic Empowerment") {
  if (pet.pet_name == PetName::kImp) {
    duration = 30;
    stats.push_back(CritChance(pet, 1.2));
  } else if (pet.pet_name == PetName::kFelguard) {
    duration = 15;
    stats.push_back(HastePercent(pet, 1.2));
  }
}

DecimationAura::DecimationAura(Player& player) : Aura(player, "Decimation") {
  duration = 10;
}

// TODO does the pet get the aura
DemonicPactAura::DemonicPactAura(Player& player) : Aura(player, "Demonic Pact") {
  duration = 45;
}

MetamorphosisAura::MetamorphosisAura(Player& player) : Aura(player, "Metamorphosis") {
  duration = 30 + (player.has_glyph_of_metamorphosis ? 6 : 0);
  stats.push_back(DamageModifier(player, 1.2));
}

ImprovedShadowBoltAura::ImprovedShadowBoltAura(Player& player) : Aura(player, "Improved Shadow Bolt") {
  duration = 30;
  stats.push_back(CritChance(player, 5));
  stats.push_back(CritChance(*player.pet, 5));
}

PyroclasmAura::PyroclasmAura(Player& player) : Aura(player, "Pyroclasm") {
  duration = 10;
  stats.push_back(ShadowModifier(player, 1 + 0.02 * player.talents.pyroclasm));
  stats.push_back(FireModifier(player, 1 + 0.02 * player.talents.pyroclasm));
}

ImprovedSoulLeechAura::ImprovedSoulLeechAura(Player& player) : Aura(player, "Improved Soul Leech") {
  duration = 15;
  stats.push_back(ManaPer5(player, player.stats.max_mana * 0.01));  // TODO does it also affect pet
}

void ImprovedSoulLeechAura::Apply() {
  Aura::Apply();
  // TODO does it give the pet 2% of *your* maximum mana or its maximum mana
  auto improved_soul_leech_modifier = 0.01 * entity.player->talents.improved_soul_leech;
  entity.player->stats.mana =
      std::min(entity.player->stats.mana + entity.player->stats.max_mana * improved_soul_leech_modifier,
               entity.player->stats.max_mana);
  entity.pet->stats.mana = std::min(entity.pet->stats.mana + entity.pet->stats.max_mana * improved_soul_leech_modifier,
                                    entity.pet->stats.max_mana);
}

BackdraftAura::BackdraftAura(Player& player) : Aura(player, "Backdraft") {
  duration                = 15;
  max_stacks              = 3;
  applies_with_max_stacks = true;
}

EmpoweredImpAura::EmpoweredImpAura(Player& player) : Aura(player, "Empowered Imp") {
  duration = 8;
}

JeTzesBellAura::JeTzesBellAura(Player& player) : Aura(player, "Je'Tze's Bell") {
  duration = 15;
  stats.push_back(ManaPer5(player, 125));
}

EmbraceOfTheSpiderAura::EmbraceOfTheSpiderAura(Player& player) : Aura(player, "Embrace of the Spider") {
  duration = 10;
  stats.push_back(HasteRating(player, 505));
}

DyingCurseAura::DyingCurseAura(Player& player) : Aura(player, "Dying Curse") {
  duration = 10;
  stats.push_back(SpellPower(player, 765));
}

MajesticDragonFigurineAura::MajesticDragonFigurineAura(Player& player) : Aura(player, "Majestic Dragon Figurine") {
  duration   = 10;
  max_stacks = 10;
  stats_per_stack.push_back(Spirit(player, 18));
}

IllustrationOfTheDragonSoulAura::IllustrationOfTheDragonSoulAura(Player& player)
    : Aura(player, "Illustration of the Dragon Soul") {
  duration   = 10;
  max_stacks = 10;
  stats_per_stack.push_back(SpellPower(player, 20));
}

SundialOfTheExiledAura::SundialOfTheExiledAura(Player& player) : Aura(player, "Sundial of the Exiled") {
  duration = 10;
  stats.push_back(SpellPower(player, 590));
}

DarkmoonCardBerserkerAura::DarkmoonCardBerserkerAura(Player& player) : Aura(player, "Darkmoon Card: Berserker!") {
  duration   = 12;
  max_stacks = 3;
  stats_per_stack.push_back(CritRating(player, 35));
}

DarkmoonCardGreatnessAura::DarkmoonCardGreatnessAura(Player& player) : Aura(player, "Darkmoon Card: Greatness") {
  duration = 15;
}

// TODO maybe need to improve this :-)
void DarkmoonCardGreatnessAura::Apply() {
  if (entity.stats.intellect > entity.stats.spirit) {
    stats = std::vector<Stat>{Intellect(entity, 300)};
  } else {
    stats = std::vector<Stat>{Spirit(entity, 300)};
  }

  Aura::Apply();
}

FlowOfKnowledgeAura::FlowOfKnowledgeAura(Player& player) : Aura(player, "Flow of Knowledge") {
  duration = 10;
  stats.push_back(SpellPower(player, 590));
}

JoustersFuryAura::JoustersFuryAura(Player& player) : Aura(player, "Jouster's Fury") {
  duration = 10;
  stats.push_back(CritRating(player, 328));
}

EyeOfTheBroodmotherAura::EyeOfTheBroodmotherAura(Player& player) : Aura(player, "Eye of the Broodmother") {
  duration   = 10;
  max_stacks = 5;
  stats_per_stack.push_back(SpellPower(player, 25));
}

PandorasPleaAura::PandorasPleaAura(Player& player) : Aura(player, "Pandora's Plea") {
  duration = 10;
  stats.push_back(SpellPower(player, 751));
}

FlareOfTheHeavensAura::FlareOfTheHeavensAura(Player& player) : Aura(player, "Flare of the Heavens") {
  duration = 10;
  stats.push_back(SpellPower(player, 850));
}

ShowOfFaithAura::ShowOfFaithAura(Player& player) : Aura(player, "Show of Faith") {
  duration = 15;
  stats.push_back(ManaPer5(player, 241));
}

ElementalFocusStoneAura::ElementalFocusStoneAura(Player& player) : Aura(player, "Elemental Focus Stone") {
  duration = 10;
  stats.push_back(HasteRating(player, 522));
}

SifsRemembranceAura::SifsRemembranceAura(Player& player) : Aura(player, "Sif's Remembrance") {
  duration = 15;
  stats.push_back(ManaPer5(player, 195));
}

MeteoriteCrystalAura::MeteoriteCrystalAura(Player& player) : Aura(player, "Meteorite Crystal") {
  duration = 20;
}

void MeteoriteCrystalAura::Fade() {
  Aura::Fade();
  entity.auras.meteoric_inspiration->Fade();
}

MeteoricInspirationAura::MeteoricInspirationAura(Player& player) : Aura(player, "Meteoric Inspiration") {
  duration   = 20;
  max_stacks = 20;
  stats_per_stack.push_back(ManaPer5(player, 75));
}

SolaceOfTheDefeatedAura::SolaceOfTheDefeatedAura(Player& player) : Aura(player, "Solace of the Defeated") {
  duration   = 10;
  max_stacks = 8;
  stats_per_stack.push_back(ManaPer5(player, 16));
}

SolaceOfTheDefeatedHeroicAura::SolaceOfTheDefeatedHeroicAura(Player& player) : Aura(player, "Solace of the Defeated") {
  duration   = 10;
  max_stacks = 8;
  stats_per_stack.push_back(ManaPer5(player, 18));
}

MoteOfFlameAura::MoteOfFlameAura(Player& player, const std::shared_ptr<Spell>& kSpell)
    : Aura(player, "Mote of Flame"), reign_of_the_unliving(*kSpell) {
  has_duration = false;
  max_stacks   = 3;
}

void MoteOfFlameAura::Apply() {
  Aura::Apply();

  if (stacks == max_stacks) {
    stacks = 0;
    reign_of_the_unliving.StartCast();
  }
}

AbyssalRuneAura::AbyssalRuneAura(Player& player) : Aura(player, "Abyssal Rune") {
  duration = 10;
  stats.push_back(SpellPower(player, 590));
}

TalismanOfVolatilePowerAura::TalismanOfVolatilePowerAura(Player& player) : Aura(player, "Talisman of Volatile Power") {
  duration = 20;
}

void TalismanOfVolatilePowerAura::Fade() {
  Aura::Fade();
  entity.auras.volatile_power->Fade();
}

VolatilePowerAura::VolatilePowerAura(Player& player) : Aura(player, "Volatile Power") {
  has_duration = false;
  stats_per_stack.push_back(HasteRating(player, 57));
  max_stacks = 8;
}

VolatilePowerHeroicAura::VolatilePowerHeroicAura(Player& player) : Aura(player, "Volatile Power") {
  has_duration = false;
  stats_per_stack.push_back(HasteRating(player, 64));
  max_stacks = 8;
}

MithrilPocketwatchAura::MithrilPocketwatchAura(Player& player) : Aura(player, "Mithril Pocketwatch") {
  duration = 10;
  stats.push_back(SpellPower(player, 590));
}

NevermeltingIceCrystalAura::NevermeltingIceCrystalAura(Player& player) : Aura(player, "Nevermelting Ice Crystal") {
  duration = 20;
  stats_per_stack.push_back(CritRating(player, 184));
  max_stacks              = 5;
  applies_with_max_stacks = true;
}

MuradinsSpyglassAura::MuradinsSpyglassAura(Player& player) : Aura(player, "Muradin's Spyglass") {
  duration   = 10;
  max_stacks = 10;
  stats_per_stack.push_back(SpellPower(player, 18));
}

MuradinsSpyglassHeroicAura::MuradinsSpyglassHeroicAura(Player& player) : Aura(player, "Muradin's Spyglass") {
  duration   = 10;
  max_stacks = 10;
  stats_per_stack.push_back(SpellPower(player, 20));
}

DislodgedForeignObjectAura::DislodgedForeignObjectAura(Player& player, const bool kIsHeroicVersion)
    : Aura(player, "Dislodged Foreign Object"), additional_spell_power_timer(2) {
  duration   = 20;
  max_stacks = 10;
  stats_per_stack.push_back(SpellPower(player, kIsHeroicVersion ? 121 : 105));
}

void DislodgedForeignObjectAura::Apply() {
  Aura::Apply();
  additional_spell_power_timer = 2;
}

void DislodgedForeignObjectAura::Tick(const double kTime) {
  Aura::Tick(kTime);
  additional_spell_power_timer -= kTime;

  if (additional_spell_power_timer <= 0) {
    IncrementStacks();
  }
}

PurifiedLunarDustAura::PurifiedLunarDustAura(Player& player) : Aura(player, "Purified Lunar Dust") {
  duration = 15;
  stats.push_back(ManaPer5(player, 304));
}

PhylacteryOfTheNamelessLichAura::PhylacteryOfTheNamelessLichAura(Player& player)
    : Aura(player, "Phylactery of the Nameless Lich") {
  duration = 20;
  stats.push_back(SpellPower(player, 1074));
}

PhylacteryOfTheNamelessLichHeroicAura::PhylacteryOfTheNamelessLichHeroicAura(Player& player)
    : Aura(player, "Phylactery of the Nameless Lich") {
  duration = 20;
  stats.push_back(SpellPower(player, 1207));
}

CharredTwilightScaleAura::CharredTwilightScaleAura(Player& player) : Aura(player, "Charred Twilight Scale") {
  duration = 15;
  stats.push_back(SpellPower(player, 763));
}

CharredTwilightScaleHeroicAura::CharredTwilightScaleHeroicAura(Player& player)
    : Aura(player, "Charred Twilight Scale") {
  duration = 15;
  stats.push_back(SpellPower(player, 861));
}

SparkOfLifeAura::SparkOfLifeAura(Player& player) : Aura(player, "Spark of Life") {
  duration = 15;
  stats.push_back(ManaPer5(player, 220));
}

GlyphOfLifeTapAura::GlyphOfLifeTapAura(Player& player) : Aura(player, "Glyph of Life Tap") {
  duration = 40;
}

void GlyphOfLifeTapAura::Apply() {
  if (is_active) {
    Aura::Fade();
  }

  stats = std::vector<Stat>{SpellPower(entity, entity.stats.spirit * 0.2)};
  Aura::Apply();
}
