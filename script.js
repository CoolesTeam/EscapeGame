let stars = 0;
let timer;
let timeLeft;

/* Regionen und Unterregionen */
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/* Fragen */
const questions = {
    "Weg": [
        { question: "Finde das Reflexivpronomen.", answers: ["Sunt", "item", "quae", "appellantur"], correct: 2, timeLimit: 15 }
    ],
    "Baum": [
        { question: "Markiere das Subjekt.", answers: ["bos", "cervi", "figura"], correct: 0, timeLimit: 15 }
    ],
    "Die Bewohner": [
        { question: "Übersetze den Satz: 'Dicebant servos...'", answers: ["Antwort A", "Antwort B", "Antwort C"], correct: 1, timeLimit: 10 }
    ]
};

let currentRegion = "";
let currentSubregion = "";

/* Verstecke Einführungsbildschirm */
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

function startTask(subregion) {
    currentSubregion = subregion;
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('task-screen').style.display = 'block';

    let task = questions[subregion][0];
    document.getElementById('task-title').textContent = `Aufgabe in ${subregion}`;
    document.getElementById('question-text').textContent = task.question;
    let container = document.getElementById('answers-container');
    container.innerHTML = "";

    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index);
        container.appendChild(btn);
    });

    startTimer(task.timeLimit);
}

function backToRegions() {
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function backToSubregions() {
    document.getElementById('task-screen').style.display = 'none';
    document.getElementById('subregion-screen').style.display = 'block';
}
