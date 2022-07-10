#pragma once
#include <memory>
#include <string>

struct Spell;
struct Pet;
struct Stat;
struct Entity;
struct Player;
#include <vector>

struct Aura {
  virtual ~Aura() = default;
  Entity& entity;
  std::vector<Stat> stats;
  std::vector<Stat> stats_per_stack;
  std::string name;
  int duration                 = 0;
  double duration_remaining    = 0;
  bool is_active               = false;
  bool has_duration            = true;
  bool applies_with_max_stacks = false;
  bool group_wide              = false;  // true if it's an aura that applies to everyone in the group
  // (will apply to pets as well then)
  // dots
  int tick_timer_total        = 0;
  double tick_timer_remaining = 0;
  int ticks_remaining         = 0;
  int ticks_total             = 0;
  int stacks                  = 0;
  int max_stacks              = 0;
  // ISB
  double modifier = 1;
  // Bloodlust
  double haste_modifier = 0;

  explicit Aura(Entity& entity);
  virtual void Setup();
  virtual void Tick(double kTime);
  virtual void Apply();
  virtual void Fade();
  virtual void DecrementStacks();
  void IncrementStacks(int kStackAmount = 1);
};

struct CurseOfTheElementsAura final : Aura {
  explicit CurseOfTheElementsAura(Player& player);
};

struct ShadowTranceAura final : Aura {
  explicit ShadowTranceAura(Player& player);
};

struct PowerInfusionAura final : Aura {
  explicit PowerInfusionAura(Player& player);
};

struct FlameCapAura final : Aura {
  explicit FlameCapAura(Player& player);
};

struct BloodFuryAura final : Aura {
  explicit BloodFuryAura(Player& player);
};

struct BloodlustAura final : Aura {
  explicit BloodlustAura(Player& player);
};

struct TheLightningCapacitorAura final : Aura {
  explicit TheLightningCapacitorAura(Player& player);
};

struct InnervateAura final : Aura {
  explicit InnervateAura(Player& player);
};

struct DemonicFrenzyAura final : Aura {
  explicit DemonicFrenzyAura(Pet& pet);
};

struct BlackBookAura final : Aura {
  explicit BlackBookAura(Pet& pet);
};

struct HauntAura final : Aura {
  explicit HauntAura(Player& player);
};

struct ShadowEmbraceAura final : Aura {
  explicit ShadowEmbraceAura(Player& player);
};

struct EradicationAura final : Aura {
  explicit EradicationAura(Player& player);
};

struct MoltenCoreAura final : Aura {
  explicit MoltenCoreAura(Player& player);
};

struct DemonicEmpowermentAura final : Aura {
  explicit DemonicEmpowermentAura(Pet& pet);
};

struct DecimationAura final : Aura {
  explicit DecimationAura(Player& player);
};

struct DemonicPactAura final : Aura {
  explicit DemonicPactAura(Player& player);
};

struct MetamorphosisAura final : Aura {
  explicit MetamorphosisAura(Player& player);
};

struct ShadowMasteryAura final : Aura {
  explicit ShadowMasteryAura(Player& player);
};

struct PyroclasmAura final : Aura {
  explicit PyroclasmAura(Player& player);
};

struct ImprovedSoulLeechAura final : Aura {
  explicit ImprovedSoulLeechAura(Player& player);
  void Apply() override;
};

struct BackdraftAura final : Aura {
  explicit BackdraftAura(Player& player);
};

struct EmpoweredImpAura final : Aura {
  explicit EmpoweredImpAura(Player& player);
};

struct JeTzesBellAura final : Aura {
  explicit JeTzesBellAura(Player& player);
};

struct EmbraceOfTheSpiderAura final : Aura {
  explicit EmbraceOfTheSpiderAura(Player& player);
};

struct DyingCurseAura final : Aura {
  explicit DyingCurseAura(Player& player);
};

struct MajesticDragonFigurineAura final : Aura {
  explicit MajesticDragonFigurineAura(Player& player);
};

struct IllustrationOfTheDragonSoulAura final : Aura {
  explicit IllustrationOfTheDragonSoulAura(Player& player);
};

struct SundialOfTheExiledAura final : Aura {
  explicit SundialOfTheExiledAura(Player& player);
};

struct DarkmoonCardBerserkerAura final : Aura {
  explicit DarkmoonCardBerserkerAura(Player& player);
};

struct DarkmoonCardGreatnessAura final : Aura {
  explicit DarkmoonCardGreatnessAura(Player& player);
  void Apply() override;
};

struct FlowOfKnowledgeAura final : Aura {
  explicit FlowOfKnowledgeAura(Player& player);
};

struct JoustersFuryAura final : Aura {
  explicit JoustersFuryAura(Player& player);
};

struct EyeOfTheBroodmotherAura final : Aura {
  explicit EyeOfTheBroodmotherAura(Player& player);
};

struct PandorasPleaAura final : Aura {
  explicit PandorasPleaAura(Player& player);
};

struct FlareOfTheHeavensAura final : Aura {
  explicit FlareOfTheHeavensAura(Player& player);
};

struct ShowOfFaithAura final : Aura {
  explicit ShowOfFaithAura(Player& player);
};

struct ElementalFocusStoneAura final : Aura {
  explicit ElementalFocusStoneAura(Player& player);
};

struct SifsRemembranceAura final : Aura {
  explicit SifsRemembranceAura(Player& player);
};

struct MeteoriteCrystalAura final : Aura {
  explicit MeteoriteCrystalAura(Player& player);
  void Fade() override;
};

struct MeteoricInspirationAura final : Aura {
  explicit MeteoricInspirationAura(Player& player);
};

struct SolaceOfTheDefeatedAura final : Aura {
  explicit SolaceOfTheDefeatedAura(Player& player);
};

struct SolaceOfTheDefeatedHeroicAura final : Aura {
  explicit SolaceOfTheDefeatedHeroicAura(Player& player);
};

struct MoteOfFlameAura final : Aura {
  Spell& reign_of_the_unliving;

  explicit MoteOfFlameAura(Player& player, const std::shared_ptr<Spell>& kSpell);
  void Apply() override;
};

struct AbyssalRuneAura final : Aura {
  explicit AbyssalRuneAura(Player& player);
};

struct TalismanOfVolatilePowerAura final : Aura {
  explicit TalismanOfVolatilePowerAura(Player& player);
  void Fade() override;
};

struct VolatilePowerAura final : Aura {
  explicit VolatilePowerAura(Player& player);
};

struct VolatilePowerHeroicAura final : Aura {
  explicit VolatilePowerHeroicAura(Player& player);
};

struct MithrilPocketwatchAura final : Aura {
  explicit MithrilPocketwatchAura(Player& player);
};

struct NevermeltingIceCrystalAura final : Aura {
  explicit NevermeltingIceCrystalAura(Player& player);
};

struct MuradinsSpyglassAura final : Aura {
  explicit MuradinsSpyglassAura(Player& player);
};

struct MuradinsSpyglassHeroicAura final : Aura {
  explicit MuradinsSpyglassHeroicAura(Player& player);
};

struct DislodgedForeignObjectAura final : Aura {
  double additional_spell_power_timer;

  explicit DislodgedForeignObjectAura(Player& player, bool kIsHeroicVersion);
  void Apply() override;
  void Tick(double kTime) override;
};

struct PurifiedLunarDustAura final : Aura {
  explicit PurifiedLunarDustAura(Player& player);
};

struct PhylacteryOfTheNamelessLichAura final : Aura {
  explicit PhylacteryOfTheNamelessLichAura(Player& player);
};

struct PhylacteryOfTheNamelessLichHeroicAura final : Aura {
  explicit PhylacteryOfTheNamelessLichHeroicAura(Player& player);
};

struct CharredTwilightScaleAura final : Aura {
  explicit CharredTwilightScaleAura(Player& player);
};

struct CharredTwilightScaleHeroicAura final : Aura {
  explicit CharredTwilightScaleHeroicAura(Player& player);
};

struct SparkOfLifeAura final : Aura {
  explicit SparkOfLifeAura(Player& player);
};
