# WOTLK Warlock Simulator

Warlock DPS simulator for Classic WoW WOTLK written in React Typescript and C++ compiled into WebAssembly.

## Setting up local development

### Frontend

```bash
git clone https://github.com/Kristoferhh/WarlockSimulatorWOTLK.git
cd WarlockSimulatorWOTLK
npm install
npm start
```

### Backend

[Emscripten SDK to compile the C++ code into WebAssembly](https://emscripten.org/docs/getting_started/downloads.html)  
 Compile the C++ code by running the `make` command in the root directory of the project
