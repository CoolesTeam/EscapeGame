let stars = 0;
let currentRegion = "";
let currentSubregion = "";

/* Regionen und Unterregionen */
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/* Alle Fragen mit Antworten */
const questions = {
    "Weg": [{
        question: "Finde das Reflexivpronomen.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
    }],
    "Baum": [{
        question: "Markiere das Subjekt.",
        answers: ["bos", "cervi", "figura"],
        correct: 0
    }],
    "Die Bewohner": [{
        question: "Wie heißt der Druide des Dorfes?",
        answers: ["Asterix", "Miraculix", "Majestix", "Obelix"],
        correct: 1
    }],
    "Der Markt": [{
        question: "Was wird auf dem Markt verkauft?",
        answers: ["Zaubertrank", "Fisch", "Schilde", "Römerhelme"],
        correct: 1
    }],
    "Fluss aufwärts": [{
        question: "Welcher Fluss fließt durch Gallien?",
        answers: ["Seine", "Rhein", "Loire", "Garonne"],
        correct: 0
    }],
    "Der Hafen": [{
        question: "Welche Stadt hat einen Hafen in Gallien?",
        answers: ["Lutetia", "Massilia", "Bibracte", "Avaricum"],
        correct: 1
    }],
    "Fluss abwärts": [{
        question: "Welches Schiff ist für den Transport auf dem Fluss bekannt?",
        answers: ["Trireme", "Langboot", "Handelsbarke", "Kogge"],
        correct: 2
    }]
};

/* Navigation */
function showIntro() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('intro-screen').style.display = 'flex';
}

function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updateStars();
}

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
        btn.onclick = function () { startTask(sub); };
        container.appendChild(btn);
    });
}

function startTask(subregion) {
    currentSubregion = subregion;
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('task-screen').style.display = 'block';
    document.getElementById('task-title').textContent = `Aufgabe in ${subregion}`;

    let task = questions[subregion][0];

    document.getElementById('question-text').textContent = task.question;

    let answerContainer = document.getElementById('answers-container');
    answerContainer.innerHTML = "";  // Antworten-Container leeren

    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");
        btn.onclick = function () { checkAnswer(index, task.correct, btn); };
        answerContainer.appendChild(btn);
    });
}

/* Antwort überprüfen */
function checkAnswer(selectedIndex, correctIndex, button) {
    if (selectedIndex === correctIndex) {
        stars++;  // Erhöhe die Sterne-Anzahl
        updateStars();
        button.classList.add("correct");
        document.getElementById('correct-sound').play();
    } else {
        button.classList.add("wrong");
        document.getElementById('wrong-sound').play();
    }
    setTimeout(backToSubregions, 1000);
}

/* Sterne-Anzeige aktualisieren */
function updateStars() {
    document.getElementById('stars-count').textContent = stars;
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
