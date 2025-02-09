let stars = 0;
let currentRegion = "";
let currentSubregion = "";

/* Regionen und Unterregionen */
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/* Alle Fragen mit Original-Antworten */
const questions = {
    "Weg": [{
        question: "Was braucht man zum Zaubertrank?",
        answers: ["Mispel", "Eiche", "Tanne", "Beere"],
        correct: 0
    }],
    "Baum": [{
        question: "Welche Holzart wird für Schilde genutzt?",
        answers: ["Eiche", "Tanne", "Kiefer", "Weide"],
        correct: 1
    }],
    "Die Bewohner": [{
        question: "Wer ist der Häuptling der Gallier?",
        answers: ["Majestix", "Asterix", "Miraculix", "Troubadix"],
        correct: 0
    }],
    "Der Markt": [{
        question: "Welches Handelsgut ist am teuersten?",
        answers: ["Fisch", "Wein", "Römerhelme", "Brot"],
        correct: 2
    }],
    "Fluss aufwärts": [{
        question: "Welche Fischart wird am häufigsten gefangen?",
        answers: ["Aal", "Forelle", "Lachs", "Hecht"],
        correct: 1
    }],
    "Der Hafen": [{
        question: "Welches Schiff ist für den Transport auf dem Fluss bekannt?",
        answers: ["Trireme", "Langboot", "Handelsbarke", "Kogge"],
        correct: 2
    }],
    "Fluss abwärts": [{
        question: "Welche Stadt liegt an der Mündung des Flusses?",
        answers: ["Lutetia", "Massilia", "Bibracte", "Avaricum"],
        correct: 1
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
    answerContainer.innerHTML = "";

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
        stars++;
        updateStars();
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
    }
    setTimeout(backToSubregions, 1000);
}

/* Sterne aktualisieren */
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
