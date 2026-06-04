window.onload = async function () {
    await loadGame();
    SKIN_MANAGER.load();
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
    
    document.querySelector("#catdescription").innerHTML = SKIN_MANAGER.selected.getDescription;

    let personal_record = saveState.stats.other.highestScore < gameState.counter ? `<span style="color: #ff7486; font-size: 35%;">${UI[saveState.lang].gameover.personal_best}</span>` : '';
    
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

    let stats = `<p id="statstitle">${UI[saveState.lang].stats.stats}</p>`;
    Object.keys(saveState.stats.collectibles).forEach(stat => {
        stats += `<p> - ${UI[saveState.lang].stats[stat]} ${saveState.stats.collectibles[stat]}</p>`
    })
    Object.keys(saveState.stats.other).forEach(stat => {
        stats += `<p class="underlined">${UI[saveState.lang].stats[stat]} ${saveState.stats.other[stat]}</p>`
    })

    let allQuests = document.querySelectorAll(".quest");

    saveState.quests.forEach(quest => {
        quest.desc = quests.descriptions[saveState.lang][`quest${quest.id}`];
        quest.reward = quests.rewards[`quest${quest.id}`];
    })

    allQuests.forEach((element, i) => {
        element.innerHTML = saveState.quests[i].desc + "</br><span style='font-size: 65%; color: azure;'>Reward: " + saveState.quests[i].reward + "</span>";
    })
}

function startGame(startTime) {
    playSound(SFX.MISC.COUNTDOWN[`count${startTime}`]);
    showPanel("#startingtimer");
    document.querySelector("#startingtimer").textContent = startTime;
    startTime -= 1;
    if (startTime < 1) {
        setTimeout(game, 1000);
    } else {
        setTimeout(startGame, 1000, startTime);
    }
}

function updateTimerDisplay() {
    if(gameState.timer > 25) gameState.timer = 25;

    document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " "
        + (gameState.freezeFishTime != 0 ? "❄ " : "")
        + gameState.timer
        + (gameState.freezeFishTime != 0 ? " ❄" : "");
}

function game() {
    const collectibles = [];

    cancelAnimationFrame(animationFrame);
    clearInterval(timerInterval);

    showPanel("#game");
    playSound(SFX.MISC.GAME_START);

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
    gameState.timeFishBonus = 2;
    gameState.freezeFishTime = 0;
    gameState.multipliers.coins = 1;
    gameState.multipliers.points = 1;
    gameState.randomEvent = 0;
    gameState.chances = {
        goodFish: 100,
        badFish: 100,
        timeFish: 10,
        goldFish: 0.5,
        deathFish: 1,
        coin: 5,
        freezeFish: 2
    };

    SKIN_MANAGER.applySelected();

    if (saveState.cat == 11) {
        document.querySelector("#randomEvent").innerHTML = `<p>` +
            `<span style='color: ${gameState.randomEvent < 4 ? "#87e894" : "#ff7486"}'>${SKIN_MANAGER.selected.getDescription}</span>`
    } else document.querySelector("#randomEvent").innerHTML = "";

    document.querySelector("#timer").textContent = UI[saveState.lang].ingame.your_time + " " + (gameState.freezeFishTime != 0 ? "❄ " : "") + gameState.timer + (gameState.freezeFishTime != 0 ? " ❄" : "");
    
    document.querySelector("#cat").src = SKIN_MANAGER.selected.imageSrc;

    gameState.canPlay = true;
    function time() {
        elapsed = 0;

        gameState.freezeFishTime != 0 ? gameState.freezeFishTime-- : gameState.timer--;
        updateTimerDisplay();

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
                const completed = quests.conditions["quest" + quest.id]();
                setTimeout(() => {
                    if (completed) completeQuest(quest.id, i);
                }, 200 * i);
            });

            const personal_record = saveState.stats.other.highestScore < gameState.counter ? `<span style="color: #ff7486; font-size: 35%;">${UI[saveState.lang].gameover.highestScore}</span>` : '';

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
        `<span style="color: white; font-size: 250%; position: absolute; top: 10%;"><u>${UI[saveState.lang].infos.all}</u></span>` +
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
        `<p>&nbsp;&nbsp;${UI[saveState.lang].creators_contributors.vgrechi}</p>` +
        `</div>` +
        `</div>` +
        `<div class="cancel" onclick="mainmenu()">` +
        `<img src="images/UI/cancel.png" width="100px" height="100px">` +
        `</div>`
}

function catmenu() {
    playSound(SFX.UI.click);
    document.querySelector("#coinsshop").innerHTML = UI[saveState.lang].shop.your_coins + " " + saveState.coins + ' <img src="images/UI/moneta.png" />';
    
    SKIN_MANAGER.renderAll();

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
        endCatDesc.innerHTML = SKIN_MANAGER.skins[getCat].getDescription
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
    if(saveState.coins < 250) { playSound(SFX.UI.buy_cat_fail); return; }

    saveState.coins -= 250;
    saveState.stats.other.bags++;

    const result = SKIN_MANAGER.rollCaseResult();
    const skin = SKIN_MANAGER.skins[result.cat];
    const isFirst = skin.unlockFromCase();
    if(!isFirst) saveState.coins += SKIN_MANAGER.rarityValues[result.rarity];

    const blackScreen = document.querySelector(".blackscreen");
    const openBag = document.createElement("div");
    const openLine = document.createElement("div");
    const openWin = document.createElement("div");
    const openShow = document.createElement("div");
    const bagAnim = document.createElement("img");

    openBag.className = "openbag";
    openLine.className = "openingline";
    openWin.className = "openingwindow";
    openShow.className = "openingshow";
    bagAnim.className = "baganimation";
    bagAnim.src = "images/cats/bag/cat_bag.png";

    for(let i = 0; i < 30; i++) {
        const roll = i === 27 ? result : SKIN_MANAGER.rollCaseResult();
        openLine.appendChild(SKIN_MANAGER.buildReelBox(roll.cat, roll.rarity));
    }

    openWin.appendChild(openLine);
    openBag.appendChild(openWin);
    openBag.appendChild(openShow);
    openBag.appendChild(bagAnim);

    blackScreen.innerHTML = "";
    blackScreen.appendChild(openBag);

    catmenu();
    SKIN_MANAGER.renderAll();
    setTimeout(() => caseEnd(result.cat, SKIN_MANAGER.rarityValues[result.rarity], isFirst), 5000);

    saveState.quests.forEach((quest, i) => {
        setTimeout(() => {
            if(quests.conditions[`quest${quest.id}`](result.rarity)) completeQuest(quest.id, i);
        }, 200 * i);
    });
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