// constant vars to get the canvas, set number of all cats in the game and sfx, nothing unusual
const c = document.querySelector("#canvas");
const ctx = c.getContext("2d");

const _catCounter = 12;
const _questCounter = 6;

let animationFrame = null, timerInterval = null;
let vxr = 0, vxl = 0, vy = 0, elapsed;

const deltaTime = 1000/144;
const catCost = [0, 150, 150, 150, 150, 300, 300, 300, 300, 500, 500, 0];

chances = [90, 85, 0.5, 80, 75]; //time, gold, coin, time after gold, coin after gold

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
        coins: 0,
        all: 0
    },
    timeFishBonus: 2,
    multipliers: {
        coins: 1,
        points: 1
    },
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
            coins: 0,
            all: 0
        },
        highestScore: 0,
        games: 0,
        quests: 0,
        bags: 0
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
        console.log(`Fish type: ${type}`)
        this.reposition();
    }

    reposition() {
        [this.rx, this.ry] = [Math.floor(Math.random() * 880) + 40, Math.floor(Math.random() * 530) + 40];
    }

    detectCollision() {
        if (gameState.canPlay) {
            const colliding = (gameState.cat.x + gameState.cat.size > this.rx && gameState.cat.x < this.rx + 30) && (gameState.cat.y + gameState.cat.size > this.ry && gameState.cat.y < this.ry + 30);

            if (!colliding) return;

            const fish = COLLECTIBLES.FISH[this.type];
            playSound(fish.sound);
            fish.onCollect();

            if (fish.onCollectDelay) fish.onCollectDelay.call(this, chances);

            this.type = fish.rollNextType(chances);
            this.reposition();
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

// sounds
// 1-9 - UI sounds
// 10-19 - game sounds
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
                source: "audio/pickup/coin.ogg",
                volume: 0.75,
                pitch_preserve: true,
                playback_rate: 1
            },
            fish: {
                source: "audio/pickup/fish.ogg",
                volume: 0.75,
                pitch_preserve: false,
                playback_rate: (Math.random() / 2) + 1.25
            },
            fish_rare: {
                source: "audio/pickup/fish_rare.ogg",
                volume: 0.25,
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
            rollNextType(chances) {
                const roll = Math.random() * 100;
                if (roll + 1 > chances[0]) return "Time";
                if (roll + 1 > chances[1]) return "Coin";
                if (roll < chances[2]) return "Gold";
                return "Points";
            }
        },
        Time: {
            image: () => document.querySelector("#timefish"),
            sound: SFX.INGAME.pickup.fish,
            onCollect() {
                gameState.timer += gameState.timeFishBonus;
                gameState.collectibles.timeFish++;
            },
            rollNextType(chances) {
                const roll = Math.random() * 100;
                if (roll + 1 > chances[0]) return "Time";
                if (roll + 1 > chances[1]) return "Coin";
                if (roll < chances[2]) return "Gold";
                return "Points";
            }
        },
        Gold: {
            image: () => document.querySelector("#goldfish"),
            sound: SFX.INGAME.pickup.fish,
            onCollect() {
                gameState.timer += 5;
                gameState.counter += 10;
                gameState.collectibles.goldFish++;
            },
            rollNextType(chances) {
                return "Points";
            },
            onCollectDelay(chances) {
                setTimeout(() => {
                    if (Math.floor(Math.random() * 100) > chances[3]) this.type = "Time";
                    else if (Math.floor(Math.random() * 100) > chances[4]) this.type = "Coin";
                    else this.type = "Points";
                }, 5000)
            }
        },
        Bad: {
            point: false,
            sound: SFX.INGAME.pickup.fish,
            image: () => document.querySelector("#badfish"),
            onCollect() {
                switch (cat) {
                    case 4:
                        if (Math.floor(Math.random() * 100) + 1 >= 11) gameState.counter -= 3;
                        else gameState.counter++;
                        break;
                    case 5:
                        gameState.counter -= (Math.floor(Math.random() * 100) + 1 <= 5) ? 5 : 3;
                        break;
                    default:
                        gameState.counter -= 3; 
                }
                gameState.collectibles.badFish++;
            },
            rollNextType(chances) {
                return Math.floor(Math.random() * 100) === 47 ? "Death" : "Bad";
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
            },
            rollNextType(chances) {
                return "Bad";
            },
            onCollectDelay(fish) {
                setTimeout(() => {
                    fish.type = "Bad";
                }, 5000)
            }
        },
        Coin: {
            image: () => document.querySelector("#coin"),
            sound: SFX.INGAME.pickup.coin,
            onCollect() {
                gameState.collectibles.coins++;
            },
            rollNextType() {
                const roll = Math.random() * 100;
                if (roll + 1 > chances[0]) return "Time";
                if (roll + 1 > chances[1]) return "Coin";
                if (roll < chances[2]) return "Gold";
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
            good: "Good Fish:",
            bad: "Bad Fish:",
            time: "Time Fish:",
            gold: "Goldfish:",
            death: "Deathfish:",
            coins: "Coins:",
            all: "All:",
            games: "Played games:",
            quests: "Completed quests:",
            bags: "Opened bags:",
            personal_best: "Personal best:"
        },
        infos: {
            all_fish: "All fish:",
            good: "Good Fish - gives 1* point",
            bad: "Bad Fish - takes away 3* points",
            time: "Time Fish - adds 2* seconds",
            gold: "Goldfish - gives 10 points + 5 seconds",
            death: "Deathfish - takes away 10 points + 5 seconds",
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
            good: "Good Fish:",
            bad: "Bad Fish:",
            time: "Time Fish:",
            gold: "Goldfish:",
            death: "Deathfish:",
            all_ingame: "Total fish:",
            coins: "Collected coins: ",
            items: "items collected, which converts into:",
            personal_best: "New personal best!"
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
    pl: {
        shop: {
            your_coins: "Twoje monety:"
        },
        ingame: {
            your_points: "Twoje punkty:",
            your_time: "Pozostały czas:"
        },
        stats: {
            stats: "Twoje statystyki:",
            good: "Dobre Rybki:",
            bad: "Złe Rybki:",
            time: "Rybki Czasu:",
            gold: "Złote rybki:",
            death: "Rybki Śmierci:",
            coins: "Monety:",
            all: "Wszystko:",
            games: "Zagrane gry:",
            quests: "Ukończone zadania:",
            bags: "Otwarte worki:",
            personal_best: "Personal best:"
        },
        infos: {
            all_fish: "Wszystkie ryby:",
            good: "Dobra Rybka - daje 1* punkt",
            bad: "Zła Rybka - zabiera 3* punkty",
            time: "Rybka Czasu - daje 2* sekundy",
            gold: "Złota rybka - daje 10 punktów + 5 sekund",
            death: "Rybka Śmierci - zabiera 10 punktów + 5 sekund",
            per_fish: "ryba",
            disclaimer: "*Może się różnić pomiędzy kotami."
        },
        creators_contributors: {
            title: "Twórcy + Kontrybutorzy",
            wikt0r3k: "wikt0r3k - Programista + SFX + Grafik",
            ankaa: "AnKaa - Grafik",
            suzana: "Suzana - Koty 7-10",
            madzik_20: "Madzik_20 - Koncept kota 11",
            JasiuKoxYT: "JasiuKoxYT - Design worka z kotem",
        },
        gameover: {
            your_points: "Twoje punkty: ",
            your_coins: "Twoje monety:",
            picked_up: "W trakcie tej gry, zebrałeś:",
            good: "Dobre Rybki:",
            bad: "Złe Rybki:",
            time: "Rybki Czasu:",
            gold: "Złote Rybki:",
            death: "Rybki Śmierci:",
            all_ingame: "Rybek łącznie:",
            coins: "Zebrane monety: ",
            items: "zebranych rzeczy, co w przeliczeniu wynosi:",
            personal_best: "Nowy rekord!"
        },
        cats: {
            cat_description: {
                cat_0: "Twój domyślny kot.",
                cat_1: {
                    buff: "+ 10% szybszy kot",
                    debuff: "- 5% mniej monet"
                },
                cat_2: {
                    buff: "+ 5% więcej szans na Monetę",
                    debuff: "- 5% mniej szans na Rybkę Czasu"
                },
                cat_3: {
                    buff: "+ 5% więcej szans na Rybkę Czasu",
                    debuff: "- 5% mniej szans na Monetę"
                },
                cat_4: {
                    buff: "+ 10% szansy na to, że Zła Rybka da 3 punkty zamiast ich zabrać",
                    debuff: "- 5% szans na to, że Dobra Rybka nie da punktów"
                },
                cat_5: {
                    buff: "+ 10% szans na PODWÓJNE oraz 5% na POTRÓJNE punkty z Dobrej Rybki",
                    debuff: "- 5% szansy na to, że Zła Rybka zabierze 10 punktów"
                },
                cat_6: {
                    buff: "+ 100% więcej szans na Złotą Rybkę",
                    debuff: "- 20% szans na to, że Dobra Rybka zabierze punkt"
                },
                cat_7: {
                    buff: "+ 5 dodatkowych rybek",
                    debuff: "- 25% mniejszy kot"
                },
                cat_8: {
                    buff: "+ 10% większy kot",
                    debuff: "- 5% wolniejszy kot"
                },
                cat_9: {
                    buff: "+ 5 dodatkowych sekund na start",
                    debuff: "- 1 Dobra Rybka staje się Złą Rybką"
                },
                cat_10: {
                    buff: "+ Time Fish daje ci o 1 sekundę więcej",
                    debuff: "- Zaczynasz posiadając tylko 10 sekund"
                },
                cat_11: {
                    random_event_info: "Ten kot ma wybierany losowy event na początku rundy",
                    random_event_1: "RANDOM EVENT: + 10% szybszy kot",
                    random_event_2: "RANDOM EVENT: + 10% więcej monet",
                    random_event_3: "RANDOM EVENT: + 5% więcej punktów",
                    random_event_4: "RANDOM EVENT: - Zaczynasz posiadając tylko 10 sekund",
                    random_event_5: "RANDOM EVENT: - 5% mniej monet",
                    random_event_6: "RANDOM EVENT: - 25% mniejszy kot"
                }
            }
        },
        bag: {
            already_has: "Posiadasz już tego kota.",
            instead: "W zamian, otrzymasz za niego",
            coins: "monet."
        }
    }
}

const quests = {
    descriptions: {
        en: {
            your_quests: "Your quests",
            reward: "Reward",
            quest1: "Earn 50 coins in a single game",
            quest2: "Collect a Goldfish",
            quest3: "Collect a Deathfish",
            quest4: "Collect a total of 100 fish in one game",
            quest5: "Collect a total of 30 Good Fish in one game",
            quest6: "Finish a game with at least 10 fish and no bad one",
            quest7: "Open a cat bag",
            quest8: "Roll a RARE cat",
            quest9: "Roll an EPIC cat",
            quest10: "Roll a MYTHIC cat"
        },
        pl: {
            your_quests: "Twoje zadania",
            reward: "Nagroda",
            quest1: "Zarób 50 monet w trakcie jeden gry",
            quest2: "Zbierz Złotą Rybkę",
            quest3: "Zbierz Rybkę Śmierci",
            quest4: "Zbierz łącznie 100 rybek w trakcie jednej gry",
            quest5: "Zbierz łącznie 30 Dobrych Rybek w trakcie jednej gry",
            quest6: "Skończ grę z minimum 10 dobrymi rybkami bez złych",
            quest7: "Otwórz worek z kotem",
            quest8: "Wylosuj RZADKIEGO kota",
            quest9: "Wylosuj EPICKIEGO kota",
            quest10: "Wylosuj MITYCZNEGO kota"
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
        quest10: 1000
    }
}

function completeQuest(questID, slotIndex) {
    playSound(SFX.UI.buy_cat);

    saveState.coin += quests.rewards[`quest${questID}`];
    saveState.stats.quests++;

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