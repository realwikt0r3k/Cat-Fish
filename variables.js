// constant vars to get the canvas, set number of all cats in the game and sfx, nothing unusual
const c = document.querySelector("#canvas");
const ctx = c.getContext("2d");

const _catCounter = 12;

// sounds
// 1-9 - UI sounds
// 10-19 - game sounds
function playSound(x) {
    switch(x) {
        case 1:
            {
                const button_click = new Audio("audio/UI/button_click.wav");
                button_click.volume = 0.8;
                button_click.play();
                break;
            }
        case 2: 
            {
                const cat_buy = new Audio("audio/UI/shop_buy_cat.wav");
                cat_buy.volume = 0.8;
                cat_buy.play();
                break;
            }
        case 3: 
            {
                const cat_not_buy = new Audio("audio/UI/shop_not_enough.wav");
                cat_not_buy.volume = 0.75;
                cat_not_buy.play();
                break;
            }
        case 11: 
            {
                const coin_pickup = new Audio("audio/pickup/coin.ogg");
                coin_pickup.volume = 0.75;
                coin_pickup.play();
                break;
            }
        case 12: 
            {
                const fish_pickup = new Audio("audio/pickup/fish.ogg");
                fish_pickup.play();
                break;
            }
    }
}

// game stats
// fishCounter works like: [Good Fish, Bad Fish, Time Fish, Gold Fish, Death Fish]
let counter = 0;
let fishCounter = [0, 0, 0, 0, 0];
let lang = 1;

// player stats
// to change: catCost, unlockedCats
const catCost = [0, 150, 150, 150, 300, 500, 300, 500, 300, 500, 300, 0];
let cat = 0;
let unlockedCats = [true, false, false, false, false, false, false, false, false, false, false, false];
let coins = 0;

let deltaTime = 10/60;
let elapsed;

// cat + fish info
// these can be modified by (de)buffs
let chances = [90, 95, 0.5, 80, 85]; //time, gold, coin, time after gold, coin after gold
let catSize = 50;
let speed = 7;
let timer = 15;
let coinMultiplier = 1;
let pointMultiplier = 1;
let timeFishAdd = 2;
let randomEvent = 0; // cat12 random event

// cat movement vars
let x = 475;
let y = 300;
let vxl = 0;
let vxr = 0;
let vy = 0;

// all UI text
// 0 - polish, 1 - english
const language = [
    ["Twoje punkty: ", "Pozostały czas: ", "pl", "Twoje monety: ", "Już posiadasz tego kota.", "Zamiast tego dostaniesz ", " monet"],
    ["Your points: ", "Time left: ", "en", "Your coins: ", "You have this cat already.", "Instead, you will get ", " coins"]
]

// all cats descriptions (buffs and debuffs)
// 0 - polish, 1 - english
// needs to be converted into JSON file
const catDescription = [
    [
        "<p>Twój podstawowy kot. Nie ma ani dodatkowych umiejętności ani nic.</p>",
        "<p>Your default cat. Does not have any additional abilities etc.</p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 10% szybszy</span><br><span style='color: #ff7486'>- 5% mniej monet</span></p>",
        "<p><span style='color: #87e894'>+ 10% faster</span><br><span style='color: #ff7486'>- 5% less coins</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 5% większa szansa na pojawienie się Monet</span><br><span style='color: #ff7486'>- 5% mniejsza szansa na pojawienie się Rybki Czasu</span></p>",
        "<p><span style='color: #87e894'>+ 5% more chance for Coins to spawn</span><br><span style='color: #ff7486'>- 5% less chance for Time Fish to spawn</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 5% większa szansa na pojawienie się Rybki Czasu</span><br><span style='color: #ff7486'>- 5% mniejsza szansa na pojawienie się Monet</span></p>",
        "<p><span style='color: #87e894'>+ 5% more chance for Time Fish to spawn</span><br><span style='color: #ff7486'>- 5% less chance for Coins to spawn</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 10% szansy, że Zła Rybka da 1 punkt zamiast go zabrać</span><br><span style='color: #ff7486'>- 5% szansy, że Dobra Rybka NIE da punktów</span></p>",
        "<p><span style='color: #87e894'>+ 10% chance for Bad Fish to give 1 point instead of taking it</span><br><span style='color: #ff7486'>- 5% chance for Good Fish to NOT count points.</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 10% szansy, że Dobra Rybka da PODWÓJNĄ liczbę punktów, 5% na POTRÓJNĄ</span><br><span style='color: #ff7486'>- 5% szansy, że Zła Rybka zabierze 5 punktów zamiast 3</span></p>",
        "<p><span style='color: #87e894'>+ 10% chance for Good Fish to give DOUBLE points, 5% for TRIPLE points</span><br><span style='color: #ff7486'>- 5% chance for Bad Fish to take 5 points away instead of 3</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 100% większa szansa na pojawienie się złotej rybki</span><br><span style='color: #ff7486'>- 15% szansy, że Dobra Rybka zabierze 1 punkt</span></p>",
        "<p><span style='color: #87e894'>+ 100% more chance for Goldfish to spawn</span><br><span style='color: #ff7486'>- 15% chance for Good Fish to take away 1 point</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 5 dodatkowych rybek</span><br><span style='color: #ff7486'>- 10% mniejszy kot</span></p>",
        "<p><span style='color: #87e894'>+ 5 additional fish</span><br><span style='color: #ff7486'>- 10% smaller cat</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 10% większy kot</span><br><span style='color: #ff7486'>- 5% wolniejszy</span></p>",
        "<p><span style='color: #87e894'>+ 10% bigger cat</span><br><span style='color: #ff7486'>- 5% slower</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ 5 dodatkowych sekund na start</span><br><span style='color: #ff7486'>- 1 Dobra Rybka zmienia się w Złą Rybkę</span></p>",
        "<p><span style='color: #87e894'>+ 5 additional seconds at start</span><br><span style='color: #ff7486'>- 1 Good Fish changes into a Bad Fish</span></p>",
    ],
    [
        "<p><span style='color: #87e894'>+ każda Rybka Czasu daje ci o 1 sekundę więcej czasu</span><br><span style='color: #ff7486'>- zaczynasz posiadając tylko 6 sekund</span></p>",
        "<p><span style='color: #87e894'>+ every Time Fish adds 1 second more to the timer</span><br><span style='color: #ff7486'>- you start with only 6 seconds</span></p>"
    ],
    [
        "<p><span style='color: #87e894'>Grając tym kotem masz szansę na te wydarzenia:<br>+ 10% szybszy kot<br>+ 10% więcej monet<br>+ 5% więcej punktów</span><br><span style='color: #ff7486'>- Zaczynasz posiadając 12 sekund<br>- 5% mniej monet<br>- 25% mniejszy kot</span></p>",
        "<p><span style='color: #87e894'>Playing with this cat you have a chance for those events:<br>+ 10 faster cat<br>+ 10% more coins<br>+ 5% more points</span><br><span style='color: #ff7486'>- You start with only 10 seconds<br>- 5% less coins<br>- 25% smaller cat</span></p>"
    ]
]

// cat12 random events
// you know the drill
// we do NOT talk about the drill
const catEvent = [
    [
        "<span style='color: #87e894'>+ 10% szybszy kot</span>",
        "<span style='color: #87e894'>+ 10% więcej monet</span>",
        "<span style='color: #87e894'>+ 5% więcej punktów</span>",
        "<span style='color: #ff7486'>- Zaczynasz posiadając tylko 10 sekund</span>",
        "<span style='color: #ff7486'>- 5% mniej monet</span>",
        "<span style='color: #ff7486'>- 25% mniejszy kot</span>"
    ],
    [
        "<span style='color: #87e894'>+ 10% faster cat</span>",
        "<span style='color: #87e894'>+ 10% more coins</span>",
        "<span style='color: #87e894'>+ 5% more points</span>",
        "<span style='color: #ff7486'>- You start with only 10 seconds</span>",
        "<span style='color: #ff7486'>- 5% less coins</span>",
        "<span style='color: #ff7486'>- 25% smaller cat</span>"
    ]
]

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