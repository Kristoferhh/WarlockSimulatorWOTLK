// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/on_cast_proc.h"

#include "../include/entity.h"
#include "../include/player.h"

OnCastProc::OnCastProc(Entity& entity, std::shared_ptr<Aura> aura) : SpellProc(entity, std::move(aura)) {
  procs_on_cast = true;
}

void OnCastProc::Setup() {
  SpellProc::Setup();

  if (procs_on_cast && on_cast_procs_enabled) {
    entity.on_cast_procs.push_back(this);
  }
}

JeTzesBell::JeTzesBell(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = WarlockSimulatorConstants::kJeTzesBell;
  proc_chance = 10;  // TODO confirm
  cooldown    = 90;  // TODO confirm
  OnCastProc::Setup();
}

EmbraceOfTheSpider::EmbraceOfTheSpider(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = WarlockSimulatorConstants::kEmbraceOfTheSpider;
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

DyingCurse::DyingCurse(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = WarlockSimulatorConstants::kDyingCurse;
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

MajesticDragonFigurine::MajesticDragonFigurine(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Majestic Dragon Figurine";
  proc_chance = 100;
  OnCastProc::Setup();
}

IllustrationOfTheDragonSoul::IllustrationOfTheDragonSoul(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Illustration of the Dragon Soul";
  proc_chance = 100;
  OnCastProc::Setup();
}

bool IllustrationOfTheDragonSoul::ShouldProc(Spell* spell) {
  return spell->is_damaging_spell;
}

SundialOfTheExiled::SundialOfTheExiled(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Sundial of the Exiled";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

bool SundialOfTheExiled::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

FlowOfKnowledge::FlowOfKnowledge(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Flow of Knowledge";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

EyeOfTheBroodmother::EyeOfTheBroodmother(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Eye of the Broodmother";
  proc_chance = 100;
  OnCastProc::Setup();
}

bool EyeOfTheBroodmother::ShouldProc(Spell* spell) {
  return spell->is_damaging_spell;
}

PandorasPlea::PandorasPlea(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Pandora's Plea";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

FlareOfTheHeavens::FlareOfTheHeavens(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Flare of the Heavens";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

bool FlareOfTheHeavens::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

ShowOfFaith::ShowOfFaith(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Show of Faith";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

ElementalFocusStone::ElementalFocusStone(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Elemental Focus Stone";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

bool ElementalFocusStone::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

SifsRemembrance::SifsRemembrance(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Sif's Remembrance";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

SolaceOfTheDefeated::SolaceOfTheDefeated(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Solace of the Defeated";
  proc_chance = 100;
  OnCastProc::Setup();
}

AbyssalRune::AbyssalRune(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Abyssal Rune";
  proc_chance = 25;
  cooldown    = 45;
  OnCastProc::Setup();
}

bool AbyssalRune::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

VolatilePower::VolatilePower(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Volatile Power";
  proc_chance = 100;
  OnCastProc::Setup();
}

bool VolatilePower::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

MithrilPocketwatch::MithrilPocketwatch(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Mithril Pocketwatch";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

bool MithrilPocketwatch::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

DislodgedForeignObject::DislodgedForeignObject(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Dislodged Foreign Object";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

bool DislodgedForeignObject::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

PurifiedLunarDust::PurifiedLunarDust(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Purified Lunar Dust";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

CharredTwilightScale::CharredTwilightScale(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, std::move(aura)) {
  name        = "Charred Twilight Scale";
  proc_chance = 10;
  cooldown    = 45;
  OnCastProc::Setup();
}

SparkOfLife::SparkOfLife(Player& player, std::shared_ptr<Aura> aura) : OnCastProc(player, std::move(aura)) {
  name        = "Spark of Life";
  proc_chance = 10;
  cooldown    = 50;
  OnCastProc::Setup();
}

bool SparkOfLife::ShouldProc(Spell* spell) {
  return spell->is_damaging_spell;
}
