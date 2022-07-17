// clang-format off
#include "pch.h"
// clang-format on
#include "../WarlockSimulatorWOTLK/include/aura_selection.h"
#include "../WarlockSimulatorWOTLK/include/item_slot.h"
#include "../WarlockSimulatorWOTLK/include/player.h"
#include "../WarlockSimulatorWOTLK/include/player_settings.h"
#include "../WarlockSimulatorWOTLK/include/sets.h"
#include "../WarlockSimulatorWOTLK/include/simulation.h"
#include "../WarlockSimulatorWOTLK/include/simulation_settings.h"
#include "../WarlockSimulatorWOTLK/include/spell.h"
#include "../WarlockSimulatorWOTLK/include/stat.h"
#include "../WarlockSimulatorWOTLK/include/talents.h"
#include "../WarlockSimulatorWOTLK/include/trinket.h"
#include "test_base.h"

class SpellTest : public ::testing::Test {
 protected:
  std::shared_ptr<AuraSelection> _auras;
  std::shared_ptr<Talents> _talents;
  std::shared_ptr<Sets> _sets;
  std::shared_ptr<ItemSlot> _items;
  std::shared_ptr<CharacterStats> _character_stats;
  std::shared_ptr<PlayerSettings> _player_settings;
  std::shared_ptr<Player> _player;
  std::shared_ptr<SimulationSettings> _simulation_settings;
  std::shared_ptr<Simulation> _simulation;
  std::unique_ptr<Spell> _spell;

  SpellTest() {
    _auras           = std::make_shared<AuraSelection>(TestBase::GetDefaultAuras());
    _talents         = std::make_shared<Talents>(TestBase::GetDefaultTalents());
    _sets            = std::make_shared<Sets>(TestBase::GetDefaultSets());
    _items           = std::make_shared<ItemSlot>(TestBase::GetDefaultItems());
    _character_stats = std::make_shared<CharacterStats>(TestBase::GetDefaultStats());
    _player_settings = std::make_shared<PlayerSettings>(
        TestBase::GetDefaultPlayerSettings(_auras, _talents, _sets, _character_stats, _items));
    _player              = std::make_shared<Player>(*_player_settings);
    _simulation_settings = std::make_shared<SimulationSettings>(TestBase::GetDefaultSimulationSettings());
    _simulation          = std::make_shared<Simulation>(*_player, *_simulation_settings);
    _player->Initialize(_simulation.get());
    _spell = std::make_unique<Spell>(*_player, "Dummy Spell");
  }
};

TEST_F(SpellTest, StartCast) {
  auto spell      = Spell(*_player, "spell");
  spell.cast_time = 3;

  spell.StartCast();
  EXPECT_EQ(spell.entity.cast_time_remaining, 3);
  EXPECT_TRUE(spell.casting);

  spell.entity.Tick(3);
  EXPECT_EQ(spell.entity.cast_time_remaining, 0);
  EXPECT_FALSE(spell.casting);
}

TEST_F(SpellTest, Cast) {
  auto spell = Spell(*_player, WarlockSimulatorConstants::kPowerInfusion, nullptr, nullptr, 0, 0, 200, 200, 0.2, 5);
  spell.entity.player->power_infusions_ready = 1;
  spell.gain_mana_on_cast                    = true;

  spell.Cast();
  EXPECT_TRUE(spell.entity.stats.mana < spell.entity.stats.max_mana);
  EXPECT_EQ(spell.entity.stats.mana, spell.entity.stats.max_mana - spell.mana_cost + spell.mana_gain);
  EXPECT_EQ(spell.cooldown_remaining, 5);
  EXPECT_EQ(spell.entity.five_second_rule_timer_remaining, 5);
  EXPECT_FALSE(spell.casting);
  EXPECT_EQ(spell.amount_of_casts_this_fight, 1);
  EXPECT_EQ(spell.entity.player->power_infusions_ready, 0);
}

TEST_F(SpellTest, Constructor) {
  const auto kSpell = Spell(*_player,
                            "test spell",
                            nullptr,
                            nullptr,
                            100,
                            200,
                            200,
                            300,
                            0.5,
                            12,
                            SpellSchool::kShadow,
                            AttackType::kMagical,
                            SpellType::kDestruction);
  EXPECT_EQ(kSpell.min_dmg, 100);
  EXPECT_EQ(kSpell.max_dmg, 200);
  EXPECT_EQ(kSpell.base_damage, 150);
  EXPECT_EQ(kSpell.min_mana_gain, 200);
  EXPECT_EQ(kSpell.max_mana_gain, 300);
  EXPECT_EQ(kSpell.mana_gain, 250);
  EXPECT_NE(kSpell.entity.combat_log_breakdown.find(kSpell.name), kSpell.entity.combat_log_breakdown.end());
  EXPECT_EQ(kSpell.mana_cost, 0.5 * kSpell.entity.kBaseMana);
  EXPECT_EQ(kSpell.cooldown, 12);
  EXPECT_EQ(kSpell.spell_school, SpellSchool::kShadow);
  EXPECT_EQ(kSpell.attack_type, AttackType::kMagical);
  EXPECT_EQ(kSpell.spell_type, SpellType::kDestruction);
}

TEST_F(SpellTest, ShadowBoltConstructor) {
  const auto kShadowBolt = ShadowBolt(*_player);
  EXPECT_EQ(kShadowBolt.name, WarlockSimulatorConstants::kShadowBolt);
  EXPECT_EQ(kShadowBolt.min_dmg, 690);
  EXPECT_EQ(kShadowBolt.max_dmg, 770);
  EXPECT_EQ(kShadowBolt.base_damage, 730);
  EXPECT_TRUE(kShadowBolt.mana_cost > 0);
  EXPECT_EQ(kShadowBolt.spell_school, SpellSchool::kShadow);
  EXPECT_EQ(kShadowBolt.attack_type, AttackType::kMagical);
  EXPECT_EQ(kShadowBolt.spell_type, SpellType::kDestruction);
  EXPECT_EQ(kShadowBolt.cast_time, 3 - 0.1 * _player->talents.bane);
  EXPECT_EQ(kShadowBolt.coefficient, 3 / 3.5 + 0.04 * _player->talents.shadow_and_flame);
  EXPECT_TRUE(kShadowBolt.does_damage);
  EXPECT_TRUE(kShadowBolt.can_crit);
  EXPECT_TRUE(kShadowBolt.can_miss);
  EXPECT_EQ(kShadowBolt.additive_modifier, 1 + 0.02 * _player->talents.improved_shadow_bolt);
  EXPECT_TRUE(kShadowBolt.is_harmful);
  EXPECT_TRUE(kShadowBolt.is_damaging_spell);
}

TEST_F(SpellTest, Reset) {
  _spell->casting                    = true;
  _spell->cooldown_remaining         = 10;
  _spell->amount_of_casts_this_fight = 50;

  _spell->Reset();
  EXPECT_FALSE(_spell->casting);
  EXPECT_EQ(_spell->cooldown_remaining, 0);
  EXPECT_EQ(_spell->amount_of_casts_this_fight, 0);
}

TEST_F(SpellTest, HasEnoughMana) {
  _spell->mana_cost = _spell->entity.stats.mana - 1;
  EXPECT_TRUE(_spell->HasEnoughMana());

  _spell->mana_cost = _spell->entity.stats.mana + 1;
  EXPECT_FALSE(_spell->HasEnoughMana());
}

TEST_F(SpellTest, CanCast_Normal) {
  EXPECT_TRUE(_spell->CanCast());
}

TEST_F(SpellTest, CanCast_OnCooldown) {
  _spell->cooldown_remaining = 10;
  EXPECT_FALSE(_spell->CanCast());
}

TEST_F(SpellTest, CanCast_PlayerHasGcd_IsNonWarlockAbility) {
  _spell->entity.gcd_remaining   = 1.5;
  _spell->is_non_warlock_ability = true;
  EXPECT_TRUE(_spell->CanCast());
}

TEST_F(SpellTest, CanCast_PlayerHasGcd_SpellIsNotOnGcd) {
  _spell->entity.gcd_remaining = 1.5;
  _spell->on_gcd               = false;
  EXPECT_TRUE(_spell->CanCast());
}

TEST_F(SpellTest, CanCast_PlayerIsCasting_SpellIsProc) {
  _spell->entity.cast_time_remaining = 3;
  _spell->is_proc                    = true;
  EXPECT_TRUE(_spell->CanCast());
}

TEST_F(SpellTest, CanCast_LimitedAmountOfCasts) {
  _spell->limited_amount_of_casts    = true;
  _spell->amount_of_casts_per_fight  = 10;
  _spell->amount_of_casts_this_fight = 5;
  EXPECT_TRUE(_spell->CanCast());

  _spell->amount_of_casts_this_fight = 10;
  EXPECT_FALSE(_spell->CanCast());
}

TEST_F(SpellTest, GetCastTime) {
  _spell->cast_time = 3;
  EXPECT_EQ(_spell->GetCastTime(), 3);

  _spell->entity.stats.haste_percent = 1.5;
  EXPECT_EQ(_spell->GetCastTime(), 2);
}

TEST_F(SpellTest, Tick) {
  _spell->cooldown = 5;
  _spell->Cast();

  _spell->Tick(3);
  EXPECT_EQ(_spell->cooldown_remaining, 2);

  _spell->Tick(7);
  EXPECT_FALSE(_spell->casting);
  EXPECT_EQ(_spell->entity.cast_time_remaining, 0);
}

TEST_F(SpellTest, Tick_PowerInfusionComingOffCooldown) {
  _spell->entity.player->power_infusions_ready = 1;
  _spell->name                                 = WarlockSimulatorConstants::kPowerInfusion;
  _spell->cooldown                             = 180;

  _spell->Cast();
  EXPECT_EQ(_spell->entity.player->power_infusions_ready, 0);

  _spell->Tick(180);
  EXPECT_EQ(_spell->entity.player->power_infusions_ready, 1);
}
