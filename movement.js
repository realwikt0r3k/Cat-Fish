addEventListener("keydown", function(e) {
    console.log(e.code);
    switch(e.code) {
        case "KeyW": case "ArrowUp":
            vy = -speed*elapsed*deltaTime;
            break;
        case "KeyS": case "ArrowDown":
            vy = speed*elapsed*deltaTime;
            break;
        case "KeyD": case "ArrowRight":
            vxr = speed*elapsed*deltaTime;
            break;
        case "KeyA": case "ArrowLeft":
            vxl = speed*elapsed*deltaTime;
            break;
    }
    if((e.ctrlKey&& e.shiftKey && (e.code == "KeyC" || e.code == "KeyI")) || e.code == "F12" ) {
        // e.preventDefault();
    }
});

addEventListener("keyup", function(e) {
    switch(e.code) {
        case "KeyW": case "ArrowUp":
            vy = 0;
            break;
        case "KeyS": case "ArrowDown":
            vy = 0;
            break;
        case "KeyD": case "ArrowRight":
            vxr = 0;
            break;
        case "KeyA": case "ArrowLeft":
            vxl = 0;
            break;
    }
});

addEventListener("contextmenu", function(event) {
    event.preventDefault();
})

addEventListener("touchstart", function(event) {
    switch(event.target.id) {
        case "moveup":
            vy = -speed*elapsed*deltaTime;
            break;
        case "movedown":
            vy = speed*elapsed*deltaTime;
            break;
        case "moveright":
            vxr = speed*elapsed*deltaTime;
            break;
        case "moveleft":
            vxl = speed*elapsed*deltaTime;
            break;
    }
})

addEventListener("touchend", function(event) {
    switch(event.target.id) {
        case "moveup":
            vy = 0;
            break;
        case "movedown":
            vy = 0;
            break;
        case "moveright":
            vxr = 0;
            break;
        case "moveleft":
            vxl = 0;
            break;
    }
})