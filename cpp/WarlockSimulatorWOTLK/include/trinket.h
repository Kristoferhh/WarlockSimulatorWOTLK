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

struct TomeOfArcanePhenomena : Trinket {
  explicit TomeOfArcanePhenomena(Player& player);
};

struct ForgeEmber : Trinket {
  explicit ForgeEmber(Player& player);
};

struct WingedTalisman : Trinket {
  explicit WingedTalisman(Player& player);
};

struct MarkOfTheWarPrisoner : Trinket {
  explicit MarkOfTheWarPrisoner(Player& player);
};

struct MendicantsCharm : Trinket {
  explicit MendicantsCharm(Player& player);
};

struct InsigniaOfBloodyFire : Trinket {
  explicit InsigniaOfBloodyFire(Player& player);
};

struct FuturesightRune : Trinket {
  explicit FuturesightRune(Player& player);
};

struct RuneOfFiniteVariation : Trinket {
  explicit RuneOfFiniteVariation(Player& player);
};

struct RuneOfInfinitePower : Trinket {
  explicit RuneOfInfinitePower(Player& player);
};

struct SpiritWorldGlass : Trinket {
  explicit SpiritWorldGlass(Player& player);
};

struct BadgeOfTheInfiltrator : Trinket {
  explicit BadgeOfTheInfiltrator(Player& player);
};

struct SpiritistsFocus : Trinket {
  explicit SpiritistsFocus(Player& player);
};

struct FigurineTwilightSerpent : Trinket {
  explicit FigurineTwilightSerpent(Player& player);
};

struct ThornyRoseBrooch : Trinket {
  explicit ThornyRoseBrooch(Player& player);
};

struct SoftlyGlowingOrb : Trinket {
  explicit SoftlyGlowingOrb(Player& player);
};

struct LivingFlame : Trinket {
  explicit LivingFlame(Player& player);
};

struct EnergySiphon : Trinket {
  explicit EnergySiphon(Player& player);
};

struct ScaleOfFates : Trinket {
  explicit ScaleOfFates(Player& player);
};

struct PlatinumDisksOfSorcery : Trinket {
  explicit PlatinumDisksOfSorcery(Player& player);
};

struct PlatinumDisksOfSwiftness : Trinket {
  explicit PlatinumDisksOfSwiftness(Player& player);
};

struct ShardOfTheCrystalHeart : Trinket {
  explicit ShardOfTheCrystalHeart(Player& player);
};

struct TalismanOfResurgence : Trinket {
  explicit TalismanOfResurgence(Player& player);
};

struct EphemeralSnowflake : Trinket {
  explicit EphemeralSnowflake(Player& player);
};

struct MaghiasMisguidedQuill : Trinket {
  explicit MaghiasMisguidedQuill(Player& player);
};
