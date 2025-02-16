let stars = 0;
let currentRegion = "";
let currentSubregion = "";
let selectedAnswers = [];
let selectedPairs = {}; // Speichert Zuordnungen für Fluss aufwärts
let selectedTerm = null;
let selectedMatch = null;

/* Regionen und Unterregionen */
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/* Fragen & Antworten */
const questions = {
    "Fluss aufwärts": [{
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

    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }
}

/* Zuordnungs-Spiel für "Fluss aufwärts" */
function setupMatchingGame(pairs) {
    let container = document.getElementById('answers-container');
    container.innerHTML = `<p>Verbinde die Begriffe:</p>`;

    selectedPairs = {}; // Reset für neue Aufgabe

    let terms = pairs.map(p => p.term);
    let matches = pairs.map(p => p.match);

    let termContainer = document.createElement("div");
    termContainer.classList.add("matching-container");

    let matchContainer = document.createElement("div");
    matchContainer.classList.add("matching-container");

    terms.forEach(term => {
        let btn = document.createElement("button");
        btn.textContent = term;
        btn.classList.add("match-button", "orange-button");
        btn.onclick = function () { selectMatch(term, btn, "term"); };
        termContainer.appendChild(btn);
    });

    matches.forEach(match => {
        let btn = document.createElement("button");
        btn.textContent = match;
        btn.classList.add("match-button", "blue-button");
        btn.onclick = function () { selectMatch(match, btn, "match"); };
        matchContainer.appendChild(btn);
    });

    container.appendChild(termContainer);
    container.appendChild(matchContainer);

    let submitBtn = document.createElement("button");
    submitBtn.textContent = "Überprüfen";
    submitBtn.classList.add("button", "submit-button");
    submitBtn.onclick = function () { checkMatches(pairs); };
    container.appendChild(submitBtn);
}

/* Auswahl der Begriffe */
function selectMatch(value, button, type) {
    if (type === "term") {
        selectedTerm = value;
        highlightSelected(button);
    } else {
        selectedMatch = value;
        highlightSelected(button);
    }

    if (selectedTerm && selectedMatch) {
        selectedPairs[selectedTerm] = selectedMatch;
        drawConnection(selectedTerm, selectedMatch);
        selectedTerm = null;
        selectedMatch = null;
    }
}

/* Visuelle Verbindungslinien */
function drawConnection(term, match) {
    let termButton = document.querySelector(`.match-button.orange-button:contains("${term}")`);
    let matchButton = document.querySelector(`.match-button.blue-button:contains("${match}")`);

    if (termButton && matchButton) {
        let line = document.createElement("div");
        line.classList.add("connection-line");
        line.style.top = (termButton.offsetTop + termButton.offsetHeight / 2) + "px";
        line.style.left = (termButton.offsetLeft + termButton.offsetWidth) + "px";
        line.style.width = (matchButton.offsetLeft - termButton.offsetLeft - termButton.offsetWidth) + "px";
        document.getElementById("answers-container").appendChild(line);
    }
}

/* Visuelles Highlight */
function highlightSelected(button) {
    button.classList.add("selected");
    setTimeout(() => {
        button.classList.remove("selected");
    }, 500);
}

/* Überprüfung der Zuordnungen */
function checkMatches(pairs) {
    let isCorrect = true;

    pairs.forEach(pair => {
        if (selectedPairs[pair.term] !== pair.match) {
            isCorrect = false;
        }
    });

    if (isCorrect) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Versuche es noch einmal.");
        selectedPairs = {};
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
