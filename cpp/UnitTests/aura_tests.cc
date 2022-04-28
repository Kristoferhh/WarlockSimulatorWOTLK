// clang-format off
#include "pch.h"
// clang-format on
#include "../WarlockSimulatorWOTLK/include/aura.h"
#include "../WarlockSimulatorWOTLK/include/aura_selection.h"
#include "../WarlockSimulatorWOTLK/include/combat_log_breakdown.h"
#include "../WarlockSimulatorWOTLK/include/item_slot.h"
#include "../WarlockSimulatorWOTLK/include/player.h"
#include "../WarlockSimulatorWOTLK/include/player_settings.h"
#include "../WarlockSimulatorWOTLK/include/sets.h"
#include "../WarlockSimulatorWOTLK/include/simulation.h"
#include "../WarlockSimulatorWOTLK/include/simulation_settings.h"
#include "../WarlockSimulatorWOTLK/include/stat.h"
#include "../WarlockSimulatorWOTLK/include/talents.h"
#include "../WarlockSimulatorWOTLK/include/trinket.h"
#include "test_base.h"

class AuraTest : public ::testing::Test {
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
  std::unique_ptr<Aura> _aura;

  AuraTest() {
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
    _aura       = std::make_unique<Aura>(*_player);
    _aura->name = "Dummy Aura";
    _aura->Setup();
  }
};

TEST_F(AuraTest, Tick_HasDuration) {
  _aura->duration = 10;
  _aura->Apply();
  ASSERT_EQ(_aura->duration_remaining, 10);

  _aura->Tick(3);
  EXPECT_EQ(_aura->duration_remaining, 7);

  _aura->Tick(7);
  EXPECT_FALSE(_aura->active);
  EXPECT_EQ(_aura->duration_remaining, 0);
}

TEST_F(AuraTest, Tick_DoesNotHaveDuration) {
  _aura->has_duration = false;
  _aura->Apply();

  _aura->Tick(99999);
  EXPECT_TRUE(_aura->active);
}

TEST_F(AuraTest, Apply) {
  const auto kStat = SpellPower(_aura->entity, 500);
  _aura->stats.push_back(kStat);
  _aura->stats_per_stack.push_back(kStat);
  _aura->duration                              = 20;
  _aura->max_stacks                            = 5;
  _aura->entity.simulation->current_fight_time = 50;

  _aura->Apply();
  EXPECT_TRUE(_aura->active);
  EXPECT_EQ(_aura->entity.stats.spell_power, 1000);
  EXPECT_EQ(_aura->entity.combat_log_breakdown.at(_aura->name)->applied_at,
            _aura->entity.simulation->current_fight_time);
  EXPECT_EQ(_aura->entity.combat_log_breakdown.at(_aura->name)->count, 1);
  EXPECT_EQ(_aura->duration_remaining, 20);

  for (int i = 0; i < 5; i++) { _aura->Apply(); }

  EXPECT_EQ(_aura->entity.combat_log_breakdown.at(_aura->name)->count, 6);
  EXPECT_EQ(_aura->entity.stats.spell_power, 3000);
}

TEST_F(AuraTest, Fade) {
  const auto kStat = SpellPower(_aura->entity, 500);
  _aura->stats.push_back(kStat);
  _aura->stats_per_stack.push_back(kStat);
  _aura->duration                              = 20;
  _aura->max_stacks                            = 5;
  _aura->entity.simulation->current_fight_time = 50;
  _aura->Apply();

  _aura->Fade();
  EXPECT_FALSE(_aura->active);
  EXPECT_EQ(_aura->entity.stats.spell_power, 0);
  EXPECT_EQ(
      _aura->entity.combat_log_breakdown.at(_aura->name)->uptime,
      _aura->entity.simulation->current_fight_time - _aura->entity.combat_log_breakdown.at(_aura->name)->applied_at);
}

TEST_F(AuraTest, Setup) {
  auto aura = Aura(*_player);
  aura.name = "Test";

  aura.Setup();
  EXPECT_NE(aura.entity.combat_log_breakdown.find("Test"), aura.entity.combat_log_breakdown.end());
  EXPECT_NE(std::find_if(aura.entity.aura_list.begin(), aura.entity.aura_list.end(),
                         [&aura](const Aura* aura_ptr) { return aura_ptr->name == aura.name; }),
            aura.entity.aura_list.end());
}
