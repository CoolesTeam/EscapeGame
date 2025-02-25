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
let selectedAnswers = [];       // Für Mehrfach- und 5er-Auswahl
let dieBewohnerTaskIndex = 0;  
let marketTaskIndex = 0;       

/***********************************************************
 *  SUBREGIONEN
 ***********************************************************/
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/***********************************************************
 *  FRAGEN & ANTWORTEN
 *
 *  - "Fluss aufwärts": Zuordnungs-Spiel (1 Versuch)
 *  - "Fluss abwärts": 5-fach Mehrfachauswahl (1 Versuch)
 ***********************************************************/
const questions = {
    // Wald
    "Weg": [{
        question: "Finde das Relativpronomen und klicke es an.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
    }],
    "Baum": [{
        question: "Suche das Subjekt des Satzes heraus und klicke es an.",
        sentence: "Est bos cervi figura, cuius a media fronte inter aures unum cornu exsistit excelsius...",
        answers: ["bos", "cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],

    // Dorf
    "Die Bewohner": [
      {
        question: "Übersetze den Satz: 'Dicebant servos nullis iuribus praeditos esse...'",
        answers: [
            "Die Sklaven haben keine Rechte und sind abhängig von ihren Herren.",
            "Sie sagten, dass die Sklaven keinerlei Rechte hätten und vollständig von ihren Herren abhängig sind.",
            "Die Sklaven sagen, dass sie keine Rechte haben und abhängig von ihren Herren sind."
        ],
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
        question: "Klicke die drei Stämme von Gallien an.",
        sentence: "Gallia est omnis divisa in partes tres...",
        answers: ["Belgae", "Gallia", "Aquitani", "Celtae", "Galli"],
        correct: [0, 2, 3]
      },
      {
        question: "Markiere die beiden Flüsse.",
        sentence: "Eorum una pars, quam Gallos obtinere dictum est...",
        answers: ["Rhodano", "Garumna", "Belgarum", "Aquitani"],
        correct: [0, 1]
      }
    ],

    // Fluss
    /* FLUSS AUFWÄRTS => Zuordnungs-Spiel (1 Versuch) */
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu (Orange ↔ Hellblau).",
        pairs: [
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],
    /* Der Hafen => Single */
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        sentence: "Haec civitas longe plurimum totius Galliae",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],
    /* FLUSS ABWÄRTS => 5-fach Mehrfachauswahl (1 Versuch) */
    "Fluss abwärts": [{
        question: "Markiere alle Adjektive.",
        sentence: "Sacrificia publica ac privata procurant, religiones interpretantur...",
        answers: ["publica", "controversiis", "privata", "disciplinae", "magnus", "magno", "omnibus", "interpretantur"],
        correct: [0, 2, 4, 5, 6]
    }]
};

/***********************************************************
 *  showSubregions(region)
 ***********************************************************/
function showSubregions(region) {
    currentRegion = region;

    // Hintergründe entfernen
    document.body.classList.remove("wald-background", "fluss-background");

    // Ggf. Wald-/Fluss-Hintergrund
    if (region === "wald") {
        document.body.classList.add("wald-background");
    } else if (region === "fluss") {
        document.body.classList.add("fluss-background");
    }

    // Wechsel zum Subregionen-Screen
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
    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("task-screen").style.display = "block";

    let tasks = questions[subregion];
    if (!tasks) {
        console.error("Fehler: Keine Frage für diese Unterregion gefunden!");
        return;
    }

    // Mehrfach-Aufgaben in 'Die Bewohner' oder 'Der Markt'
    let task;
    if (subregion === "Die Bewohner") {
        task = tasks[dieBewohnerTaskIndex];
        if (!task) {
            alert("Alle Aufgaben in 'Die Bewohner' erledigt!");
            backToSubregions();
            return;
        }
    } else if (subregion === "Der Markt") {
        task = tasks[marketTaskIndex];
        if (!task) {
            alert("Alle Aufgaben im Markt erledigt!");
            backToSubregions();
            return;
        }
    } else {
        // Standard: nur eine Aufgabe
        task = tasks[0];
    }

    // Titel & Frage
    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = task.question;

    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    // Satz anzeigen (falls vorhanden)
    if (task.sentence) {
        let sentenceP = document.createElement("p");
        sentenceP.style.fontStyle = "italic";
        sentenceP.textContent = task.sentence;
        answerContainer.appendChild(sentenceP);
    }

    // Spezialfälle:
    // 1) Fluss aufwärts => Zuordnungs-Spiel (1 Versuch)
    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }

    // 2) Fluss abwärts => 5-fach Mehrfachauswahl (1 Versuch)
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

    // 3) Sonst Single/Mehrfach
    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");

        // Single
        if (!Array.isArray(task.correct)) {
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
        }
        // Multi
        else {
            btn.onclick = () => handleMultiChoice(index, btn, task.correct, subregion);
        }
        answerContainer.appendChild(btn);
    });
}

/***********************************************************
 *  FLUSS AUFWÄRTS => Zuordnungs-Spiel (Nur 1 Versuch!)
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

    // zurücksetzen
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

    // Linke Seite (Term)
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

    // Rechte Seite (Match)
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

    // Überprüfen-Button => Nur 1 Versuch!
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

    // beide?
    if (selectedTerm && selectedMatch) {
        addPair(selectedTerm.value, selectedTerm.button, selectedMatch.value, selectedMatch.button);
        // Reset
        selectedTerm = null;
        selectedMatch = null;
    }
}

/**
 * Speichert Paar + Farbe
 */
function addPair(term, termBtn, match, matchBtn) {
    // Falls term schon verbunden
    if (selectedPairs[term]) {
        let oldMatch = selectedPairs[term];
        removeColor(term, oldMatch);
        delete selectedPairs[term];
    }
    // Falls match schon verbunden
    for (let t in selectedPairs) {
        if (selectedPairs[t] === match) {
            removeColor(t, match);
            delete selectedPairs[t];
            break;
        }
    }

    // Neues Paar
    selectedPairs[term] = match;
    let colorClass = pairColors[colorIndex];
    colorIndex = (colorIndex + 1) % pairColors.length;
    colorMap[term]  = colorClass;
    colorMap[match] = colorClass;
    termBtn.classList.add(colorClass);
    matchBtn.classList.add(colorClass);
}

function removeColor(term, match) {
    let classTerm  = colorMap[term];
    let classMatch = colorMap[match];
    if (classTerm) {
        let btns = document.querySelectorAll("button");
        btns.forEach(b => {
            if (b.textContent === term) {
                b.classList.remove(classTerm);
            }
        });
        delete colorMap[term];
    }
    if (classMatch) {
        let btns = document.querySelectorAll("button");
        btns.forEach(b => {
            if (b.textContent === match) {
                b.classList.remove(classMatch);
            }
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

/**
 * Nur 1 Versuch => Wenn falsch, direkt zurück
 */
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
    // Danach zurück
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  FLUSS ABWÄRTS => 5-fach Mehrfachauswahl (1 Versuch)
 ***********************************************************/
function setMatchingColors(index, button) {
    const colors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
    button.classList.remove(...colors);

    if (selectedAnswers.includes(index)) {
        // abwählen
        selectedAnswers = selectedAnswers.filter(i => i !== index);
    } else {
        // neu
        selectedAnswers.push(index);
        let colorClass = colors[selectedAnswers.length % colors.length];
        button.classList.add(colorClass);
    }
}

/**
 * Nur 1 Versuch => direkt zurück
 */
function checkFiveAnswers(correctAnswers) {
    selectedAnswers.sort();
    correctAnswers.sort();
    if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Du hast nicht die richtigen 5 Antworten gewählt.");
    }
    // Danach sofort zurück
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  Multi-Choice Handler (z.B. 'Der Markt')
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

    // Wenn Anzahl = correctAnswers.length => Check
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
 *  STERNE & NAVIGATION
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
