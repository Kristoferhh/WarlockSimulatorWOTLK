import { TalentTree, Talent, TalentName, SpellId } from "../Types";

export interface TalentTreeStruct {
  Name: TalentTree;
  Rows: Talent[][];
}

export const Talents: TalentTreeStruct[] = [
  {
    Name: TalentTree.Affliction,
    Rows: [
      [
        {
          Name: TalentName.ImprovedCurseOfAgony,
          RankIds: [18827, 18829],
          IconName: "spell_shadow_curseofsargeras",
        },
        {
          Name: TalentName.Suppression,
          RankIds: [18174, 18175, 18176],
          IconName: "spell_shadow_unsummonbuilding",
        },
        {
          Name: TalentName.ImprovedCorruption,
          RankIds: [17810, 17811, 17812, 17813, 17814],
          IconName: "spell_shadow_abominationexplosion",
        },
      ],
      [
        {
          Name: TalentName.ImprovedCurseOfWeakness,
          RankIds: [18179, 18180],
          IconName: "spell_shadow_curseofmannoroth",
        },
        {
          Name: TalentName.ImprovedDrainSoul,
          RankIds: [18213, 18372],
          IconName: "spell_shadow_haunting",
        },
        {
          Name: TalentName.ImprovedLifeTap,
          RankIds: [18182, 18183],
          IconName: "spell_shadow_burningspirit",
        },
        {
          Name: TalentName.SoulSiphon,
          RankIds: [17804, 17805],
          IconName: "spell_shadow_lifedrain02",
        },
      ],
      [
        {
          Name: TalentName.ImprovedFear,
          RankIds: [53754, 53759],
          IconName: "spell_shadow_possession",
        },
        {
          Name: TalentName.FelConcentration,
          RankIds: [17783, 17784, 17785],
          IconName: "spell_shadow_fingerofdeath",
        },
        {
          Name: TalentName.AmplifyCurse,
          RankIds: [SpellId.AmplifyCurse],
          IconName: "spell_shadow_contagion",
        },
      ],
      [
        {
          Name: TalentName.GrimReach,
          RankIds: [18218, 18219],
          IconName: "spell_shadow_callofbone",
        },
        {
          Name: TalentName.Nightfall,
          RankIds: [18094, 18095],
          IconName: "spell_shadow_twilight",
        },
        {},
        {
          Name: TalentName.EmpoweredCorruption,
          RankIds: [32381, 32382, 32383],
          IconName: "spell_shadow_abominationexplosion",
        },
      ],
      [
        {
          Name: TalentName.ShadowEmbrance,
          RankIds: [32385, 32387, 32392, 32393, 32394],
          IconName: "spell_shadow_shadowembrace",
        },
        {
          Name: TalentName.SiphonLife,
          RankIds: [SpellId.SiphonLife],
          IconName: "spell_shadow_requiem",
        },
        {
          Name: TalentName.CurseOfExhaustion,
          RankIds: [18223],
          IconName: "spell_shadow_grimward",
          Requirement: { Name: TalentName.AmplifyCurse, Points: 1 },
        },
      ],
      [
        {
          Name: TalentName.ImprovedFelhunter,
          RankIds: [54037, 54038],
          IconName: "spell_shadow_summonfelhunter",
        },
        {
          Name: TalentName.ShadowMastery,
          RankIds: [18271, 18272, 18273, 18274, 18275],
          IconName: "spell_shadow_shadetruesight",
          Requirement: { Name: TalentName.SiphonLife, Points: 1 },
        },
      ],
      [
        {
          Name: TalentName.Eradication,
          RankIds: [47195, 47196, 47197],
          IconName: "ability_warlock_eradication",
        },
        {
          Name: TalentName.Contagion,
          RankIds: [30060, 30061, 30062, 30063, 30064],
          IconName: "spell_shadow_painfulafflictions",
        },
        {
          Name: TalentName.DarkPact,
          RankIds: [18220],
          IconName: "spell_shadow_darkritual",
        },
      ],
      [
        {
          Name: TalentName.ImprovedHowlOfTerror,
          RankIds: [30054, 30057],
          IconName: "spell_shadow_deathscream",
        },
        {},
        {
          Name: TalentName.Malediction,
          RankIds: [32477, 32483, 32484],
          IconName: "spell_shadow_curseofachimonde",
        },
      ],
      [
        {
          Name: TalentName.DeathsEmbrace,
          RankIds: [47198, 47199, 47200],
          IconName: "spell_shadow_deathsembrace",
        },
        {
          Name: TalentName.UnstableAffliction,
          RankIds: [SpellId.UnstableAffliction],
          IconName: "spell_shadow_unstableaffliction_3",
          Requirement: { Name: TalentName.Contagion, Points: 5 },
        },
        {
          Name: TalentName.Pandemic,
          RankIds: [58435],
          IconName: "spell_shadow_unstableaffliction_2",
          Requirement: { Name: TalentName.UnstableAffliction, Points: 1 },
        },
      ],
      [
        {},
        {
          Name: TalentName.EverlastingAffliction,
          RankIds: [47201, 47202, 47203, 47204, 47205],
          IconName: "ability_warlock_everlastingaffliction",
        },
      ],
      [
        {},
        {
          Name: TalentName.Haunt,
          RankIds: [SpellId.Haunt],
          IconName: "ability_warlock_haunt",
        },
      ],
    ],
  },
  {
    Name: TalentTree.Demonology,
    Rows: [
      [
        {
          Name: TalentName.ImprovedHealthstone,
          RankIds: [18692, 18693],
          IconName: "inv_stone_04",
        },
        {
          Name: TalentName.ImprovedImp,
          RankIds: [18694, 18695, 18696],
          IconName: "spell_shadow_summonimp",
        },
        {
          Name: TalentName.DemonicEmbrace,
          RankIds: [18697, 18698, 18699],
          IconName: "spell_shadow_metamorphosis",
        },
        {
          Name: TalentName.FelSynergy,
          RankIds: [47230, 47231],
          IconName: "spell_shadow_felmending",
        },
      ],
      [
        {
          Name: TalentName.ImprovedHealthFunnel,
          RankIds: [18703, 18704],
          IconName: "spell_shadow_lifedrain",
        },
        {
          Name: TalentName.DemonicBrutality,
          RankIds: [18705, 18706, 18707],
          IconName: "spell_shadow_summonvoidwalker",
        },
        {
          Name: TalentName.FelVitality,
          RankIds: [18731, 18743, 18744],
          IconName: "spell_holy_magicalsentry",
        },
      ],
      [
        {
          Name: TalentName.ImprovedSuccubus,
          RankIds: [18754, 18755, 18756],
          IconName: "spell_shadow_summonsuccubus",
        },
        {
          Name: TalentName.SoulLink,
          RankIds: [SpellId.SoulLink],
          IconName: "spell_shadow_gathershadows",
        },
        {
          Name: TalentName.FelDomination,
          RankIds: [18708],
          IconName: "spell_nature_removecurse",
        },
        {
          Name: TalentName.DemonicAegis,
          RankIds: [30143, 30144, 30145],
          IconName: "spell_shadow_ragingscream",
        },
      ],
      [
        {},
        {
          Name: TalentName.UnholyPower,
          RankIds: [18769, 18770, 18771, 18772, 18773],
          IconName: "spell_shadow_shadowworddominate",
          Requirement: { Name: TalentName.SoulLink, Points: 1 },
        },
        {
          Name: TalentName.MasterSummoner,
          RankIds: [18709, 18710],
          IconName: "spell_shadow_impphaseshift",
          Requirement: { Name: TalentName.FelDomination, Points: 1 },
        },
      ],
      [
        {
          Name: TalentName.ManaFeed,
          RankIds: [30326],
          IconName: "spell_shadow_manafeed",
          Requirement: { Name: TalentName.UnholyPower, Points: 5 },
        },
        {},
        {
          Name: TalentName.MasterConjuror,
          RankIds: [18767, 18768],
          IconName: "inv_ammo_firetar",
        },
      ],
      [
        {},
        {
          Name: TalentName.MasterDemonologist,
          RankIds: [23785, 23822, 23823, 23824, 23825],
          IconName: "spell_shadow_shadowpact",
          Requirement: { Name: TalentName.UnholyPower, Points: 5 },
        },
        {
          Name: TalentName.MoltenCore,
          RankIds: [47245, 47246, 47247],
          IconName: "ability_warlock_moltencore",
        },
      ],
      [
        {
          Name: TalentName.DemonicResilience,
          RankIds: [30319, 30320, 30321],
          IconName: "spell_shadow_demonicfortitude",
        },
        {
          Name: TalentName.DemonicEmpowerment,
          RankIds: [47193],
          IconName: "ability_warlock_demonicempowerment",
          Requirement: { Name: TalentName.MasterDemonologist, Points: 5 },
        },
        {
          Name: TalentName.DemonicKnowledge,
          RankIds: [35691, 35692, 35693],
          IconName: "spell_shadow_improvedvampiricembrace",
        },
      ],
      [
        {},
        {
          Name: TalentName.DemonicTactics,
          RankIds: [30242, 30245, 30246, 30247, 30248],
          IconName: "spell_shadow_demonictactics",
        },
        {
          Name: TalentName.Decimation,
          RankIds: [63156, 63158],
          IconName: "spell_fire_fireball02",
        },
      ],
      [
        {
          Name: TalentName.ImprovedDemonicTactics,
          RankIds: [54347, 54348, 54348],
          IconName: "ability_warlock_improveddemonictactics",
          Requirement: { Name: TalentName.DemonicTactics, Points: 5 },
        },
        {
          Name: TalentName.SummonFelguard,
          RankIds: [30146],
          IconName: "spell_shadow_summonfelguard",
        },
        {
          Name: TalentName.Nemesis,
          RankIds: [63117, 63121, 63123],
          IconName: "spell_shadow_demonicempathy",
        },
      ],
      [
        {},
        {
          Name: TalentName.DemonicPact,
          RankIds: [47236, 47237, 47238, 47239, 47240],
          IconName: "spell_shadow_demonicpact",
        },
      ],
      [
        {},
        {
          Name: TalentName.Metamorphosis,
          RankIds: [59672],
          IconName: "spell_shadow_demonform",
        },
      ],
    ],
  },
  {
    Name: TalentTree.Destruction,
    Rows: [
      [
        {},
        {
          Name: TalentName.ImprovedShadowBolt,
          RankIds: [17793, 17796, 17801, 17802, 17803],
          IconName: "spell_shadow_shadowbolt",
        },
        {
          Name: TalentName.Bane,
          RankIds: [17788, 17789, 17790, 17791, 17792],
          IconName: "spell_shadow_deathpact",
        },
      ],
      [
        {
          Name: TalentName.Aftermath,
          RankIds: [18119, 18120],
          IconName: "spell_fire_fire",
        },
        {
          Name: TalentName.MoltenSkin,
          RankIds: [63349, 63350, 63351],
          IconName: "ability_mage_moltenarmor",
        },
        {
          Name: TalentName.Cataclysm,
          RankIds: [17778, 17779, 17780],
          IconName: "spell_fire_windsofwoe",
        },
      ],
      [
        {
          Name: TalentName.DemonicPower,
          RankIds: [18126, 18127],
          IconName: "spell_fire_firebolt",
        },
        {
          Name: TalentName.Shadowburn,
          RankIds: [SpellId.Shadowburn],
          IconName: "spell_shadow_scourgebuild",
        },
        {
          Name: TalentName.Ruin,
          RankIds: [17959, 59738, 59739, 59740, 59741],
          IconName: "spell_shadow_shadowwordpain",
        },
      ],
      [
        {
          Name: TalentName.Intensity,
          RankIds: [18135, 18136],
          IconName: "spell_fire_lavaspawn",
        },
        {
          Name: TalentName.DestructiveReach,
          RankIds: [17917, 17918],
          IconName: "spell_shadow_corpseexplode",
        },
        {},
        {
          Name: TalentName.ImprovedSearingPain,
          RankIds: [17927, 17929, 17930],
          IconName: "spell_fire_soulburn",
        },
      ],
      [
        {
          Name: TalentName.Backlash,
          RankIds: [34935, 34938, 34939],
          IconName: "spell_fire_playingwithfire",
          Requirement: { Name: TalentName.Intensity, Points: 2 },
        },
        {
          Name: TalentName.ImprovedImmolate,
          RankIds: [17815, 17833, 17834],
          IconName: "spell_fire_immolation",
        },
        {
          Name: TalentName.Devastation,
          RankIds: [18130],
          IconName: "spell_fire_flameshock",
          Requirement: { Name: TalentName.Ruin, Points: 5 },
        },
      ],
      [
        {
          Name: TalentName.NetherProtection,
          RankIds: [30299, 30301, 30302],
          IconName: "spell_shadow_netherprotection",
        },
        {},
        {
          Name: TalentName.Emberstorm,
          RankIds: [17954, 17955, 17956, 17957, 17958],
          IconName: "spell_fire_selfdestruct",
        },
      ],
      [
        {},
        {
          Name: TalentName.Conflagrate,
          RankIds: [SpellId.Conflagrate],
          IconName: "spell_fire_fireball",
        },
        {
          Name: TalentName.SoulLeech,
          RankIds: [30293, 30295, 30296],
          IconName: "spell_shadow_soulleech_3",
        },
        {
          Name: TalentName.Pyroclasm,
          RankIds: [18096, 18073, 63245],
          IconName: "spell_fire_volcano",
        },
      ],
      [
        {},
        {
          Name: TalentName.ShadowAndFlame,
          RankIds: [30288, 30289, 30290, 30291, 30292],
          IconName: "spell_shadow_shadowandflame",
        },
        {
          Name: TalentName.ImprovedSoulLeech,
          RankIds: [54117, 54118],
          IconName: "ability_warlock_improvedsoulleech",
          Requirement: { Name: TalentName.SoulLeech, Points: 3 },
        },
      ],
      [
        {
          Name: TalentName.Backdraft,
          RankIds: [47258, 47259, 47260],
          IconName: "ability_warlock_backdraft",
          Requirement: { Name: TalentName.Conflagrate, Points: 1 },
        },
        {
          Name: TalentName.Shadowfury,
          RankIds: [SpellId.Shadowfury],
          IconName: "spell_shadow_shadowfury",
        },
        {
          Name: TalentName.EmpoweredImp,
          RankIds: [47220, 47221, 47223],
          IconName: "ability_warlock_empoweredimp",
        },
      ],
      [
        {},
        {
          Name: TalentName.FireAndBrimstone,
          RankIds: [47266, 47267, 47268, 47269, 47270],
          IconName: "ability_warlock_fireandbrimstone",
        },
      ],
      [
        {},
        {
          Name: TalentName.ChaosBolt,
          RankIds: [SpellId.ChaosBolt],
          IconName: "ability_warlock_chaosbolt",
        },
      ],
    ],
  },
];
