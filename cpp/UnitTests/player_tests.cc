// clang-format off
#include "pch.h"
// clang-format on
#include "../WarlockSimulatorWOTLK/include/aura.h"
#include "../WarlockSimulatorWOTLK/include/aura_selection.h"
#include "../WarlockSimulatorWOTLK/include/combat_log_breakdown.h"
#include "../WarlockSimulatorWOTLK/include/damage_over_time.h"
#include "../WarlockSimulatorWOTLK/include/item_slot.h"
#include "../WarlockSimulatorWOTLK/include/pet.h"
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

class PlayerTest : public ::testing::Test {
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

  PlayerTest() {
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
    _player->Reset();
  }
};

TEST_F(PlayerTest, Reset) {
  _player->stats.mana            = 0;
  _player->iteration_damage      = 1000;
  _player->power_infusions_ready = 0;
  ASSERT_NE(_player->stats.mana, _player->stats.max_mana);

  _player->Reset();
  EXPECT_EQ(_player->stats.mana, _player->stats.max_mana);
  EXPECT_EQ(_player->iteration_damage, 0);
  EXPECT_EQ(_player->power_infusions_ready, 2);
}

TEST_F(PlayerTest, EndAuras) {
  const auto kCorruption   = std::make_shared<CorruptionDot>(*_player);
  const auto kCurseOfAgony = std::make_shared<CurseOfAgonyDot>(*_player);
  _player->dot_list.push_back(kCorruption.get());
  _player->trinkets.push_back(SkullOfGuldan(*_player));
  _player->trinkets.at(0).Use();
  _player->dot_list.at(0)->Apply();
  _player->dot_list.push_back(kCurseOfAgony.get());
  _player->trinkets.push_back(ShiftingNaaruSliver(*_player));
  _player->trinkets.at(1).Use();
  _player->dot_list.at(1)->Apply();
  ASSERT_TRUE(_player->trinkets.at(0).is_active);
  ASSERT_TRUE(_player->dot_list.at(0)->is_active);
  ASSERT_TRUE(_player->trinkets.at(1).is_active);
  ASSERT_TRUE(_player->dot_list.at(1)->is_active);

  _player->EndAuras();
  EXPECT_FALSE(_player->trinkets.at(0).is_active);
  EXPECT_FALSE(_player->dot_list.at(0)->is_active);
  EXPECT_FALSE(_player->trinkets.at(1).is_active);
  EXPECT_FALSE(_player->dot_list.at(1)->is_active);
}

TEST_F(PlayerTest, GetHastePercent) {
  _player->stats.haste_rating = 100;
  const auto kHastePercentFromRating =
      _player->stats.haste_rating / WarlockSimulatorConstants::kHasteRatingPerPercent / 100.0;
  ASSERT_NE(_player->auras.bloodlust, nullptr);
  ASSERT_NE(_player->auras.power_infusion, nullptr);
  ASSERT_EQ(_player->GetHastePercent(), 1 + kHastePercentFromRating);

  _player->auras.power_infusion->Apply();
  EXPECT_EQ(_player->GetHastePercent(), 1.2 * (1 + kHastePercentFromRating));

  _player->auras.bloodlust->Apply();
  EXPECT_EQ(_player->GetHastePercent(), 1.3 * (1 + kHastePercentFromRating));
  EXPECT_TRUE(_player->auras.power_infusion->is_active);
}

TEST_F(PlayerTest, GetSpellPower) {
  _player->stats.spell_power         = 100;
  _player->stats.shadow_power        = 200;
  _player->stats.fire_power          = 300;
  _player->talents.demonic_knowledge = 3;
  const auto kExpectedSpellPower     = 100 + (_player->pet->GetStamina() + _player->pet->GetIntellect()) * 0.04 * 3;
  ASSERT_NE(kExpectedSpellPower, 100);
  const auto kExpectedShadowPower = 200 + kExpectedSpellPower;
  const auto kExpectedFirePower   = 300 + kExpectedSpellPower;

  EXPECT_EQ(_player->GetSpellPower(SpellSchool::kShadow), kExpectedShadowPower);
  EXPECT_EQ(_player->GetSpellPower(SpellSchool::kFire), kExpectedFirePower);
}

TEST_F(PlayerTest, UseCooldowns) {
  ASSERT_NE(_player->auras.flame_cap, nullptr);
  ASSERT_NE(_player->auras.blood_fury, nullptr);
  ASSERT_NE(_player->spells.flame_cap, nullptr);
  ASSERT_NE(_player->spells.blood_fury, nullptr);

  _player->UseCooldowns();
  EXPECT_TRUE(_player->auras.flame_cap->is_active);
  EXPECT_EQ(_player->spells.flame_cap->cooldown_remaining, 180);
  EXPECT_TRUE(_player->auras.blood_fury->is_active);
  EXPECT_EQ(_player->spells.blood_fury->cooldown_remaining, 120);
}

TEST_F(PlayerTest, UseCooldowns_PI) {
  ASSERT_NE(_player->auras.power_infusion, nullptr);

  _player->UseCooldowns();
  EXPECT_TRUE(_player->auras.power_infusion->is_active);
  EXPECT_TRUE(std::count_if(_player->spells.power_infusion.begin(),
                            _player->spells.power_infusion.end(),
                            [](const std::shared_ptr<Spell>& kPowerInfusion) {
                              return kPowerInfusion->cooldown_remaining > 0;
                            }) == 1);
}

TEST_F(PlayerTest, UseCooldowns_PI_BloodlustIsActive) {
  ASSERT_NE(_player->auras.power_infusion, nullptr);
  ASSERT_NE(_player->auras.bloodlust, nullptr);
  _player->auras.bloodlust->Apply();

  _player->UseCooldowns();
  EXPECT_FALSE(_player->auras.power_infusion->is_active);
}

TEST_F(PlayerTest, UseCooldowns_Innervate) {
  ASSERT_NE(_player->auras.innervate, nullptr);
  _player->stats.mana = 0;

  _player->UseCooldowns();
  EXPECT_TRUE(_player->auras.innervate->is_active);
  EXPECT_TRUE(
      std::count_if(_player->spells.innervate.begin(),
                    _player->spells.innervate.end(),
                    [](const std::shared_ptr<Spell>& kInnervate) { return kInnervate->cooldown_remaining > 0; }) == 1);
}

TEST_F(PlayerTest, UseCooldowns_Innervate_TooHighMana) {
  ASSERT_NE(_player->auras.innervate, nullptr);
  ASSERT_TRUE(_player->stats.mana / _player->stats.max_mana > 0.5);

  _player->UseCooldowns();
  EXPECT_FALSE(_player->auras.innervate->is_active);
}

TEST_F(PlayerTest, UseCooldowns_Trinket) {
  _player->trinkets.push_back(SkullOfGuldan(*_player));
  _player->trinkets.push_back(ShiftingNaaruSliver(*_player));
  ASSERT_EQ(_player->trinkets.size(), 2);

  _player->UseCooldowns();
  EXPECT_TRUE(_player->trinkets.at(0).is_active);
  EXPECT_EQ(_player->trinkets.at(1).cooldown_remaining, _player->trinkets.at(0).duration);

  _player->trinkets.at(0).Reset();
  _player->trinkets.at(1).cooldown_remaining = 5000;
  _player->UseCooldowns();
  EXPECT_TRUE(_player->trinkets.at(0).is_active);
  EXPECT_EQ(_player->trinkets.at(1).cooldown_remaining, 5000);
}

TEST_F(PlayerTest, UseCooldowns_Trinket_DoesNotShareCooldown) {
  _player->trinkets.push_back(SkullOfGuldan(*_player));
  _player->trinkets.push_back(ShiftingNaaruSliver(*_player));
  _player->trinkets.at(0).shares_cooldown = false;
  ASSERT_EQ(_player->trinkets.size(), 2);
  ASSERT_TRUE(_player->trinkets.at(1).shares_cooldown);

  _player->UseCooldowns();
  EXPECT_TRUE(_player->trinkets.at(0).is_active);
  EXPECT_TRUE(_player->trinkets.at(1).is_active);

  _player->trinkets.at(0).Reset();
  _player->trinkets.at(0).shares_cooldown = true;
  _player->trinkets.at(1).shares_cooldown = false;
  _player->UseCooldowns();
  EXPECT_TRUE(_player->trinkets.at(0).is_active);
  EXPECT_TRUE(_player->trinkets.at(1).is_active);
}

TEST_F(PlayerTest, GetDamageModifier_T6_4PC) {
  _player->sets.t6 = 4;
  auto shadow_bolt = ShadowBolt(*_player);
  auto incinerate  = Incinerate(*_player);

  EXPECT_EQ(_player->spells.shadow_bolt->GetDamageModifier(), 1.06);
  EXPECT_EQ(_player->spells.incinerate->GetDamageModifier(), 1.06);
}

TEST_F(PlayerTest, GetDamageModifier_ShadowMastery) {
  auto shadow_bolt = ShadowBolt(*_player);

  _player->talents.shadow_mastery = 5;

  EXPECT_EQ(_player->spells.shadow_bolt->GetDamageModifier(), 1.1);
}

TEST_F(PlayerTest, GetDamageModifier_ShadowMastery_CurseOfDoom_ShouldNotApply) {
  const auto kCurseOfDoomDot = std::make_shared<CurseOfDoomDot>(*_player);
  auto curse_of_doom         = CurseOfDoom(*_player, nullptr, kCurseOfDoomDot);

  _player->talents.shadow_mastery = 5;

  EXPECT_EQ(_player->spells.curse_of_doom->GetDamageModifier(), 1.0);
}

TEST_F(PlayerTest, GetDamageModifier_ImprovedCurseOfAgony) {
  auto curse_of_agony_dot      = std::make_shared<CurseOfAgonyDot>(*_player);
  auto curse_of_agony          = CurseOfAgony(*_player, nullptr, curse_of_agony_dot);
  auto current_damage_modifier = _player->spells.curse_of_agony->GetDamageModifier();

  _player->talents.improved_curse_of_agony = 2;

  EXPECT_EQ(_player->spells.curse_of_agony->GetDamageModifier(), current_damage_modifier + 0.1);
}

TEST_F(PlayerTest, GetDamageModifier_Emberstorm) {
  auto fire_spell              = Spell(*_player);
  fire_spell.spell_school      = SpellSchool::kFire;
  auto current_damage_modifier = fire_spell.GetDamageModifier();

  _player->talents.emberstorm = 5;

  EXPECT_EQ(fire_spell.GetDamageModifier(), current_damage_modifier + 0.1);
}

TEST_F(PlayerTest, GetDamageModifier_Contagion) {
  auto curse_of_agony_dot                 = std::make_shared<CurseOfAgonyDot>(*_player);
  auto curse_of_agony                     = CurseOfAgony(*_player, nullptr, curse_of_agony_dot);
  auto corruption_dot                     = std::make_shared<CorruptionDot>(*_player);
  auto corruption                         = Corruption(*_player, nullptr, corruption_dot);
  auto seed_of_corruption                 = SeedOfCorruption(*_player);
  auto agony_current_damage_modifier      = _player->spells.curse_of_agony->GetDamageModifier();
  auto corruption_current_damage_modifier = _player->spells.curse_of_agony->GetDamageModifier();
  auto seed_current_damage_modifier       = _player->spells.curse_of_agony->GetDamageModifier();

  _player->talents.contagion = 5;

  EXPECT_EQ(_player->spells.curse_of_agony->GetDamageModifier(), agony_current_damage_modifier + 0.05);
  EXPECT_EQ(_player->spells.corruption->GetDamageModifier(), corruption_current_damage_modifier + 0.05);
  EXPECT_EQ(_player->spells.seed_of_corruption->GetDamageModifier(), seed_current_damage_modifier + 0.05);
}

TEST_F(PlayerTest, GetDamageModifier_ImprovedImmolate) {
  auto immolate_dot                  = std::make_shared<ImmolateDot>(*_player);
  auto immolate                      = Immolate(*_player, nullptr, immolate_dot);
  auto dot_current_damage_modifier   = _player->spells.immolate->GetDamageModifier();
  auto spell_current_damage_modifier = _player->spells.immolate->GetDamageModifier();

  _player->talents.emberstorm        = 5;
  _player->talents.improved_immolate = 5;

  EXPECT_EQ(_player->spells.immolate->GetDamageModifier(), dot_current_damage_modifier + 0.1);
  EXPECT_EQ(_player->spells.immolate->GetDamageModifier(), spell_current_damage_modifier + 0.35);
}

TEST_F(PlayerTest, Tick_Trinkets) {
  _player->trinkets.push_back(SkullOfGuldan(*_player));
  _player->trinkets.push_back(ShiftingNaaruSliver(*_player));

  for (auto& trinket : _player->trinkets) {
    trinket.cooldown_remaining = 50;
  }

  _player->Tick(20);

  for (const auto& kTrinket : _player->trinkets) {
    EXPECT_EQ(kTrinket.cooldown_remaining, 30);
  }
}

TEST_F(PlayerTest, Tick_MP5) {
  _player->stats.mp5  = 30;
  _player->stats.mana = 0;
  ASSERT_TRUE(_player->stats.max_mana > 30);
  ASSERT_EQ(_player->mp5_timer_remaining, 5);

  _player->Tick(1);
  EXPECT_EQ(_player->mp5_timer_remaining, 4);
  _player->Tick(4);

  EXPECT_EQ(_player->mp5_timer_remaining, 5);
  EXPECT_EQ(static_cast<int>(_player->stats.mana), 30);
  EXPECT_EQ(_player->combat_log_breakdown.at(WarlockSimulatorConstants::kMp5)->casts, 1);
  EXPECT_EQ(static_cast<int>(_player->combat_log_breakdown.at(WarlockSimulatorConstants::kMp5)->iteration_mana_gain),
            30);
}

TEST_F(PlayerTest, Tick_MP5_ManaOvercapping) {
  _player->stats.mp5  = 30;
  _player->stats.mana = _player->stats.max_mana - 10;

  _player->Tick(5);

  EXPECT_EQ(_player->stats.mana, _player->stats.max_mana);
  EXPECT_EQ(_player->combat_log_breakdown.at(WarlockSimulatorConstants::kMp5)->iteration_mana_gain, 10);
}

TEST_F(PlayerTest, Tick_MP5_Innervate) {}
