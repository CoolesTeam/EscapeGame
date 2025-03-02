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

/**
 * Wir speichern den Status jeder Frage in einer Struktur:
 * answeredStatus[subregion] = 
 *   - null, falls kein Mehrfach => single Task
 *   - oder ein Array, falls es mehrere Tasks gibt.
 * 
 * Mögliche Werte:
 * - "unanswered": (Standard) => noch nicht beantwortet
 * - "correct" => einmal richtig gelöst
 * - "wrong"   => einmal falsch gelöst
 * 
 * Für Subregionen mit mehreren Aufgaben (z. B. "Die Bewohner" mit 2):
 *   answeredStatus["Die Bewohner"] = ["unanswered"/"correct"/"wrong", ...]
 */
let answeredStatus = {
    "Weg": "unanswered",
    "Baum": "unanswered",

    "Die Bewohner": ["unanswered", "unanswered"],
    "Der Markt":    ["unanswered", "unanswered"],

    "Fluss aufwärts": "unanswered",
    "Der Hafen":       "unanswered",
    "Fluss abwärts":   "unanswered"
};

let dieBewohnerTaskIndex = 0;  
let marketTaskIndex = 0;  

// Für Mehrfach-/5er-Auswahl
let selectedAnswers = [];

// Aktuelle Region/Subregion
let currentRegion = "";
let currentSubregion = "";

/***********************************************************
 *  SUBREGIONEN-LISTE
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
    "Weg": [{
        question: "Finde das Relativpronomen und klicke es an.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
    }],
    "Baum": [{
        question: "Suche das Subjekt des Satzes...",
        answers: ["bos", "cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],

    // "Die Bewohner" => 2 Aufgaben
    "Die Bewohner": [
      {
        question: "Übersetze...",
        answers: [
            "Die Sklaven haben keine Rechte...",
            "Sie sagten, dass die Sklaven keinerlei Rechte hätten...",
            "Die Sklaven sagen, dass sie keine Rechte haben..."
        ],
        correct: 1
      },
      {
        question: "Gib den AcI-Auslöser an.",
        answers: ["dicebant", "iuribus", "praeditos"],
        correct: 0
      }
    ],

    // "Der Markt" => 2 Aufgaben
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

    // Fluss
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
 *  showSubregions(region)
 ***********************************************************/
function showSubregions(region) {
    currentRegion = region;

    // Hintergründe
    document.body.classList.remove("wald-background", "fluss-background");
    if (region === "wald")  document.body.classList.add("wald-background");
    if (region === "fluss") document.body.classList.add("fluss-background");

    document.getElementById("game-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";

    let container = document.getElementById("subregion-container");
    container.innerHTML = "";

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = function () {
            // Reset Indizes bei Mehrfachaufgaben
            if (region === "dorf" && sub === "Die Bewohner") {
                // Wenn wir 2 Tasks haben => answeredStatus["Die Bewohner"] = [...]
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
 *  => Prüft, ob bereits "wrong" oder "correct"
 ***********************************************************/
function startTask(subregion) {
    currentSubregion = subregion;
    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("task-screen").style.display = "block";

    let tasks = questions[subregion];
    if (!tasks) {
        console.error("Keine Fragen zu dieser Subregion:", subregion);
        return;
    }

    // MULTI-Aufgaben: "Die Bewohner" / "Der Markt"
    let task;
    let statusForSubregion = answeredStatus[subregion];

    if (Array.isArray(tasks) && tasks.length > 1) {
        // subregion hat mehrere Aufgaben
        let index = 0;
        if (subregion === "Die Bewohner") index = dieBewohnerTaskIndex;
        else if (subregion === "Der Markt") index = marketTaskIndex;
        
        // Prüfe, ob array => answeredStatus[subregion][index]
        if (statusForSubregion[index] !== "unanswered") {
            // Falls "wrong" oder "correct" => kein 2. Versuch
            alert("Diese Aufgabe wurde bereits beantwortet. Keine Wiederholung möglich!");
            backToSubregions();
            return;
        }

        task = tasks[index];

    } else {
        // Single-Aufgabe
        if (statusForSubregion !== "unanswered") {
            alert("Diese Aufgabe wurde bereits beantwortet. Keine Wiederholung möglich!");
            backToSubregions();
            return;
        }
        task = tasks[0];
    }

    // Normaler Ablauf: UI vorbereiten
    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = task.question;

    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    // Satz optional
    if (task.sentence) {
        let p = document.createElement("p");
        p.style.fontStyle = "italic";
        p.textContent = task.sentence;
        answerContainer.appendChild(p);
    }

    // FLUSS AUFWÄRTS => Zuordnungs-Spiel
    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }

    // FLUSS ABWÄRTS => 5-fach Mehrfachauswahl
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

    // Standard (Single / MultiChoice)
    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");

        if (!Array.isArray(task.correct)) {
            // Single
            btn.onclick = () => {
                if (index === task.correct) {
                    // Richtig => Stern + set "correct"
                    setAnswerStatus(subregion, "correct");
                    stars++;
                    updateStars();
                    alert("Richtig! ⭐ Du hast einen Stern erhalten.");
                    handleNextTask(subregion);
                } else {
                    // Falsch => set "wrong"
                    setAnswerStatus(subregion, "wrong");
                    alert("Falsch! ❌ Keine Wiederholung möglich.");
                    handleNextTask(subregion);
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
 *  Hilfsfunktion setAnswerStatus(subregion, status)
 *  -> Für Single / für Multi mit Index
 ***********************************************************/
function setAnswerStatus(subregion, result) {
    let tasks = questions[subregion];

    // Mehrfach-Aufgaben?
    if (Array.isArray(tasks) && tasks.length > 1) {
        if (subregion === "Die Bewohner") {
            answeredStatus[subregion][dieBewohnerTaskIndex] = result;
        } else if (subregion === "Der Markt") {
            answeredStatus[subregion][marketTaskIndex] = result;
        }
    } else {
        // Single
        answeredStatus[subregion] = result;
    }
}

/***********************************************************
 *  handleNextTask(subregion)
 *  -> Falls subregion mehrere Aufgaben hat, zum nächsten Index
 *     Sonst => zurück
 ***********************************************************/
function handleNextTask(subregion) {
    let tasks = questions[subregion];
    if (Array.isArray(tasks) && tasks.length > 1) {
        // Mehrere
        if (subregion === "Die Bewohner") dieBewohnerTaskIndex++;
        if (subregion === "Der Markt")    marketTaskIndex++;
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  MULTI CHOICE: handleMultiChoice
 *  -> Single Attempt => Bei erstem Fehler => "wrong"
 *     Bei richtig => "correct"
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

    // Wenn Anzahl = correctAnswers.length => auswerten
    if (selectedAnswers.length === correctAnswers.length) {
        let sortedSel = [...selectedAnswers].sort();
        let sortedCor = [...correctAnswers].sort();
        if (JSON.stringify(sortedSel) === JSON.stringify(sortedCor)) {
            // correct
            setAnswerStatus(subregion, "correct");
            stars++;
            updateStars();
            alert("Richtig! ⭐ Du hast einen Stern erhalten.");
            handleNextTask(subregion);
        } else {
            // wrong
            setAnswerStatus(subregion, "wrong");
            alert("Falsch! ❌ Keine Wiederholung möglich.");
            handleNextTask(subregion);
        }
    }
}

/***********************************************************
 *  FLUSS ABWÄRTS => 5-fach Mehrfachauswahl
 *  -> Einmaliger Versuch
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

function checkFiveAnswers(correctAnswers) {
    selectedAnswers.sort();
    correctAnswers.sort();
    if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
        // correct
        setAnswerStatus(currentSubregion, "correct");
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        // wrong
        setAnswerStatus(currentSubregion, "wrong");
        alert("Falsch! ❌ Keine Wiederholung möglich.");
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  FLUSS AUFWÄRTS => Zuordnungs-Spiel (auch nur 1 Versuch)
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
        if (selectedTerm) highlightButton(selectedTerm.button, "term"); // un-highlight
        selectedTerm = { value, button };
        highlightButton(button, "select");
    } else {
        if (selectedMatch) highlightButton(selectedMatch.button, "match");
        selectedMatch = { value, button };
        highlightButton(button, "select");
    }

    if (selectedTerm && selectedMatch) {
        addPair(selectedTerm.value, selectedTerm.button, selectedMatch.value, selectedMatch.button);
        selectedTerm = null;
        selectedMatch = null;
    }
}

function addPair(term, termBtn, match, matchBtn) {
    // vorhandene Zuordnungen löschen
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
    let c = pairColors[colorIndex];
    colorIndex = (colorIndex + 1) % pairColors.length;

    colorMap[term]  = c;
    colorMap[match] = c;

    termBtn.classList.add(c);
    matchBtn.classList.add(c);
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

function highlightButton(btn, mode) {
    if (mode === "select") {
        btn.style.border = "3px solid red";
    } else {
        // unselect
        btn.style.border = "none";
    }
}

function checkFlussMatches(pairs) {
    let correct = true;
    for (let p of pairs) {
        if (!selectedPairs[p.term] || selectedPairs[p.term] !== p.match) {
            correct = false;
            break;
        }
    }

    if (correct) {
        setAnswerStatus(currentSubregion, "correct");
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        setAnswerStatus(currentSubregion, "wrong");
        alert("Falsch! ❌ Keine Wiederholung möglich.");
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  UPDATE STARS
 ***********************************************************/
function updateStars() {
    document.getElementById("stars-count").textContent = stars;
}

/***********************************************************
 *  BACK / NAVIGATION
 ***********************************************************/
function backToRegions() {
    document.body.classList.remove("wald-background", "fluss-background");
    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
}

function backToSubregions() {
    document.getElementById("task-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";
}
