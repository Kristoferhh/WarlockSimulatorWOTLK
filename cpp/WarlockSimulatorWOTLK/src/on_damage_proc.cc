#include "../include/on_damage_proc.h"

#include <utility>

#include "../include/entity.h"
#include "../include/player.h"
#include "../include/player_settings.h"

OnDamageProc::OnDamageProc(Player& player,
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
    : SpellProc(player,
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
  if (on_damage_procs_enabled) {
    entity.on_damage_procs.push_back(this);
  }

  procs_on_damage = true;
}

DarkmoonCardBerserker::DarkmoonCardBerserker(Player& player, const std::shared_ptr<Aura>& kAura)
    : OnDamageProc(player, "Darkmoon Card: Berserker!", kAura) {
  proc_chance = 50;
}

DarkmoonCardDeath::DarkmoonCardDeath(Player& player)
    : OnDamageProc(player,
                   "Darkmoon Card: Death",
                   nullptr,
                   nullptr,
                   1750,
                   2250,
                   0,
                   0,
                   0,
                   45,
                   SpellSchool::kShadow,
                   AttackType::kMagical) {
  proc_chance = 15;
  does_damage = true;
  can_crit    = true;
}

DarkmoonCardGreatness::DarkmoonCardGreatness(Player& player, const std::shared_ptr<Aura>& kAura)
    : OnDamageProc(player, "Darkmoon Card: Greatness", kAura, nullptr, 0, 0, 0, 0, 0, 45) {
  proc_chance = 35;
}

MuradinsSpyglass::MuradinsSpyglass(Player& player, const std::shared_ptr<Aura>& kAura)
    : OnDamageProc(player, "Muradin's Spyglass", kAura) {
  proc_chance = 100;
}
