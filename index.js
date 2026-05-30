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
    switch (saveState.cat) {
        case 0:
            document.querySelector("#catdescription").innerHTML = `<p>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]}</p>`;
            break;
        case 11:
            document.querySelector("#catdescription").innerHTML = `<p><span style='color: #f0e440'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_info"]}</span>`;
            document.querySelector("#randomEvent").innerHTML = `<p>` +
                `<span style='color: ${gameState.randomEvent < 4 ? "#87e894" : "#ff7486"}'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_" + gameState.randomEvent]}</span>`
            break;
        default:
            document.querySelector("#catdescription").innerHTML = `<p>` +
                `<span style='color: #87e894'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat].buff}</span>` +
                `<br><span style='color: #ff7486'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat].debuff}</span>` +
                `</p>`
            break;
    }

    let personal_record = saveState.stats.highestScore < gameState.counter ? `<span style="color: #ff7486; font-size: 35%;">${UI[saveState.lang].gameover.personal_best}</span>` : '';
    
    let end_stats = `<p id="#endcounter">${UI[saveState.lang].gameover.your_points} ${gameState.counter} ${personal_record}</p>`;
    end_stats += `<p id="#endcoins">${UI[saveState.lang].gameover.your_coins} ${saveState.coins} <img src="images/UI/moneta.png"/></p>`

    Object.keys(gameState.collectibles).forEach(stat => {
        end_stats += `<br><span style="font-size: 75%">${UI[saveState.lang].gameover[stat]} ${gameState.collectibles[stat]}</span>`
    })

    document.querySelector("#endstats").innerHTML = end_stats;

    document.querySelector("#infomenu").innerHTML = `<div id="gameinfo">` +
        `<span style="color: white; font-size: 250%; position: absolute; top: 10%;"><u>${UI[saveState.lang].infos.all_fish}</u></span>` +
        `<div>` +
        `<img src="images/fish/rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.goodFish}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(0.75&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/zla_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.badFish}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(0.25&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/timer_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.timeFish}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(1&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/zlota_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.goldFish}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(2.5&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.ang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/smierc_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.deathFish}</p>` +
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

    let stats = `<p id="statstitle">${UI[saveState.lang].stats.stats}</p>`;
    Object.keys(saveState.stats.collectibles).forEach(stat => {
        stats += `<p> - ${UI[saveState.lang].stats[stat]} ${saveState.stats.collectibles[stat]}</p>`
    })
    Object.keys(saveState.stats.other).forEach(stat => {
        stats += `<p class="underlined">${UI[saveState.lang].stats[stat]} ${saveState.stats.other[stat]}</p>`
    })

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
    const collectibles = [];

    cancelAnimationFrame(animationFrame);
    clearInterval(timerInterval);

    showPanel("#game");
    playSound(SFX.UI.click);

    gameState.cat.x = 475;
    gameState.cat.y = 300;
    gameState.counter = 0;

    Object.keys(gameState.collectibles).forEach(stat => {
        gameState.collectibles[stat] = 0;
    })

    gameState.collectibles_limit = 12;
    gameState.collectibles_bad_limit = 5;
    gameState.timer = 15;
    gameState.cat.size = 50;
    gameState.cat.speed = 7;
    gameState.timeFishBonus = 1;
    gameState.freezeFishTime = 0;
    gameState.multipliers.coins = 1;
    gameState.multipliers.points = 1;
    gameState.randomEvent = 0;
    gameState.chances = {
        goodFish: 100,
        badFish: 100,
        timeFish: 15,
        goldFish: 0.5,
        deathFish: 1,
        coin: 5,
        freezeFish: 2.5
    };

    switch (saveState.cat) {
        case 1:
            gameState.speed = 7.7;
            gameState.multipliers.coins = 0.95;
            break;
        case 2:
            gameState.chances.coin += 5;
            gameState.chances.timeFish -= 5;
            break;
        case 3:
            gameState.chances.coin -= 5;
            gameState.chances.timeFish += 5;
            break;
        case 6:
            chances[2] = 1;
            break;
        case 7:
            gameState.cat.size = 37.5;
            gameState.collectibles_limit = 17;
            break;
        case 8:
            gameState.cat.size = 55;
            gameState.cat.speed = 6.65;
            break;
        case 9:
            gameState.timer = 20;
            gameState.collectibles_bad_limit = 6;
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
        document.querySelector("#randomEvent").innerHTML = `<p>` +
            `<span style='color: ${gameState.randomEvent < 4 ? "#87e894" : "#ff7486"}'>${UI[saveState.lang].cats.cat_description["cat_" + saveState.cat]["random_event_" + gameState.randomEvent]}</span>`
    } else document.querySelector("#randomEvent").innerHTML = "";

    document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + (gameState.freezeFishTime != 0 ? "❄ " : "") + gameState.timer + (gameState.freezeFishTime != 0 ? " ❄" : "");

    changeCat(saveState.cat);

    gameState.canPlay = true;
    function time() {
        elapsed = 0;

        gameState.freezeFishTime != 0 ? gameState.freezeFishTime-- : gameState.timer--;

        document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + (gameState.freezeFishTime != 0 ? "❄ " : "") + gameState.timer + (gameState.freezeFishTime != 0 ? " ❄" : "");
        if (gameState.timer < 1) {
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrame);

            gameState.canPlay = false;
            gameState.coins = parseInt(
                ((gameState.collectibles.goodFish * 0.75 +
                    gameState.collectibles.badFish * 0.25 +
                    gameState.collectibles.timeFish * 1 +
                    gameState.collectibles.goldFish * 2.5 +
                    gameState.collectibles.deathFish * 2) + gameState.collectibles.coins) * gameState.multipliers.coins
            );

            saveState.coins += gameState.coins;
            gameState.counter = parseInt(gameState.counter * gameState.multipliers.points);

            Object.keys(saveState.stats.collectibles).forEach(stat => {
                saveState.stats.collectibles[stat] += gameState.collectibles[stat];
            })

            saveState.stats.other.games++;

            showPanel("#gameover");

            saveState.quests.forEach((quest, i) => {
                setTimeout(function () {
                    if(quests.conditions["quest" + quest.id]()) completeQuest(quest.id, i);
                }, 200 * i)
            });

            const personal_record = saveState.stats.other.highestScore < gameState.counter ? `<span style="color: #ff7486; font-size: 35%;">${UI[saveState.lang].gameover.highestScore}</span>` : '';
            if (saveState.stats.other.highestScore < gameState.counter) saveState.stats.other.highestScore = gameState.counter;

            let end_stats = `<p id="#endcounter">${UI[saveState.lang].gameover.your_points} ${gameState.counter} ${personal_record}</p>`;
            end_stats += `<p id="#endcoins">${UI[saveState.lang].gameover.your_coins} ${saveState.coins} <img src="images/UI/moneta.png"/></p>`

            Object.keys(gameState.collectibles).forEach(stat => {
                end_stats += `<br><span style="font-size: 75%">${UI[saveState.lang].gameover[stat]} ${gameState.collectibles[stat]}</span>`
            })

            document.querySelector("#endstats").innerHTML = end_stats;
        }
    }

    for(i=1;i<=gameState.collectibles_limit;i++) {
        console.log(`${i} / ${gameState.collectibles_limit}`)
        collectibles.push(
            new Point((i < gameState.collectibles_bad_limit) ? false : true, (i == gameState.collectibles_limit) ? "Time" : undefined)
        )
    }

    let startTime = performance.now();

    function update() {
        let time = performance.now();
        elapsed = (time - startTime);
        startTime = time;

        if (gameState.canPlay) {
            ctx.clearRect(0, 0, c.width, c.height);
            player.move();
            collectibles.forEach(collectible => {
                collectible.update();
            })
            document.querySelector("#counter").textContent = UI[saveState.lang].ingame.your_points + " " + gameState.counter;
        }
        animationFrame = requestAnimationFrame(update);
    }
    animationFrame = requestAnimationFrame(update);
    timerInterval = setInterval(time, 1000);
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
        `<p>&nbsp;${UI[saveState.lang].infos.goodFish}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(0.75&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/zla_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.badFish}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(0.25&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/timer_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.timeFish}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(1&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/zlota_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.goldFish}</p>` +
        `<p style="font-size: 75%; opacity: 0.75;">&nbsp;(2.5&nbsp;</p>` +
        `<img style="opacity: 0.75;" src="images/UI/moneta.png" width="20px" height="20px" />` +
        `<p style="font-size: 75%; opacity: 0.75;">/${UI[saveState.lang].infos.per_fish})</p>` +
        `</div>` +
        `<div>` +
        `<img src="images/fish/smierc_rybka.png" width="40px" height="40px" />` +
        `<p>&nbsp;${UI[saveState.lang].infos.deathFish}</p>` +
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

    let stats = `<p id="statstitle">${UI[saveState.lang].stats.stats}</p>`;
    Object.keys(saveState.stats.collectibles).forEach(stat => {
        stats += `<p> - ${UI[saveState.lang].stats[stat]} ${saveState.stats.collectibles[stat]}</p>`
    })
    Object.keys(saveState.stats.other).forEach(stat => {
        stats += `<p class="underlined">${UI[saveState.lang].stats[stat]} ${saveState.stats.other[stat]}</p>`
    })
    
    document.querySelector("#stats").innerHTML = stats;

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
        let bags = saveState.stats.other.bags++;

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

        saveState.quests.forEach((quest, i) => {
            setTimeout(function () {
                if(quests.conditions["quest" + quest.id]((quest.id == 7) ? bags : saveRarity)) completeQuest(quest.id, i);
            }, 200 * i)
        });
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