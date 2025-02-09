let stars = 0;
let currentRegion = "";
let currentSubregion = "";

/* Regionen und Unterregionen */
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/* Fragen */
const questions = {
    "Weg": [{ question: "Finde das Reflexivpronomen.", answers: ["Sunt", "item", "quae", "appellantur"], correct: 2, timeLimit: 15 }],
    "Baum": [{ question: "Markiere das Subjekt.", answers: ["bos", "cervi", "figura"], correct: 0, timeLimit: 15 }]
};

/* Einführungsbildschirm ausblenden */
function hideIntro() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

/* Unterregionen anzeigen */
function showSubregions(region) {
    currentRegion = region;
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('subregion-screen').style.display = 'block';
    document.getElementById('subregion-title').textContent = `Wähle eine Aufgabe in ${region}`;
    let container = document.getElementById('subregion-container');
    container.innerHTML = "";

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = () => startTask(sub);
        container.appendChild(btn);
    });
}

function backToRegions() {
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function backToSubregions() {
    document.getElementById('task-screen').style.display = 'none';
    document.getElementById('subregion-screen').style.display = 'block';
}
