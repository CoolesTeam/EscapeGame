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

/* Willkommensbildschirm ausblenden und Erklärungsbildschirm zeigen */
function showIntro() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('intro-screen').style.display = 'flex';
}

/* Spiel starten */
function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
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

/* Navigation */
function backToRegions() {
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function backToSubregions() {
    document.getElementById('task-screen').style.display = 'none';
    document.getElementById('subregion-screen').style.display = 'block';
}
