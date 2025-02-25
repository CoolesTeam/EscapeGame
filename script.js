/***********************************************************
 *  FUNKTIONEN FÜR START- & INTRO-SEITE
 ***********************************************************/
function showIntro() {
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("intro-screen").style.display = "block";
}

function startGame() {
    document.getElementById("intro-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    updateStars();
}

/***********************************************************
 *  GLOBALE VARIABLEN
 ***********************************************************/
let stars = 0;
let currentRegion = "";
let currentSubregion = "";
let selectedAnswers = [];   
let dieBewohnerTaskIndex = 0;  
let marketTaskIndex = 0;       

/***********************************************************
 *  SUBREGIONEN (STRUKTUR)
 ***********************************************************/
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/***********************************************************
 *  FRAGEN & ANTWORTEN
 ***********************************************************/
const questions = {
    // WALD
    "Weg": [{
        question: "Finde das Relativpronomen und klicke es an.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
    }],
    "Baum": [{
        question: "Suche das Subjekt...",
        answers: ["bos", "cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],

    // DORF
    "Die Bewohner": [
      {
        question: "Übersetze...",
        answers: ["...", "...", "..."],
        correct: 1
      },
      {
        question: "Gib den AcI Auslöser an.",
        answers: ["dicebant", "iuribus", "praeditos"],
        correct: 0
      }
    ],
    "Der Markt": [
      {
        question: "Klicke die drei Stämme...",
        answers: ["Belgae", "Gallia", "Aquitani", "Celtae", "Galli"],
        correct: [0, 2, 3]
      },
      {
        question: "Markiere die beiden Flüsse.",
        answers: ["Rhodano", "Garumna", "Belgarum", "Aquitani"],
        correct: [0, 1]
      }
    ],

    // FLUSS
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu...",
        pairs: [
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],
    "Fluss abwärts": [{
        question: "Markiere alle Adjektive...",
        answers: ["publica", "controversiis", "privata", "disciplinae", "magnus", "magno", "omnibus", "interpretantur"],
        correct: [0, 2, 4, 5, 6]
    }]
};

/***********************************************************
 *  HILFSFUNKTIONEN FÜR KLASSEN
 ***********************************************************/
/**
 * Entfernt vorhandene 'region-...' Klassen vom body
 * und fügt region-XYZ je nach Parameter hinzu
 */
function applyRegionClass(region) {
    document.body.classList.remove("region-wald", "region-dorf", "region-fluss");
    if (region === "wald")  document.body.classList.add("region-wald");
    if (region === "dorf")  document.body.classList.add("region-dorf");
    if (region === "fluss") document.body.classList.add("region-fluss");
}

/**
 * Macht aus 'Weg' => 'question-weg',
 * aus 'Die Bewohner' => 'question-die-bewohner' etc.
 */
function subregionToClassName(subregion) {
    return "question-" + subregion
        .toLowerCase()         // kleinschreiben
        .replace(/\s+/g, "-")  // Leerzeichen durch "-"
        .replace(/[^\w-]/g, ""); // Sonderzeichen entfernen, falls nötig
}

/**
 * Entfernt vorhandene 'question-...' Klassen vom #task-screen
 * und fügt die passende Subregion-Klasse hinzu
 */
function applySubregionClass(subregion) {
    // Alle subregion-Klassen im CSS definieren:
    //  .question-weg, .question-baum, .question-die-bewohner, ...
    const taskScreen = document.getElementById("task-screen");

    // Alle question-... Klassen entfernen
    taskScreen.classList.remove(
      "question-weg", "question-baum", "question-die-bewohner", "question-der-markt",
      "question-fluss-aufwärts", "question-der-hafen", "question-fluss-abwärts"
    );

    // Die neue Klasse hinzufügen
    const newClass = subregionToClassName(subregion);
    taskScreen.classList.add(newClass);
}

/***********************************************************
 *  showSubregions(region)
 ***********************************************************/
function showSubregions(region) {
    currentRegion = region;

    // REGION-KLASSE anwenden (für CSS)
    applyRegionClass(region);

    // Alte Hintergründe entfernen
    document.body.classList.remove("wald-background", "fluss-background");
    // Falls du die wald.jpg/fluss.jpg Hintergründe beibehalten willst,
    // kannst du das hier anpassen:
    if (region === "wald") {
        document.body.classList.add("wald-background");
    } else if (region === "fluss") {
        document.body.classList.add("fluss-background");
    }

    // UI-Logik
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";

    let container = document.getElementById("subregion-container");
    container.innerHTML = "";

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = function () {
            if (region === "dorf" && sub === "Die Bewohner") {
                dieBewohnerTaskIndex = 0;
            }
            if (region === "dorf" && sub === "Der Markt") {
                marketTaskIndex = 0;
            }
            startTask(sub);
        };
        container.appendChild(btn);
    });
}

/***********************************************************
 *  startTask(subregion)
 ***********************************************************/
function startTask(subregion) {
    currentSubregion = subregion;

    // Subregion-Klasse anwenden (für CSS)
    applySubregionClass(subregion);

    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("task-screen").style.display = "block";

    let tasks = questions[subregion];
    if (!tasks) {
        console.error("Fehler: Keine Frage für Subregion:", subregion);
        return;
    }

    let task;
    if (subregion === "Die Bewohner") {
        task = tasks[dieBewohnerTaskIndex];
        if (!task) {
            alert("Alle Aufgaben in 'Die Bewohner' erledigt!");
            backToSubregions();
            return;
        }
    }
    else if (subregion === "Der Markt") {
        task = tasks[marketTaskIndex];
        if (!task) {
            alert("Alle Aufgaben im Markt erledigt!");
            backToSubregions();
            return;
        }
    }
    else {
        // Standard: nur eine Aufgabe
        task = tasks[0];
    }

    // Titel & Frage
    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = task.question;

    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    // Satz optional
    if (task.sentence) {
        let sentenceP = document.createElement("p");
        sentenceP.style.fontStyle = "italic";
        sentenceP.textContent = task.sentence;
        answerContainer.appendChild(sentenceP);
    }

    // FALL 1: "Fluss aufwärts" => Zuordnungs-Spiel
    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }

    // FALL 2: "Fluss abwärts" => 5-fach Mehrfachauswahl
    if (subregion === "Fluss abwärts") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkFiveAnswers(task.correct);
        answerContainer.appendChild(submitBtn);

        task.answers.forEach((answer, index) => {
            let btn = document.createElement("button");
            btn.textContent = answer;
            btn.classList.add("button", "answer-button");
            btn.onclick = () => setMatchingColors(index, btn);
            answerContainer.appendChild(btn);
        });
        return;
    }

    // FALL 3: Standard Single/Mehrfach
    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");

        if (!Array.isArray(task.correct)) {
            // Single
            btn.onclick = () => {
                if (index === task.correct) {
                    stars++;
                    updateStars();
                    alert("Richtig! ⭐ Du hast einen Stern erhalten.");
                    handleNextTask(subregion);
                } else {
                    alert("Falsch! ❌ Versuch es nochmal.");
                }
            };
        } else {
            // Multi
            btn.onclick = () => handleMultiChoice(index, btn, task.correct, subregion);
        }
        answerContainer.appendChild(btn);
    });
}

/***********************************************************
 *  FLUSS AUFWÄRTS => Zuordnungs-Spiel
 ***********************************************************/
const pairColors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
let colorIndex = 0;
let selectedTerm = null;
let selectedMatch = null;
let selectedPairs = {};
let colorMap = {};

function setupMatchingGame(pairs) {
    let container = document.getElementById("answers-container");
    container.innerHTML = "<p>Verbinde Orange (lateinische Wörter) mit Hellblau (deutsche Bedeutung) per Klick!</p>";

    selectedTerm = null;
    selectedMatch = null;
    selectedPairs = {};
    colorMap = {};
    colorIndex = 0;

    let leftDiv  = document.createElement("div");
    let rightDiv = document.createElement("div");
    leftDiv.style.display  = "inline-block";
    leftDiv.style.marginRight = "50px";
    leftDiv.style.verticalAlign = "top";
    rightDiv.style.display = "inline-block";
    rightDiv.style.verticalAlign = "top";

    // Linke Seite (Orange)
    pairs.forEach(pair => {
        let leftBtn = document.createElement("button");
        leftBtn.textContent = pair.term;
        leftBtn.style.backgroundColor = "orange";
        leftBtn.style.color = "white";
        leftBtn.style.padding = "20px 30px";
        leftBtn.style.fontSize = "16px";
        leftBtn.style.margin = "5px";
        leftBtn.onclick = () => selectFlussItem(pair.term, leftBtn, "term");
        leftDiv.appendChild(leftBtn);
    });

    // Rechte Seite (Hellblau)
    pairs.forEach(pair => {
        let rightBtn = document.createElement("button");
        rightBtn.textContent = pair.match;
        rightBtn.style.backgroundColor = "lightblue";
        rightBtn.style.color = "black";
        rightBtn.style.padding = "20px 30px";
        rightBtn.style.fontSize = "16px";
        rightBtn.style.margin = "5px";
        rightBtn.onclick = () => selectFlussItem(pair.match, rightBtn, "match");
        rightDiv.appendChild(rightBtn);
    });

    container.appendChild(leftDiv);
    container.appendChild(rightDiv);

    let checkBtn = document.createElement("button");
    checkBtn.textContent = "Überprüfen";
    checkBtn.classList.add("button");
    checkBtn.style.marginTop = "20px";
    checkBtn.onclick = () => checkFlussMatches(pairs);
    container.appendChild(document.createElement("br"));
    container.appendChild(checkBtn);
}

function selectFlussItem(value, button, type) {
    if (type === "term") {
        if (selectedTerm) unhighlightButton(selectedTerm.button, "term");
        selectedTerm = { value, button };
        highlightButton(button);
    } else {
        if (selectedMatch) unhighlightButton(selectedMatch.button, "match");
        selectedMatch = { value, button };
        highlightButton(button);
    }

    if (selectedTerm && selectedMatch) {
        addPair(selectedTerm.value, selectedTerm.button, selectedMatch.value, selectedMatch.button);
        selectedTerm = null;
        selectedMatch = null;
    }
}

function addPair(term, termBtn, match, matchBtn) {
    if (selectedPairs[term]) {
        let oldMatch = selectedPairs[term];
        removeColor(term, oldMatch);
        delete selectedPairs[term];
    }
    for (let t in selectedPairs) {
        if (selectedPairs[t] === match) {
            removeColor(t, match);
            delete selectedPairs[t];
            break;
        }
    }

    selectedPairs[term] = match;
    let colorClass = pairColors[colorIndex];
    colorIndex = (colorIndex + 1) % pairColors.length;

    colorMap[term]  = colorClass;
    colorMap[match] = colorClass;

    termBtn.classList.add(colorClass);
    matchBtn.classList.add(colorClass);
}

function removeColor(term, match) {
    let cTerm  = colorMap[term];
    let cMatch = colorMap[match];
    if (cTerm) {
        let btns = document.querySelectorAll("button");
        btns.forEach(b => {
            if (b.textContent === term) b.classList.remove(cTerm);
        });
        delete colorMap[term];
    }
    if (cMatch) {
        let btns = document.querySelectorAll("button");
        btns.forEach(b => {
            if (b.textContent === match) b.classList.remove(cMatch);
        });
        delete colorMap[match];
    }
}

function highlightButton(btn) {
    btn.style.border = "3px solid red";
}
function unhighlightButton(btn, type) {
    if (btn) {
        btn.style.border = (type === "term") ? "3px solid orange" : "3px solid lightblue";
        setTimeout(() => {
            btn.style.border = "none";
        }, 150);
    }
}

/** Nur 1 Versuch => Zurück, egal ob richtig oder falsch */
function checkFlussMatches(pairs) {
    let correct = true;
    for (let p of pairs) {
        if (!selectedPairs[p.term] || selectedPairs[p.term] !== p.match) {
            correct = false;
            break;
        }
    }
    if (correct) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Deine Zuordnung war nicht korrekt.");
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  FLUSS ABWÄRTS => 5-fach Mehrfachauswahl
 ***********************************************************/
function setMatchingColors(index, button) {
    const colors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
    button.classList.remove(...colors);

    if (selectedAnswers.includes(index)) {
        selectedAnswers = selectedAnswers.filter(i => i !== index);
    } else {
        selectedAnswers.push(index);
        let colorClass = colors[selectedAnswers.length % colors.length];
        button.classList.add(colorClass);
    }
}

/** 1 Versuch => direkt zurück, egal ob richtig/falsch */
function checkFiveAnswers(correctAnswers) {
    selectedAnswers.sort();
    correctAnswers.sort();
    if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Nicht die richtigen 5 Antworten.");
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  MULTI-CHOICE (z.B. 'Der Markt')
 ***********************************************************/
function handleMultiChoice(index, button, correctAnswers, subregion) {
    let maxLen = correctAnswers.length;
    if (selectedAnswers.includes(index)) {
        selectedAnswers = selectedAnswers.filter(i => i !== index);
        button.style.backgroundColor = "#f0f0f0";
        button.style.color = "black";
    } else {
        if (selectedAnswers.length < maxLen) {
            selectedAnswers.push(index);
            button.style.backgroundColor = "orange";
            button.style.color = "white";
        } else {
            alert(`Du kannst nur ${maxLen} Antworten auswählen!`);
        }
    }

    if (selectedAnswers.length === correctAnswers.length) {
        let sortedSelected = [...selectedAnswers].sort();
        let sortedCorrect = [...correctAnswers].sort();
        if (JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect)) {
            stars++;
            updateStars();
            alert("Richtig! ⭐ Du hast einen Stern erhalten.");
            handleNextTask(subregion);
        } else {
            alert("Falsch! ❌ Bitte versuche es nochmal.");
        }
    }
}

/***********************************************************
 *  NÄCHSTE AUFGABE / NAVIGATION
 ***********************************************************/
function handleNextTask(subregion) {
    if (subregion === "Die Bewohner") {
        dieBewohnerTaskIndex++;
    }
    if (subregion === "Der Markt") {
        marketTaskIndex++;
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  STERNE / SCREEN-WECHSEL
 ***********************************************************/
function updateStars() {
    document.getElementById("stars-count").textContent = stars;
}

function backToRegions() {
    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
}

function backToSubregions() {
    document.getElementById("task-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";
}
