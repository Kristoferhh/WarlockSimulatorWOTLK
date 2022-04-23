#pragma once
#include <string>
#include <vector>

struct Stat;
struct Player;

struct Trinket {
  Player& player;
  std::vector<Stat> stats;
  int duration = 0;
  double duration_remaining = 0;
  int cooldown = 0;
  double cooldown_remaining = 0;
  bool active = false;
  bool shares_cooldown = true;
  std::string name;

  explicit Trinket(Player& player);
  [[nodiscard]] bool Ready() const;
  void Reset();
  void Setup();
  void Use();
  void Fade();
  void Tick(double kTime);
};

struct ShiftingNaaruSliver : Trinket {
  explicit ShiftingNaaruSliver(Player& player);
};

struct SkullOfGuldan : Trinket {
  explicit SkullOfGuldan(Player& player);
};
