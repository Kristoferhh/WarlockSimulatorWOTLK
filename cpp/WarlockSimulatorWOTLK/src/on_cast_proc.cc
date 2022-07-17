// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/on_cast_proc.h"

#include "../include/entity.h"
#include "../include/player.h"

OnCastProc::OnCastProc(Entity& entity, const std::string& kName, std::shared_ptr<Aura> aura, const int kCooldown)
    : SpellProc(entity, kName, std::move(aura), nullptr, 0, 0, 0, 0, 0, kCooldown) {
  if (on_cast_procs_enabled) {
    entity.on_cast_procs.push_back(this);
  }

  procs_on_cast = true;
}

JeTzesBell::JeTzesBell(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Je'Tze's Bell", std::move(aura), 90) {
  proc_chance = 10;  // TODO confirm
}

EmbraceOfTheSpider::EmbraceOfTheSpider(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Embrace of the Spider", std::move(aura), 45) {
  proc_chance = 10;
}

DyingCurse::DyingCurse(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Dying Curse", std::move(aura), 45) {
  proc_chance = 10;
}

MajesticDragonFigurine::MajesticDragonFigurine(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Majestic Dragon Figurine", std::move(aura)) {
  proc_chance = 100;
}

IllustrationOfTheDragonSoul::IllustrationOfTheDragonSoul(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Illustration of the Dragon Soul", std::move(aura)) {
  proc_chance = 100;
}

bool IllustrationOfTheDragonSoul::ShouldProc(Spell* spell) {
  return spell->is_damaging_spell;
}

SundialOfTheExiled::SundialOfTheExiled(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Sundial of the Exiled", std::move(aura), 45) {
  proc_chance = 10;
}

bool SundialOfTheExiled::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

FlowOfKnowledge::FlowOfKnowledge(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Flow of Knowledge", std::move(aura), 45) {
  proc_chance = 10;
}

EyeOfTheBroodmother::EyeOfTheBroodmother(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Eye of the Broodmother", std::move(aura)) {
  proc_chance = 100;
}

bool EyeOfTheBroodmother::ShouldProc(Spell* spell) {
  return spell->is_damaging_spell;
}

PandorasPlea::PandorasPlea(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Pandora's Plea", std::move(aura), 45) {
  proc_chance = 10;
}

FlareOfTheHeavens::FlareOfTheHeavens(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Flare of the Heavens", std::move(aura), 45) {
  proc_chance = 10;
}

bool FlareOfTheHeavens::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

ShowOfFaith::ShowOfFaith(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Show of Faith", std::move(aura), 45) {
  proc_chance = 10;
}

ElementalFocusStone::ElementalFocusStone(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Elemental Focus Stone", std::move(aura), 45) {
  proc_chance = 10;
}

bool ElementalFocusStone::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

SifsRemembrance::SifsRemembrance(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Sif's Remembrance", std::move(aura), 45) {
  proc_chance = 10;
}

SolaceOfTheDefeated::SolaceOfTheDefeated(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Solace of the Defeated", std::move(aura)) {
  proc_chance = 100;
}

AbyssalRune::AbyssalRune(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Abyssal Rune", std::move(aura), 45) {
  proc_chance = 25;
}

bool AbyssalRune::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

VolatilePower::VolatilePower(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Volatile Power", std::move(aura)) {
  proc_chance = 100;
}

bool VolatilePower::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

MithrilPocketwatch::MithrilPocketwatch(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Mithril Pocketwatch", std::move(aura), 45) {
  proc_chance = 10;
}

bool MithrilPocketwatch::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

DislodgedForeignObject::DislodgedForeignObject(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Dislodged Foreign Object", std::move(aura), 45) {
  proc_chance = 10;
}

bool DislodgedForeignObject::ShouldProc(Spell* spell) {
  return spell->is_harmful;
}

PurifiedLunarDust::PurifiedLunarDust(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Purified Lunar Dust", std::move(aura), 45) {
  proc_chance = 10;
}

CharredTwilightScale::CharredTwilightScale(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Charred Twilight Scale", std::move(aura), 45) {
  proc_chance = 10;
}

SparkOfLife::SparkOfLife(Player& player, std::shared_ptr<Aura> aura)
    : OnCastProc(player, "Spark of Life", std::move(aura), 50) {
  proc_chance = 10;
}

bool SparkOfLife::ShouldProc(Spell* spell) {
  return spell->is_damaging_spell;
}
