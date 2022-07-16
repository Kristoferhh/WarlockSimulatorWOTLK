#pragma once
#include <memory>
#include <string>
#include <vector>

#include "spell_cast_result.h"

struct Pet;
struct Player;
enum class SpellType;
enum class AttackType;
enum class SpellSchool;
struct DamageOverTime;
struct Aura;
struct Entity;

struct Spell {
  virtual ~Spell() = default;
  Entity& entity;
  std::shared_ptr<Aura> aura_effect;
  std::shared_ptr<DamageOverTime> dot_effect;
  std::vector<std::string> shared_cooldown_spells;
  SpellSchool spell_school;
  AttackType attack_type;
  SpellType spell_type;
  std::string name;
  int min_dmg                        = 0;
  int max_dmg                        = 0;
  double base_damage                 = 0;
  bool casting                       = false;
  bool can_crit                      = false;
  bool on_gcd                        = true;
  bool is_proc                       = false;
  bool limited_amount_of_casts       = false;
  bool is_non_warlock_ability        = false;
  double coefficient                 = 0;
  double cooldown_remaining          = 0;
  double cast_time                   = 0;
  double cooldown                    = 0;
  double mana_cost                   = 0;
  int min_mana_gain                  = 0;
  int max_mana_gain                  = 0;
  double mana_gain                   = 0;
  int amount_of_casts_per_fight      = 0;
  int amount_of_casts_this_fight     = 0;
  int proc_chance                    = 0;
  int bonus_damage_from_immolate_min = 0;
  int bonus_damage_from_immolate_max = 0;
  double bonus_damage_from_immolate  = 0;
  double bonus_crit_chance           = 0;
  double additive_modifier           = 1.0;
  double multiplicative_modifier     = 1.0;
  double bonus_hit_chance            = 0;
  double crit_damage_multiplier      = 1.5;
  bool does_damage                   = false;
  bool is_item                       = false;
  bool can_miss                      = false;
  bool is_finisher                   = false;
  bool gain_mana_on_cast             = false;
  bool procs_on_hit                  = false;
  bool on_hit_procs_enabled          = true;
  bool procs_on_crit                 = false;
  bool on_crit_procs_enabled         = true;
  bool procs_on_dot_ticks            = false;
  bool on_dot_tick_procs_enabled     = true;
  bool procs_on_damage               = false;
  bool on_damage_procs_enabled       = true;
  bool procs_on_resist               = false;
  bool on_resist_procs_enabled       = true;
  bool procs_on_cast                 = false;
  bool on_cast_procs_enabled         = true;
  bool is_harmful                    = false;
  bool is_damaging_spell             = false;

  explicit Spell(Entity& entity, std::shared_ptr<Aura> aura = nullptr, std::shared_ptr<DamageOverTime> dot = nullptr);
  virtual void Setup();
  virtual void Cast();
  virtual bool CanCast();
  virtual double GetBaseDamage();
  virtual void Reset();
  virtual double GetCastTime();
  virtual bool Ready();
  virtual void StartCast(double kPredictedDamage = 0);
  void OnCritProcs();
  void OnResistProcs();
  void OnDamageProcs();
  void OnHitProcs();
  void OnCastProcs();
  void Tick(double kTime);
  double PredictDamage();
  [[nodiscard]] bool HasEnoughMana() const;
  [[nodiscard]] double GetCritChance() const;
  [[nodiscard]] double GetHitChance() const;
  [[nodiscard]] double GetDamageModifier() const;
  [[nodiscard]] double GetPartialResistMultiplier() const;

 protected:
  [[nodiscard]] bool IsCrit() const;
  [[nodiscard]] bool IsHit() const;

 private:
  virtual double GetCooldown();
  virtual void Damage(bool kIsCrit = false, bool kIsGlancing = false);
  [[nodiscard]] double GetManaCost() const;
  virtual std::vector<double> GetConstantDamage();
  SpellCastResult MagicSpellCast();
  [[nodiscard]] SpellCastResult PhysicalSpellCast() const;
  void OnSpellHit(const SpellCastResult& kSpellCastResult);
  void CombatLogDamage(bool kIsCrit,
                       bool kIsGlancing,
                       double kTotalDamage,
                       double kSpellBaseDamage,
                       double kSpellPower,
                       double kCritMultiplier,
                       double kDamageModifier,
                       double kPartialResistMultiplier) const;
  void ManaGainOnCast() const;
};

struct ShadowBolt final : Spell {
  explicit ShadowBolt(Player& player);
  void StartCast(double predicted_damage) override;
  [[nodiscard]] double CalculateCastTime() const;
};

struct Incinerate final : Spell {
  explicit Incinerate(Player& player);
};

struct SearingPain final : Spell {
  explicit SearingPain(Player& player);
};

struct SoulFire final : Spell {
  explicit SoulFire(Player& player);
};

struct Shadowburn final : Spell {
  explicit Shadowburn(Player& player);
};

struct DeathCoil final : Spell {
  explicit DeathCoil(Player& player);
};

struct Shadowfury final : Spell {
  explicit Shadowfury(Player& player);
};

struct SeedOfCorruption final : Spell {
  explicit SeedOfCorruption(Player& player);
  double aoe_cap;
  void Damage(bool is_crit = false, bool is_glancing = false) override;
};

struct Corruption final : Spell {
  explicit Corruption(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot);
};

struct UnstableAffliction final : Spell {
  explicit UnstableAffliction(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot);
};

struct Haunt final : Spell {
  explicit Haunt(Player& player, std::shared_ptr<Aura> aura);
};

struct Immolate final : Spell {
  explicit Immolate(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot);
};

struct CurseOfAgony final : Spell {
  explicit CurseOfAgony(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot);
};

struct CurseOfTheElements final : Spell {
  explicit CurseOfTheElements(Player& player, std::shared_ptr<Aura> aura);
};

struct CurseOfDoom final : Spell {
  explicit CurseOfDoom(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot);
};

struct Conflagrate final : Spell {
  explicit Conflagrate(Player& player);
  void Cast() override;
  bool CanCast() override;
};

struct FlameCap final : Spell {
  explicit FlameCap(Player& player, std::shared_ptr<Aura> aura);
};

struct BloodFury final : Spell {
  explicit BloodFury(Player& player, std::shared_ptr<Aura> aura);
};

struct Bloodlust final : Spell {
  explicit Bloodlust(Player& player, std::shared_ptr<Aura> aura);
};

struct PowerInfusion final : Spell {
  explicit PowerInfusion(Player& player, std::shared_ptr<Aura> aura);
};

struct Innervate final : Spell {
  explicit Innervate(Player& player, std::shared_ptr<Aura> aura);
};

struct ManaTideTotem final : Spell {
  explicit ManaTideTotem(Player& player, std::shared_ptr<Aura> aura);
};

struct PetMelee final : Spell {
  explicit PetMelee(Pet& pet);
  double GetBaseDamage() override;
  double GetCooldown() override;
};

struct ImpFirebolt final : Spell {
  explicit ImpFirebolt(Pet& pet);
};

struct SuccubusLashOfPain final : Spell {
  explicit SuccubusLashOfPain(Pet& pet);
};

struct FelguardCleave final : Spell {
  explicit FelguardCleave(Pet& pet);
  double GetBaseDamage() override;
};

struct ChaosBolt final : Spell {
  explicit ChaosBolt(Player& player);
};

struct Shadowflame final : Spell {
  explicit Shadowflame(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot);
};

struct DrainSoul final : Spell {
  explicit DrainSoul(Player& player, std::shared_ptr<Aura> aura, std::shared_ptr<DamageOverTime> dot);
};

struct DemonicEmpowerment final : Spell {
  explicit DemonicEmpowerment(Player& player, std::shared_ptr<Aura> aura);
};

struct Metamorphosis final : Spell {
  explicit Metamorphosis(Player& player, std::shared_ptr<Aura> aura);
};

struct GnomishLightningGenerator final : Spell {
  explicit GnomishLightningGenerator(Player& player);
};

struct FigurineSapphireOwl final : Spell {
  explicit FigurineSapphireOwl(Player& player, std::shared_ptr<Aura> aura);
};

struct DarkmoonCardIllusion final : Spell {
  explicit DarkmoonCardIllusion(Player& player);
};

struct MeteoriteCrystal final : Spell {
  explicit MeteoriteCrystal(Player& player, std::shared_ptr<Aura> aura);
};

struct ReignOfTheUnliving final : Spell {
  explicit ReignOfTheUnliving(Player& player);
};

struct ReignOfTheUnlivingHeroic final : Spell {
  explicit ReignOfTheUnlivingHeroic(Player& player);
};

struct TalismanOfVolatilePower final : Spell {
  explicit TalismanOfVolatilePower(Player& player, std::shared_ptr<Aura> aura);
};

struct NevermeltingIceCrystal final : Spell {
  explicit NevermeltingIceCrystal(Player& player, std::shared_ptr<Aura> aura);
};

struct SliverOfPureIce final : Spell {
  explicit SliverOfPureIce(Player& player);
};

struct SliverOfPureIceHeroic final : Spell {
  explicit SliverOfPureIceHeroic(Player& player);
};
