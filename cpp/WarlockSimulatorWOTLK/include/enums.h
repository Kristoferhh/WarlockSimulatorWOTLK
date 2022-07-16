#pragma once

#include <string>

enum class SpellSchool { kNoSchool, kShadow, kFire, kNature, kFrost, kArcane };

enum class SpellType { kNoSpellType, kAffliction, kDestruction };

enum class PetName { kNoName, kImp, kVoidwalker, kSuccubus, kFelhunter, kFelguard };

enum class PetType { kNoPetType, kMelee, kRanged };

enum class PetMode { kNoMode, kPassive, kAggressive };

enum class AttackType { kNoAttackType, kPhysical, kMagical };

enum class SimulationType { kNormal, kAllItems, kStatWeights };

enum class CalculationType { kNoType, kAdditive, kMultiplicative };

enum class EntityType { kNoType, kPlayer, kPet };

namespace WarlockSimulatorConstants {
const std::string kSpirit                = "Spirit";
const std::string kDamageModifier        = "Damage Modifier";
const std::string kSpellPower            = "Spell Power";
const std::string kShadowPower           = "Shadow Power";
const std::string kFirePower             = "Fire Power";
const std::string kSpellHasteRating      = "Spell Haste Rating";
const std::string kSpellHastePercent     = "Spell Haste Percent";
const std::string kMeleeHastePercent     = "Melee Haste Percent";
const std::string kManaCostModifier      = "Mana Cost Modifier";
const std::string kSpellCritChance       = "Spell Crit Chance";
const std::string kSpellCritRating       = "Spell Crit Rating";
const std::string kAttackPower           = "Attack Power";
const std::string kMp5                   = "Mp5";
const std::string kAttackPowerModifier   = "Attack Power Modifier";
constexpr double kHitRatingPerPercent    = 26.232;
constexpr double kCritRatingPerPercent   = 45.91;
constexpr double kHasteRatingPerPercent  = 32.79;
constexpr double kManaPerIntellect       = 15;
constexpr double kHealthPerStamina       = 10;
constexpr double kCritChancePerIntellect = 1 / 166.6;
constexpr double kBaseCritChancePercent  = 1.70458;
constexpr double kMeleeCritChanceSuppression =
    4.73;  // Source: Fierywind from Warlock discord and maybe Fight Club discord // TODO needs to be updated for WOTLK
constexpr double kBaseEnemyDodgeChance          = 6.5;  // TODO update for WOTLK
const std::string kImp                          = "Imp";
const std::string kSuccubus                     = "Succubus";
const std::string kFelguard                     = "Felguard";
const std::string kDyingCurse                   = "Dying Curse";
const std::string kEmbraceOfTheSpider           = "Embrace of the Spider";
const std::string kJeTzesBell                   = "Je'Tze's Bell";
const std::string kPendulumOfTelluricCurrents   = "Pendulum of Telluric Currents";
const std::string kEmpoweredImp                 = "Empowered Imp";
const std::string kSoulLeech                    = "Soul Leech";
const std::string kBackdraft                    = "Backdraft";
const std::string kImprovedSoulLeech            = "Improved Soul Leech";
const std::string kPyroclasm                    = "Pyroclasm";
const std::string kDemonicPact                  = "Demonic Pact";
const std::string kMetamorphosis                = "Metamorphosis";
const std::string kDecimation                   = "Decimation";
const std::string kDemonicEmpowerment           = "Demonic Empowerment";
const std::string kMoltenCore                   = "Molten Core";
const std::string kEradication                  = "Eradication";
const std::string kShadowEmbrace                = "Shadow Embrace";
const std::string kShadowBolt                   = "Shadow Bolt";
const std::string kChaosBolt                    = "Chaos Bolt";
const std::string kLifeTap                      = "Life Tap";
const std::string kIncinerate                   = "Incinerate";
const std::string kSearingPain                  = "Searing Pain";
const std::string kCorruption                   = "Corruption";
const std::string kImmolate                     = "Immolate";
const std::string kUnstableAffliction           = "Unstable Affliction";
const std::string kSiphonLife                   = "Siphon Life";
const std::string kHaunt                        = "Haunt";
const std::string kCurseOfDoom                  = "Curse of Doom";
const std::string kCurseOfAgony                 = "Curse of Agony";
const std::string kCurseOfTheElements           = "Curse of the Elements";
const std::string kSoulFire                     = "Soul Fire";
const std::string kShadowburn                   = "Shadowburn";
const std::string kDeathCoil                    = "Death Coil";
const std::string kShadowfury                   = "Shadowfury";
const std::string kSeedOfCorruption             = "Seed of Corruption";
const std::string kHellfire                     = "Hellfire";
const std::string kRainOfFire                   = "Rain of Fire";
const std::string kConflagrate                  = "Conflagrate";
const std::string kFlameCap                     = "Flame Cap";
const std::string kBloodFury                    = "Blood Fury";
const std::string kBloodlust                    = "Bloodlust";
const std::string kTheLightningCapacitor        = "The Lightning Capacitor";
const std::string kPowerInfusion                = "Power Infusion";
const std::string kInnervate                    = "Innervate";
const std::string kNightfall                    = "Nightfall";
const std::string kManaTideTotem                = "Mana Tide Totem";
const std::string kJudgementOfWisdom            = "Judgement of Wisdom";
const std::string kDarkPact                     = "Dark Pact";
const std::string kDemonicRune                  = "Demonic Rune";
const std::string kFirebolt                     = "Firebolt";
const std::string kDemonicFrenzy                = "Demonic Frenzy";
const std::string kLashOfPain                   = "Lash of Pain";
const std::string kMelee                        = "Melee";
const std::string kCleave                       = "Cleave";
const std::string kBlackBook                    = "The Black Book";
const std::string kShadowflame                  = "Shadowflame";
const std::string kDrainSoul                    = "Drain Soul";
const std::string kRunicManaPotion              = "Runic Mana Potion";
constexpr int kFigurineSapphireOwlTotalManaGain = 2340;
constexpr int GlyphOfCorruptionProcChance       = 4;
}  // namespace WarlockSimulatorConstants

namespace ItemId {
constexpr int kSparkOfLife                       = 37657;
constexpr int kCharredTwilightScaleHeroic        = 54588;
constexpr int kCharredTwilightScale              = 54572;
constexpr int kPhylacteryOfTheNamelessLichHeroic = 50365;
constexpr int kPhylacteryOfTheNamelessLich       = 50360;
constexpr int kPurifiedLunarDust                 = 50358;
constexpr int kMaghiasMisguidedQuill             = 50357;
constexpr int kDislodgedForeignObjectHeroic      = 50348;
constexpr int kDislodgedForeignObject            = 50353;
constexpr int kSliverOfPureIce                   = 50339;
constexpr int kSliverOfPureIceHeroic             = 50346;
constexpr int kEphemeralSnowflake                = 50260;
constexpr int kNevermeltingIceCrystal            = 50259;
constexpr int kMithrilPocketwatch                = 49076;
constexpr int kTalismanOfResurgence              = 48724;
constexpr int kShardOfTheCrystalHeart            = 48722;
constexpr int kFetishOfVolatilePowerHeroic       = 48018;
constexpr int kTalismanOfVolatilePowerHeroic     = 47946;
constexpr int kTalismanOfVolatilePower           = 47726;
constexpr int kFetishOfVolatilePower             = 47879;
constexpr int kAbyssalRune                       = 47213;
constexpr int kReignOfTheDead                    = 47316;
constexpr int kReignOfTheDeadHeroic              = 47477;
constexpr int kReignOfTheUnliving                = 47182;
constexpr int kReignOfTheUnlivingHeroic          = 47188;
constexpr int kSolaceOfTheFallen                 = 47271;
constexpr int kSolaceOfTheFallenHeroic           = 47432;
constexpr int kSolaceOfTheDefeated               = 47041;
constexpr int kSolaceOfTheDefeatedHeroic         = 47059;
constexpr int kPlatinumDisksOfSwiftness          = 46088;
constexpr int kPlatinumDisksOfSorcery            = 46087;
constexpr int kMeteoriteCrystal                  = 46051;
constexpr int kSifsRemembrance                   = 45929;
constexpr int kElementalFocusStone               = 45866;
constexpr int kSparkOfHope                       = 45703;
constexpr int kShowOfFaith                       = 45535;
constexpr int kFlareOfTheHeavens                 = 45518;
constexpr int kPandorasPlea                      = 45490;
constexpr int kScaleOfFates                      = 45466;
constexpr int kEyeOfTheBroodmother               = 45308;
constexpr int kEnergySiphon                      = 45292;
constexpr int kLivingFlame                       = 45148;
constexpr int kJoustersFuryAlliance              = 45131;
constexpr int kJoustersFuryHorde                 = 45219;
constexpr int kFlowOfKnowledge                   = 44912;
constexpr int kMercurialAlchemistsStone          = 44322;
constexpr int kDarkmoonCardGreatnessIntellect    = 44255;
constexpr int kDarkmoonCardGreatnessSpirit       = 44254;
constexpr int kSoftlyGlowingOrb                  = 43837;
constexpr int kThornyRoseBrooch                  = 43836;
constexpr int kDarkmoonCardDeath                 = 57352;
constexpr int kGnomishLightningGenerator         = 41121;
constexpr int kSundialOfTheExiled                = 60063;
constexpr int kIllustrationOfTheDragonSoul       = 40432;
constexpr int kMajesticDragonFigurine            = 40430;
constexpr int kSoulOfTheDead                     = 60537;
constexpr int kExtractOfNecromanticPower         = 60487;
constexpr int kDyingCurse                        = 40255;
constexpr int kSpiritistsFocus                   = 39821;
constexpr int kBadgeOfTheInfiltrator             = 39811;
constexpr int kSpiritWorldGlass                  = 39388;
constexpr int kEmbraceOfTheSpider                = 60490;
constexpr int kRuneOfInfinitePower               = 38765;
constexpr int kRuneOfFiniteVariation             = 38764;
constexpr int kFuturesightRune                   = 38763;
constexpr int kInsigniaOfBloodyFire              = 38762;
constexpr int kMendicantsCharm                   = 38760;
constexpr int kMarkOfTheWarPrisoner              = 37873;
constexpr int kWingedTalisman                    = 37844;
constexpr int kJeTzesBell                        = 37835;
constexpr int kForgeEmber                        = 37660;
constexpr int kPendulumOfTelluricCurrents        = 37264;
constexpr int kShiftingNaaruSliver               = 34429;
constexpr int kSkullOfGuldan                     = 32483;
constexpr int kTheLightningCapacitor             = 28785;
constexpr int kTomeOfArcanePhenomena             = 36972;
constexpr int kFigurineTwilightSerpent           = 42395;
constexpr int kFigurineSapphireOwl               = 42413;
constexpr int kDarkmoonCardIllusion              = 42988;
constexpr int kDarkmoonCardBerserker             = 42989;
}  // namespace ItemId

namespace GlyphId {
constexpr int kQuickDecay         = 70948;
constexpr int kLifeTap            = 63941;
constexpr int kHaunt              = 63930;
constexpr int kCurseOfAgony       = 56282;
constexpr int kCorruption         = 56271;
constexpr int kShadowBolt         = 56294;
constexpr int kUnstableAffliction = 56301;
constexpr int kFelguard           = 56285;
constexpr int kImmolate           = 56291;
constexpr int kImp                = 56292;
constexpr int kIncinerate         = 56268;
constexpr int kMetamorphosis      = 63932;
constexpr int kSearingPain        = 56293;
constexpr int kShadowburn         = 56295;
constexpr int kChaosBolt          = 63933;
constexpr int kConflagrate        = 56270;
}  // namespace GlyphId
