// ReSharper disable CppClangTidyClangDiagnosticShadowField
#include "../include/on_crit_proc.h"

#include <utility>

#include "../include/aura.h"
#include "../include/entity.h"
#include "../include/pet.h"
#include "../include/player.h"
#include "../include/player_settings.h"
#include "../include/talents.h"

OnCritProc::OnCritProc(Entity& entity,
                       const std::string& kName,
                       std::shared_ptr<Aura> aura,
                       std::shared_ptr<DamageOverTime> dot,
                       double kMinDmg,
                       double kMaxDmg,
                       int kMinManaGain,
                       int kMaxManaGain,
                       double kManaCost,
                       int kCooldown,
                       SpellSchool spell_school,
                       AttackType attack_type,
                       SpellType spell_type)
    : SpellProc(entity,
                kName,
                std::move(aura),
                std::move(dot),
                kMinDmg,
                kMaxDmg,
                kMinManaGain,
                kMaxManaGain,
                kManaCost,
                kCooldown,
                spell_school,
                attack_type,
                spell_type) {
  if (on_crit_procs_enabled) {
    entity.on_crit_procs.push_back(this);
  }

  procs_on_crit = true;
}

DemonicPact::DemonicPact(Pet& pet, std::shared_ptr<Aura> aura)
    : OnCritProc(pet, "Demonic Pact", std::move(aura), nullptr, 0, 0, 0, 0, 0, 20) {
  proc_chance = 100;
}

Pyroclasm::Pyroclasm(Player& player, std::shared_ptr<Aura> aura) : OnCritProc(player, "Pyroclasm", std::move(aura)) {
  proc_chance = 100;
}

EmpoweredImp::EmpoweredImp(Pet& pet, std::shared_ptr<Aura> aura) : OnCritProc(pet, "Empowered Imp", std::move(aura)) {
  proc_chance = pet.player->talents.empowered_imp == 1   ? 33
                : pet.player->talents.empowered_imp == 2 ? 66
                : pet.player->talents.empowered_imp == 3 ? 100
                                                         : 0;
}

SoulOfTheDead::SoulOfTheDead(Player& player)
    : OnCritProc(player, "Soul of the Dead", nullptr, nullptr, 0, 0, 900, 900, 0, 45) {
  proc_chance       = 25;
  gain_mana_on_cast = true;
}

MoteOfFlame::MoteOfFlame(Player& player, std::shared_ptr<Aura> aura)
    : OnCritProc(player, "Mote of Flame", std::move(aura), nullptr, 0, 0, 0, 0, 0, 2) {
  proc_chance = 100;
}
