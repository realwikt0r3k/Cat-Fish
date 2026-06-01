// constant vars to get the canvas, set number of all cats in the game and sfx, nothing unusual
const c = document.querySelector("#canvas");
const ctx = c.getContext("2d");

const _catCounter = 12;
const _questCounter = 17;

let animationFrame = null,
  timerInterval = null;
let vxr = 0,
  vxl = 0,
  vy = 0,
  elapsed;

const deltaTime = 1000 / 144;
const catCost = [0, 150, 150, 150, 150, 300, 300, 300, 300, 500, 500, 0];

function chance(number) {
  return Math.random() * 100 < number;
}

const assets = {};

let gameState = {
  canPlay: false,
  collectibles_limit: 12,
  collectibles_bad_limit: 5,
  timer: 15,
  cat: {
    x: 475,
    y: 300,
    size: 50,
    speed: 7,
  },
  counter: 0,
  collectibles: {
    goodFish: 0,
    badFish: 0,
    timeFish: 0,
    goldFish: 0,
    deathFish: 0,
    freezeFish: 0,
    coins: 0,
    all: 0,
  },
  coins: 0,
  chances: {
    goodFish: 100,
    badFish: 100,
    timeFish: 10,
    goldFish: 0.5,
    deathFish: 1,
    coin: 5,
    freezeFish: 2,
  },
  timeFishBonus: 2,
  multipliers: {
    coins: 1,
    points: 1,
  },
  freezeFishTime: 0,
  randomEvent: 0,
};

let saveState = {
  coins: 250,
  lang: "en",
  cat: 0,
  daily: true,
  music: false,
  sfx: true,
  unlockedCats: [0],
  stats: {
    collectibles: {
      goodFish: 0,
      badFish: 0,
      timeFish: 0,
      goldFish: 0,
      deathFish: 0,
      freezeFish: 0,
      coins: 0,
      all: 0,
    },
    other: {
      highestScore: 0,
      games: 0,
      quests: 0,
      bags: 0,
    },
  },
  quests: [
    {
      id: Math.floor(Math.random() * _questCounter + 1),
      desc: null,
      reward: null,
      status: false,
    },
    {
      id: Math.floor(Math.random() * _questCounter + 1),
      desc: null,
      reward: null,
      status: false,
    },
    {
      id: Math.floor(Math.random() * _questCounter + 1),
      desc: null,
      reward: null,
      status: false,
    },
  ],
};

const CONSTS = {
  SKINS: {
    SKIN_SOURCES: {
      DEFAULT: "default",
      SHOP: "shop",
      CASE: "case",
    },
    SKIN_RARITIES: {
      COMMON: {
        cost: 150,
        rarity: "common",
        chance: 100,
      },
      RARE: {
        cost: 300,
        rarity: "rare",
        chance: 35,
      },
      EPIC: {
        cost: 500,
        rarity: "epic",
        chance: 15,
      },
      MYTHIC: {
        cost: 1500,
        rarity: "mythic",
        chance: 2,
      },
    },
  },
};

class Player {
  detectCollision() {
    if (gameState.canPlay) {
      if (gameState.cat.x < 5) gameState.cat.x = 5;
      if (gameState.cat.x > c.width - (gameState.cat.size + 5))
        gameState.cat.x = c.width - (gameState.cat.size + 5);
      if (gameState.cat.y < 5) gameState.cat.y = 5;
      if (gameState.cat.y > c.height - (gameState.cat.size + 5))
        gameState.cat.y = c.height - (gameState.cat.size + 5);
    }
  }

  move() {
    if (gameState.canPlay) {
      gameState.cat.x +=
        (vxr - vxl) * gameState.cat.speed * (elapsed / deltaTime);
      gameState.cat.y += vy * gameState.cat.speed * (elapsed / deltaTime);
      this.detectCollision();
      let img = document.querySelector("#cat");
      ctx.drawImage(
        img,
        gameState.cat.x,
        gameState.cat.y,
        gameState.cat.size,
        gameState.cat.size,
      );
    }
  }
}

class Point {
  constructor(point, type = point ? "Points" : "Bad") {
    this.point = point;
    this.type = type;
    this.decayTimer = null;
    this.reposition();
  }

  reposition() {
    [this.rx, this.ry] = [
      Math.floor(Math.random() * 880) + 40,
      Math.floor(Math.random() * 530) + 40,
    ];
  }

  startDecayTimer() {
    clearTimeout(this.decayTimer);
    this.decayTimer = setTimeout(() => {
      const fish = COLLECTIBLES.FISH[this.type];
      if (fish.onDecay) {
        this.type = fish.onDecay();
        this.reposition();
      }
    }, 5000);
  }

  detectCollision() {
    if (gameState.canPlay) {
      const colliding =
        gameState.cat.x + gameState.cat.size > this.rx &&
        gameState.cat.x < this.rx + 30 &&
        gameState.cat.y + gameState.cat.size > this.ry &&
        gameState.cat.y < this.ry + 30;

      if (!colliding) return;

      clearTimeout(this.decayTimer);

      const fish = COLLECTIBLES.FISH[this.type];
      playSound(fish.sound);
      fish.onCollect();

      gameState.collectibles.all++;

      this.type = fish.rollNextType();
      this.reposition();

      if (COLLECTIBLES.FISH[this.type].onDecay) this.startDecayTimer();
    }
  }

  update() {
    if (gameState.canPlay) {
      this.detectCollision();
      const img = COLLECTIBLES.FISH[this.type].image();
      ctx.drawImage(img, this.rx, this.ry, 30, 30);
    }
  }
}

class Skin {
  constructor(def) {
    Object.assign(this, def);
    this.unlocked = def.cost === 0;
  }

  get isCaseOnly() {
    return this.source === CONSTS.SKINS.SKIN_SOURCES.CASE;
  }

  get canBuy() {
    return (
      this.source === CONSTS.SKINS.SKIN_SOURCES.SHOP &&
      !this.unlocked &&
      saveState.coins >= this.cost
    );
  }

  get getDescription() {
    const desc = this.description[saveState.lang];
    if (this.id == 0) return `<p>${desc.default}</p>`;
    if (this.id == 11) {
      if (gameState.randomEvent == 0) return `<p>${desc.default}</p>`;
      return `<p><span style='color: ${gameState.randomEvent < 4 ? "#87e894" : "#ff7486"}'>${desc[`random_event_${gameState.randomEvent}`]}</span></p>`;
    }
    return `<p>
            <span style='color: #87e894'>${desc.buff}</span>
            <br>
            <span style='color: #ff7486'>${desc.debuff}</span>
        </p>`;
  }

  get imageSrc() {
    return assets[`images/cats/cat${this.id + 1}.png`].src;
  }

  get lockSrc() {
    return this.isCaseOnly
      ? assets[`images/cats/locks/lock_case.png`].src
      : assets[`images/cats/locks/lock${this.cost}.png`].src;
  }

  applyModifiers() {
    if (this.modifiers) this.modifiers();
  }

  onPickup = {
    goodFish: () => {
      if (this.behaviors?.onPickup?.goodFish)
        this.behaviors.onPickup.goodFish();
      else gameState.counter++;
    },
    badFish: () => {
      if (this.behaviors?.onPickup?.badFish) this.behaviors.onPickup.badFish();
      else gameState.counter -= 3;
    },
    timeFish: () => {
      if (this.behaviors?.onPickup?.timeFish)
        this.behaviors.onPickup.timeFish();
      else gameState.timer += gameState.timeFishBonus;
    },
    goldFish: () => {
      if (this.behaviors?.onPickup?.goldFish)
        this.behaviors.onPickup.goldFish();
      else {
        gameState.timer += 5;
        gameState.counter += 10;
      }
    },
    deathFish: () => {
      if (this.behaviors?.onPickup?.deathFish)
        this.behaviors.onPickup.deathFish();
      else {
        gameState.timer -= 5;
        gameState.counter -= 10;
      }
    },
    freezeFish: () => {
      if (this.behaviors?.onPickup?.freezeFish)
        this.behaviors.onPickup.freezeFish();
      else gameState.freezeFishTime = 3;
    },
  };

  unlock() {
    if (this.unlocked || this.isCaseOnly) return false;
    if (saveState.coins < this.cost) return false;
    saveState.coins -= this.cost;
    this.unlocked = true;
    return true;
  }

  unlockFromCase() {
    if (this.unlocked) return false;
    this.unlocked = true;
    return true;
  }

  render(isSelected) {
    const child = document.createElement("div");
    child.className = "skin";

    const img = document.createElement("img");
    img.src = this.imageSrc;
    img.width = 100;
    img.height = 100;

    if (!this.unlocked) {
      img.style.filter = "brightness(25%)";
      const lock = document.createElement("img");
      lock.src = this.lockSrc;
      lock.className = "locked";
      child.appendChild(img);
      child.appendChild(lock);
    } else {
      img.style.filter = isSelected ? "brightness(100%)" : "brightness(50%)";
      child.appendChild(img);
    }

    child.addEventListener("click", () => SKIN_MANAGER.onSkinClick(this));
    return child;
  }
}

const SKIN_MANAGER = {
  rarityValues: {
    common: CONSTS.SKINS.SKIN_RARITIES.COMMON.cost / 2,
    rare: CONSTS.SKINS.SKIN_RARITIES.RARE.cost / 2,
    epic: CONSTS.SKINS.SKIN_RARITIES.EPIC.cost / 2,
    mythic: CONSTS.SKINS.SKIN_RARITIES.MYTHIC.cost / 2,
  },

  skins: [
    new Skin({
      id: 0,
      cost: 0,
      rarity: "default",
      source: CONSTS.SKINS.SKIN_SOURCES.DEFAULT,
      description: {
        en: { default: "Your default cat." },
        pl: { default: "Twój domyślny kot." },
      },
      modifiers: null,
      behaviors: null,
    }),
    new Skin({
      id: 1,
      rarity: CONSTS.SKINS.SKIN_RARITIES.COMMON.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.COMMON.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: { buff: "+ 10% faster cat", debuff: "- 5% less coins" },
        pl: { buff: "+ 10% szybszy kot", debuff: "- 5% mniej monet" },
      },
      modifiers: () => {
        gameState.cat.speed = 7.7;
        gameState.multipliers.coins = 0.95;
      },
      behaviors: null,
    }),
    new Skin({
      id: 2,
      rarity: CONSTS.SKINS.SKIN_RARITIES.COMMON.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.COMMON.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: {
          buff: "+ 5% more chance for a Coin",
          debuff: "- 5% less chance for Time Fish",
        },
        pl: {
          buff: "+ 5% więcej szans na Monetę",
          debuff: "- 5% mniej szans na Rybkę Czasu",
        },
      },
      modifiers: () => {
        gameState.chances.timeFish = 89.775;
        gameState.chances.coin = 80.75;
      },
      behaviors: null,
    }),
    new Skin({
      id: 3,
      rarity: CONSTS.SKINS.SKIN_RARITIES.COMMON.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.COMMON.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: {
          buff: "+ 5% more chance for Time Fish",
          debuff: "- 5% less chance for a Coin",
        },
        pl: {
          buff: "+ 5% więcej szans na Rybkę Czasu",
          debuff: "- 5% mniej szans na Monetę",
        },
      },
      modifiers: () => {
        gameState.chances.timeFish = 85.5;
        gameState.chances.coin = 84.7875;
      },
      behaviors: null,
    }),
    new Skin({
      id: 4,
      rarity: CONSTS.SKINS.SKIN_RARITIES.RARE.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.RARE.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: {
          buff: "+ 10% chance for Bad Fish to give 3 points instead of taking them",
          debuff: "- 5% chance for Good Fish to not give any point",
        },
        pl: {
          buff: "+ 10% szansy na to, że Zła Rybka da 3 punkty zamiast ich zabrać",
          debuff: "- 5% szans na to, że Dobra Rybka nie da punktów",
        },
      },
      modifiers: null,
      behaviors: {
        onPickup: {
          goodFish: () => {
            if (chance(5)) return;
            gameState.counter++;
          },
          badFish: () => {
            if (chance(10)) gameState.counter++;
            else gameState.counter -= 3;
          },
        },
      },
    }),
    new Skin({
      id: 5,
      rarity: CONSTS.SKINS.SKIN_RARITIES.RARE.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.RARE.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: {
          buff: "+ 10% chance for DOUBLE and 5% for TRIPLE points from Good Fish",
          debuff: "- 5% chance for Bad Fish to take 10 points",
        },
        pl: {
          buff: "+ 10% szans na PODWÓJNE oraz 5% na POTRÓJNE punkty z Dobrej Rybki",
          debuff: "- 5% szansy na to, że Zła Rybka zabierze 10 punktów",
        },
      },
      modifiers: null,
      behaviors: {
        onPickup: {
          goodFish: () => {
            if (chance(5)) gameState.counter += 3;
            else if (chance(10)) gameState.counter += 2;
            else gameState.counter++;
          },
          badFish: () => {
            if (chance(5)) gameState.counter -= 5;
            else gameState.counter -= 3;
          },
        },
      },
    }),
    new Skin({
      id: 6,
      rarity: CONSTS.SKINS.SKIN_RARITIES.RARE.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.RARE.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: {
          buff: "+ 100% more chance for Gold Fish",
          debuff: "- 20% chance for Good Fish to take 1 point",
        },
        pl: {
          buff: "+ 100% więcej szans na Złotą Rybkę",
          debuff: "- 20% szans na to, że Dobra Rybka zabierze punkt",
        },
      },
      modifiers: () => {
        gameState.chances.goldFish = 1;
      },
      behaviors: {
        onPickup: {
          goodFish: () => {
            if (chance(20)) gameState.counter--;
            else gameState.counter++;
          },
        },
      },
    }),
    new Skin({
      id: 7,
      rarity: CONSTS.SKINS.SKIN_RARITIES.MYTHIC.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.MYTHIC.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: { buff: "+ 5 additional fish", debuff: "- 25% smaller cat" },
        pl: { buff: "+ 5 dodatkowych rybek", debuff: "- 25% mniejszy kot" },
      },
      modifiers: () => {
        gameState.cat.size = 45;
        gameState.collectibles_limit += 5;
      },
      behaviors: null,
    }),
    new Skin({
      id: 8,
      rarity: CONSTS.SKINS.SKIN_RARITIES.RARE.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.RARE.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: { buff: "+ 10% bigger cat", debuff: "- 5% slower cat" },
        pl: { buff: "+ 10% większy kot", debuff: "- 5% wolniejszy kot" },
      },
      modifiers: () => {
        gameState.cat.size = 55;
        gameState.cat.speed = 6.65;
      },
      behaviors: null,
    }),
    new Skin({
      id: 9,
      rarity: CONSTS.SKINS.SKIN_RARITIES.EPIC.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.EPIC.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: {
          buff: "+ 5 additional seconds at start",
          debuff: "- 1 Good Fish becomes a Bad Fish",
        },
        pl: {
          buff: "+ 5 dodatkowych sekund na start",
          debuff: "- 1 Dobra Rybka staje się Złą Rybką",
        },
      },
      modifiers: () => {
        gameState.timer = 20;
        gameState.collectibles_bad_limit--;
      },
      behaviors: null,
    }),
    new Skin({
      id: 10,
      rarity: CONSTS.SKINS.SKIN_RARITIES.EPIC.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.EPIC.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.SHOP,
      description: {
        en: {
          buff: "+ Time Fish gives 1 second more",
          debuff: "- You start with only 6 seconds",
        },
        pl: {
          buff: "+ Time Fish daje ci o 1 sekundę więcej",
          debuff: "- Zaczynasz posiadając tylko 6 sekund",
        },
      },
      modifiers: () => {
        gameState.timeFishBonus = 3;
        gameState.timer = 6;
      },
      behaviors: null,
    }),
    new Skin({
      id: 11,
      rarity: CONSTS.SKINS.SKIN_RARITIES.MYTHIC.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.MYTHIC.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.CASE,
      description: {
        en: {
          default: "Playing with this cat you have a chance for those events:",
          random_event_1: "RANDOM EVENT: + 10% faster cat",
          random_event_2: "RANDOM EVENT: + 10% more coins",
          random_event_3: "RANDOM EVENT: + 5% more points",
          random_event_4: "RANDOM EVENT: - You start with only 10 seconds",
          random_event_5: "RANDOM EVENT: - 5% less coins",
          random_event_6: "RANDOM EVENT: - 25% smaller cat",
        },
        pl: {
          default: "Grając tym kotem masz szansę na te wydarzenia:",
          random_event_1: "RANDOM EVENT: + 10% szybszy kot",
          random_event_2: "RANDOM EVENT: + 10% więcej monet",
          random_event_3: "RANDOM EVENT: + 5% więcej punktów",
          random_event_4:
            "RANDOM EVENT: - Zaczynasz posiadając tylko 10 sekund",
          random_event_5: "RANDOM EVENT: - 5% mniej monet",
          random_event_6: "RANDOM EVENT: - 25% mniejszy kot",
        },
      },
      modifiers: () => {
        gameState.randomEvent = Math.floor(Math.random() * 6 + 1);
        switch (gameState.randomEvent) {
          case 1:
            gameState.cat.speed = 7.7;
            break;
          case 2:
            gameState.multipliers.coins = 1.1;
            break;
          case 3:
            gameState.multipliers.points = 1.05;
            break;
          case 4:
            gameState.timer = 12;
            break;
          case 5:
            gameState.multipliers.coins = 0.95;
            break;
          case 6:
            gameState.cat.size = 37.5;
            break;
        }
      },
      behaviors: null,
    }),
    new Skin({
      id: 12,
      rarity: CONSTS.SKINS.SKIN_RARITIES.MYTHIC.rarity,
      cost: CONSTS.SKINS.SKIN_RARITIES.MYTHIC.cost,
      source: CONSTS.SKINS.SKIN_SOURCES.CASE,
      description: {
        en: {
          buff: "+ You start with 25 seconds",
          debuff: "- Time Fish only freeze your time for 1 second",
        },
        pl: {
          buff: "+ Zaczynasz z 25 sekundami",
          debuff: "- Rybki czasu jedynie zamrażają twój czas na 1 sekunde",
        },
      },
      modifiers: () => {
        gameState.timer = 25;
      },
      behaviors: {
        onPickup: {
          timeFish: () => {
            gameState.freezeFishTime =
              gameState.freezeFishTime < 1 ? 1 : gameState.freezeFishTime;
            updateTimerDisplay();
          },
        },
      },
    }),
  ],

  get selected() {
    return this.skins[saveState.cat];
  },

  rollCaseResult() {
    let rarity;
    if (chance(CONSTS.SKINS.SKIN_RARITIES.MYTHIC.chance)) rarity = "mythic";
    else if (chance(CONSTS.SKINS.SKIN_RARITIES.EPIC.chance)) rarity = "epic";
    else if (chance(CONSTS.SKINS.SKIN_RARITIES.RARE.chance)) rarity = "rare";
    else rarity = "common";

    const pool = this.skins.filter((skin) => skin.rarity === rarity);
    const cat = pool[Math.floor(Math.random() * pool.length)];

    return { cat: cat.id, rarity };
  },

  buildReelBox(cat, rarity) {
    const box = document.createElement("div");
    box.className = [`box ${rarity}`];
    const img = document.createElement("img");
    img.width = 90;
    img.height = 90;
    img.src = assets[`images/cats/cat${cat + 1}.png`].src;
    box.appendChild(img);
    return box;
  },

  onSkinClick(skin) {
    if (skin.unlocked) {
      playSound(SFX.UI.click);
      saveState.cat = skin.id;
      this.renderAll();
    } else if (skin.isCaseOnly) {
      playSound(SFX.UI.buy_cat_fail);
      document.querySelector("#catdescription").innerHTML =
        UI[saveState.lang].shop.case_only;
    } else {
      if (skin.unlock()) {
        playSound(SFX.UI.buy_cat);
        this.renderAll();
      } else {
        playSound(SFX.UI.buy_cat_fail);
      }
    }
    document.querySelector("#catdescription").innerHTML =
      this.selected.getDescription;
    document.querySelector("#coinsshop").innerHTML =
      UI[saveState.lang].shop.your_coins +
      " " +
      saveState.coins +
      ' <img src="images/UI/moneta.png" />';
  },

  renderAll() {
    const parent = document.querySelector("#cats");
    parent.innerHTML = "";
    this.skins.forEach((skin) => {
      parent.appendChild(skin.render(skin.id === saveState.cat));
    });
    document.querySelector("#cat").src = this.selected.imageSrc;
    document.querySelector("#catdescription").innerHTML =
      this.selected.getDescription;
  },

  applySelected() {
    this.selected.applyModifiers();
  },

  load() {
    saveState.unlockedCats.forEach((id) => {
      if (this.skins[id]) this.skins[id].unlocked = true;
    });
  },

  save() {
    saveState.unlockedCats = this.skins
      .filter((skin) => skin.unlocked)
      .map((skin) => skin.id);
  },
};

const player = new Player();

const background_music = new Audio("audio/bg_music.mp3");
background_music.volume = 0.65;
background_music.loop = true;
background_music.preservesPitch = true;
background_music.playbackRate = 1.0;
background_music.muted = !saveState.music;

const SFX = {
  MISC: {
    COUNTDOWN: {
      count3: {
        source: assets["audio/countdown.mp3"],
        volume: 0.85,
        pitch_preserve: true,
        playback_rate: 1,
      },
      count2: {
        source: assets["audio/countdown.mp3"],
        volume: 0.9,
        pitch_preserve: false,
        playback_rate: 1.5,
      },
      count1: {
        source: assets["audio/countdown.mp3"],
        volume: 1,
        pitch_preserve: false,
        playback_rate: 2,
      },
    },
    GAME_START: {
      source: assets["audio/start_game.mp3"],
      volume: 1,
      pitch_preserve: false,
      playback_rate: 1.25,
    },
  },
  UI: {
    click: {
      source: assets["audio/UI/button_click.wav"],
      volume: 0.8,
      pitch_preserve: true,
      playback_rate: 1,
    },
    buy_cat: {
      source: assets["audio/UI/shop_buy_cat.wav"],
      volume: 0.8,
      pitch_preserve: true,
      playback_rate: 1,
    },
    buy_cat_fail: {
      source: assets["audio/UI/shop_not_enough.wav"],
      volume: 0.75,
      pitch_preserve: true,
      playback_rate: 1,
    },
  },
  INGAME: {
    pickup: {
      coin: {
        source: assets["audio/pickup/coin.mp3"],
        volume: 0.6,
        pitch_preserve: false,
        playback_rate: 1.1,
      },
      fish: {
        source: assets["audio/pickup/fish.mp3"],
        volume: 0.45,
        pitch_preserve: false,
        playback_rate: Math.random() / 2 + 1.25,
      },
      bad: {
        source: assets["audio/pickup/bad.mp3"],
        volume: 0.4,
        pitch_preserve: false,
        playback_rate: Math.random() / 2 + 1.25,
      },
      fish_rare: {
        source: assets["audio/pickup/fish_rare.ogg"],
        volume: 0.25,
        pitch_preserve: true,
        playback_rate: 1,
      },
      freeze: {
        source: assets["audio/pickup/freeze.mp3"],
        volume: 1,
        pitch_preserve: false,
        playback_rate: 0.7,
      },
    },
  },
};

function playSound(soundToPlay) {
  if (saveState.sfx) {
    const sound = new Audio(soundToPlay.source);
    sound.preservesPitch = soundToPlay.pitch_preserve;
    sound.playbackRate = soundToPlay.playback_rate;
    sound.volume = soundToPlay.volume;
    sound.play();
  }
}

const COLLECTIBLES = {
  FISH: {
    Points: {
      image: () => document.querySelector("#goodfish"),
      sound: SFX.INGAME.pickup.fish,
      onCollect() {
        SKIN_MANAGER.selected.onPickup.goodFish();
        gameState.collectibles.goodFish++;
      },
      rollNextType() {
        if (chance(gameState.chances.timeFish)) return "Time";
        if (chance(gameState.chances.coin)) return "Coin";
        if (chance(gameState.chances.goldFish)) return "Gold";
        if (chance(gameState.chances.freezeFish)) return "Freeze";
        return "Points";
      },
    },
    Time: {
      image: () => document.querySelector("#timefish"),
      sound: SFX.INGAME.pickup.fish,
      onCollect() {
        SKIN_MANAGER.selected.onPickup.timeFish();
        gameState.collectibles.timeFish++;
        updateTimerDisplay();
      },
      rollNextType() {
        if (chance(gameState.chances.timeFish)) return "Time";
        if (chance(gameState.chances.coin)) return "Coin";
        if (chance(gameState.chances.goldFish)) return "Gold";
        if (chance(gameState.chances.freezeFish)) return "Freeze";
        return "Points";
      },
    },
    Gold: {
      image: () => document.querySelector("#goldfish"),
      sound: SFX.INGAME.pickup.coin,
      onCollect() {
        SKIN_MANAGER.selected.onPickup.goldFish();
        gameState.collectibles.goldFish++;
        updateTimerDisplay();
      },
      rollNextType() {
        return "Points";
      },
      onDecay() {
        if (chance(gameState.chances.timeFish)) return "Time";
        if (chance(gameState.chances.coin)) return "Coin";
        if (chance(gameState.chances.freezeFish)) return "Freeze";
        return "Points";
      },
    },
    Bad: {
      point: false,
      sound: SFX.INGAME.pickup.bad,
      image: () => document.querySelector("#badfish"),
      onCollect() {
        SKIN_MANAGER.selected.onPickup.badFish();
        gameState.collectibles.badFish++;
      },
      rollNextType() {
        return chance(gameState.chances.deathFish) ? "Death" : "Bad";
      },
    },
    Death: {
      point: false,
      sound: SFX.INGAME.pickup.fish,
      image: () => document.querySelector("#deadfish"),
      onCollect() {
        SKIN_MANAGER.selected.onPickup.deathFish();
        gameState.collectibles.deathFish++;
        updateTimerDisplay();
      },
      rollNextType() {
        return "Bad";
      },
      onDecay() {
        return "Bad";
      },
    },
    Freeze: {
      sound: SFX.INGAME.pickup.freeze,
      image: () => document.querySelector("#freezefish"),
      onCollect() {
        SKIN_MANAGER.selected.onPickup.freezeFish();
        gameState.collectibles.freezeFish++;
        updateTimerDisplay();
      },
      rollNextType() {
        if (chance(gameState.chances.timeFish)) return "Time";
        if (chance(gameState.chances.coin)) return "Coin";
        if (chance(gameState.chances.goldFish)) return "Gold";
        return "Points";
      },
    },
    Coin: {
      image: () => document.querySelector("#coin"),
      sound: SFX.INGAME.pickup.coin,
      onCollect() {
        gameState.collectibles.coins++;
      },
      rollNextType() {
        if (chance(gameState.chances.timeFish)) return "Time";
        if (chance(gameState.chances.coin)) return "Coin";
        if (chance(gameState.chances.goldFish)) return "Gold";
        if (chance(gameState.chances.freezeFish)) return "Freeze";
        return "Points";
      },
    },
  },
};

const splashText = [
  "(Not) The best web game of 2025!",
  "Right now at version: b0.7",
  "Made by wikt0r3k",
  "Yes, I am polish.",
  "Cześć Polsko!",
  "Fish-Cat",
  "These splashes ain't getting translated any time soon.",
  'The "-" in logo is a fish :D',
  "Maybe i'll add some more languages...",
  "2 people job for real",
  "God I love itch.io games.",
  "Discord: wikt0r3k",
  "God I love Balatro",
  "Also try... oh wait, my friends don't make games...",
];

const UI = {
  en: {
    shop: {
      your_coins: "Your coins:",
    },
    ingame: {
      your_points: "Your points:",
      your_time: "Time remaining:",
    },
    stats: {
      stats: "Your stats:",
      goodFish: "Good Fish:",
      badFish: "Bad Fish:",
      timeFish: "Time Fish:",
      goldFish: "Gold Fish:",
      deathFish: "Death Fish:",
      freezeFish: "Freeze Fish:",
      coins: "Coins:",
      all: "All Fish:",
      games: "Played games:",
      quests: "Completed quests:",
      bags: "Opened bags:",
      highestScore: "Personal best:",
    },
    infos: {
      all: "All fish:",
      goodFish: "Good Fish - gives 1* point",
      badFish: "Bad Fish - takes away 3* points",
      timeFish: "Time Fish - adds 2* seconds",
      goldFish: "Gold Fish - gives 10 points + 5 seconds",
      deathFish: "Death Fish - takes away 10 points + 5 seconds",
      freezeFish: "Freeze Fish - stops the timer for 3 seconds",
      per_fish: "fish",
      disclaimer: "*Can vary between different cats.",
    },
    creators_contributors: {
      title: "Creators + Contributors",
      wikt0r3k: "wikt0r3k - Developer + Soundtrack",
      ankaa: "AnKaa - Graphic Designer",
      vgrechi: "Vgrechisher - SFX",
    },
    gameover: {
      your_points: "Your points: ",
      your_coins: "Your coins:",
      picked_up: "During this run, you collected:",
      goodFish: "Good Fish:",
      badFish: "Bad Fish:",
      timeFish: "Time Fish:",
      goldFish: "Gold Fish:",
      deathFish: "Death Fish:",
      freezeFish: "Freeze Fish:",
      all: "Total Fish:",
      coins: "Collected coins: ",
      items: "items collected, which converts into:",
      highestScore: "New personal best!",
    },
    cats: {
      cat_description: {
        cat_0: "Your default cat.",
        cat_1: {
          buff: "+ 10% faster cat",
          debuff: "- 5% less coins",
        },
        cat_2: {
          buff: "+ 5% more chance for a Coin",
          debuff: "- 5% less chance for Time Fish",
        },
        cat_3: {
          buff: "+ 5% more chance for Time Fish",
          debuff: "- 5% less chance for a Coin",
        },
        cat_4: {
          buff: "+ 10% chance for Bad Fish to give 3 points instead of taking them",
          debuff: "- 5% chance for Good Fish to not give any point",
        },
        cat_5: {
          buff: "+ 10% chance for DOUBLE and 5% for TRIPLE points from Good Fish",
          debuff: "- 5% chance for Bad Fish to take 10 points",
        },
        cat_6: {
          buff: "+ 100% more chance for Gold Fish",
          debuff: "- 20% chance for Good Fish to take 1 point",
        },
        cat_7: {
          buff: "+ 5 additional fish",
          debuff: "- 25% smaller cat",
        },
        cat_8: {
          buff: "+ 10% bigger cat",
          debuff: "- 5% slower cat",
        },
        cat_9: {
          buff: "+ 5 additional seconds at start",
          debuff: "- 1 Good Fish becomes a Bad Fish",
        },
        cat_10: {
          buff: "+ Time Fish gives 1 second more",
          debuff: "- You start with only 10 seconds",
        },
        cat_11: {
          random_event_info:
            "This cat has a random event picked at the start of the round",
          random_event_1: "RANDOM EVENT: + 10% faster cat",
          random_event_2: "RANDOM EVENT: + 10% more coins",
          random_event_3: "RANDOM EVENT: + 5% more points",
          random_event_4: "RANDOM EVENT: - You start with only 10 seconds",
          random_event_5: "RANDOM EVENT: - 5% less coins",
          random_event_6: "RANDOM EVENT: - 25% smaller cat",
        },
      },
    },
    bag: {
      already_has: "Your already have this cat.",
      instead: "Instead, you'll get",
      coins: "coins.",
    },
  },
};

const quests = {
  descriptions: {
    en: {
      your_quests: "Your quests",
      reward: "Reward",
      quest1: "Earn 50 coins in a single game",
      quest2: "Collect a Gold Fish",
      quest3: "Collect a Death Fish",
      quest4: "Collect a total of 100 fish in one game",
      quest5: "Collect a total of 30 Good Fish in one game",
      quest6: "Finish a game with at least 10 fish and no bad one",
      quest7: "Open a cat bag",
      quest8: "Roll a RARE cat",
      quest9: "Roll an EPIC cat",
      quest10: "Roll a MYTHIC cat",
      quest11: "Get 50 points from a single game",
      quest12: "Get 100 points from a single game",
      quest13: "Get 150 points from a single game",
      quest14: "Get 200 points from a single game",
      quest15: "Beat your personal record",
      quest16: "Collect a total of 500 fish in one game",
      quest17: "Earn 100 coins in a single game",
      quest18: "Collect a total of 50 Time Fish in one game",
      quest19: "Collect at least 5 fish without getting any Good Fish",
    },
  },
  rewards: {
    quest1: 100,
    quest2: 150,
    quest3: 150,
    quest4: 200,
    quest5: 150,
    quest6: 150,
    quest7: 125,
    quest8: 250,
    quest9: 500,
    quest10: 1000,
    quest11: 50,
    quest12: 150,
    quest13: 250,
    quest14: 500,
    quest15: 100,
    quest16: 1000,
    quest17: 150,
    quest18: 750,
    quest19: 250,
  },
  conditions: {
    quest1: () => gameState.coins >= 50,
    quest2: () => gameState.collectibles.goldFish > 0,
    quest3: () => gameState.collectibles.deathFish > 0,
    quest4: () => gameState.collectibles.all >= 100,
    quest5: () => gameState.collectibles.goodFish >= 30,
    quest6: () =>
      gameState.collectibles.goodFish >= 10 &&
      gameState.collectibles.badFish + gameState.collectibles.deathFish < 1,
    quest7: () => true,
    quest8: (rarity) => rarity == "rare",
    quest9: (rarity) => rarity == "epic",
    quest10: (rarity) => rarity == "mythic",
    quest11: () => gameState.counter >= 50,
    quest12: () => gameState.counter >= 100,
    quest13: () => gameState.counter >= 150,
    quest14: () => gameState.counter >= 200,
    quest15: () => saveState.stats.other.highestScore < gameState.counter,
    quest16: () => gameState.collectibles.all >= 500,
    quest17: () => gameState.coins >= 100,
    quest18: () => gameState.collectibles.timeFish >= 50,
    quest19: () =>
      gameState.collectibles.all >= 5 && gameState.collectibles.goodFish < 1,
  },
};

function completeQuest(questID, slotIndex) {
  playSound(SFX.UI.buy_cat);

  saveState.coins += quests.rewards[`quest${questID}`];
  saveState.stats.other.quests++;

  let screen = document.querySelector("body");
  let child = document.createElement("span");
  child.innerHTML =
    " +" +
    quests.rewards["quest" + questID] +
    ' <img width="32" height="32" src="images/UI/moneta.png"> ';
  child.id = "dailyrewardpopup";
  screen.appendChild(child);
  document.querySelector("#dailyreward").style.filter = "saturate(0)";
  setTimeout(
    () => screen.removeChild(document.querySelector("#dailyrewardpopup")),
    1000,
  );

  const newID = Math.floor(Math.random() * _questCounter) + 1;
  saveState.quests[slotIndex] = {
    id: newID,
    desc: quests.descriptions[saveState.lang][`quest${newID}`],
    reward: quests.rewards[`quest${newID}`],
    status: false,
  };
}
