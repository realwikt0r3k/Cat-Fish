function saveGame() {
    let gameData = {
        coins: coins,
        cats: unlockedCats,
        selectedCat: cat
    }

    localStorage.setItem("catfish_save", JSON.stringify(gameData));
}

function loadGame() {
    let gameData = JSON.parse(localStorage.getItem("catfish_save"));
    if(gameData !== null && gameData !== undefined) {
        coins = gameData.coins;
        unlockedCats = gameData.cats;
        cat = gameData.selectedCat;
    }

    // let xmlhttp = new XMLHttpRequest();
    // let url = "/languages.json";
    // xmlhttp.onreadystatechange = function() {
    //     if(this.readyState == 4 && this.status == 200) {
    //         allText = JSON.parse(this.responseText);
    //     }
    // } 
    // xmlhttp.open("GET", url, true);
    // xmlhttp.send();
}