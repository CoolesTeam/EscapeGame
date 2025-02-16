let stars = 0;
let currentRegion = "";
let currentSubregion = "";
let selectedAnswers = [];
let currentPairs = {}; // Speichert die Zuordnungen für Drag & Drop

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
        question: "Suche das Subjekt des Satzes heraus und klicke es an.",
        sentence: "Est bos cervi figura, cuius a media fronte inter aures unum cornu exsistit excelsius magisque directum his, quae nobis nota sunt, cornibus.",
        answers: ["bos cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],
    "Fluss abwärts": [{
        question: "Ordne die Begriffe richtig zu.",
        pairs: [
            { term: "caelo", match: "Himmel" },
            { term: "sacris", match: "Opfer" },
            { term: "deos", match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
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
    let answerContainer = document.getElementById('answers-container');
    answerContainer.innerHTML = "";

    if (!task) {
        console.error("Fehler: Keine Frage für diese Unterregion gefunden!");
        return;
    }

    if (subregion === "Fluss abwärts") {
        setupDragAndDrop(task.pairs);
        return;
    }

    document.getElementById('question-text').textContent = task.question;
    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");
        btn.onclick = function () { checkAnswer(index, task.correct, btn); };
        answerContainer.appendChild(btn);
    });
}

/* Drag-&-Drop für "Fluss abwärts" */
function setupDragAndDrop(pairs) {
    let container = document.getElementById('answers-container');
    container.innerHTML = `<p>Ziehe die Begriffe in die richtigen Felder:</p>`;

    currentPairs = {}; // Reset für neue Aufgabe

    let terms = pairs.map(p => p.term);
    let matches = pairs.map(p => p.match);

    // Zufällige Reihenfolge generieren
    terms.sort(() => Math.random() - 0.5);
    matches.sort(() => Math.random() - 0.5);

    let termList = document.createElement("div");
    termList.classList.add("drag-container");

    let matchList = document.createElement("div");
    matchList.classList.add("drag-container");

    terms.forEach(term => {
        let item = document.createElement("div");
        item.textContent = term;
        item.classList.add("drag-item", "drag-term");
        item.draggable = true;
        item.ondragstart = dragStart;
        termList.appendChild(item);
    });

    matches.forEach(match => {
        let item = document.createElement("div");
        item.textContent = match;
        item.classList.add("drag-item", "drag-match");
        item.ondrop = drop;
        item.ondragover = allowDrop;
        matchList.appendChild(item);
    });

    container.appendChild(termList);
    container.appendChild(matchList);

    let submitBtn = document.createElement("button");
    submitBtn.textContent = "Überprüfen";
    submitBtn.classList.add("button", "submit-button");
    submitBtn.onclick = function () { checkPairs(pairs); };
    container.appendChild(submitBtn);
}

/* Drag-&-Drop-Events */
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.textContent);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let draggedText = event.dataTransfer.getData("text");
    event.target.textContent = draggedText;
    currentPairs[event.target.textContent] = draggedText;
}

/* Überprüfung der Zuordnung */
function checkPairs(pairs) {
    let isCorrect = true;

    pairs.forEach(pair => {
        if (currentPairs[pair.match] !== pair.term) {
            isCorrect = false;
        }
    });

    if (isCorrect) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Versuche es noch einmal.");
    }

    setTimeout(backToSubregions, 1000);
}

function updateStars() {
    document.getElementById('stars-count').textContent = stars;
}

function backToRegions() {
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function backToSubregions() {
    document.getElementById('task-screen').style.display = 'none';
    document.getElementById('subregion-screen').style.display = 'block';
}
