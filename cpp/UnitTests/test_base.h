#pragma once

struct PlayerSettings;
struct Player;
struct Simulation;
struct SimulationSettings;
struct AuraSelection;
struct Talents;
struct Sets;
struct CharacterStats;
struct ItemSlot;
struct SimulationSettings;
struct Spell;

struct TestBase {
  static Player SetUpPlayer(std::shared_ptr<PlayerSettings> player_settings = nullptr);
  static Simulation SetUpSimulation(std::shared_ptr<Player> player,
                                    std::shared_ptr<SimulationSettings> simulation_settings = nullptr);
  static PlayerSettings GetDefaultPlayerSettings(std::shared_ptr<AuraSelection> auras  = nullptr,
                                                 std::shared_ptr<Talents> talents      = nullptr,
                                                 std::shared_ptr<Sets> sets            = nullptr,
                                                 std::shared_ptr<CharacterStats> stats = nullptr,
                                                 std::shared_ptr<ItemSlot> items       = nullptr);
  static SimulationSettings GetDefaultSimulationSettings();
  static AuraSelection GetDefaultAuras();
  static Talents GetDefaultTalents();
  static Sets GetDefaultSets();
  static CharacterStats GetDefaultStats();
  static ItemSlot GetDefaultItems();
  static std::unique_ptr<Spell> CreateSpell();
};
