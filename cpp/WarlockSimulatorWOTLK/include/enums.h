#pragma once

#include <string>

enum class SpellSchool { kNoSchool, kShadow, kFire };

enum class SpellType { kNoSpellType, kAffliction, kDestruction };

enum class PetName { kNoName, kImp, kVoidwalker, kSuccubus, kFelhunter, kFelguard };

enum class PetType { kNoPetType, kMelee, kRanged };

enum class PetMode { kNoMode, kPassive, kAggressive };

enum class AttackType { kNoAttackType, kPhysical, kMagical };

enum class SimulationType { kNormal, kAllItems, kStatWeights };

enum class CalculationType { kNoType, kAdditive, kMultiplicative };

enum class EntityType { kNoType, kPlayer, kPet };

namespace PetNameStr {
const std::string kImp      = "Imp";
const std::string kSuccubus = "Succubus";
const std::string kFelguard = "Felguard";
}  // namespace PetNameStr

namespace SpellName {
const std::string kEmpoweredImp          = "Empowered Imp";
const std::string kSoulLeech             = "Soul Leech";
const std::string kBackdraft             = "Backdraft";
const std::string kImprovedSoulLeech     = "Improved Soul Leech";
const std::string kPyroclasm             = "Pyroclasm";
const std::string kImprovedShadowBolt    = "Improved Shadow Bolt";
const std::string kShadowMastery         = "Shadow Mastery";
const std::string kDemonicPact           = "Demonic Pact";
const std::string kMetamorphosis         = "Metamorphosis";
const std::string kDecimation            = "Decimation";
const std::string kDemonicEmpowerment    = "Demonic Empowerment";
const std::string kMoltenCore            = "Molten Core";
const std::string kEradication           = "Eradication";
const std::string kShadowEmbrace         = "Shadow Embrace";
const std::string kShadowBolt            = "Shadow Bolt";
const std::string kChaosBolt             = "Chaos Bolt";
const std::string kLifeTap               = "Life Tap";
const std::string kIncinerate            = "Incinerate";
const std::string kSearingPain           = "Searing Pain";
const std::string kCorruption            = "Corruption";
const std::string kImmolate              = "Immolate";
const std::string kUnstableAffliction    = "Unstable Affliction";
const std::string kSiphonLife            = "Siphon Life";
const std::string kHaunt                 = "Haunt";
const std::string kCurseOfDoom           = "Curse of Doom";
const std::string kCurseOfAgony          = "Curse of Agony";
const std::string kCurseOfTheElements    = "Curse of the Elements";
const std::string kSoulFire              = "Soul Fire";
const std::string kShadowburn            = "Shadowburn";
const std::string kDeathCoil             = "Death Coil";
const std::string kShadowfury            = "Shadowfury";
const std::string kSeedOfCorruption      = "Seed of Corruption";
const std::string kHellfire              = "Hellfire";
const std::string kRainOfFire            = "Rain of Fire";
const std::string kConflagrate           = "Conflagrate";
const std::string kFlameCap              = "Flame Cap";
const std::string kBloodFury             = "Blood Fury";
const std::string kBloodlust             = "Bloodlust";
const std::string kTheLightningCapacitor = "The Lightning Capacitor";
const std::string kPowerInfusion         = "Power Infusion";
const std::string kInnervate             = "Innervate";
const std::string kNightfall             = "Nightfall";
const std::string kManaTideTotem         = "Mana Tide Totem";
const std::string kJudgementOfWisdom     = "Judgement of Wisdom";
const std::string kDarkPact              = "Dark Pact";
const std::string kDemonicRune           = "Demonic Rune";
const std::string kFirebolt              = "Firebolt";
const std::string kDemonicFrenzy         = "Demonic Frenzy";
const std::string kLashOfPain            = "Lash of Pain";
const std::string kMelee                 = "Melee";
const std::string kCleave                = "Cleave";
const std::string kBlackBook             = "The Black Book";
const std::string kShadowflame           = "Shadowflame";
const std::string kDrainSoul             = "Drain Soul";
const std::string kRunicManaPotion       = "Runic Mana Potion";
}  // namespace SpellName

namespace StatName {
const std::string kDamageModifier      = "Damage Modifier";
const std::string kSpellPower          = "Spell Power";
const std::string kShadowPower         = "Shadow Power";
const std::string kFirePower           = "Fire Power";
const std::string kSpellHasteRating    = "Spell Haste Rating";
const std::string kSpellHastePercent   = "Spell Haste Percent";
const std::string kMeleeHastePercent   = "Melee Haste Percent";
const std::string kManaCostModifier    = "Mana Cost Modifier";
const std::string kSpellCritChance     = "Spell Crit Chance";
const std::string kSpellCritRating     = "Spell Crit Rating";
const std::string kAttackPower         = "Attack Power";
const std::string kMp5                 = "Mp5";
const std::string kAttackPowerModifier = "Attack Power Modifier";
}  // namespace StatName

namespace StatConstant {
constexpr double kHitRatingPerPercent    = 12.62;
constexpr double kCritRatingPerPercent   = 22.08;
constexpr double kHasteRatingPerPercent  = 15.77;
constexpr double kManaPerIntellect       = 15;
constexpr double kHealthPerStamina       = 10;
constexpr double kCritChancePerIntellect = 1 / 166.6;
constexpr double kBaseCritChancePercent  = 1.70458;
// Source: Fierywind from Warlock discord and maybe Fight Club discord
constexpr double kMeleeCritChanceSuppression = 4.73;
constexpr double kBaseEnemyDodgeChance       = 6.5;
}  // namespace StatConstant

namespace ItemId {
constexpr int kShiftingNaaruSliver   = 34429;
constexpr int kSkullOfGuldan         = 32483;
constexpr int kTheLightningCapacitor = 28785;
}  // namespace ItemId
