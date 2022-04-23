#include "pch.h"
#include "test_base.h"
#include "../WarlockSimulatorWOTLK/include/stat.h"
#include "../WarlockSimulatorWOTLK/include/trinket.h"
#include "../WarlockSimulatorWOTLK/include/player.h"
#include "../WarlockSimulatorWOTLK/include/simulation.h"
#include "../WarlockSimulatorWOTLK/include/spell.h"

class SpellTest : public ::testing::Test {
 protected:
  std::shared_ptr<Player> _player;
  std::shared_ptr<Simulation> _simulation;

  void SetUp() override {
    _player = std::make_shared<Player>(TestBase::SetUpPlayer());
    _simulation = std::make_shared<Simulation>(TestBase::SetUpSimulation(_player));

    _player->Initialize(_simulation.get());
  }
};

TEST_F(SpellTest, ShadowBolt) {
  EXPECT_NE(_player->spells.shadow_bolt, nullptr);

  _player->spells.shadow_bolt->StartCast();
  EXPECT_EQ(_player->cast_time_remaining, 3);

  _player->spells.shadow_bolt->casting = false;
  _player->cast_time_remaining = 0;

  _player->spells.shadow_bolt->Cast();
  // EXPECT_EQ(_player->stats.mana, _player->stats.max_mana - 420);
}
