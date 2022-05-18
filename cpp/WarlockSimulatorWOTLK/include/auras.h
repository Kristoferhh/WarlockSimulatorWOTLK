#pragma once

#include <memory>

struct DamageOverTime;
struct Aura;

struct Auras {
  std::shared_ptr<DamageOverTime> corruption;
  std::shared_ptr<DamageOverTime> unstable_affliction;
  std::shared_ptr<DamageOverTime> immolate;
  std::shared_ptr<DamageOverTime> curse_of_agony;
  std::shared_ptr<DamageOverTime> curse_of_doom;
  std::shared_ptr<DamageOverTime> drain_soul;
  std::shared_ptr<Aura> improved_shadow_bolt;
  std::shared_ptr<Aura> curse_of_the_elements;
  std::shared_ptr<Aura> shadow_trance;
  std::shared_ptr<Aura> amplify_curse;
  std::shared_ptr<Aura> power_infusion;
  std::shared_ptr<Aura> innervate;
  std::shared_ptr<Aura> blood_fury;
  std::shared_ptr<Aura> flame_cap;
  std::shared_ptr<Aura> bloodlust;
  std::shared_ptr<Aura> the_lightning_capacitor;
  std::shared_ptr<Aura> mana_tide_totem;
  std::shared_ptr<Aura> demonic_frenzy;
  std::shared_ptr<Aura> black_book;
  std::shared_ptr<Aura> haunt;
};
