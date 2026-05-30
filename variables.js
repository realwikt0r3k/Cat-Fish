// constant vars to get the canvas, set number of all cats in the game and sfx, nothing unusual
const c = document.querySelector("#canvas");
const ctx = c.getContext("2d");

const _catCounter = 12;
const _questCounter = 17;

let animationFrame = null, timerInterval = null;
let vxr = 0, vxl = 0, vy = 0, elapsed;

const deltaTime = 1000/144;
const catCost = [0, 150, 150, 150, 150, 300, 300, 300, 300, 500, 500, 0];

function chance(number) {
    return Math.random() * 100 < number;
}

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
        all: 0
    },
    coins: 0,
    chances: {
        goodFish: 100,
        badFish: 100,
        timeFish: 15,
        goldFish: 0.5,
        deathFish: 1,
        coin: 5,
        freezeFish: 2.5
    },
    timeFishBonus: 2,
    multipliers: {
        coins: 1,
        points: 1
    },
    freezeFishTime: 0,
    randomEvent: 0
};

let saveState = {
    coins: 250,
    lang: "en",
    cat: 0,
    daily: true,
    music: false,
    sfx: true,
    unlockedCats: Array(_catCounter).fill(false),
    stats: {
        collectibles: {
            goodFish: 0,
            badFish: 0,
            timeFish: 0,
            goldFish: 0,
            deathFish: 0,
            freezeFish: 0,
            coins: 0,
            all: 0
        },
        other: {
            highestScore: 0,
            games: 0,
            quests: 0,
            bags: 0
        }
    },
    quests: [
        { id: Math.floor(Math.random() * _questCounter + 1), desc: null, reward: null, status: false },
        { id: Math.floor(Math.random() * _questCounter + 1), desc: null, reward: null, status: false },
        { id: Math.floor(Math.random() * _questCounter + 1), desc: null, reward: null, status: false }
    ]
};

class Player {
    detectCollision() {
        if (gameState.canPlay) {
            if (gameState.cat.x < 5) gameState.cat.x = 5;
            if (gameState.cat.x > c.width - (gameState.cat.size + 5)) gameState.cat.x = c.width - (gameState.cat.size + 5);
            if (gameState.cat.y < 5) gameState.cat.y = 5;
            if (gameState.cat.y > c.height - (gameState.cat.size + 5)) gameState.cat.y = c.height - (gameState.cat.size + 5);
        }
    }

    move() {
        if (gameState.canPlay) {
            gameState.cat.x += (vxr - vxl) * gameState.cat.speed * (elapsed / deltaTime);
            gameState.cat.y += vy * gameState.cat.speed * (elapsed / deltaTime);
            this.detectCollision();
            let img = document.querySelector("#cat");
            ctx.drawImage(img, gameState.cat.x, gameState.cat.y, gameState.cat.size, gameState.cat.size);
        }
    }
}

class Point {
    constructor(point, type = point ? "Points" : "Bad") {
        this.point = point;
        this.type = type
        this.decayTimer = null;
        this.reposition();
    }

    reposition() {
        [this.rx, this.ry] = [Math.floor(Math.random() * 880) + 40, Math.floor(Math.random() * 530) + 40];
    }

    startDecayTimer() {
        clearTimeout(this.decayTimer);
        this.decayTimer = setTimeout(() => {
            const fish = COLLECTIBLES.FISH[this.type];
            if(fish.onDecay) {
                this.type = fish.onDecay();
                this.reposition();
            }
        }, 5000);
    }

    detectCollision() {
        if (gameState.canPlay) {
            const colliding = (gameState.cat.x + gameState.cat.size > this.rx && gameState.cat.x < this.rx + 30) && (gameState.cat.y + gameState.cat.size > this.ry && gameState.cat.y < this.ry + 30);

            if (!colliding) return;

            clearTimeout(this.decayTimer);

            const fish = COLLECTIBLES.FISH[this.type];
            playSound(fish.sound);
            fish.onCollect();
            
            gameState.collectibles.all++;

            this.type = fish.rollNextType();
            this.reposition();

            if(COLLECTIBLES.FISH[this.type].onDecay) this.startDecayTimer();

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

const player = new Player();

const background_music = new Audio("audio/bg_music.mp3");
background_music.volume = 0.3;
background_music.loop = true;
background_music.muted = !saveState.music;

const SFX = {
    UI: {
        click: {
            source: "audio/UI/button_click.wav",
            volume: 0.8,
            pitch_preserve: true,
            playback_rate: 1
        },
        buy_cat: {
            source: "audio/UI/shop_buy_cat.wav",
            volume: 0.8,
            pitch_preserve: true,
            playback_rate: 1
        },
        buy_cat_fail: {
            source: "audio/UI/shop_not_enough.wav",
            volume: 0.75,
            pitch_preserve: true,
            playback_rate: 1
        },
    },
    INGAME: {
        pickup: {
            coin: {
                source: "audio/pickup/coin.wav",
                volume: 0.6,
                pitch_preserve: true,
                playback_rate: 1
            },
            fish: {
                source: "audio/pickup/fish.wav",
                volume: 0.6,
                pitch_preserve: false,
                playback_rate: (Math.random() / 2) + 1.25
            },
            fish_rare: {
                source: "audio/pickup/fish_rare.ogg",
                volume: 0.25,
                pitch_preserve: true,
                playback_rate: 1
            },
            freeze: {
                source: "audio/pickup/freeze.wav",
                volume: 0.7,
                pitch_preserve: true,
                playback_rate: 1
            },
        }
    }
}

function playSound(soundToPlay) {
    if (saveState.sfx) {
        const sound = new Audio(soundToPlay.source);
        sound.preservesPitch = soundToPlay.pitch_preserve
        sound.playbackRate = soundToPlay.playback_rate
        sound.volume = soundToPlay.volume
        sound.play();
    }
}

const COLLECTIBLES = {
    FISH: {
        Points: {
            image: () => document.querySelector("#goodfish"),
            sound: SFX.INGAME.pickup.fish,
            onCollect() {
                gameState.counter++;
                gameState.collectibles.goodFish++;
            },
            rollNextType() {
                if ( chance(gameState.chances.timeFish) ) return "Time";
                if ( chance(gameState.chances.coin) ) return "Coin";
                if ( chance(gameState.chances.goldFish) ) return "Gold";
                if ( chance(gameState.chances.freezeFish) ) return "Freeze";
                return "Points";
            }
        },
        Time: {
            image: () => document.querySelector("#timefish"),
            sound: SFX.INGAME.pickup.fish,
            onCollect() {
                gameState.timer += gameState.timeFishBonus;
                gameState.collectibles.timeFish++;
                document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + (gameState.freezeFishTime != 0 ? "❄ " : "") + gameState.timer + (gameState.freezeFishTime != 0 ? " ❄" : "");
            },
            rollNextType() {
                if ( chance(gameState.chances.timeFish) ) return "Time";
                if ( chance(gameState.chances.coin) ) return "Coin";
                if ( chance(gameState.chances.goldFish) ) return "Gold";
                if ( chance(gameState.chances.freezeFish) ) return "Freeze";
                return "Points";
            }
        },
        Gold: {
            image: () => document.querySelector("#goldfish"),
            sound: SFX.INGAME.pickup.coin,
            onCollect() {
                gameState.timer += 5;
                gameState.counter += 10;
                gameState.collectibles.goldFish++;
                document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + (gameState.freezeFishTime != 0 ? "❄ " : "") + gameState.timer + (gameState.freezeFishTime != 0 ? " ❄" : "");
            },
            rollNextType() {
                return "Points";
            },
            onDecay() {
                if (chance(gameState.chances.timeFish)) return "Time";
                if (chance(gameState.chances.coin)) return "Coin";
                if (chance(gameState.chances.freezeFish)) return "Freeze";
                return "Points";
            }
        },
        Bad: {
            point: false,
            sound: SFX.INGAME.pickup.fish,
            image: () => document.querySelector("#badfish"),
            onCollect() {
                switch (cat) {
                    case 4:
                        (chance(10)) ? gameState.counter -= 3 : gameState.counter++;
                        break;
                    case 5:
                        gameState.counter -= chance(5) ? 5 : 3;
                        break;
                    default:
                        gameState.counter -= 3; 
                }
                gameState.collectibles.badFish++;
            },
            rollNextType() {
                return chance(gameState.chances.deathFish) ? "Death" : "Bad";
            }
        },
        Death: {
            point: false,
            sound: SFX.INGAME.pickup.fish,
            image: () => document.querySelector("#deadfish"),
            onCollect() {
                gameState.counter -= 10;
                gameState.timer -= 5;
                gameState.collectibles.deathFish++;
                document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + (gameState.freezeFishTime != 0 ? "❄ " : "") + gameState.timer + (gameState.freezeFishTime != 0 ? " ❄" : "");
            },
            rollNextType() {
                return "Bad";
            },
            onDecay() {
                return "Bad";
            }
        },
        Freeze: {
            sound: SFX.INGAME.pickup.freeze,
            image: () => document.querySelector("#freezefish"),
            onCollect() {
                gameState.collectibles.freezeFish++;
                gameState.freezeFishTime = 3;
                document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + (gameState.freezeFishTime != 0 ? "❄ " : "") + gameState.timer + (gameState.freezeFishTime != 0 ? " ❄" : "");
            },
            rollNextType() {
                if ( chance(gameState.chances.timeFish) ) return "Time";
                if ( chance(gameState.chances.coin) ) return "Coin";
                if ( chance(gameState.chances.goldFish) ) return "Gold";
                return "Points";
            }
        },
        Coin: {
            image: () => document.querySelector("#coin"),
            sound: SFX.INGAME.pickup.coin,
            onCollect() {
                gameState.collectibles.coins++;
            },
            rollNextType() {
                if ( chance(gameState.chances.timeFish) ) return "Time";
                if ( chance(gameState.chances.coin) ) return "Coin";
                if ( chance(gameState.chances.goldFish) ) return "Gold";
                if ( chance(gameState.chances.freezeFish) ) return "Freeze";
                return "Points";
            }
        }
    }
}

const splashText = [
    "(Not) The best web game of 2025!",
    "Right now at version: b0.7",
    "Made by wikt0r3k",
    "Yes, I am polish.",
    "Cześć Polsko!",
    "Fish-Cat",
    "These splashes ain't getting translated any time soon.",
    "The \"-\" in logo is a fish :D",
    "Maybe i'll add some more languages...",
    "2 people job for real",
    "God I love itch.io games.",
    "Discord: wikt0r3k",
    "God I love Balatro",
    "Also try... oh wait, my friends don't make games...",
]

const UI = {
    en: {
        shop: {
            your_coins: "Your coins:"
        },
        ingame: {
            your_points: "Your points:",
            your_time: "Time remaining:"
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
            highestScore: "Personal best:"
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
            disclaimer: "*Can vary between different cats."
        },
        creators_contributors: {
            title: "Creators + Contributors",
            wikt0r3k: "wikt0r3k - Developer + SFX + Graphic Designer",
            ankaa: "AnKaa - Graphic Designer",
            suzana: "Suzana - Cats 7-10",
            madzik_20: "Madzik_20 - Concept art for cat 11",
            JasiuKoxYT: "JasiuKoxYT - Bag with a cat design",
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
            highestScore: "New personal best!"
        },
        cats: {
            cat_description: {
                cat_0: "Your default cat.",
                cat_1: {
                    buff: "+ 10% faster cat",
                    debuff: "- 5% less coins"
                },
                cat_2: {
                    buff: "+ 5% more chance for a Coin",
                    debuff: "- 5% less chance for Time Fish"
                },
                cat_3: {
                    buff: "+ 5% more chance for Time Fish",
                    debuff: "- 5% less chance for a Coin"
                },
                cat_4: {
                    buff: "+ 10% chance for Bad Fish to give 3 points instead of taking them",
                    debuff: "- 5% chance for Good Fish to not give any point"
                },
                cat_5: {
                    buff: "+ 10% chance for DOUBLE and 5% for TRIPLE points from Good Fish",
                    debuff: "- 5% chance for Bad Fish to take 10 points"
                },
                cat_6: {
                    buff: "+ 100% more chance for Gold Fish",
                    debuff: "- 20% chance for Good Fish to take 1 point"
                },
                cat_7: {
                    buff: "+ 5 additional fish",
                    debuff: "- 25% smaller cat"
                },
                cat_8: {
                    buff: "+ 10% bigger cat",
                    debuff: "- 5% slower cat"
                },
                cat_9: {
                    buff: "+ 5 additional seconds at start",
                    debuff: "- 1 Good Fish becomes a Bad Fish"
                },
                cat_10: {
                    buff: "+ Time Fish gives 1 second more",
                    debuff: "- You start with only 10 seconds"
                },
                cat_11: {
                    random_event_info: "This cat has a random event picked at the start of the round",
                    random_event_1: "RANDOM EVENT: + 10% faster cat",
                    random_event_2: "RANDOM EVENT: + 10% more coins",
                    random_event_3: "RANDOM EVENT: + 5% more points",
                    random_event_4: "RANDOM EVENT: - You start with only 10 seconds",
                    random_event_5: "RANDOM EVENT: - 5% less coins",
                    random_event_6: "RANDOM EVENT: - 25% smaller cat"
                }
            }
        },
        bag: {
            already_has: "Your already have this cat.",
            instead: "Instead, you'll get",
            coins: "coins."
        }
    },
}

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
        }
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
        quest19: 250
    },
    conditions: {
        quest1: () => (gameState.coins >= 50),
        quest2: () => (gameState.collectibles.goldFish > 0),
        quest3: () => (gameState.collectibles.deathFish > 0),
        quest4: () => (gameState.collectibles.all >= 100),
        quest5: () => (gameState.collectibles.goodFish >= 30),
        quest6: () => (gameState.collectibles.goodFish >= 10 && (gameState.collectibles.badFish + gameState.collectibles.deathFish) < 1),
        quest7: (bags) => (bags < saveState.stats.bags),
        quest8: (rarity) => (rarity == "rare"),
        quest9: (rarity) => (rarity == "epic"),
        quest10: (rarity) => (rarity == "mythic"),
        quest11: () => (gameState.counter >= 50),
        quest12: () => (gameState.counter >= 100),
        quest13: () => (gameState.counter >= 150),
        quest14: () => (gameState.counter >= 200),
        quest15: () => (saveState.stats.other.highestScore < gameState.counter),
        quest16: () => (gameState.collectibles.all >= 500),
        quest17: () => (gameState.coins >= 100),
        quest18: () => (gameState.collectibles.timeFish >= 50),
        quest19: () => (gameState.collectibles.all >= 5 && gameState.collectibles.goodFish < 1),
    }
}

function completeQuest(questID, slotIndex) {
    playSound(SFX.UI.buy_cat);

    saveState.coin += quests.rewards[`quest${questID}`];
    saveState.stats.other.quests++;

    let screen = document.querySelector("body");
    let child = document.createElement("span");
    child.innerHTML = ' +' + quests.rewards["quest" + questID] + ' <img width="32" height="32" src="images/UI/moneta.png"> ';
    child.id = "dailyrewardpopup";
    screen.appendChild(child);
    document.querySelector("#dailyreward").style.filter = "saturate(0)";
    setTimeout(() => screen.removeChild(document.querySelector("#dailyrewardpopup")), 1000);

    const newID = Math.floor(Math.random() * _questCounter) + 1;
    saveState.quests[slotIndex] = {
        id: newID,
        desc: quests.descriptions[saveState.lang][`quest${newID}`],
        reward: quests.rewards[`quest${newID}`],
        status: false
    };
}