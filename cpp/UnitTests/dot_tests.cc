// clang-format off
#include "pch.h"
// clang-format on
#include "../WarlockSimulatorWOTLK/include/aura.h"
#include "../WarlockSimulatorWOTLK/include/aura_selection.h"
#include "../WarlockSimulatorWOTLK/include/combat_log_breakdown.h"
#include "../WarlockSimulatorWOTLK/include/damage_over_time.h"
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

class DotTest : public ::testing::Test {
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

  DotTest() {
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
  }
};

TEST_F(DotTest, CorruptionConstructor) {
  const auto kCorruption = CorruptionDot(*_player);
  EXPECT_EQ(kCorruption.original_duration, 18);
  EXPECT_EQ(kCorruption.original_tick_timer_total, 3);
  EXPECT_FALSE(kCorruption.is_active);
  EXPECT_EQ(kCorruption.duration, 18);
  EXPECT_EQ(kCorruption.name, "Corruption");
  EXPECT_EQ(kCorruption.school, SpellSchool::kShadow);
  EXPECT_FALSE(kCorruption.should_reset_duration_on_next_tick);
  EXPECT_EQ(kCorruption.tick_timer_total, 3);
  EXPECT_EQ(kCorruption.ticks_total, 6);
}
