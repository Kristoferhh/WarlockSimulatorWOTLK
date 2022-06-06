#pragma once
#include "spell_proc.h"

struct Player;

struct OnCritProc : SpellProc {
  explicit OnCritProc(Entity& entity_param, std::shared_ptr<Aura> aura = nullptr);
  void Setup() override;
};

struct DemonicPact final : OnCritProc {
  explicit DemonicPact(Pet& pet, std::shared_ptr<Aura> aura);
};

struct Pyroclasm final : OnCritProc {
  explicit Pyroclasm(Player& player, std::shared_ptr<Aura> aura);
};

struct EmpoweredImp final : OnCritProc {
  explicit EmpoweredImp(Pet& pet, std::shared_ptr<Aura> aura);
};
