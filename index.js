window.onload = function () {
    loadGame();
    mainmenu();

    setTimeout(function () {
        background_music.play();
    }, 5000);
}

window.onbeforeunload = function () {
    saveGame();
}

function showPanel(panelId) {
    ["#mainmenu", "#catmenu", "#infomenu", "#questsmenu", "#gameover", "#startingtimer", "#game"].forEach(id => 
        document.querySelector(id).style.display = "none");
    document.querySelector(panelId).style.display = "inline";
}

function changeLanguage(selectLanguage) {
    playSound(SFX.UI.click);
    saveState.lang = selectLanguage;
    document.querySelector("#counter").textContent = UI[saveState.lang].ingame.your_points + " " + gameState.counter;
    document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + gameState.timer;
    document.querySelector("#coinsshop").innerHTML = UI[saveState.lang].shop.your_coins + " " + saveState.coins + ' <img src="images/UI/moneta.png" />';
    switch (cat) {
        case 0:
            document.querySelector("#catdescription").innerHTML = `<p>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]}</p>`;
            break;
        case 11:
            if (randomEvent < 4) {
                document.querySelector("#catdescription").innerHTML = `<p>` +
                    `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_" + gameState.randomEvent]}</span>`
                document.querySelector("#randomEvent").innerHTML = `<p>` +
                    `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_" + gameState.randomEvent]}</span>`
            } else {
                document.querySelector("#catdescription").innerHTML = `<p>` +
                    `<span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_" + gameState.randomEvent]}</span>`
                document.querySelector("#randomEvent").innerHTML = `<p>` +
                    `<span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_" + gameState.randomEvent]}</span>`
            }
            break;
        default:
            document.querySelector("#catdescription").innerHTML = `<p>` +
                `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat].buff}</span>` +
                `<br><span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat].debuff}</span>` +
                `</p>`
            break;
    }
    document.querySelector("#endstats").innerHTML = `<p><p id="#endcounter">${UI[saveState.lang].gameover.your_points} ${gameState.counter}</p>` +
        `<p id="#endcoins">${UI[saveState.lang].gameover.your_coins} ${saveState.coins} <img src="images/UI/moneta.png"/></p>` +
        `<span style="font-size: 75%">${UI[saveState.lang].gameover.good} ${gameState.collectibles.goodFish} <img src="images/fish/rybka.png" width="20" height="20" /></span>` +
        `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.bad} ${gameState.collectibles.badFish} <img src="images/fish/zla_rybka.png" width="20" height="20" /></span>` +
        `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.time} ${gameState.collectibles.timeFish} <img src="images/fish/timer_rybka.png" width="20" height="20" /></span>` +
        `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.gold} ${gameState.collectibles.goldFish} <img src="images/fish/zlota_rybka.png" width="20" height="20" /></span>` +
        `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.death} ${gameState.collectibles.deathFish} <img src="images/fish/smierc_rybka.png" width="20" height="20" /></span>` +
        `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.all_ingame} ${gameState.collectibles.all}</span>` +
        `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.coins} ${gameState.collectibles.coins} <img src="images/UI/moneta.png" width="20" height="20" /></span>`

    document.querySelector("#infomenu").innerHTML = `<div id="gameinfo">` +
        `<span style="color: white; font-size: 250%; position: absolute; top: 10%;"><u>${UI[saveState.lang].infos.all_fish}</u></span>` +
        `<div>` +
        `<img src="images/fish/rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.good}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(0.75&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/zla_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.bad}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(0.25&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/timer_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.time}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(1&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/zlota_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.gold}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(2.5&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.ang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/smierc_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.death}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(2&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<span style="color: white; font-size: 100%; font-weight: 100;"><i>${UI[saveState.lang].infos.disclaimer}</i></span>` +
        `</div>` +
        `<div id="info">` +
        `<span style="color: white; font-size: 250%; position: absolute; top: 10%;"><u>${UI[saveState.lang].creators_contributors.title}</u></span>` +
        `<div class="ig_link" onclick="location.href='https://www.instagram.com/wiktorniak/'">` +
        `<img src="images/UI/instagram.png" width="40px" height="40px" />` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.wikt0r3k}</p>` +
        `</div>` +
        `<div class="ig_link" onclick="location.href='https://www.instagram.com/anlaanka/'">` +
        `<img src="images/UI/instagram.png" width="40px" height="40px" />` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.ankaa}</p>` +
        `</div>` +
        `<div class="ig_link">` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.suzana}</p>` +
        `</div>` +
        `<div class="ig_link">` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.madzik_20}</p>` +
        `</div>` +
        `<div class="ig_link">` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.JasiuKoxYT}</p>` +
        `</div>` +
        `</div>` +
        `<div class="cancel" onclick="mainmenu()">` +
        `<img src="images/UI/cancel.png" width="100px" height="100px">` +
        `</div>`

    document.querySelector("#stats").innerHTML = `<p id="statstitle">${UI[saveState.lang].stats.stats}</p>` +
        `<p> - ${UI[saveState.lang].stats.good} ${saveState.stats.collectibles.goodFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.bad} ${saveState.stats.collectibles.badFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.time} ${saveState.stats.collectibles.timeFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.gold} ${saveState.stats.collectibles.goldFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.death} ${saveState.stats.collectibles.deathFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.coins} ${saveState.stats.collectibles.coins}</p>` +
        `<p class="underlined">${UI[saveState.lang].stats.all} ${saveState.stats.collectibles.all}</p>` +
        `<p class="underlined">${UI[saveState.lang].stats.games} ${saveState.stats.games}</p>` +
        `<p class="underlined">${UI[saveState.lang].stats.quests} ${saveState.stats.quests}</p>` +
        `<p class="underlined">${UI[saveState.lang].stats.bags} ${saveState.stats.bags}</p>`

    let allQuests = document.querySelectorAll(".quest");

    for (let i = 1; i <= 3; i++) {
        saveState.quests[i].desc = quests.descriptions[saveState.lang]["quest" + saveState.quests[i].id];
        saveState.quests[i].reward = quests.rewards["quest" + saveState.quests[i].id];
    }

    allQuests.forEach((element, i) => {
        element.innerHTML = saveState.quests[i].desc + "</br><span style='font-size: 65%; color: azure;'>Reward: " + saveState.quests[i].reward + "</span>";
    })
}

function changeCat(event) {
    selectCat = event.target;

    if (event instanceof Event) {
        const target = event.currentTarget;
        selectCat = Array.from(document.querySelectorAll(".skin")).indexOf(target);
    } else {
        selectCat = event;
    }

    console.log(selectCat);
    if (saveState.unlockedCats[selectCat]) {
        playSound(SFX.UI.click);
        saveState.cat = selectCat;
        document.getElementById("cat").src = "images/cats/cat" + (saveState.cat + 1) + ".png";
        let skins = document.querySelectorAll(".skin");

        document.querySelector("#cats").innerHTML = "";

        for (let skin = 0; skin < skins.length; skin++) {

            let image = "images/cats/cat" + (skin + 1) + ".png";
            let child = document.createElement('div');

            if (!saveState.unlockedCats[skin]) {
                image = document.createElement('img');
                image.src = "images/cats/cat" + (skin + 1) + ".png";
                image.style.filter = "brightness(25%)";
                image.width = "100";
                image.height = "100";
                child.appendChild(image);
                image = document.createElement('img');
                image.src = "images/cats/locks/lock" + catCost[skin] + ".png";
                image.className = "locked";
                child.appendChild(image);
            } else {
                image = document.createElement('img');
                image.src = "images/cats/cat" + (skin + 1) + ".png";
                image.width = "100";
                image.height = "100";
                child.appendChild(image);
                if (saveState.cat == skin) child.style.filter = "brightness(100%)";
                else child.style.filter = "brightness(50%)";
            }

            child.className = "skin";
            child.addEventListener("click", changeCat);
            document.querySelector("#cats").appendChild(child);
        }
    } else {
        if (saveState.coins >= catCost[selectCat] && catCost[selectCat] != 0) {
            playSound(SFX.UI.buy_cat);
            saveState.unlockedCats[selectCat] = true;
            saveState.coins -= catCost[selectCat];
            changeCat(selectCat);
            document.querySelector("#coinsshop").innerHTML = UI[saveState.lang].shop.your_coins + " " + saveState.coins + ' <img src="images/UI/moneta.png" />';
        } else {
            playSound(SFX.UI.buy_cat_fail);
        }
    }

    switch (saveState.cat) {
        case 0:
            document.querySelector("#catdescription").innerHTML = `<p>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]}</p>`;
            break;
        case 11:
            document.querySelector("#catdescription").innerHTML = `<p><span style='color: #f0e440'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_info"]}</span>`;
            break;
        default:
            document.querySelector("#catdescription").innerHTML = `<p>` +
                `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat].buff}</span>` +
                `<br><span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat].debuff}</span>` +
                `</p>`
            break;
    }
}

function startGame(startTime) {
    playSound(SFX.UI.click);
    showPanel("#startingtimer");
    document.querySelector("#startingtimer").textContent = startTime;
    startTime -= 1;
    if (startTime < 1) {
        setTimeout(game, 1000);
    } else {
        setTimeout(startGame, 1000, startTime);
    }
}

function game() {
    showPanel("#game");
    playSound(SFX.UI.click);

    gameState.cat.x = 475;
    gameState.cat.y = 300;
    gameState.counter = 0;

    Object.keys(gameState.collectibles).forEach(stat => {
        gameState.collectibles[stat] = 0;
    })

    gameState.timer = 15;
    gameState.cat.size = 50;
    gameState.cat.speed = 7;
    gameState.timeFishBonus = 1;
    gameState.multipliers.coins = 1;
    gameState.multipliers.points = 1;
    gameState.randomEvent = 0;
    chances = [90, 85, 0.5, 80, 75]; //time, gold, coin, time after gold, coin after gold

    switch (saveState.cat) {
        case 1:
            gameState.speed = 7.7;
            gameState.multipliers.coins = 0.95;
            break;
        case 2:
            chances[0] = 89.775;
            chances[1] = 80.75;
            chances[3] = 79.8;
            chances[4] = 71.25;
            break;
        case 3:
            chances[0] = 85.5;
            chances[1] = 84.7875;
            chances[3] = 76;
            chances[4] = 74.8125;
            break;
        case 6:
            chances[2] = 1;
            break;
        case 7:
            gameState.cat.size = 45;
            break;
        case 8:
            gameState.cat.size = 55;
            gameState.cat.speed = 6.65;
            break;
        case 9:
            gameState.timer = 20;
            break;
        case 10:
            gameState.timeFishBonus = 3;
            gameState.timer = 6;
            break;
        case 11:
            gameState.randomEvent = Math.floor(Math.random() * 6 + 1);
    }

    switch (gameState.randomEvent) {
        case 1:
            gameState.cat.speed = 7.7;
            break;
        case 2:
            gameState.multipliers.coins = 0.95;
            break;
        case 3:
            gameState.multipliers.points = 0.95;
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

    if (saveState.cat == 11) {
        if (gameState.randomEvent < 4) {
            document.querySelector("#randomEvent").innerHTML = `<p>` +
                `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_" + gameState.randomEvent]}</span>`
        } else {
            document.querySelector("#randomEvent").innerHTML = `<p>` +
                `<span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_" + gameState.randomEvent]}</span>`
        }
    } else document.querySelector("#randomEvent").innerHTML = "";

    document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + gameState.timer;

    changeCat(saveState.cat);

    gameState.canPlay = true;
    let interval;

    function time() {
        gameState.timer--;
        document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + gameState.timer;
        if (gameState.timer < 1) {
            gameState.canPlay = false;
            clearInterval(interval);

            let addCoins = parseInt(
                ((gameState.collectibles.goodFish * 0.75 +
                    gameState.collectibles.badFish * 0.25 +
                    gameState.collectibles.timeFish * 1 +
                    gameState.collectibles.goldFish * 2.5 +
                    gameState.collectibles.deathFish * 2) + gameState.collectibles.coins) * gameState.multipliers.coins
            );

            gameState.collectibles.all = gameState.collectibles.goodFish +
                gameState.collectibles.badFish +
                gameState.collectibles.timeFish +
                gameState.collectibles.goldFish +
                gameState.collectibles.deathFish;

            saveState.coins += addCoins;
            gameState.counter = parseInt(gameState.counter * gameState.multipliers.points);

            saveState.stats.collectibles.goodFish += gameState.collectibles.goodFish;
            saveState.stats.collectibles.badFish += gameState.collectibles.badFish;
            saveState.stats.collectibles.timeFish += gameState.collectibles.timeFish;
            saveState.stats.collectibles.goldFish += gameState.collectibles.goldFish;
            saveState.stats.collectibles.deathFish += gameState.collectibles.deathFish;

            saveState.stats.collectibles.coins += gameState.collectibles.coins;
            saveState.stats.collectibles.all += gameState.collectibles.all;
            saveState.stats.games++;

            showPanel("#gameover");

            document.querySelector("#endstats").innerHTML = `<p><p id="#endcounter">${UI[saveState.lang].gameover.your_points} ${gameState.counter}</p>` +
                `<p id="#endcoins">${UI[saveState.lang].gameover.your_coins} ${saveState.stats.collectibles.coins} <img src="images/UI/moneta.png"/></p>` +
                `<span style="font-size: 75%">${UI[saveState.lang].gameover.good} ${gameState.collectibles.goodFish} <img src="images/fish/rybka.png" width="20" height="20" /></span>` +
                `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.bad} ${gameState.collectibles.badFish} <img src="images/fish/zla_rybka.png" width="20" height="20" /></span>` +
                `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.time} ${gameState.collectibles.timeFish} <img src="images/fish/timer_rybka.png" width="20" height="20" /></span>` +
                `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.gold} ${gameState.collectibles.goldFish} <img src="images/fish/zlota_rybka.png" width="20" height="20" /></span>` +
                `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.death} ${gameState.collectibles.deathFish} <img src="images/fish/smierc_rybka.png" width="20" height="20" /></span>` +
                `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.all_ingame} ${gameState.collectibles.all}</span>` +
                `<br><span style="font-size: 75%">${UI[saveState.lang].gameover.coins} ${gameState.collectibles.coins} <img src="images/UI/moneta.png" width="20" height="20" /></span>`

            for (let i = 0; i <= 2; i++) {
                setTimeout(function () {
                    switch (saveState.quests[i].id) {
                        case 1:
                            if (addCoins >= 50) completeQuest(1, i);
                            break;
                        case 2:
                            if (gameState.collectibles.goldFish > 0) completeQuest(2, i);
                            break;
                        case 3:
                            if (gameState.collectibles.deathFish > 0) completeQuest(3, i);
                            break;
                        case 4:
                            if (gameState.collectibles.all >= 100) completeQuest(4, i);
                            break;
                        case 5:
                            if (gameState.collectibles.goodFish >= 30) completeQuest(5, i);
                            break;
                        case 6:
                            if (gameState.collectibles.all >= 10 && gameState.collectibles.badFish == 0) completeQuest(6, i);
                            break;
                    }
                }, 100 * i)
            }
        }
    }

    let point = new Point(true, "Time");
    let point2 = new Point(false);
    let point3 = new Point(true);
    let point4 = new Point(false);
    let point5 = new Point(true);
    let point6 = new Point(true);
    let point7 = new Point(true);
    let point8 = new Point(false);
    let point9 = new Point(false);
    let point10 = new Point(true);
    let point11 = new Point(false);
    let point12;
    let point13;
    let point14;
    let point15;
    let point16;
    let point17;

    if (saveState.cat == 9) point12 = new Point(false);
    else point12 = new Point(true);
    if (saveState.cat == 7) {
        point13 = new Point(true);
        point14 = new Point(true);
        point15 = new Point(true);
        point16 = new Point(false);
        point17 = new Point(false);
    }


    let startTime = performance.now();

    function update() {
        let time = performance.now();
        elapsed = (time - startTime);
        startTime = time;

        if (gameState.canPlay) {
            ctx.clearRect(0, 0, c.width, c.height);
            player.move();
            point.update();
            point2.update();
            point3.update();
            point4.update();
            point5.update();
            point6.update();
            point7.update();
            point8.update();
            point9.update();
            point10.update();
            point11.update();
            point12.update();
            if (saveState.cat == 7) {
                point13.update();
                point14.update();
                point15.update();
                point16.update();
                point17.update();
            }
            document.querySelector("#counter").textContent = UI[saveState.lang].ingame.your_points + " " + gameState.counter;
        }
        requestAnimationFrame(update);
    }

    update();
    interval = setInterval(time, 1000);
}

function mainmenu() {
    playSound(SFX.UI.click);
    if (!saveState.daily) document.querySelector("#dailyreward").style.filter = "saturate(0)";

    document.querySelector("#splashtext").textContent = splashText[Math.floor(Math.random() * splashText.length)];

    showPanel("#mainmenu");
}

function infomenu() {
    playSound(SFX.UI.click);
    showPanel("#infomenu");

    document.querySelector("#infomenu").innerHTML = `<div id="gameinfo">` +
        `<span style="color: white; font-size: 250%; position: absolute; top: 10%;"><u>${UI[saveState.lang].infos.all_fish}</u></span>` +
        `<div>` +
        `<img src="images/fish/rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.good}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(0.75&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/zla_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.bad}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(0.25&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/timer_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.time}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(1&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/zlota_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.gold}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(2.5&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/smierc_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.death}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(2&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<span style="color: white; font-size: 100%; font-weight: 100;"><i>${UI[saveState.lang].infos.disclaimer}</i></span>` +
        `</div>` +
        `<div id="info">` +
        `<span style="color: white; font-size: 250%; position: absolute; top: 10%;"><u>${UI[saveState.lang].creators_contributors.title}</u></span>` +
        `<div class="ig_link" onclick="location.href='https://www.instagram.com/wiktorniak/'">` +
        `<img src="images/UI/instagram.png" width="40px" height="40px" />` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.wikt0r3k}</p>` +
        `</div>` +
        `<div class="ig_link" onclick="location.href='https://www.instagram.com/anlaanka/'">` +
        `<img src="images/UI/instagram.png" width="40px" height="40px" />` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.ankaa}</p>` +
        `</div>` +
        `<div class="ig_link">` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.suzana}</p>` +
        `</div>` +
        `<div class="ig_link">` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.madzik_20}</p>` +
        `</div>` +
        `<div class="ig_link">` +
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.JasiuKoxYT}</p>` +
        `</div>` +
        `</div>` +
        `<div class="cancel" onclick="mainmenu()">` +
        `<img src="images/UI/cancel.png" width="100px" height="100px">` +
        `</div>`
}

function catmenu() {
    playSound(SFX.UI.click);
    document.querySelector("#coinsshop").innerHTML = UI[saveState.lang].shop.your_coins + " " + saveState.coins + ' <img src="images/UI/moneta.png" />';
    document.querySelector("#cats").innerHTML = "";

    let parent = document.querySelector("#cats");
    let image;

    for (let i = 0; i < _catCounter; i++) {
        let child = document.createElement('div');
        if (!saveState.unlockedCats[i]) {
            image = document.createElement('img');
            image.src = "images/cats/cat" + (i + 1) + ".png";
            image.style.filter = "brightness(25%)";
            image.width = "100";
            image.height = "100";
            child.appendChild(image);
            image = document.createElement('img');
            image.src = "images/cats/locks/lock" + catCost[i] + ".png";
            image.className = "locked";
            child.appendChild(image);
        } else {
            image = document.createElement('img');
            image.src = "images/cats/cat" + (i + 1) + ".png";
            image.width = "100";
            image.height = "100";
            child.appendChild(image);
            if (saveState.cat == i) child.style.filter = "brightness(100%)";
            else child.style.filter = "brightness(50%)";
        }

        child.className = "skin";
        child.addEventListener("click", changeCat);
        parent.appendChild(child);
    }

    switch (saveState.cat) {
        case 0:
            document.querySelector("#catdescription").innerHTML = `<p>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]}</p>`;
            break;
        case 11:
            document.querySelector("#catdescription").innerHTML = `<p><span style='color: #f0e440'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_info"]}</span>`;
            break;
        default:
            document.querySelector("#catdescription").innerHTML = `<p>` +
                `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat].buff}</span>` +
                `<br><span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat].debuff}</span>` +
                `</p>`
            break;
    }

    document.querySelector("#stats").innerHTML = `<p id="statstitle">${UI[saveState.lang].stats.stats}</p>` +
        `<p> - ${UI[saveState.lang].stats.good} ${saveState.stats.collectibles.goodFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.bad} ${saveState.stats.collectibles.badFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.time} ${saveState.stats.collectibles.timeFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.gold} ${saveState.stats.collectibles.goldFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.death} ${saveState.stats.collectibles.deathFish}</p>` +
        `<p> - ${UI[saveState.lang].stats.coins} ${saveState.stats.collectibles.coins}</p>` +
        `<p class="underlined">${UI[saveState.lang].stats.all} ${saveState.stats.collectibles.all}</p>` +
        `<p class="underlined">${UI[saveState.lang].stats.games} ${saveState.stats.games}</p>` +
        `<p class="underlined">${UI[saveState.lang].stats.quests} ${saveState.stats.quests}</p>` +
        `<p class="underlined">${UI[saveState.lang].stats.bags} ${saveState.stats.bags}</p>`

    showPanel("#catmenu");
}

function caseEnd(getCat, moneyShow, isFirst) {
    let openBag = document.querySelector(".openbag");
    let endCat = document.createElement("div");
    let endCatDesc = document.createElement("div");
    let endCatImg = document.createElement("img");

    let endCancel = document.createElement("div");
    let endCancelImg = document.createElement("img");

    endCancel.className = "endcasecancel";

    endCancelImg.src = "images/UI/cancel.png";
    endCancelImg.width = 100;
    endCancelImg.height = 100;

    endCancel.appendChild(endCancelImg);

    openBag.innerHTML = "";

    endCat.className = "endcasecat";
    endCatDesc.className = "endcasedesc";

    endCatImg.src = "images/cats/cat" + (getCat + 1) + ".png";
    endCatImg.width = 260;
    endCatImg.height = 260;

    if (!isFirst) {
        playSound(SFX.UI.buy_cat_fail);
        endCatImg.style.filter = "saturate(0)";
        endCatImg.style.opacity = "0.65";

        endCatDesc.innerHTML = UI[saveState.lang].bag.already_has + " <br>" + UI[saveState.lang].bag.instead + " " + moneyShow + " " + UI[saveState.lang].bag.coins;
    } else {
        playSound(SFX.UI.buy_cat);
        switch (cat) {
            case 0:
                endCatDesc.innerHTML = `<p>${UI[saveState.lang].cats.cat_description["cat_" + getCat]}</p>`;
                break;
            case 11:
                if (randomEvent < 4) {
                    endCatDesc.innerHTML = `<p>` +
                        `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + getCat]["random_event_" + gameState.randomEvent]}</span>`
                } else {
                    endCatDesc.innerHTML = `<p>` +
                        `<span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + getCat]["random_event_" + gameState.randomEvent]}</span>`
                }
                break;
            default:
                endCatDesc.innerHTML = `<p>` +
                    `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + getCat].buff}</span>` +
                    `<br><span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + getCat].debuff}</span>` +
                    `</p>`
                break;
        }
    }
    endCat.appendChild(endCatImg);

    openBag.appendChild(endCat);
    openBag.appendChild(endCatDesc);
    openBag.appendChild(endCancel);

    document.querySelector(".endcasecancel").addEventListener("click", () => {
        document.querySelector(".blackscreen").innerHTML = "";
        catmenu();
    })
}

function openCase() {
    if (saveState.coins >= 250) {
        saveState.coins -= 250;
        saveState.stats.bags++;

        let blackScreen = document.querySelector(".blackscreen");
        let openBag = document.createElement("div");
        let openLine = document.createElement("div");
        let openWin = document.createElement("div");
        let openShow = document.createElement("div");
        let bagAnim = document.createElement("img");

        openBag.className = "openbag";
        openLine.className = "openingline";
        openWin.className = "openingwindow";
        openShow.className = "openingshow";

        bagAnim.className = "baganimation";

        bagAnim.src = "images/cats/bag/cat_bag.png";

        let saveBox;
        let saveRarity;
        let catToMoney;

        for (let i = 0; i < 30; i++) {
            box = document.createElement('div');
            randomBox = Math.floor(Math.random() * 100) + 1;

            image = document.createElement('img');
            image.width = "90";
            image.height = "90";

            let openCat;
            let saveOpenCat;
            let saveOpenRarity;

            if (randomBox <= 2) {
                saveOpenCat = 11;
                box.classList = ["box mythic"];

                saveOpenRarity = "mythic";

                image.src = "images/cats/cat" + (saveOpenCat + 1) + ".png";
            } else if (randomBox <= 7) {
                openCat = Math.floor(Math.random() * 3) + 1;
                if (openCat == 1) saveOpenCat = 5;
                else if (openCat == 2) saveOpenCat = 7;
                else saveOpenCat = 9;

                saveOpenRarity = "epic";

                box.classList = ["box epic"];
                image.src = "images/cats/cat" + (saveOpenCat + 1) + ".png";
            } else if (randomBox <= 27) {
                openCat = Math.floor(Math.random() * 4) + 1;
                if (openCat == 1) saveOpenCat = 4;
                else if (openCat == 2) saveOpenCat = 6;
                else if (openCat == 3) saveOpenCat = 8;
                else saveOpenCat = 10;

                saveOpenRarity = "rare";

                box.classList = ["box rare"];
                image.src = "images/cats/cat" + (saveOpenCat + 1) + ".png";
            } else {
                openCat = Math.floor(Math.random() * 3) + 1;
                if (openCat == 1) saveOpenCat = 1;
                else if (openCat == 2) saveOpenCat = 2;
                else saveOpenCat = 3;

                saveOpenRarity = "common";

                box.classList = ["box common"];
                image.src = "images/cats/cat" + (saveOpenCat + 1) + ".png";
            }

            if (i == 27) {
                saveBox = saveOpenCat;
                saveRarity = saveOpenRarity;

                if (saveRarity == "mythic") catToMoney = 500;
                else if (saveRarity == "epic") catToMoney = 250;
                else if (saveRarity == "rare") catToMoney = 150;
                else catToMoney = 75;

                if (saveState.unlockedCats[saveBox]) {
                    saveState.coins += catToMoney;
                    first = false;
                } else {
                    saveState.unlockedCats[saveBox] = true;
                    first = true;
                }
            }
            box.appendChild(image);
            openLine.appendChild(box);
        }

        catmenu();

        openWin.appendChild(openLine);
        openBag.appendChild(openWin);
        openBag.appendChild(openShow);
        openBag.appendChild(bagAnim);

        blackScreen.innerHTML = "";
        blackScreen.appendChild(openBag);

        changeCat(saveBox);
        setTimeout(caseEnd, 5000, saveBox, catToMoney, first);
    } else {
        playSound(SFX.UI.buy_cat_fail);
    }
}

function collectDaily() {
    if (saveState.daily) {
        playSound(SFX.UI.buy_cat);
        let screen = document.querySelector("body");
        let child = document.createElement("span");
        child.innerHTML = ' +250 <img width="32" height="32" src="images/UI/moneta.png"> ';
        child.id = "dailyrewardpopup";
        screen.appendChild(child);
        saveState.coins += 250;
        document.querySelector("#dailyreward").style.filter = "saturate(0)";
        setTimeout(function () {
            screen.removeChild(document.querySelector("#dailyrewardpopup"));
        }, 1000);
        saveState.daily = false;
    } else {
        playSound(SFX.UI.buy_cat_fail);
    }
}

function questmenu() {
    playSound(SFX.UI.click);

    let allQuests = document.querySelectorAll(".quest");

    allQuests.forEach((element, i) => {
        element.innerHTML = saveState.quests[i].desc + "</br><span style='font-size: 65%; color: azure;'>Reward: " + saveState.quests[i].reward + "</span>";
    })

    showPanel("#questsmenu");
}

function mute(x) {
    switch (x) {
        case 1:
            background_music.muted = saveState.music;
            saveState.music = !saveState.music;
            if (saveState.music) document.querySelector("#music").classList = ["sound"]
            else document.querySelector("#music").classList = ["sound off"]
            break;
        case 2:
            saveState.sfx = !saveState.sfx;
            if (saveState.sfx) document.querySelector("#sfx").classList = ["sound"]
            else document.querySelector("#sfx").classList = ["sound off"]
            break;
    }
    if (saveState.sfx) playSound(SFX.UI.click);
}