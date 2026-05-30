addEventListener("keydown", function(e) {
    switch(e.code) {
        case "KeyW": case "ArrowUp":
            vy = -1;
            break;
        case "KeyS": case "ArrowDown":
            vy = 1;
            break;
        case "KeyD": case "ArrowRight":
            vxr = 1;
            break;
        case "KeyA": case "ArrowLeft":
            vxl = 1;
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
            vy = -1;
            break;
        case "movedown":
            vy = 1;
            break;
        case "moveright":
            vxr = 1;
            break;
        case "moveleft":
            vxl = 1;
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