function saveGame() {
    SKIN_MANAGER.save();
    localStorage.setItem("catfish_save_8", JSON.stringify(saveState));
}

const manifest = {
    'audio/pickup': ['fish.mp3', 'coin.mp3', 'bad.mp3', 'fish_rare.ogg', 'freeze.mp3'],
    'audio/UI': ['button_click.wav', 'shop_buy_cat.wav', 'shop_not_enough.wav'],
    'audio': ['bg_music.mp3', 'countdown.mp3', 'start_game.mp3'],

    'images/cats': ['cat1.png', 'cat2.png', 'cat3.png', 'cat4.png', 'cat5.png', 'cat6.png',
        'cat7.png', 'cat8.png', 'cat9.png', 'cat10.png', 'cat11.png', 'cat12.png', 'cat13.png'
    ],
    'images/cats/bag': ['cat_bag.png'],
    'images/cats/locks': ['lock_case.png', 'lock150.png', 'lock300.png', 'lock500.png', 'lock1500.png']
}

const loadImage = src => new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
});

const loadAudio = src => new Promise((res, rej) => {
    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => res(audio), {once: true});
    audio.addEventListener('error', rej, {once: true});
    audio.preload = 'auto';
    audio.src = src;
    audio.load();
});

async function loadGame() {
    const tasks = [];
    const loadingText = document.querySelector('#loading-text');
    const progressFill = document.querySelector('#progress-fill');

    for (const [folder, files] of Object.entries(manifest)) {
        for (const file of files) {
            const path = `${folder}/${file}`;
            const isAudio = folder.startsWith('audio');
            tasks.push({
                key: path,
                label: `Loading ${path}`,
                load: () => isAudio ? loadAudio(path) : loadImage(path)
            })
        }
    }

    console.log(tasks.map(t => t.key));

    for (let i = 0; i < tasks.length; i++) {
        try {
            loadingText.textContent = tasks[i].label;
            assets[tasks[i].key] = await tasks[i].load();
            progressFill.style.width = `${((i + 1) / tasks.length) * 100}%`;
        } catch (err) {
            console.warn(`Failed to load: ${tasks[i].label}`, err);
        }
    }

    await new Promise(res => setTimeout(res, 300));

    loadingText.textContent = "Click to continue";
    loadingText.style.color = "white";

    document.getElementById('loading-screen').addEventListener('click', () => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('mainmenu').style.display = 'inline';

        setTimeout(function () {
            background_music.play();
        }, 5000);
    });

    const saved = localStorage.getItem("catfish_save_8");
    if (saved) Object.assign(saveState, JSON.parse(saved));
    else saveState.unlockedCats = [0];

    if (saveState.sfx) document.querySelector("#sfx").classList = ["sound"]
    else document.querySelector("#sfx").classList = ["sound off"]

    if (saveState.music) document.querySelector("#music").classList = ["sound"]
    else document.querySelector("#music").classList = ["sound off"]

    saveState.quests.forEach(quest => {
        quest.desc = quests.descriptions[saveState.lang][`quest${quest.id}`];
        quest.reward = quests.rewards[`quest${quest.id}`];
    })
};