#pragma once
#include <map>
#include <memory>
#include <vector>

struct Spell;
struct SimulationSettings;
struct Player;

struct Simulation {
  Player& player;
  const SimulationSettings& kSettings;
  std::vector<double> dps_vector;
  int iteration                 = 0;
  double current_fight_time     = 0;
  double iteration_fight_length = 0;
  double fight_time_remaining   = 0;
  double min_dps                = 0;
  double max_dps                = 0;

  Simulation(Player& player, const SimulationSettings& kSimulationSettings);
  void Start();
  void IterationReset();
  void CastNonPlayerCooldowns() const;
  void CastNonGcdSpells() const;
  void CastGcdSpells() const;
  void CastPetSpells() const;
  void IterationEnd();
  void SimulationEnd(long long kSimulationDuration) const;
  double PassTime();
  void Tick(double kTime);
  void SelectedSpellHandler(const std::shared_ptr<Spell>& kSpell,
                            std::map<std::shared_ptr<Spell>, double>& predicted_damage_of_spells) const;
  void CastSelectedSpell(const std::shared_ptr<Spell>& kSpell, double kPredictedDamage = 0) const;
};
