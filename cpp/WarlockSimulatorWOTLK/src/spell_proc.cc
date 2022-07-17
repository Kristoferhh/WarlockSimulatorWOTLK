#include "../include/spell_proc.h"

#include <utility>

SpellProc::SpellProc(Entity& entity,
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
    : Spell(entity,
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
  is_proc = true;
  on_gcd  = false;
}

bool SpellProc::ShouldProc(Spell*) {
  return true;
}
