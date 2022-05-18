#pragma once
#include <vector>

struct Spell;

struct Spells {
  std::shared_ptr<Spell> life_tap;
  std::shared_ptr<Spell> seed_of_corruption;
  std::shared_ptr<Spell> hellfire;
  std::shared_ptr<Spell> rain_of_fire;
  std::shared_ptr<Spell> shadow_bolt;
  std::shared_ptr<Spell> incinerate;
  std::shared_ptr<Spell> searing_pain;
  std::shared_ptr<Spell> corruption;
  std::shared_ptr<Spell> unstable_affliction;
  std::shared_ptr<Spell> immolate;
  std::shared_ptr<Spell> haunt;
  std::shared_ptr<Spell> curse_of_agony;
  std::shared_ptr<Spell> curse_of_the_elements;
  std::shared_ptr<Spell> curse_of_doom;
  std::shared_ptr<Spell> conflagrate;
  std::shared_ptr<Spell> shadowburn;
  std::shared_ptr<Spell> death_coil;
  std::shared_ptr<Spell> shadowfury;
  std::shared_ptr<Spell> amplify_curse;
  std::shared_ptr<Spell> dark_pact;
  std::shared_ptr<Spell> demonic_rune;
  std::shared_ptr<Spell> flame_cap;
  std::shared_ptr<Spell> blood_fury;
  std::shared_ptr<Spell> the_lightning_capacitor;
  std::shared_ptr<Spell> mana_tide_totem;
  std::shared_ptr<Spell> judgement_of_wisdom;
  std::shared_ptr<Spell> improved_shadow_bolt;
  std::shared_ptr<Spell> melee;
  std::shared_ptr<Spell> firebolt;
  std::shared_ptr<Spell> lash_of_pain;
  std::shared_ptr<Spell> cleave;
  std::shared_ptr<Spell> demonic_frenzy;
  std::shared_ptr<Spell> bloodlust;
  std::shared_ptr<Spell> drain_soul;
  std::vector<std::shared_ptr<Spell>> power_infusion;
  std::vector<std::shared_ptr<Spell>> innervate;
};
