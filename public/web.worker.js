// eslint-disable-next-line no-undef
importScripts('./WarlockSim.js')

onmessage = event => {
  fetch('./WarlockSim.wasm')
    .then(response => response.arrayBuffer())
    // eslint-disable-next-line no-undef
    .then(binary => WarlockSim({ wasmBinary: binary }))
    .then(w => w.ready)
    .then(module => {
      try {
        const playerData = event.data.PlayerSettings
        const simulationData = event.data.SimulationSettings

        const items = module.allocItems()
        items.head = parseInt(playerData.Items.Head)
        items.neck = parseInt(playerData.Items.Neck)
        items.shoulders = parseInt(playerData.Items.Shoulders)
        items.back = parseInt(playerData.Items.Back)
        items.chest = parseInt(playerData.Items.Chest)
        items.wrist = parseInt(playerData.Items.Wrist)
        items.hands = parseInt(playerData.Items.Hands)
        items.waist = parseInt(playerData.Items.Waist)
        items.legs = parseInt(playerData.Items.Legs)
        items.feet = parseInt(playerData.Items.Feet)
        items.finger1 = parseInt(playerData.Items.Finger1)
        items.finger2 = parseInt(playerData.Items.Finger2)
        items.trinket1 = parseInt(playerData.Items.Trinket1)
        items.trinket2 = parseInt(playerData.Items.Trinket2)
        items.weapon = parseInt(playerData.Items.Weapon)
        items.offhand = parseInt(playerData.Items.OffHand)
        items.wand = parseInt(playerData.Items.Wand)

        // TODO for the love of god make this file use TypeScript
        const auras = module.allocAuras()
        auras.felArmor = playerData.Auras.includes(47893)
        auras.judgementOfWisdom = playerData.Auras.includes(20354)
        auras.manaSpringTotem = playerData.Auras.includes(25570)
        auras.wrathOfAirTotem = playerData.Auras.includes(3738)
        auras.totemOfWrath = playerData.Auras.includes(30706)
        auras.markOfTheWild = playerData.Auras.includes(26990)
        auras.prayerOfSpirit = playerData.Auras.includes(32999)
        auras.bloodPact = playerData.Auras.includes(27268)
        auras.inspiringPresence = playerData.Auras.includes(28878)
        auras.moonkinAura = playerData.Auras.includes(24907)
        auras.powerInfusion = playerData.Auras.includes(10060)
        auras.bloodlust = playerData.Auras.includes(2825)
        auras.ferociousInspiration = playerData.Auras.includes(34460)
        auras.innervate = playerData.Auras.includes(29166)
        auras.manaTideTotem = playerData.Auras.includes(16190)
        auras.curseOfTheElements = playerData.Auras.includes(27228)
        auras.shadowWeaving = playerData.Auras.includes(15334)
        auras.improvedScorch = playerData.Auras.includes(12873)
        auras.misery = playerData.Auras.includes(33195)
        auras.vampiricTouch = playerData.Auras.includes(48160)
        auras.faerieFire = playerData.Auras.includes(26993)
        auras.sunderArmor = playerData.Auras.includes(25225)
        auras.exposeArmor = playerData.Auras.includes(26866)
        auras.curseOfRecklessness = playerData.Auras.includes(27226)
        auras.bloodFrenzy = playerData.Auras.includes(29859)
        auras.exposeWeakness = playerData.Auras.includes(34503)
        auras.annihilator = playerData.Auras.includes(16928)
        auras.improvedHuntersMark = playerData.Auras.includes(19425)
        auras.demonicRune = playerData.Auras.includes(12662)
        auras.flameCap = playerData.Auras.includes(22788)
        auras.petBlessingOfKings = playerData.Auras.includes(25898)
        auras.petBlessingOfWisdom = playerData.Auras.includes(27143)
        auras.petBlessingOfMight = playerData.Auras.includes(27141)
        auras.petArcaneIntellect = playerData.Auras.includes(27127)
        auras.petMarkOfTheWild = playerData.Auras.includes(26990)
        auras.petPrayerOfFortitude = playerData.Auras.includes(25392)
        auras.petPrayerOfSpirit = playerData.Auras.includes(32999)
        auras.petKiblersBits = playerData.Auras.includes(43771)
        auras.petHeroicPresence = playerData.Auras.includes(6562)
        auras.petStrengthOfEarthTotem = playerData.Auras.includes(25528)
        auras.petBattleShout = playerData.Auras.includes(2048)
        auras.petTrueshotAura = playerData.Auras.includes(31519)
        auras.petLeaderOfThePack = playerData.Auras.includes(17007)
        auras.petUnleashedRage = playerData.Auras.includes(30811)
        auras.petStaminaScroll = playerData.Auras.includes(33081)
        auras.petIntellectScroll = playerData.Auras.includes(33078)
        auras.petStrengthScroll = playerData.Auras.includes(33082)
        auras.petAgilityScroll = playerData.Auras.includes(33077)
        auras.petSpiritScroll = playerData.Auras.includes(33080)

        const talents = module.allocTalents()
        talents.improvedCurseOfAgony = parseInt(
          playerData.Talents['Improved Curse of Agony']
        )
        talents.suppression = parseInt(playerData.Talents.Suppression)
        talents.improvedCorruption = parseInt(
          playerData.Talents['Improved Corruption']
        )
        talents.improvedLifeTap = parseInt(
          playerData.Talents['Improved Life Tap']
        )
        talents.amplifyCurse = parseInt(playerData.Talents['Amplify Curse'])
        talents.nightfall = parseInt(playerData.Talents.Nightfall)
        talents.empoweredCorruption = parseInt(
          playerData.Talents['Empowered Corruption']
        )
        talents.shadowEmbrace = parseInt(playerData.Talents['Shadow Embrace'])
        talents.siphonLife = parseInt(playerData.Talents['Siphon Life'])
        talents.improvedFelhunter = parseInt(
          playerData.Talents['Improved Felhunter']
        )
        talents.shadowMastery = parseInt(playerData.Talents['Shadow Mastery'])
        talents.eradication = parseInt(playerData.Talents.Eradication)
        talents.contagion = parseInt(playerData.Talents.Contagion)
        talents.darkPact = parseInt(playerData.Talents['Dark Pact'])
        talents.malediction = parseInt(playerData.Talents.Malediction)
        talents.deathsEmbrace = parseInt(playerData.Talents[`Death's Embrace`])
        talents.unstableAffliction = parseInt(
          playerData.Talents['Unstable Affliction']
        )
        talents.pandemic = parseInt(playerData.Talents.Pandemic)
        talents.everlastingAffliction = parseInt(
          playerData.Talents['Everlasting Affliction']
        )
        talents.haunt = parseInt(playerData.Talents.Haunt)
        talents.improvedImp = parseInt(playerData.Talents['Improved Imp'])
        talents.demonicEmbrace = parseInt(playerData.Talents['Demonic Embrace'])
        talents.demonicBrutality = parseInt(
          playerData.Talents['Demonic Brutality']
        )
        talents.felVitality = parseInt(playerData.Talents['Fel Vitality'])
        talents.demonicAegis = parseInt(playerData.Talents['Demonic Aegis'])
        talents.unholyPower = parseInt(playerData.Talents['Unholy Power'])
        talents.manaFeed = parseInt(playerData.Talents['Mana Feed'])
        talents.masterConjuror = parseInt(playerData.Talents['Master Conjuror'])
        talents.masterDemonologist = parseInt(
          playerData.Talents['Master Demonologist']
        )
        talents.moltenCore = parseInt(playerData.Talents['Molten Core'])
        talents.demonicEmpowerment = parseInt(
          playerData.Talents['Demonic Empowerment']
        )
        talents.demonicKnowledge = parseInt(
          playerData.Talents['Demonic Knowledge']
        )
        talents.demonicTactics = parseInt(playerData.Talents['Demonic Tactics'])
        talents.decimation = parseInt(playerData.Talents.Decimation)
        talents.improvedDemonicTactics = parseInt(
          playerData.Talents['Improved Demonic Tactics']
        )
        talents.summonFelguard = parseInt(playerData.Talents['Summon Felguard'])
        talents.nemesis = parseInt(playerData.Talents.Nemesis)
        talents.demonicPact = parseInt(playerData.Talents['Demonic Pact'])
        talents.metamorphosis = parseInt(playerData.Talents.Metamorphosis)
        talents.improvedShadowBolt = parseInt(
          playerData.Talents['Improved Shadow Bolt']
        )
        talents.bane = parseInt(playerData.Talents.Bane)
        talents.aftermath = parseInt(playerData.Talents.Aftermath)
        talents.cataclysm = parseInt(playerData.Talents.Cataclysm)
        talents.demonicPower = parseInt(playerData.Talents['Demonic Power'])
        talents.shadowburn = parseInt(playerData.Talents.Shadowburn)
        talents.ruin = parseInt(playerData.Talents.Ruin)
        talents.improvedSearingPain = parseInt(
          playerData.Talents['Improved Searing Pain']
        )
        talents.backlash = parseInt(playerData.Talents.Backlash)
        talents.improvedImmolate = parseInt(
          playerData.Talents['Improved Immolate']
        )
        talents.devastation = parseInt(playerData.Talents.Devastation)
        talents.emberstorm = parseInt(playerData.Talents.Emberstorm)
        talents.conflagrate = parseInt(playerData.Talents.Conflagrate)
        talents.pyroclasm = parseInt(playerData.Talents.Pyroclasm)
        talents.shadowAndFlame = parseInt(
          playerData.Talents['Shadow and Flame']
        )
        talents.improvedSoulLeech = parseInt(
          playerData.Talents['Improved Soul Leech']
        )
        talents.backdraft = parseInt(playerData.Talents.Backdraft)
        talents.shadowfury = parseInt(playerData.Talents.Shadowfury)
        talents.empoweredImp = parseInt(playerData.Talents['Empowered Imp'])
        talents.fireAndBrimstone = parseInt(
          playerData.Talents['Fire and Brimstone']
        )
        talents.chaosBolt = parseInt(playerData.Talents['Chaos Bolt'])

        const sets = module.allocSets()
        sets.t6 = parseInt(playerData.Sets['670']) || 0

        const stats = module.allocStats()
        stats.health = parseFloat(playerData.Stats.Health)
        stats.mana = parseFloat(playerData.Stats.Mana)
        stats.stamina = parseFloat(playerData.Stats.Stamina)
        stats.intellect = parseFloat(playerData.Stats.Intellect)
        stats.spirit = parseFloat(playerData.Stats.Spirit)
        stats.spellPower = parseFloat(playerData.Stats.SpellPower)
        stats.shadowPower = parseFloat(playerData.Stats.ShadowPower)
        stats.firePower = parseFloat(playerData.Stats.FirePower)
        stats.hasteRating = parseFloat(playerData.Stats.HasteRating)
        stats.hitRating = parseFloat(playerData.Stats.HitRating)
        stats.critRating = parseFloat(playerData.Stats.CritRating)
        stats.critChance = 0
        stats.mp5 = parseFloat(playerData.Stats.Mp5)
        stats.manaCostModifier = 1
        stats.spellPenetration = parseFloat(playerData.Stats.SpellPenetration)
        stats.fireModifier = parseFloat(playerData.Stats.FireModifier)
        stats.shadowModifier = parseFloat(playerData.Stats.ShadowModifier)
        stats.staminaModifier = parseFloat(playerData.Stats.StaminaModifier)
        stats.intellectModifier = parseFloat(playerData.Stats.IntellectModifier)
        stats.spiritModifier = parseFloat(playerData.Stats.SpiritModifier)

        const playerSettings = module.allocPlayerSettings(
          auras,
          talents,
          sets,
          stats,
          items
        )
        playerSettings.randomSeeds = module.allocRandomSeeds(
          simulationData.Iterations,
          event.data.RandomSeed
        )
        playerSettings.itemId = parseInt(event.data.ItemId)
        playerSettings.metaGemId = parseInt(playerData.MetaGemId)
        playerSettings.equippedItemSimulation =
          event.data.EquippedItemSimulation === true
        playerSettings.recordingCombatLogBreakdown =
          playerData.Settings.automaticallyOpenSimDetails === 'yes'
        playerSettings.customStat = module.EmbindConstant[event.data.CustomStat]
        playerSettings.enemyLevel = parseInt(playerData.Settings.targetLevel)
        playerSettings.enemyShadowResist = parseInt(
          playerData.Settings.targetShadowResistance
        )
        playerSettings.enemyFireResist = parseInt(
          playerData.Settings.targetFireResistance
        )
        if (playerData.Settings.petChoice === 'Imp') {
          playerSettings.selectedPet = module.EmbindConstant.imp
        } else if (playerData.Settings.petChoice === 'Succubus') {
          playerSettings.selectedPet = module.EmbindConstant.succubus
        } else if (playerData.Settings.petChoice === 'Felhunter') {
          playerSettings.selectedPet = module.EmbindConstant.felhunter
        } else if (playerData.Settings.petChoice === 'Felguard') {
          playerSettings.selectedPet = module.EmbindConstant.felguard
        }
        playerSettings.ferociousInspirationAmount = parseInt(
          playerData.Settings.ferociousInspirationAmount
        )
        playerSettings.usingCustomIsbUptime =
          playerData.Settings.customIsbUptime === 'yes'
        playerSettings.customIsbUptimeValue = parseFloat(
          playerData.Settings.customIsbUptimeValue
        )
        playerSettings.improvedImp = parseInt(
          playerData.Settings.improvedImpSetting
        )
        playerSettings.improvedExposeArmor = parseInt(
          playerData.Settings.improvedExposeArmor
        )
        playerSettings.fightType =
          !playerData.Settings.fightType ||
          playerData.Settings.fightType === 'singleTarget'
            ? module.EmbindConstant.singleTarget
            : module.EmbindConstant.aoe
        playerSettings.enemyAmount = parseInt(playerData.Settings.enemyAmount)
        playerSettings.race =
          module.EmbindConstant[playerData.Settings.race.toLowerCase()]
        playerSettings.powerInfusionAmount = parseInt(
          playerData.Settings.powerInfusionAmount
        )
        playerSettings.innervateAmount = parseInt(
          playerData.Settings.innervateAmount
        )
        playerSettings.enemyArmor = parseInt(playerData.Settings.enemyArmor)
        playerSettings.exposeWeaknessUptime = parseFloat(
          playerData.Settings.exposeWeaknessUptime
        )
        playerSettings.improvedFaerieFire =
          playerData.Settings.improvedFaerieFire === 'yes'
        playerSettings.infinitePlayerMana =
          playerData.Settings.infinitePlayerMana === 'yes'
        playerSettings.infinitePetMana =
          playerData.Settings.infinitePetMana === 'yes'
        playerSettings.lashOfPainUsage =
          playerData.Settings.lashOfPainUsage === 'onCooldown'
            ? module.EmbindConstant.onCooldown
            : module.EmbindConstant.noIsb
        playerSettings.petMode =
          playerData.Settings.petMode === '0'
            ? module.EmbindConstant.passive
            : module.EmbindConstant.aggressive
        playerSettings.prepopBlackBook =
          playerData.Settings.prepopBlackBook === 'yes'
        playerSettings.randomizeValues =
          playerData.Settings.randomizeValues === 'yes'
        playerSettings.rotationOption =
          playerData.Settings.rotationOption === 'simChooses'
            ? module.EmbindConstant.simChooses
            : module.EmbindConstant.userChooses
        playerSettings.survivalHunterAgility = parseInt(
          playerData.Settings.survivalHunterAgility
        )
        playerSettings.hasHaunt = playerData.Rotation.Dots.includes(48181)
        playerSettings.hasImmolate = playerData.Rotation.Dots.includes(47811)
        playerSettings.hasCorruption = playerData.Rotation.Dots.includes(47813)
        playerSettings.hasUnstableAffliction =
          playerData.Rotation.Dots.includes(30108)
        playerSettings.hasSearingPain =
          playerData.Rotation.Filler.includes(47815)
        playerSettings.hasShadowBolt =
          playerData.Rotation.Filler.includes(47809)
        playerSettings.hasIncinerate =
          playerData.Rotation.Filler.includes(47838)
        playerSettings.hasCurseOfRecklessness =
          playerData.Rotation.Curse.includes(16231)
        playerSettings.hasCurseOfTheElements =
          playerData.Rotation.Curse.includes(47865)
        playerSettings.hasCurseOfAgony =
          playerData.Rotation.Curse.includes(47864)
        playerSettings.hasCurseOfDoom =
          playerData.Rotation.Curse.includes(47867)
        playerSettings.hasDeathCoil =
          playerData.Rotation.Finishers.includes(47860)
        playerSettings.hasShadowburn =
          playerData.Rotation.Finishers.includes(17877)
        playerSettings.hasConflagrate =
          playerData.Rotation.Finishers.includes(17962)
        playerSettings.hasShadowfury = playerData.Rotation.Other.includes(30283)
        playerSettings.hasAmplifyCurse =
          playerData.Rotation.Other.includes(18288)
        playerSettings.hasDarkPact = playerData.Rotation.Other.includes(59092)

        const simulationSettings = module.allocSimSettings()
        simulationSettings.iterations = parseInt(simulationData.Iterations)
        simulationSettings.minTime = parseInt(simulationData.MinTime)
        simulationSettings.maxTime = parseInt(simulationData.MaxTime)
        simulationSettings.simulationType = parseInt(event.data.SimulationType)

        const player = module.allocPlayer(playerSettings)
        const simulation = module.allocSim(player, simulationSettings)
        simulation.start()
      } catch (exceptionPtr) {
        console.error(module.getExceptionMessage(exceptionPtr))
      }
    })
    .catch(e => console.error(e))
}
