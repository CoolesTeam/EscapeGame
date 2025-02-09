let stars = 0;
let currentRegion = "";
let currentSubregion = "";

/* Regionen und Unterregionen */
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/* Fragen & Antworten */
const questions = {
    "Weg": [{
        question: "Finde das Reflexivpronomen und markiere es rot.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
    }],
    "Baum": [{
        question: "Suche das Subjekt des Satzes heraus und ziehe es in die Lücke.",
        answers: ["bos cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],
    "Die Bewohner": [{
        question: "Übersetze den Satz: 'Dicebant servos nullis iuribus praeditos esse et penitus a dominis pendere.'",
        answers: [
            "Die Sklaven haben keine Rechte und sind abhängig von ihren Herren.",
            "Sie sagten, dass die Sklaven keinerlei Rechte hätten und vollständig von ihren Herren abhängig sind.",
            "Die Sklaven sagen, dass sie keine Rechte haben und abhängig von ihren Herren sind."
        ],
        correct: 1
    }],
    "Der Markt": [{
        question: "Markiere die drei Stämme von Gallien lila.",
        answers: ["Belgae", "Aquitani", "Celtae", "Romani"],
        correct: [0, 1, 2]
    }],
    "Fluss aufwärts": [{
        question: "Bringe diese lateinischen Begriffe in die richtige Reihenfolge.",
        answers: ["caelo - Himmel", "sacris - Opfer", "deos - Götter", "imperium - Macht"],
        correct: [0, 1, 2, 3]
    }],
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],
    "Fluss abwärts": [{
        question: "Markiere alle Adjektive.",
        answers: ["publica", "privata", "magnus", "magno", "omnibus"],
        correct: [0, 1, 2, 3, 4]
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

/* FIX: Unterregionen erscheinen jetzt wirklich */
function showSubregions(region) {
    currentRegion = region;
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('task-screen').style.display = 'none';

    let subregionScreen = document.getElementById('subregion-screen');
    subregionScreen.style.display = "block";

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

/* FIX: Aufgaben werden jetzt korrekt angezeigt */
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
    if (Array.isArray(correctIndex)) {
        if (correctIndex.includes(selectedIndex)) {
            stars++;
            updateStars();
            button.classList.add("correct");
        } else {
            button.classList.add("wrong");
        }
    } else {
        if (selectedIndex === correctIndex) {
            stars++;
            updateStars();
            button.classList.add("correct");
        } else {
            button.classList.add("wrong");
        }
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
