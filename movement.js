addEventListener("keydown", function(e) {
    switch(e.code) {
        case "KeyW":
            vy = -speed*elapsed*deltaTime;
            break;
        case "KeyS":
            vy = speed*elapsed*deltaTime;
            break;
        case "KeyD":
            vxr = speed*elapsed*deltaTime;
            break;
        case "KeyA":
            vxl = speed*elapsed*deltaTime;
            break;
    }
});

addEventListener("keyup", function(e) {
    switch(e.code) {
        case "KeyW":
            vy = 0;
            break;
        case "KeyS":
            vy = 0;
            break;
        case "KeyD":
            vxr = 0;
            break;
        case "KeyA":
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