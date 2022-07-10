#pragma once
#include "spell_proc.h"

struct OnCastProc : SpellProc {
  explicit OnCastProc(Entity& entity, std::shared_ptr<Aura> aura = nullptr);
  void Setup() override;
};

struct JeTzesBell final : OnCastProc {
  explicit JeTzesBell(Player& player, std::shared_ptr<Aura> aura);
};

struct EmbraceOfTheSpider final : OnCastProc {
  explicit EmbraceOfTheSpider(Player& player, std::shared_ptr<Aura> aura);
};

struct DyingCurse final : OnCastProc {
  explicit DyingCurse(Player& player, std::shared_ptr<Aura> aura);
};

struct MajesticDragonFigurine final : OnCastProc {
  explicit MajesticDragonFigurine(Player& player, std::shared_ptr<Aura> aura);
};

struct IllustrationOfTheDragonSoul final : OnCastProc {
  explicit IllustrationOfTheDragonSoul(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct SundialOfTheExiled final : OnCastProc {
  explicit SundialOfTheExiled(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct FlowOfKnowledge final : OnCastProc {
  explicit FlowOfKnowledge(Player& player, std::shared_ptr<Aura> aura);
};

struct EyeOfTheBroodmother final : OnCastProc {
  explicit EyeOfTheBroodmother(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct PandorasPlea final : OnCastProc {
  explicit PandorasPlea(Player& player, std::shared_ptr<Aura> aura);
};

struct FlareOfTheHeavens final : OnCastProc {
  explicit FlareOfTheHeavens(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct ShowOfFaith final : OnCastProc {
  explicit ShowOfFaith(Player& player, std::shared_ptr<Aura> aura);
};

struct ElementalFocusStone final : OnCastProc {
  explicit ElementalFocusStone(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct SifsRemembrance final : OnCastProc {
  explicit SifsRemembrance(Player& player, std::shared_ptr<Aura> aura);
};

struct SolaceOfTheDefeated final : OnCastProc {
  explicit SolaceOfTheDefeated(Player& player, std::shared_ptr<Aura> aura);
};

struct AbyssalRune final : OnCastProc {
  explicit AbyssalRune(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct VolatilePower final : OnCastProc {
  explicit VolatilePower(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct MithrilPocketwatch final : OnCastProc {
  explicit MithrilPocketwatch(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct DislodgedForeignObject final : OnCastProc {
  explicit DislodgedForeignObject(Player& player, std::shared_ptr<Aura> aura);
  bool ShouldProc(Spell* spell) override;
};

struct PurifiedLunarDust final : OnCastProc {
  explicit PurifiedLunarDust(Player& player, std::shared_ptr<Aura> aura);
};

struct CharredTwilightScale final : OnCastProc {
  explicit CharredTwilightScale(Player& player, std::shared_ptr<Aura> aura);
};
