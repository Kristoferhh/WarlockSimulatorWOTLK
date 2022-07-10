SOURCE_FILE_PATH = cpp/WarlockSimulatorWOTLK/src/bindings.cc cpp/WarlockSimulatorWOTLK/src/spell.cc cpp/WarlockSimulatorWOTLK/src/entity.cc cpp/WarlockSimulatorWOTLK/src/on_resist_proc.cc cpp/WarlockSimulatorWOTLK/src/on_dot_tick_proc.cc cpp/WarlockSimulatorWOTLK/src/on_damage_proc.cc cpp/WarlockSimulatorWOTLK/src/on_crit_proc.cc cpp/WarlockSimulatorWOTLK/src/spell_proc.cc cpp/WarlockSimulatorWOTLK/src/on_hit_proc.cc cpp/WarlockSimulatorWOTLK/src/life_tap.cc cpp/WarlockSimulatorWOTLK/src/stat.cc cpp/WarlockSimulatorWOTLK/src/rng.cc cpp/WarlockSimulatorWOTLK/src/mana_over_time.cc cpp/WarlockSimulatorWOTLK/src/mana_potion.cc cpp/WarlockSimulatorWOTLK/src/common.cc cpp/WarlockSimulatorWOTLK/src/player.cc cpp/WarlockSimulatorWOTLK/src/simulation.cc cpp/WarlockSimulatorWOTLK/src/aura.cc cpp/WarlockSimulatorWOTLK/src/damage_over_time.cc cpp/WarlockSimulatorWOTLK/src/trinket.cc cpp/WarlockSimulatorWOTLK/src/pet.cc cpp/WarlockSimulatorWOTLK/src/on_cast_proc.cc
DEST_FILE_PATH = public/WarlockSim.js
FLAGS = -s EXPORT_NAME="WarlockSim" --bind --no-entry -O2 -s ASSERTIONS=2 -s NO_FILESYSTEM=1 -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 -std=c++20

all: $(SOURCE_FILE_PATH)
	em++ $(SOURCE_FILE_PATH) -o $(DEST_FILE_PATH) $(FLAGS)