let stars = 0;
let currentRegion = "";
let currentSubregion = "";
let selectedAnswers = [];

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
        question: "Klicke die drei Stämme von Gallien an.",
        sentence: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.",
        answers: ["Belgae", "Aquitani", "Celtae", "Romani"],
        correct: [0, 1, 2]
    }],

    /* -------- GEÄNDERTER BEREICH "Fluss aufwärts" -------- */
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu.",
        pairs: [
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],
    /* ----------------------------------------------------- */

    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        sentence: "Haec civitas longe plurimum totius Galliae",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],
    "Fluss abwärts": [{
        question: "Markiere alle Adjektive.",
        answers: ["publica", "privata", "magnus", "magno", "omnibus"],
        correct: [0, 1, 2, 3, 4]
    }]
};

/* Navigation / Spielablauf */
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
    if (!task) {
        console.error("Fehler: Keine Frage für diese Unterregion gefunden!");
        return;
    }

    document.getElementById('question-text').textContent = task.question;

    let answerContainer = document.getElementById('answers-container');
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    // Satz einblenden (z.B. bei "Baum" oder "Der Markt")
    if (task.sentence) {
        let sentenceElement = document.createElement("p");
        sentenceElement.textContent = task.sentence;
        sentenceElement.style.fontStyle = "italic";
        sentenceElement.style.marginBottom = "10px";
        answerContainer.appendChild(sentenceElement);
    }

    // Nur wenn es sich um "Fluss aufwärts" handelt, bauen wir das Zuordnungsspiel
    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }

    // Ansonsten Standard: Mehrfachauswahl etc.
    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");
        btn.onclick = function () { handleMultiSelect(index, btn, task.correct); };
        answerContainer.appendChild(btn);
    });

    if (subregion === "Der Markt") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = function () { checkMultiAnswer(task.correct); };
        answerContainer.appendChild(submitBtn);
    }
}

/* Mehrfachauswahl (unverändert) */
function handleMultiSelect(index, button, correctAnswers) {
    if (selectedAnswers.includes(index)) {
        selectedAnswers = selectedAnswers.filter(i => i !== index);
        button.classList.remove("selected");
        button.style.backgroundColor = "";
    } else {
        if (selectedAnswers.length < 3) {
            selectedAnswers.push(index);
            button.classList.add("selected");
            button.style.backgroundColor = "orange";
        } else {
            alert("Du kannst nur drei Antworten auswählen!");
        }
    }
}

/* Prüfen, ob alle drei richtigen Antworten ausgewählt wurden (nur „Der Markt“) */
function checkMultiAnswer(correctAnswers) {
    selectedAnswers.sort();
    correctAnswers.sort();
    if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Du musst genau drei richtige Antworten auswählen.");
    }
    setTimeout(backToSubregions, 1000);
}

/* ------------------- AB HIER: FLUSS AUFWÄRTS ------------------- */
let selectedTerm = null;
let selectedMatch = null;
let selectedPairs = {};

/* Zuordnungs-Spiel (Fluss aufwärts) */
function setupMatchingGame(pairs) {
    let container = document.getElementById('answers-container');
    container.innerHTML = "<p>Verbinde die Begriffe per Klick (Orange ↔ Hellblau):</p>";

    selectedPairs = {};

    // LEFT: Orange (caelo, sacris, deos, imperium)
    // RIGHT: Hellblau (Himmel, Opfer, Götter, Macht)
    let leftDiv  = document.createElement("div");
    let rightDiv = document.createElement("div");
    leftDiv.classList.add("matching-container");
    rightDiv.classList.add("matching-container");

    // Orangen Buttons (term)
    pairs.forEach(pair => {
        let btn = document.createElement("button");
        btn.textContent = pair.term;
        btn.classList.add("button", "orange-button");
        btn.onclick = function() { selectFlussMatch(pair.term, btn, "term"); };
        leftDiv.appendChild(btn);
    });

    // Hellblaue Buttons (match)
    pairs.forEach(pair => {
        let btn = document.createElement("button");
        btn.textContent = pair.match;
        btn.classList.add("button", "blue-button");
        btn.onclick = function() { selectFlussMatch(pair.match, btn, "match"); };
        rightDiv.appendChild(btn);
    });

    container.appendChild(leftDiv);
    container.appendChild(rightDiv);

    // Button zum Überprüfen
    let checkBtn = document.createElement("button");
    checkBtn.textContent = "Überprüfen";
    checkBtn.classList.add("button", "submit-button");
    checkBtn.onclick = function() { checkFlussMatches(pairs); };
    container.appendChild(checkBtn);
}

/* Klick-Logik bei Fluss aufwärts */
function selectFlussMatch(value, button, type) {
    if (type === "term") {
        selectedTerm = value;
        highlightSelected(button);
    } else {
        selectedMatch = value;
        highlightSelected(button);
    }

    if (selectedTerm && selectedMatch) {
        // Speichere Zuordnung
        selectedPairs[selectedTerm] = selectedMatch;
        drawLine(selectedTerm, selectedMatch); // optional, falls du Striche willst
        selectedTerm  = null;
        selectedMatch = null;
    }
}

/* Visuelles Hervorheben */
function highlightSelected(button) {
    button.classList.add("selected");
    setTimeout(() => {
        button.classList.remove("selected");
    }, 400);
}

/* Evtl. Striche zeichnen (vereinfachte Version) */
function drawLine(term, match) {
    // Dies erfordert ein komplexeres Layout, 
    // deshalb nur eine symbolische Meldung:
    console.log(`Verbindung gezeichnet: ${term} ↔ ${match}`);
}

/* Überprüfung bei "Fluss aufwärts" */
function checkFlussMatches(pairs) {
    let correct = true;
    for (let pair of pairs) {
        if (!selectedPairs[pair.term] || selectedPairs[pair.term] !== pair.match) {
            correct = false;
            break;
        }
    }

    if (correct) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Bitte versuche es erneut.");
        selectedPairs = {};
    }

    setTimeout(backToSubregions, 1000);
}
/* ------------------------------------------------------------- */

/* Sterne & Navigation (unverändert) */
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
