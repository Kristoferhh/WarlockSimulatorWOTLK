#include "../include/bindings.h"

#include <iostream>

#include "../include/aura_selection.h"
#include "../include/common.h"
#include "../include/item_slot.h"
#include "../include/player_settings.h"
#include "../include/sets.h"
#include "../include/simulation.h"
#include "../include/stat.h"
#include "../include/talents.h"
#include "../include/trinket.h"

#pragma warning(disable : 4100)
void DpsUpdate(double dps) {
#ifdef EMSCRIPTEN
  EM_ASM({postMessage({event : "dpsUpdate", data : {dps : $0}})}, dps);
#endif
}

void ErrorCallback(const char* error_msg) {
#ifdef EMSCRIPTEN
  EM_ASM({postMessage({event : "errorCallback", data : {errorMsg : UTF8ToString($0)}})}, error_msg);
#endif
}

void PostCombatLogBreakdownVector(const char* name, double mana_gain, double damage) {
#ifdef EMSCRIPTEN
  EM_ASM(
      {
          postMessage({event : "combatLogVector", data : {name : UTF8ToString($0), manaGain : $1, damage : $2}}
          )
  },
      name, mana_gain, damage);
#endif
}

void PostCombatLogBreakdown(const char* name, uint32_t casts, uint32_t crits, uint32_t misses, uint32_t count,
                            double uptime_in_seconds, uint32_t dodges, uint32_t glancing_blows) {
#ifdef EMSCRIPTEN
  EM_ASM(
      {
          postMessage({
                       event : "combatLogBreakdown",
                       data : {
              name : UTF8ToString($0),
              casts : $1,
              crits : $2,
              misses : $3,
              count : $4,
              uptime_in_seconds : $5,
              dodges : $6,
              glancingBlows : $7,
              damage : 0,
              manaGain : 0
            }
          }
          )
  },
      name, casts, crits, misses, count, uptime_in_seconds, dodges, glancing_blows);
#endif
}

void CombatLogUpdate(const char* combat_log_entry) {
#ifdef EMSCRIPTEN
  EM_ASM({postMessage({event : "combatLogUpdate", data : {combatLogEntry : UTF8ToString($0)}})}, combat_log_entry);
#else
  std::cout << combat_log_entry << std::endl;
#endif
}

void SimulationUpdate(int iteration, int iteration_amount, double median_dps, int item_id, const char* custom_stat) {
#ifdef EMSCRIPTEN
  EM_ASM(
      {
          postMessage({
                       event : "update",
                       data : {medianDps : $0, iteration : $1, iterationAmount : $2, itemId : $3, customStat : UTF8ToString($4)}
          }
          )
  },
      median_dps, iteration, iteration_amount, item_id, custom_stat);
#else
  /*std::cout << "Iteration: " << std::to_string(iteration) << "/" << std::to_string(iteration_amount)
            << ". Median DPS: " << std::to_string(median_dps) << std::endl;*/
#endif
}

void SendSimulationResults(double median_dps, double min_dps, double max_dps, int item_id, int iteration_amount,
                           int total_fight_duration, const char* custom_stat, long long simulation_duration) {
#ifdef EMSCRIPTEN
  EM_ASM(
      {
          postMessage({
                       event : "end",
                       data : {
              medianDps : $0,
              minDps : $1,
              maxDps : $2,
              itemId : $3,
              iterationAmount : $4,
              totalDuration : $5,
              customStat : UTF8ToString($6)
            }
          }
          )
  },
      median_dps, min_dps, max_dps, item_id, iteration_amount, total_fight_duration, custom_stat);
#else
  std::cout << "Median DPS: " << std::to_string(median_dps) << ". Min DPS: " << std::to_string(min_dps)
            << ". Max DPS: " << std::to_string(max_dps) << std::endl;
  std::cout << std::to_string(iteration_amount) << " iterations in "
            << DoubleToString(round(simulation_duration / 1000) / 1000, 3) << " seconds" << std::endl;
#endif
}

std::vector<uint32_t> AllocRandomSeeds(const int kAmountOfSeeds, const uint32_t kRandSeed) {
  srand(kRandSeed);
  std::vector<uint32_t> seeds(kAmountOfSeeds);

  for (int i = 0; i < kAmountOfSeeds; i++) { seeds[i] = rand(); }

  return seeds;
}

ItemSlot AllocItems() {
  return {};
}

AuraSelection AllocAuras() {
  return {};
}

Talents AllocTalents() {
  return {};
}

Sets AllocSets() {
  return {};
}

CharacterStats AllocStats() {
  return {};
}

PlayerSettings AllocPlayerSettings(AuraSelection& auras, Talents& talents, Sets& sets, CharacterStats& stats,
                                   ItemSlot& items) {
  return {auras, talents, sets, stats, items};
}

Player AllocPlayer(PlayerSettings& settings) {
  return Player(settings);
}

SimulationSettings AllocSimSettings() {
  return {};
}

Simulation AllocSim(Player& player, SimulationSettings& simulation_settings) {
  return {player, simulation_settings};
}

std::string GetExceptionMessage(const intptr_t kExceptionPtr) {
  return {reinterpret_cast<std::exception*>(kExceptionPtr)->what()};
}

#ifdef EMSCRIPTEN
EMSCRIPTEN_BINDINGS(module) {
  emscripten::class_<Player>("Player").constructor<PlayerSettings&>();

  emscripten::class_<Simulation>("Simulation")
      .constructor<Player&, SimulationSettings&>()
      .function("start", &Simulation::Start);

  emscripten::class_<ItemSlot>("ItemSlot")
      .property("head", &ItemSlot::head)
      .property("neck", &ItemSlot::neck)
      .property("shoulders", &ItemSlot::shoulders)
      .property("back", &ItemSlot::back)
      .property("chest", &ItemSlot::chest)
      .property("wrist", &ItemSlot::wrist)
      .property("hands", &ItemSlot::hands)
      .property("waist", &ItemSlot::waist)
      .property("legs", &ItemSlot::legs)
      .property("feet", &ItemSlot::feet)
      .property("finger1", &ItemSlot::finger_1)
      .property("finger2", &ItemSlot::finger_2)
      .property("trinket1", &ItemSlot::trinket_1)
      .property("trinket2", &ItemSlot::trinket_2)
      .property("weapon", &ItemSlot::weapon)
      .property("offhand", &ItemSlot::off_hand)
      .property("wand", &ItemSlot::wand);

  emscripten::class_<AuraSelection>("Auras")
      .constructor<>()
      .property("felArmor", &AuraSelection::fel_armor)
      .property("judgementOfWisdom", &AuraSelection::judgement_of_wisdom)
      .property("manaSpringTotem", &AuraSelection::mana_spring_totem)
      .property("wrathOfAirTotem", &AuraSelection::wrath_of_air_totem)
      .property("totemOfWrath", &AuraSelection::totem_of_wrath)
      .property("markOfTheWild", &AuraSelection::mark_of_the_wild)
      .property("prayerOfSpirit", &AuraSelection::prayer_of_spirit)
      .property("bloodPact", &AuraSelection::blood_pact)
      .property("inspiringPresence", &AuraSelection::inspiring_presence)
      .property("moonkinAura", &AuraSelection::moonkin_aura)
      .property("powerInfusion", &AuraSelection::power_infusion)
      .property("bloodlust", &AuraSelection::bloodlust)
      .property("ferociousInspiration", &AuraSelection::ferocious_inspiration)
      .property("innervate", &AuraSelection::innervate)
      .property("manaTideTotem", &AuraSelection::mana_tide_totem)
      .property("curseOfTheElements", &AuraSelection::curse_of_the_elements)
      .property("shadowWeaving", &AuraSelection::shadow_weaving)
      .property("improvedScorch", &AuraSelection::improved_scorch)
      .property("misery", &AuraSelection::misery)
      .property("vampiricTouch", &AuraSelection::vampiric_touch)
      .property("faerieFire", &AuraSelection::faerie_fire)
      .property("sunderArmor", &AuraSelection::sunder_armor)
      .property("exposeArmor", &AuraSelection::expose_armor)
      .property("bloodFrenzy", &AuraSelection::blood_frenzy)
      .property("exposeWeakness", &AuraSelection::expose_weakness)
      .property("annihilator", &AuraSelection::annihilator)
      .property("improvedHuntersMark", &AuraSelection::improved_hunters_mark)
      .property("demonicRune", &AuraSelection::demonic_rune)
      .property("flameCap", &AuraSelection::flame_cap)
      .property("petBlessingOfKings", &AuraSelection::pet_blessing_of_kings)
      .property("petBlessingOfWisdom", &AuraSelection::pet_blessing_of_wisdom)
      .property("petBlessingOfMight", &AuraSelection::pet_blessing_of_might)
      .property("petArcaneIntellect", &AuraSelection::pet_arcane_intellect)
      .property("petMarkOfTheWild", &AuraSelection::pet_mark_of_the_wild)
      .property("petPrayerOfFortitude", &AuraSelection::pet_prayer_of_fortitude)
      .property("petPrayerOfSpirit", &AuraSelection::pet_prayer_of_spirit)
      .property("petKiblersBits", &AuraSelection::pet_kiblers_bits)
      .property("petHeroicPresence", &AuraSelection::pet_heroic_presence)
      .property("petStrengthOfEarthTotem", &AuraSelection::pet_strength_of_earth_totem)
      .property("petBattleShout", &AuraSelection::pet_battle_shout)
      .property("petTrueshotAura", &AuraSelection::pet_trueshot_aura)
      .property("petLeaderOfThePack", &AuraSelection::pet_leader_of_the_pack)
      .property("petUnleashedRage", &AuraSelection::pet_unleashed_rage)
      .property("petStaminaScroll", &AuraSelection::pet_stamina_scroll)
      .property("petIntellectScroll", &AuraSelection::pet_intellect_scroll)
      .property("petStrengthScroll", &AuraSelection::pet_strength_scroll)
      .property("petAgilityScroll", &AuraSelection::pet_agility_scroll)
      .property("petSpiritScroll", &AuraSelection::pet_spirit_scroll);

  emscripten::class_<CharacterStats>("CharacterStats")
      .constructor<>()
      .property("health", &CharacterStats::health)
      .property("mana", &CharacterStats::mana)
      .property("stamina", &CharacterStats::stamina)
      .property("intellect", &CharacterStats::intellect)
      .property("spirit", &CharacterStats::spirit)
      .property("spellPower", &CharacterStats::spell_power)
      .property("shadowPower", &CharacterStats::shadow_power)
      .property("firePower", &CharacterStats::fire_power)
      .property("hasteRating", &CharacterStats::spell_haste_rating)
      .property("hastePercent", &CharacterStats::spell_haste_percent)
      .property("hitRating", &CharacterStats::spell_hit_rating)
      .property("critRating", &CharacterStats::spell_crit_rating)
      .property("critChance", &CharacterStats::spell_crit_chance)
      .property("mp5", &CharacterStats::mp5)
      .property("manaCostModifier", &CharacterStats::mana_cost_modifier)
      .property("spellPenetration", &CharacterStats::spell_penetration)
      .property("fireModifier", &CharacterStats::fire_modifier)
      .property("shadowModifier", &CharacterStats::shadow_modifier)
      .property("staminaModifier", &CharacterStats::stamina_modifier)
      .property("intellectModifier", &CharacterStats::intellect_modifier)
      .property("spiritModifier", &CharacterStats::spirit_modifier);

  emscripten::class_<Talents>("Talents")
      .constructor<>()
      .property("improvedCurseOfAgony", &Talents::improved_curse_of_agony)
      .property("suppression", &Talents::suppression)
      .property("improvedCorruption", &Talents::improved_corruption)
      .property("improvedLifeTap", &Talents::improved_life_tap)
      .property("amplifyCurse", &Talents::amplify_curse)
      .property("nightfall", &Talents::nightfall)
      .property("empoweredCorruption", &Talents::empowered_corruption)
      .property("shadowEmbrace", &Talents::shadow_embrace)
      .property("siphonLife", &Talents::siphon_life)
      .property("improvedFelhunter", &Talents::improved_felhunter)
      .property("shadowMastery", &Talents::shadow_mastery)
      .property("eradication", &Talents::eradication)
      .property("contagion", &Talents::contagion)
      .property("darkPact", &Talents::dark_pact)
      .property("malediction", &Talents::malediction)
      .property("deathsEmbrace", &Talents::deaths_embrace)
      .property("unstableAffliction", &Talents::unstable_affliction)
      .property("pandemic", &Talents::pandemic)
      .property("everlastingAffliction", &Talents::everlasting_affliction)
      .property("haunt", &Talents::haunt)
      .property("improvedImp", &Talents::improved_imp)
      .property("demonicEmbrace", &Talents::demonic_embrace)
      .property("demonicBrutality", &Talents::demonic_brutality)
      .property("felVitality", &Talents::fel_vitality)
      .property("demonicAegis", &Talents::demonic_aegis)
      .property("unholyPower", &Talents::unholy_power)
      .property("manaFeed", &Talents::mana_feed)
      .property("masterConjuror", &Talents::master_conjuror)
      .property("masterDemonologist", &Talents::master_demonologist)
      .property("moltenCore", &Talents::molten_core)
      .property("demonicEmpowerment", &Talents::demonic_empowerment)
      .property("demonicKnowledge", &Talents::demonic_knowledge)
      .property("demonicTactics", &Talents::demonic_tactics)
      .property("decimation", &Talents::decimation)
      .property("improvedDemonicTactics", &Talents::improved_demonic_tactics)
      .property("summonFelguard", &Talents::summon_felguard)
      .property("nemesis", &Talents::nemesis)
      .property("demonicPact", &Talents::demonic_pact)
      .property("metamorphosis", &Talents::metamorphosis)
      .property("improvedShadowBolt", &Talents::improved_shadow_bolt)
      .property("bane", &Talents::bane)
      .property("aftermath", &Talents::aftermath)
      .property("cataclysm", &Talents::cataclysm)
      .property("demonicPower", &Talents::demonic_power)
      .property("shadowburn", &Talents::shadowburn)
      .property("ruin", &Talents::ruin)
      .property("improvedSearingPain", &Talents::improved_searing_pain)
      .property("backlash", &Talents::backlash)
      .property("improvedImmolate", &Talents::improved_immolate)
      .property("devastation", &Talents::devastation)
      .property("emberstorm", &Talents::emberstorm)
      .property("conflagrate", &Talents::conflagrate)
      .property("pyroclasm", &Talents::pyroclasm)
      .property("shadowAndFlame", &Talents::shadow_and_flame)
      .property("improvedSoulLeech", &Talents::improved_soul_leech)
      .property("backdraft", &Talents::backdraft)
      .property("shadowfury", &Talents::shadowfury)
      .property("empoweredImp", &Talents::empowered_imp)
      .property("fireAndBrimstone", &Talents::fire_and_brimstone)
      .property("chaosBolt", &Talents::chaos_bolt);

  emscripten::class_<Sets>("Sets").constructor<>().property("t6", &Sets::t6);

  emscripten::class_<PlayerSettings>("PlayerSettings")
      .constructor<AuraSelection&, Talents&, Sets&, CharacterStats&, ItemSlot&>()
      .property("randomSeeds", &PlayerSettings::random_seeds)
      .property("itemId", &PlayerSettings::item_id)
      .property("metaGemId", &PlayerSettings::meta_gem_id)
      .property("equippedItemSimulation", &PlayerSettings::equipped_item_simulation)
      .property("recordingCombatLogBreakdown", &PlayerSettings::recording_combat_log_breakdown)
      .property("customStat", &PlayerSettings::custom_stat)
      .property("enemyLevel", &PlayerSettings::enemy_level)
      .property("enemyShadowResist", &PlayerSettings::enemy_shadow_resist)
      .property("enemyFireResist", &PlayerSettings::enemy_fire_resist)
      .property("selectedPet", &PlayerSettings::selected_pet)
      .property("ferociousInspirationAmount", &PlayerSettings::ferocious_inspiration_amount)
      .property("usingCustomIsbUptime", &PlayerSettings::using_custom_isb_uptime)
      .property("customIsbUptimeValue", &PlayerSettings::custom_isb_uptime_value)
      .property("improvedImp", &PlayerSettings::improved_imp)
      .property("fightType", &PlayerSettings::fight_type)
      .property("enemyAmount", &PlayerSettings::enemy_amount)
      .property("race", &PlayerSettings::race)
      .property("powerInfusionAmount", &PlayerSettings::power_infusion_amount)
      .property("innervateAmount", &PlayerSettings::innervate_amount)
      .property("enemyArmor", &PlayerSettings::enemy_armor)
      .property("exposeWeaknessUptime", &PlayerSettings::expose_weakness_uptime)
      .property("improvedFaerieFire", &PlayerSettings::improved_faerie_fire)
      .property("infinitePlayerMana", &PlayerSettings::infinite_player_mana)
      .property("infinitePetMana", &PlayerSettings::infinite_pet_mana)
      .property("lashOfPainUsage", &PlayerSettings::lash_of_pain_usage)
      .property("petMode", &PlayerSettings::pet_mode)
      .property("prepopBlackBook", &PlayerSettings::prepop_black_book)
      .property("randomizeValues", &PlayerSettings::randomize_values)
      .property("rotationOption", &PlayerSettings::rotation_option)
      .property("survivalHunterAgility", &PlayerSettings::survival_hunter_agility)
      .property("hasImmolate", &PlayerSettings::has_immolate)
      .property("hasCorruption", &PlayerSettings::has_corruption)
      .property("hasUnstableAffliction", &PlayerSettings::has_unstable_affliction)
      .property("hasHaunt", &PlayerSettings::has_haunt)
      .property("hasSearingPain", &PlayerSettings::has_searing_pain)
      .property("hasShadowBolt", &PlayerSettings::has_shadow_bolt)
      .property("hasIncinerate", &PlayerSettings::has_incinerate)
      .property("hasSeedOfCorruption", &PlayerSettings::has_seed_of_corruption)
      .property("hasHellfire", &PlayerSettings::has_hellfire)
      .property("hasRainOfFire", &PlayerSettings::has_rain_of_fire)
      .property("hasCurseOfTheElements", &PlayerSettings::has_curse_of_the_elements)
      .property("hasCurseOfAgony", &PlayerSettings::has_curse_of_agony)
      .property("hasCurseOfDoom", &PlayerSettings::has_curse_of_doom)
      .property("hasDeathCoil", &PlayerSettings::has_death_coil)
      .property("hasShadowburn", &PlayerSettings::has_shadow_burn)
      .property("hasConflagrate", &PlayerSettings::has_conflagrate)
      .property("hasShadowfury", &PlayerSettings::has_shadowfury)
      .property("hasAmplifyCurse", &PlayerSettings::has_amplify_curse)
      .property("hasDarkPact", &PlayerSettings::has_dark_pact)
      .property("hasDrainSoul", &PlayerSettings::has_drain_soul);

  emscripten::class_<SimulationSettings>("SimulationSettings")
      .constructor<>()
      .property("iterations", &SimulationSettings::iterations)
      .property("minTime", &SimulationSettings::min_time)
      .property("maxTime", &SimulationSettings::max_time)
      .property("simulationType", &SimulationSettings::simulation_type);

  emscripten::enum_<SimulationType>("SimulationType")
      .value("normal", SimulationType::kNormal)
      .value("allItems", SimulationType::kAllItems)
      .value("statWeights", SimulationType::kStatWeights);

  emscripten::enum_<EmbindConstant>("EmbindConstant")
      .value("onCooldown", EmbindConstant::kOnCooldown)
      .value("singleTarget", EmbindConstant::kSingleTarget)
      .value("aoe", EmbindConstant::kAoe)
      .value("noIsb", EmbindConstant::kNoIsb)
      .value("human", EmbindConstant::kHuman)
      .value("gnome", EmbindConstant::kGnome)
      .value("orc", EmbindConstant::kOrc)
      .value("undead", EmbindConstant::kUndead)
      .value("bloodElf", EmbindConstant::kBloodElf)
      .value("simChooses", EmbindConstant::kSimChooses)
      .value("userChooses", EmbindConstant::kUserChooses)
      .value("stamina", EmbindConstant::kStamina)
      .value("intellect", EmbindConstant::kIntellect)
      .value("spirit", EmbindConstant::kSpirit)
      .value("spellPower", EmbindConstant::kSpellPower)
      .value("shadowPower", EmbindConstant::kShadowPower)
      .value("firePower", EmbindConstant::kFirePower)
      .value("hitRating", EmbindConstant::kHitRating)
      .value("critRating", EmbindConstant::kCritRating)
      .value("hasteRating", EmbindConstant::kHasteRating)
      .value("mp5", EmbindConstant::kMp5)
      .value("normal", EmbindConstant::kNormal)
      .value("imp", EmbindConstant::kImp)
      .value("succubus", EmbindConstant::kSuccubus)
      .value("felhunter", EmbindConstant::kFelhunter)
      .value("felguard", EmbindConstant::kFelguard)
      .value("passive", EmbindConstant::kPassive)
      .value("aggressive", EmbindConstant::kAggressive);

  emscripten::function("allocRandomSeeds", &AllocRandomSeeds);
  emscripten::function("allocItems", &AllocItems);
  emscripten::function("allocAuras", &AllocAuras);
  emscripten::function("allocTalents", &AllocTalents);
  emscripten::function("allocSets", &AllocSets);
  emscripten::function("allocStats", &AllocStats);
  emscripten::function("allocPlayerSettings", &AllocPlayerSettings);
  emscripten::function("allocPlayer", &AllocPlayer);
  emscripten::function("allocSimSettings", &AllocSimSettings);
  emscripten::function("allocSim", &AllocSim);
  emscripten::function("getExceptionMessage", &GetExceptionMessage);

  emscripten::register_vector<uint32_t>("vector<uint32_t>");
}
#endif

#pragma warning(default : 4100)
