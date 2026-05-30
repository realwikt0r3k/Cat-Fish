function saveGame() {
    localStorage.setItem("catfish_save_4", JSON.stringify(saveState));
}

function loadGame() {
    const saved = localStorage.getItem("catfish_save_4");
    if (saved) Object.assign(saveState, JSON.parse(saved));
    else saveState.unlockedCats[0] = true;

    if (saveState.sfx) document.querySelector("#sfx").classList = ["sound"]
    else document.querySelector("#sfx").classList = ["sound off"]
    if (saveState.music) document.querySelector("#music").classList = ["sound"]
    else document.querySelector("#music").classList = ["sound off"]

    saveState.quests.forEach(quest => {
        quest.desc = quests.descriptions[saveState.lang][`quest${quest.id}`];
        quest.reward = quests.rewards[`quest${quest.id}`];
    })
}