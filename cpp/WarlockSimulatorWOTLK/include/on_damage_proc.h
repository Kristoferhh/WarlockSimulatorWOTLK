#pragma once
#include "spell_proc.h"

struct Player;

struct OnDamageProc : SpellProc {
  explicit OnDamageProc(Player& player,
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
};

struct DarkmoonCardBerserker final : OnDamageProc {
  explicit DarkmoonCardBerserker(Player& player, const std::shared_ptr<Aura>& kAura);
};

struct DarkmoonCardDeath final : OnDamageProc {
  explicit DarkmoonCardDeath(Player& player);
};

struct DarkmoonCardGreatness final : OnDamageProc {
  explicit DarkmoonCardGreatness(Player& player, const std::shared_ptr<Aura>& kAura);
};

struct MuradinsSpyglass final : OnDamageProc {
  explicit MuradinsSpyglass(Player& player, const std::shared_ptr<Aura>& kAura);
};
