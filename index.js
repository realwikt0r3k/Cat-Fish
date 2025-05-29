window.onload = function() {
    loadGame();
    mainmenu();
}

window.onbeforeunload = function() {
    saveGame();
}

function changeLanguage(selectLanguage) {
    playSound(1);
    document.querySelector("."+language[lang][2]).style.display = "none";
    lang = selectLanguage;
    document.querySelector("."+language[lang][2]).style.display = "flex";
    document.querySelector("#counter").textContent = language[lang][0]+counter;
    document.querySelector("#timer").textContent = language[lang][1]+timer;
    document.querySelector("#endcounter").textContent = language[lang][0]+counter;
    document.querySelector("#endcoins").innerHTML = language[lang][3]+coins+' <img src="images/UI/moneta.png" />';
    document.querySelector("#coinsshop").innerHTML = language[lang][3]+coins+' <img src="images/UI/moneta.png" />';
    document.querySelector("#catdescription").innerHTML = catDescription[cat][lang];
    document.querySelector("#randomEvent").innerHTML = catEvent[lang][randomEvent-1];
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
    if(unlockedCats[selectCat]) {
        playSound(1);
        cat = selectCat;
        document.getElementById("cat").src = "images/cats/cat"+(cat+1)+".png";
        let skins = document.querySelectorAll(".skin");

        document.querySelector("#cats").innerHTML = "";
        
        for(let skin = 0; skin < skins.length; skin++) {

            let image = "images/cats/cat"+(skin+1)+".png";
            let child = document.createElement('div');

            if(!unlockedCats[skin]) {
                image = document.createElement('img');
                image.src = "images/cats/cat"+(skin+1)+".png";
                image.style.filter = "brightness(25%)";
                image.width = "100";
                image.height = "100";
                child.appendChild(image);
                image = document.createElement('img');
                image.src = "images/cats/locks/lock"+catCost[skin]+".png";
                image.className = "locked";
                child.appendChild(image);
            } else {
                image = document.createElement('img');
                image.src = "images/cats/cat"+(skin+1)+".png";
                image.width = "100";
                image.height = "100";
                child.appendChild(image);
                if(cat == skin) child.style.filter = "brightness(100%)";
                else child.style.filter = "brightness(50%)";
            }

            child.className = "skin";
            child.addEventListener("click", changeCat);
            document.querySelector("#cats").appendChild(child);
        }
    } else {
        if(coins >= catCost[selectCat] && catCost[selectCat] != 0) {
            playSound(2);
            unlockedCats[selectCat] = true;
            coins -= catCost[selectCat];
            changeCat(selectCat);
            document.querySelector("#coinsshop").innerHTML = language[lang][3]+coins+' <img src="images/UI/moneta.png" />';
        } else {
            playSound(3);
        }
    }

    document.querySelector("#catdescription").innerHTML = catDescription[cat][lang];
}

function startGame(startTime) {
    playSound(1);
    document.querySelector("#startingtimer").style.display = "inline";
    document.querySelector("#gameover").style.display = "none";
    document.querySelector("#mainmenu").style.display = "none";
    document.querySelector("#startingtimer").textContent = startTime;
    startTime -= 1;
    if(startTime<1) {
        setTimeout(game, 1000);
    } else {
        setTimeout(startGame, 1000, startTime);
    }
}

function game() {
    document.querySelector("#startingtimer").style.display = "none";
    playSound(1);

    x = 475;
    y = 300;
    counter = 0;
    
    fishCounter = [0, 0, 0, 0, 0];
    
    timer = 15;
    catSize = 50;
    speed = 7;
    timeFishAdd = 1;
    coinMultiplier = 1;
    pointMultiplier = 1;
    randomEvent = 0;
    chances = [90, 85, 0.5, 80, 75]; //time, gold, coin, time after gold, coin after gold
    
    switch(cat) {
        case 1:
            speed = 7.7;
            coinMultiplier = 0.95;
            break;
        case 2:
            chances[0] = 85.5;
            chances[1] = 84.7875;
            chances[3] = 76;
            chances[4] = 74.8125;
            break;
        case 3:
            chances[0] = 89.775;
            chances[1] = 80.75;
            chances[3] = 79.8;
            chances[4] = 71.25;
            break;
        case 6:
            chances[2] = 1;
            break;
        case 7:
            catSize = 45;
            break;
        case 8:
            catSize = 55;
            speed = 6.65;
            break;
        case 9:
            timer = 20;
            break;
        case 10:
            timeFishAdd = 3;
            timer = 6;
            break;
        case 11:
            randomEvent = Math.floor(Math.random()*6+1);
    }

    switch(randomEvent) {
        case 1:
            speed = 7.7;
            break;
        case 2:
            coinMultiplier = 1.1;
            break;
        case 3:
            pointMultiplier = 1.05;
            break;
        case 4:
            timer = 12;
            break;
        case 5:
            coinMultiplier = 0.95;
            break;
        case 6:
            catSize = 37.5;
            break;
    }

    if(randomEvent > 0) document.querySelector('#randomEvent').innerHTML = catEvent[lang][randomEvent-1]
    else document.querySelector("#randomEvent").innerHTML = "";

    // document.querySelector("#loading").style.display = "none";
    document.querySelector("#gameover").style.display = "none";
    document.querySelector("#mainmenu").style.display = "none";
    document.querySelector("#game").style.display = "inline";
    document.querySelector("#timer").textContent = language[lang][1]+timer;

    changeCat(cat);
    
    let canPlay = true;
    let interval;

    function time() {
        timer--;
        document.querySelector("#timer").textContent = language[lang][1]+timer;
        if(timer<1) {
            canPlay = false;
            clearInterval(interval);

            let addCoins = parseInt(
                (fishCounter[0]*0.75+
                fishCounter[1]*0.25+
                fishCounter[2]*1+
                fishCounter[3]*2.5+
                fishCounter[4]*2)*coinMultiplier
            );

            coins += addCoins;
            counter = parseInt(counter*pointMultiplier);

            document.querySelector("#endcounter").textContent = language[lang][0]+counter;
            document.querySelector("#endcoins").innerHTML = language[lang][3]+coins+' <img src="images/UI/moneta.png" />';
            document.querySelector("#gameover").style.display = "inline";
            document.querySelector("#game").style.display = "none";

            document.querySelector("#fish1").innerHTML = fishCounter[0]+' <img src="images/fish/rybka.png" />';
            document.querySelector("#fish2").innerHTML = fishCounter[1]+' <img src="images/fish/zla_rybka.png" />';
            document.querySelector("#fish3").innerHTML = fishCounter[2]+' <img src="images/fish/timer_rybka.png" />';
            document.querySelector("#fish4").innerHTML = fishCounter[3]+' <img src="images/fish/zlota_rybka.png" />';
            document.querySelector("#fish5").innerHTML = fishCounter[4]+' <img src="images/fish/smierc_rybka.png" />';
        }
    }

    class Player {
        detectCollision() {
            if(canPlay) {
                if(x<5) x = 5;
                if(x>c.width-(catSize+5)) x = c.width-(catSize+5);
                if(y<5) y = 5;
                if(y>c.height-(catSize+5)) y = c.height-(catSize+5);
            }
        }

        move() {
            if(canPlay) {
                x += vxr-vxl;
                y += vy;
                this.detectCollision();
                let img = document.querySelector("#cat");
                ctx.drawImage(img, x, y, catSize, catSize);
            }
        }
    }

    class Point {
        constructor(point, type = "Points", rx, ry) {
            this.rx = Math.floor(Math.random()*880)+40;
            this.ry = Math.floor(Math.random()*530)+40;
            this.point = point;
            if(this.point) {
                this.type = type;
            } else {
                this.type = "UnTime";
            }
        }

        detectCollision() {
            if(canPlay) {
                if((x+catSize>this.rx&&x<this.rx+30) && (y+catSize>this.ry&&y<this.ry+30)) {
                    this.rx = Math.floor(Math.random()*880)+40;
                    this.ry = Math.floor(Math.random()*530)+40;
                    if(this.point) {
                        switch(this.type) {
                            case "Points":
                                playSound(12);
                                switch(cat) {
                                    case 4:
                                        if(Math.floor(Math.random()*100)+1 >= 6) counter++;
                                        break;
                                    case 5:
                                        if(Math.floor(Math.random()*100)+1 <= 5) counter += 3;
                                        else if(Math.floor(Math.random()*100)+1 <= 15) counter += 2;
                                        else counter++;
                                        break;
                                    case 6:
                                        if(Math.floor(Math.random()*100)+1 <= 15) counter--;
                                        else counter++;
                                        break;
                                    default: 
                                        counter++;
                                        break;
                                }
                                fishCounter[0] += 1;
                                break;
                            case "Time": 
                                playSound(12);
                                timer += timeFishAdd;
                                fishCounter[2] += 1;
                                document.querySelector("#timer").textContent = language[lang][1]+timer;
                                break;
                            case "Gold": 
                                playSound(12);
                                timer += 5;
                                counter += 10;
                                fishCounter[3] += 1;
                                document.querySelector("#timer").textContent = language[lang][1]+timer;
                                break;
                            case "Coin": 
                                playSound(11);
                                coins += 1;
                                break;
                        }
                        this.chance = (Math.random()*100)+1;
                        if(this.chance > chances[0]) this.type = "Time";
                        else if(Math.floor(this.chance) > chances[1]) this.type = "Coin";
                        else if(this.chance < chances[2]) {
                            this.type = "Gold";
                            setTimeout(()=>{
                                this.rx = Math.floor(Math.random()*880)+40;
                                this.ry = Math.floor(Math.random()*530)+40;
                                if(Math.floor(this.chance) > chances[3]) this.type = "Time";
                                else if(Math.floor(this.chance) > chances[4]) this.type = "Coin";
                                else this.type = "Points";
                            }, 5000)
                        } else this.type = "Points";
                    }
                    else {
                        switch(this.type) {
                            case "UnTime":
                                playSound(12);
                                if(cat == 4) {
                                    if(Math.floor(Math.random()*100)+1 >= 11) counter -= 3;
                                    else counter++;
                                } else if(cat == 5) {
                                    if(Math.floor(Math.random()*100)+1 <= 5) counter -= 5;
                                    else counter -= 3;
                                } else counter -= 3;
                                fishCounter[1] += 1;
                                break;
                            case "Death": 
                                playSound(12);
                                counter -= 10;
                                timer -= 5;
                                fishCounter[4] += 1;
                                document.querySelector("#timer").textContent = language[lang][1]+timer;
                                break;
                        }
                        if(Math.floor(Math.random()*100) == 47) {
                            this.type = "Death";
                            setTimeout(()=>{
                                this.rx = Math.floor(Math.random()*880)+40;
                                this.ry = Math.floor(Math.random()*530)+40;
                                this.type = "UnTime";
                            }, 5000)
                        } else this.type = "UnTime";
                    }
                }
            }
        }
        
        update() {
            if(canPlay) {
                let img;
                this.detectCollision();
                if(this.point) {
                    if(this.type == "Points") img = document.querySelector("#goodfish");
                    else if(this.type == "Time") img = document.querySelector("#timefish");
                    else if(this.type == "Gold") img = document.querySelector("#goldfish");
                    else img = document.querySelector("#coin")
                } else {
                    if(this.type == "UnTime") img = document.querySelector("#badfish");
                    else img = document.querySelector("#deadfish");
                }
                ctx.drawImage(img, this.rx, this.ry, 30, 30);
            }
        }
    }

    let player = new Player();
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
    
    if(cat == 9) point12 = new Point(false);
    else point12 = new Point(true);
    if(cat == 7) {
        point13 =  new Point(true);
        point14 =  new Point(true);
        point15 =  new Point(true);
        point16 =  new Point(false);
        point17 =  new Point(false);
    }
    

    let startTime = performance.now();

    function update() {
        let time = performance.now();
        elapsed = (time - startTime);
        startTime = time;

        if(canPlay) {
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
            if(cat == 7) {
                point13.update();
                point14.update();
                point15.update();
                point16.update();
                point17.update();
            }
            document.querySelector("#counter").textContent = language[lang][0]+counter;
        }
        requestAnimationFrame(update);
    }

    update();
    interval = setInterval(time, 1000);
}

function mainmenu() {
    playSound(1);

    document.querySelector("#splashtext").textContent = splashText[Math.floor(Math.random()*splashText.length)];

    document.querySelector("#gameover").style.display = "none";
    document.querySelector("#catmenu").style.display = "none";
    document.querySelector("#infomenu").style.display = "none";
    document.querySelector("#mainmenu").style.display = "inline";
}

function infomenu() {
    playSound(1);
    document.querySelector("#gameover").style.display = "none";
    document.querySelector("#catmenu").style.display = "none";
    document.querySelector("#mainmenu").style.display = "none";
    document.querySelector("#infomenu").style.display = "inline";
}

function catmenu() {
    playSound(1);
    document.querySelector("#coinsshop").innerHTML = language[lang][3]+coins+' <img src="images/UI/moneta.png" />';
    document.querySelector("#cats").innerHTML = "";

    let parent = document.querySelector("#cats");
    let image;

    for(let i=0;i<_catCounter;i++) {
        let child = document.createElement('div');
        if(!unlockedCats[i]) {
            image = document.createElement('img');
            image.src = "images/cats/cat"+(i+1)+".png";
            image.style.filter = "brightness(25%)";
            image.width = "100";
            image.height = "100";
            child.appendChild(image);
            image = document.createElement('img');
            image.src = "images/cats/locks/lock"+catCost[i]+".png";
            image.className = "locked";
            child.appendChild(image);
        } else {
            image = document.createElement('img');
            image.src = "images/cats/cat"+(i+1)+".png";
            image.width = "100";
            image.height = "100";
            child.appendChild(image);
            if(cat == i) child.style.filter = "brightness(100%)";
            else child.style.filter = "brightness(50%)";
        }

        child.className = "skin";
        child.addEventListener("click", changeCat);
        parent.appendChild(child);
    }

    document.querySelector("#catdescription").innerHTML = catDescription[cat][lang];

    document.querySelector("#catmenu").style.display = "inline";
    document.querySelector("#infomenu").style.display = "none";
    document.querySelector("#mainmenu").style.display = "none";
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

    endCatImg.src = "images/cats/cat"+(getCat+1)+".png";
    endCatImg.width = 260;
    endCatImg.height = 260;

    if(!isFirst) {
        playSound(3);
        endCatImg.style.filter = "saturate(0)";
        endCatImg.style.opacity = "0.65";

        endCatDesc.innerHTML = language[lang][4]+"<br>"+language[lang][5]+moneyShow+language[lang][6];
    } else {
        playSound(2);
        endCatDesc.innerHTML = catDescription[getCat][lang];
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
    if(coins >= 250) {
        coins -= 250;

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

        for(let i=0;i<30;i++) {
            box = document.createElement('div');
            randomBox = Math.floor(Math.random()*100)+1;

            image = document.createElement('img');
            image.width = "90";
            image.height = "90";

            let openCat;
            let saveOpenCat;
            let saveOpenRarity;

            if(randomBox <= 2) {
                saveOpenCat = 11;
                box.classList = ["box mythic"];

                saveOpenRarity = "mythic";

                image.src = "images/cats/cat"+(saveOpenCat+1)+".png";
            } else if(randomBox <= 7) {
                openCat = Math.floor(Math.random()*3)+1;
                if(openCat == 1) saveOpenCat = 5;
                else if(openCat == 2) saveOpenCat = 7;
                else saveOpenCat = 9;

                saveOpenRarity = "epic";

                box.classList = ["box epic"];
                image.src = "images/cats/cat"+(saveOpenCat+1)+".png";
            } else if(randomBox <= 27) {
                openCat = Math.floor(Math.random()*4)+1;
                if(openCat == 1) saveOpenCat = 4;
                else if(openCat == 2) saveOpenCat = 6;
                else if(openCat == 3) saveOpenCat = 8;
                else saveOpenCat = 10;

                saveOpenRarity = "rare";

                box.classList = ["box rare"];
                image.src = "images/cats/cat"+(saveOpenCat+1)+".png";
            } else {
                openCat = Math.floor(Math.random()*3)+1;
                if(openCat == 1) saveOpenCat = 1;
                else if(openCat == 2) saveOpenCat = 2;
                else saveOpenCat = 3;
                
                saveOpenRarity = "common";

                box.classList = ["box common"];
                image.src = "images/cats/cat"+(saveOpenCat+1)+".png";
            }

            if(i==27) {
                saveBox = saveOpenCat;
                saveRarity = saveOpenRarity;

                if(saveRarity == "mythic") catToMoney = 500;
                else if(saveRarity == "epic") catToMoney = 250;
                else if(saveRarity == "rare") catToMoney = 150;
                else catToMoney = 75;

                if(unlockedCats[saveBox]) {
                    coins += catToMoney;
                    first = false;
                } else {
                    unlockedCats[saveBox] = true;
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
        playSound(3);
    }
}