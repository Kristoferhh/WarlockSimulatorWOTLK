#pragma once
#include "spell.h"

struct SpellProc : Spell {
  explicit SpellProc(Entity& entity,
                     const std::string& kName,
                     std::shared_ptr<Aura> aura          = nullptr,
                     std::shared_ptr<DamageOverTime> dot = nullptr,
                     double kMinDmg                      = 0,
                     double kMaxDmg                      = 0,
                     int kMinManaGain                    = 0,
                     int kMaxManaGain                    = 0,
                     double kManaCost                    = 0,
                     int kCooldown                       = 0,
                     SpellSchool spell_school            = SpellSchool::kNoSchool,
                     AttackType attack_type              = AttackType::kNoAttackType,
                     SpellType spell_type                = SpellType::kNoSpellType);
  virtual bool ShouldProc(Spell* spell);
};
