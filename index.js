const c = document.querySelector("#canvas");
const ctx = c.getContext("2d");

let cat = 0;

let speed = 7;
let deltaTime = 10/60;
let elapsed;

let x = 475;
let y = 300;
let vxl = 0;
let vxr = 0;
let vy = 0;
    
let counter = 0;

let language = [
    ["Twoje punkty: ", "Pozostały czas: ", "pl", "Zagraj ponownie"],
    ["Your points: ", "Time left: ", "en", "Play again"],
    ["Deine Punkte: ", "Restdauer: ", "de", "Erneut abspielen"],
    ["Tus puntos: ", "Tiempo restante: ", "es", "Jugar de nuevo"],
    ["Ваши баллы: ", "Оставшееся время: ", "ru", "Играй еще раз"]
]

let lang = 1;

let timer = 15;

function changeLanguage(selectLanguage) {
    lang = selectLanguage;
    document.querySelector("#counter").textContent = language[lang][0]+counter;
    document.querySelector("#timer").textContent = language[lang][1]+timer;
    document.querySelector("#endcounter").textContent = language[lang][0]+counter;
    document.querySelector("#reset").textContent = language[lang][3];
}

function changeCat(selectCat) {
    cat = selectCat;
    document.getElementById("cat").src = "images/cat"+(cat+1)+".png";
}

function game() {

    x = 475;
    y = 300;
    timer = 15;
    counter = 0;
    
    document.querySelector("#loading").style.display = "none";
    document.querySelector("#gameover").style.display = "none";
    document.querySelector("#game").style.display = "inline";
    document.querySelector("#timer").textContent = language[lang][1]+timer;
    
    let canPlay = true;
    let interval;
    let timeoutGold = 0;
    let timeoutDead = 0;
    

    function time() {
        timer--;
        document.querySelector("#timer").textContent = language[lang][1]+timer;
        if(timer<1) {
            canPlay = false;
            clearInterval(interval);
            document.querySelector("#reset").textContent = language[lang][3];
            document.querySelector("#endcounter").textContent = language[lang][0]+counter;
            document.querySelector("#gameover").style.display = "inline";
            document.querySelector("#game").style.display = "none";
        }
    }

    class Player {
        detectCollision() {
            if(canPlay) {
                if(x<5) x = 5;
                if(x>c.width-55) x = c.width-55;
                if(y<5) y = 5;
                if(y>c.height-55) y = c.height-55;
            }
        }

        move() {
            if(canPlay) {
                x += vxr-vxl;
                y += vy;
                this.detectCollision();
                let img = document.querySelector("#cat");
                ctx.drawImage(img ,x, y, 50, 50);
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
                if((x+50>this.rx&&x<this.rx+30) && (y+50>this.ry&&y<this.ry+30)) {
                    this.rx = Math.floor(Math.random()*880)+40;
                    this.ry = Math.floor(Math.random()*530)+40;
                    if(this.point) {
                        switch(this.type) {
                            case "Points":
                                counter++;
                                break;
                            case "Time": 
                                timer += 2;
                                document.querySelector("#timer").textContent = language[lang][1]+timer;
                                break;
                            case "Gold": 
                                timer += 5;
                                counter += 10;
                                document.querySelector("#timer").textContent = language[lang][1]+timer;
                                break;
                        }
                        if(Math.floor(Math.random()*100) > 90) this.type = "Time";
                        else if(Math.random()*100 < 0.5) {
                            this.type = "Gold";
                            setTimeout(()=>{
                                this.rx = Math.floor(Math.random()*880)+40;
                                this.ry = Math.floor(Math.random()*530)+40;
                                if(Math.floor(Math.random()*100) > 90) this.type = "Time";
                                else this.type = "Points";
                            }, 5000)
                        } else this.type = "Points";
                    }
                    else {
                        switch(this.type) {
                            case "UnTime":
                                counter -= 3;
                                break;
                            case "Death": 
                                counter -= 10;
                                timer -= 5;
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
                    else img = document.querySelector("#goldfish");
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
    let point4 = new Point(true);
    let point5 = new Point(false);
    let point6 = new Point(true);
    let point7 = new Point(true);
    let point8 = new Point(true);
    let point9 = new Point(false);
    let point10 = new Point(false);
    let point11 = new Point(false);
    let point12 = new Point(true);

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
            document.querySelector("#counter").textContent = language[lang][0]+counter;
        }
        requestAnimationFrame(update);
    }

    update();
    interval = setInterval(time, 1000);
}

game();