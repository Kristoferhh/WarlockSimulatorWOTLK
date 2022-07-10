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

Aura::Aura(Entity& player) : entity(player) {}

void Aura::Setup() {
  if (entity.recording_combat_log_breakdown && !entity.combat_log_breakdown.contains(name)) {
    entity.combat_log_breakdown.insert({name, std::make_shared<CombatLogBreakdown>(name)});
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

    for (auto& stat : stats) {
      stat.AddStat();
    }

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
    entity.player->ThrowError("Attempting to fade " + name + " when it isn't is_active");
  }

  for (auto& stat : stats) {
    stat.RemoveStat();
  }

  if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " faded");
  }

  if (entity.recording_combat_log_breakdown) {
    entity.combat_log_breakdown.at(name)->uptime_in_seconds +=
        entity.simulation->current_fight_time - entity.combat_log_breakdown.at(name)->applied_at;
  }

  if (stacks > 0) {
    for (auto& stat : stats_per_stack) {
      stat.RemoveStat(stacks);
    }
  }

  is_active = false;
  stacks    = 0;
}

void Aura::IncrementStacks(const int kStackAmount) {
  stacks += kStackAmount;

  for (auto& stat : stats_per_stack) {
    stat.AddStat(kStackAmount);
  }
}

void Aura::DecrementStacks() {
  stacks--;

  if (stacks <= 0) {
    Fade();
  } else if (entity.ShouldWriteToCombatLog()) {
    entity.CombatLog(name + " (" + std::to_string(stacks) + ")");
  }
}

CurseOfTheElementsAura::CurseOfTheElementsAura(Player& player) : Aura(player) {
  name     = SpellName::kCurseOfTheElements;
  duration = 300;
  Aura::Setup();
}

ShadowTranceAura::ShadowTranceAura(Player& player) : Aura(player) {
  name     = SpellName::kNightfall;
  duration = 10;
  Aura::Setup();
}

PowerInfusionAura::PowerInfusionAura(Player& player) : Aura(player) {
  name     = SpellName::kPowerInfusion;
  duration = 15;
  stats.push_back(SpellHastePercent(player, 1.2));
  stats.push_back(ManaCostModifier(player, 0.8));
  Aura::Setup();
}

FlameCapAura::FlameCapAura(Player& player) : Aura(player) {
  name     = SpellName::kFlameCap;
  duration = 60;
  stats.push_back(FirePower(player, 80));
  Aura::Setup();
}

BloodFuryAura::BloodFuryAura(Player& player) : Aura(player) {
  name     = SpellName::kBloodFury;
  duration = 15;
  stats.push_back(SpellPower(player, 163));
  Aura::Setup();
}

BloodlustAura::BloodlustAura(Player& player) : Aura(player) {
  name       = SpellName::kBloodlust;
  duration   = 40;
  group_wide = true;
  stats.push_back(SpellHastePercent(player, 1.3));
  if (player.pet != nullptr) {
    stats.push_back(SpellHastePercent(*player.pet, 1.3));
    stats.push_back(MeleeHastePercent(*player.pet, 1.3));
  }
  Aura::Setup();
}

TheLightningCapacitorAura::TheLightningCapacitorAura(Player& player) : Aura(player) {
  name         = SpellName::kTheLightningCapacitor;
  has_duration = false;
  max_stacks   = 3;
  Aura::Setup();
}

InnervateAura::InnervateAura(Player& player) : Aura(player) {
  name     = SpellName::kInnervate;
  duration = 20;
  Aura::Setup();
}

DemonicFrenzyAura::DemonicFrenzyAura(Pet& pet) : Aura(pet) {
  name       = SpellName::kDemonicFrenzy;
  duration   = 10;
  max_stacks = 10;
  Aura::Setup();
}

BlackBookAura::BlackBookAura(Pet& pet) : Aura(pet) {
  name     = SpellName::kBlackBook;
  duration = 30;
  stats.push_back(SpellPower(pet, 200));
  stats.push_back(AttackPower(pet, 325));
  Aura::Setup();
}

HauntAura::HauntAura(Player& player) : Aura(player) {
  name     = SpellName::kHaunt;
  duration = 12;
  Aura::Setup();
}

ShadowEmbraceAura::ShadowEmbraceAura(Player& player) : Aura(player) {
  name       = SpellName::kShadowEmbrace;
  duration   = 12;
  max_stacks = 3;
  Aura::Setup();
}

EradicationAura::EradicationAura(Player& player) : Aura(player) {
  name     = SpellName::kEradication;
  duration = 10;
  stats.push_back(SpellHastePercent(player,
                                    player.talents.eradication == 1   ? 1.06
                                    : player.talents.eradication == 2 ? 1.12
                                    : player.talents.eradication == 3 ? 1.2
                                                                      : 1));
  Aura::Setup();
}

MoltenCoreAura::MoltenCoreAura(Player& player) : Aura(player) {
  name                    = SpellName::kMoltenCore;
  duration                = 15;
  max_stacks              = 3;
  applies_with_max_stacks = true;
  Aura::Setup();
}

DemonicEmpowermentAura::DemonicEmpowermentAura(Pet& pet) : Aura(pet) {
  name = SpellName::kDemonicEmpowerment;

  if (pet.pet_name == PetName::kImp) {
    duration = 30;
    stats.push_back(SpellCritChance(pet, 1.2));
  } else if (pet.pet_name == PetName::kFelguard) {
    duration = 15;
    stats.push_back(MeleeHastePercent(pet, 1.2));
  }

  Aura::Setup();
}

DecimationAura::DecimationAura(Player& player) : Aura(player) {
  name     = SpellName::kDecimation;
  duration = 10;
  Aura::Setup();
}

// TODO does the pet get the aura
DemonicPactAura::DemonicPactAura(Player& player) : Aura(player) {
  name     = SpellName::kDemonicPact;
  duration = 45;
  Aura::Setup();
}

MetamorphosisAura::MetamorphosisAura(Player& player) : Aura(player) {
  name     = SpellName::kMetamorphosis;
  duration = 30;
  stats.push_back(DamageModifier(player, 1.2));
  Aura::Setup();
}

ShadowMasteryAura::ShadowMasteryAura(Player& player) : Aura(player) {
  name     = SpellName::kShadowMastery;
  duration = 30;
  stats.push_back(SpellCritChance(player, 5));
  stats.push_back(SpellCritChance(*player.pet, 5));
  Aura::Setup();
}

PyroclasmAura::PyroclasmAura(Player& player) : Aura(player) {
  name     = SpellName::kPyroclasm;
  duration = 10;
  stats.push_back(ShadowModifier(player, 1 + 0.02 * player.talents.pyroclasm));
  stats.push_back(FireModifier(player, 1 + 0.02 * player.talents.pyroclasm));
  Aura::Setup();
}

ImprovedSoulLeechAura::ImprovedSoulLeechAura(Player& player) : Aura(player) {
  name     = SpellName::kImprovedSoulLeech;
  duration = 15;
  stats.push_back(ManaPer5(player, player.stats.max_mana * 0.01));  // TODO does it also affect pet
  Aura::Setup();
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

BackdraftAura::BackdraftAura(Player& player) : Aura(player) {
  name                    = SpellName::kBackdraft;
  duration                = 15;
  max_stacks              = 3;
  applies_with_max_stacks = true;
  Aura::Setup();
}

EmpoweredImpAura::EmpoweredImpAura(Player& player) : Aura(player) {
  name     = SpellName::kEmpoweredImp;
  duration = 8;
  Aura::Setup();
}

JeTzesBellAura::JeTzesBellAura(Player& player) : Aura(player) {
  name     = SpellName::kJeTzesBell;
  duration = 15;
  stats.push_back(ManaPer5(player, 125));
  Aura::Setup();
}

EmbraceOfTheSpiderAura::EmbraceOfTheSpiderAura(Player& player) : Aura(player) {
  name     = SpellName::kEmbraceOfTheSpider;
  duration = 10;
  stats.push_back(SpellHasteRating(player, 505));
  Aura::Setup();
}

DyingCurseAura::DyingCurseAura(Player& player) : Aura(player) {
  name     = SpellName::kDyingCurse;
  duration = 10;
  stats.push_back(SpellPower(player, 765));
  Aura::Setup();
}

MajesticDragonFigurineAura::MajesticDragonFigurineAura(Player& player) : Aura(player) {
  name       = "Majestic Dragon Figurine";
  duration   = 10;
  max_stacks = 10;
  stats_per_stack.push_back(Spirit(player, 18));
  Aura::Setup();
}

IllustrationOfTheDragonSoulAura::IllustrationOfTheDragonSoulAura(Player& player) : Aura(player) {
  name       = "Illustration of the Dragon Soul";
  duration   = 10;
  max_stacks = 10;
  stats_per_stack.push_back(SpellPower(player, 20));
  Aura::Setup();
}

SundialOfTheExiledAura::SundialOfTheExiledAura(Player& player) : Aura(player) {
  name     = "Sundial of the Exiled";
  duration = 10;
  stats.push_back(SpellPower(player, 590));
  Aura::Setup();
}

DarkmoonCardBerserkerAura::DarkmoonCardBerserkerAura(Player& player) : Aura(player) {
  name       = "Darkmoon Card: Berserker!";
  duration   = 12;
  max_stacks = 3;
  stats_per_stack.push_back(SpellCritRating(player, 35));
  Aura::Setup();
}

DarkmoonCardGreatnessAura::DarkmoonCardGreatnessAura(Player& player) : Aura(player) {
  name     = "Darkmoon Card: Crusade";
  duration = 15;
  Aura::Setup();
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

FlowOfKnowledgeAura::FlowOfKnowledgeAura(Player& player) : Aura(player) {
  name     = "Flow of Knowledge";
  duration = 10;
  stats.push_back(SpellPower(player, 590));
  Aura::Setup();
}

JoustersFuryAura::JoustersFuryAura(Player& player) : Aura(player) {
  name     = "Jouster's Fury";
  duration = 10;
  stats.push_back(SpellCritRating(player, 328));
  Aura::Setup();
}

EyeOfTheBroodmotherAura::EyeOfTheBroodmotherAura(Player& player) : Aura(player) {
  name       = "Eye of the Broodmother";
  duration   = 10;
  max_stacks = 5;
  stats_per_stack.push_back(SpellPower(player, 25));
  Aura::Setup();
}

PandorasPleaAura::PandorasPleaAura(Player& player) : Aura(player) {
  name     = "Pandora's Plea";
  duration = 10;
  stats.push_back(SpellPower(player, 751));
  Aura::Setup();
}

FlareOfTheHeavensAura::FlareOfTheHeavensAura(Player& player) : Aura(player) {
  name     = "Flare of the Heavens";
  duration = 10;
  stats.push_back(SpellPower(player, 850));
  Aura::Setup();
}

ShowOfFaithAura::ShowOfFaithAura(Player& player) : Aura(player) {
  name     = "Show of Faith";
  duration = 15;
  stats.push_back(ManaPer5(player, 241));
  Aura::Setup();
}

ElementalFocusStoneAura::ElementalFocusStoneAura(Player& player) : Aura(player) {
  name     = "Elemental Focus Stone";
  duration = 10;
  stats.push_back(SpellHasteRating(player, 522));
  Aura::Setup();
}

SifsRemembranceAura::SifsRemembranceAura(Player& player) : Aura(player) {
  name     = "Sif's Remembrance";
  duration = 15;
  stats.push_back(ManaPer5(player, 195));
  Aura::Setup();
}

MeteoriteCrystalAura::MeteoriteCrystalAura(Player& player) : Aura(player) {
  name     = "Meteorite Crystal";
  duration = 20;
  Aura::Setup();
}

void MeteoriteCrystalAura::Fade() {
  entity.auras.meteoric_inspiration->Fade();
}

MeteoricInspirationAura::MeteoricInspirationAura(Player& player) : Aura(player) {
  name       = "Meteoric Inspiration";
  duration   = 20;
  max_stacks = 20;
  stats_per_stack.push_back(ManaPer5(player, 75));
  Aura::Setup();
}

SolaceOfTheDefeatedAura::SolaceOfTheDefeatedAura(Player& player) : Aura(player) {
  name       = "Solace of the Defeated";
  duration   = 10;
  max_stacks = 8;
  stats_per_stack.push_back(ManaPer5(player, 16));
  Aura::Setup();
}

SolaceOfTheDefeatedHeroicAura::SolaceOfTheDefeatedHeroicAura(Player& player) : Aura(player) {
  name       = "Solace of the Defeated";
  duration   = 10;
  max_stacks = 8;
  stats_per_stack.push_back(ManaPer5(player, 18));
  Aura::Setup();
}

MoteOfFlameAura::MoteOfFlameAura(Player& player, const std::shared_ptr<Spell>& kSpell)
    : Aura(player), reign_of_the_unliving(*kSpell) {
  name         = "Mote of Flame";
  has_duration = false;
  max_stacks   = 3;
  Aura::Setup();
}

void MoteOfFlameAura::Apply() {
  Aura::Apply();

  if (stacks == max_stacks) {
    stacks = 0;
    reign_of_the_unliving.StartCast();
  }
}

AbyssalRuneAura::AbyssalRuneAura(Player& player) : Aura(player) {
  name     = "Abyssal Rune";
  duration = 10;
  stats.push_back(SpellPower(player, 590));
  Aura::Setup();
}

TalismanOfVolatilePowerAura::TalismanOfVolatilePowerAura(Player& player) : Aura(player) {
  name     = "Talisman of Volatile Power";
  duration = 20;
  Aura::Setup();
}

void TalismanOfVolatilePowerAura::Fade() {
  Aura::Fade();
  entity.auras.volatile_power->Fade();
}

VolatilePowerAura::VolatilePowerAura(Player& player) : Aura(player) {
  name         = "Volatile Power";
  has_duration = false;
  stats_per_stack.push_back(SpellHasteRating(player, 57));
  max_stacks = 8;
  Aura::Setup();
}

VolatilePowerHeroicAura::VolatilePowerHeroicAura(Player& player) : Aura(player) {
  name         = "Volatile Power";
  has_duration = false;
  stats_per_stack.push_back(SpellHasteRating(player, 64));
  max_stacks = 8;
  Aura::Setup();
}

MithrilPocketwatchAura::MithrilPocketwatchAura(Player& player) : Aura(player) {
  name     = "Mithril Pocketwatch";
  duration = 10;
  stats.push_back(SpellPower(player, 590));
  Aura::Setup();
}

NevermeltingIceCrystalAura::NevermeltingIceCrystalAura(Player& player) : Aura(player) {
  name     = "Nevermelting Ice Crystal";
  duration = 20;
  stats_per_stack.push_back(SpellCritRating(player, 184));
  max_stacks              = 5;
  applies_with_max_stacks = true;
  Aura::Setup();
}

MuradinsSpyglassAura::MuradinsSpyglassAura(Player& player) : Aura(player) {
  name       = "Muradin's Spyglass";
  duration   = 10;
  max_stacks = 10;
  stats_per_stack.push_back(SpellPower(player, 18));
  Aura::Setup();
}

MuradinsSpyglassHeroicAura::MuradinsSpyglassHeroicAura(Player& player) : Aura(player) {
  name       = "Muradin's Spyglass";
  duration   = 10;
  max_stacks = 10;
  stats_per_stack.push_back(SpellPower(player, 20));
  Aura::Setup();
}

DislodgedForeignObjectAura::DislodgedForeignObjectAura(Player& player, const bool kIsHeroicVersion)
    : Aura(player), additional_spell_power_timer(2) {
  name       = "Dislodged Foreign Object";
  duration   = 20;
  max_stacks = 10;
  stats_per_stack.push_back(SpellPower(player, kIsHeroicVersion ? 121 : 105));
  Aura::Setup();
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

PurifiedLunarDustAura::PurifiedLunarDustAura(Player& player) : Aura(player) {
  name     = "Purified Lunar Dust";
  duration = 15;
  stats.push_back(ManaPer5(player, 304));
  Aura::Setup();
}

PhylacteryOfTheNamelessLichAura::PhylacteryOfTheNamelessLichAura(Player& player) : Aura(player) {
  name     = "Phylactery of the Nameless Lich";
  duration = 20;
  stats.push_back(SpellPower(player, 1074));
  Aura::Setup();
}

PhylacteryOfTheNamelessLichHeroicAura::PhylacteryOfTheNamelessLichHeroicAura(Player& player) : Aura(player) {
  name     = "Phylactery of the Nameless Lich";
  duration = 20;
  stats.push_back(SpellPower(player, 1207));
  Aura::Setup();
}

CharredTwilightScaleAura::CharredTwilightScaleAura(Player& player) : Aura(player) {
  name     = "Charred Twilight Scale";
  duration = 15;
  stats.push_back(SpellPower(player, 763));
  Aura::Setup();
}

CharredTwilightScaleHeroicAura::CharredTwilightScaleHeroicAura(Player& player) : Aura(player) {
  name     = "Charred Twilight Scale";
  duration = 15;
  stats.push_back(SpellPower(player, 861));
  Aura::Setup();
}
