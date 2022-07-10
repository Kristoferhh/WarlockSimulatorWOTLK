#pragma once
#include <string>
#include <vector>

struct Stat;
struct Player;

struct Trinket {
  Player& player;
  std::vector<Stat> stats;
  int duration              = 0;
  double duration_remaining = 0;
  int cooldown              = 0;
  double cooldown_remaining = 0;
  bool is_active            = false;
  bool shares_cooldown      = true;
  std::string name;

  explicit Trinket(Player& player_param);
  [[nodiscard]] bool Ready() const;
  void Reset();
  void Setup();
  void Use();
  void Fade();
  void Tick(double kTime);
};

struct ShiftingNaaruSliver : Trinket {
  explicit ShiftingNaaruSliver(Player& player_param);
};

struct SkullOfGuldan : Trinket {
  explicit SkullOfGuldan(Player& player_param);
};

struct TomeOfArcanePhenomena : Trinket {
  explicit TomeOfArcanePhenomena(Player& player_param);
};

struct ForgeEmber : Trinket {
  explicit ForgeEmber(Player& player_param);
};

struct WingedTalisman : Trinket {
  explicit WingedTalisman(Player& player_param);
};

struct MarkOfTheWarPrisoner : Trinket {
  explicit MarkOfTheWarPrisoner(Player& player_param);
};

struct MendicantsCharm : Trinket {
  explicit MendicantsCharm(Player& player_param);
};

struct InsigniaOfBloodyFire : Trinket {
  explicit InsigniaOfBloodyFire(Player& player_param);
};

struct FuturesightRune : Trinket {
  explicit FuturesightRune(Player& player_param);
};

struct RuneOfFiniteVariation : Trinket {
  explicit RuneOfFiniteVariation(Player& player_param);
};

struct RuneOfInfinitePower : Trinket {
  explicit RuneOfInfinitePower(Player& player_param);
};

struct SpiritWordGlass : Trinket {
  explicit SpiritWordGlass(Player& player_param);
};

struct BadgeOfTheInfiltrator : Trinket {
  explicit BadgeOfTheInfiltrator(Player& player_param);
};

struct SpiritistsFocus : Trinket {
  explicit SpiritistsFocus(Player& player_param);
};

struct FigurineTwilightSerpent : Trinket {
  explicit FigurineTwilightSerpent(Player& player_param);
};

struct ThornyRoseBrooch : Trinket {
  explicit ThornyRoseBrooch(Player& player_param);
};

struct SoftlyGlowingOrb : Trinket {
  explicit SoftlyGlowingOrb(Player& player_param);
};

struct LivingFlame : Trinket {
  explicit LivingFlame(Player& player_param);
};

struct EnergySiphon : Trinket {
  explicit EnergySiphon(Player& player_param);
};

struct ScaleOfFates : Trinket {
  explicit ScaleOfFates(Player& player_param);
};

struct PlatinumDisksOfSorcery : Trinket {
  explicit PlatinumDisksOfSorcery(Player& player_param);
};

struct PlatinumDisksOfSwiftness : Trinket {
  explicit PlatinumDisksOfSwiftness(Player& player_param);
};

struct ShardOfTheCrystalHeart : Trinket {
  explicit ShardOfTheCrystalHeart(Player& player_param);
};

struct TalismanOfResurgence : Trinket {
  explicit TalismanOfResurgence(Player& player_param);
};

struct EphemeralSnowflake : Trinket {
  explicit EphemeralSnowflake(Player& player_param);
};

struct MaghiasMisguidedQuill : Trinket {
  explicit MaghiasMisguidedQuill(Player& player_param);
};
