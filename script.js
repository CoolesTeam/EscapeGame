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
 *  SUBREGIONEN (Wald, Dorf, Fluss)
 ***********************************************************/
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/***********************************************************
 *  FRAGEN & ANTWORTEN
 *
 *  Hier ist wieder die ORIGINAL-Zuordnung:
 *  - "Fluss aufwärts" => Zuordnungs-Spiel
 *  - "Fluss abwärts" => 5-fach Mehrfachauswahl
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
    /* FLUSS AUFWÄRTS => Zuordnungs-Spiel (Paare) */
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu (Orange ↔ Hellblau).",
        pairs: [
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],

    /* Der Hafen => Single Choice */
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        sentence: "Haec civitas longe plurimum totius Galliae",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],

    /* FLUSS ABWÄRTS => Mehrfachauswahl mit 5 richtigen (Farbig) */
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

    // Passenden Hintergrund hinzufügen
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
            // Reset-Index für Mehrfach-Aufgaben
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

    // Mehrfach-Aufgaben in "Die Bewohner" / "Der Markt"
    let task;
    if (subregion === "Die Bewohner") {
        task = tasks[dieBewohnerTaskIndex];
        if (!task) {
            alert("Du hast alle Aufgaben in 'Die Bewohner' erledigt!");
            backToSubregions();
            return;
        }
    }
    else if (subregion === "Der Markt") {
        task = tasks[marketTaskIndex];
        if (!task) {
            alert("Du hast alle Aufgaben im Markt erledigt!");
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
    // 1) FLUSS AUFWÄRTS => Zuordnungs-Spiel
    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }

    // 2) FLUSS ABWÄRTS => Farbiges Mehrfachauswahl-Spiel
    if (subregion === "Fluss abwärts") {
        // Button zum Bestätigen
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkFiveAnswers(task.correct);
        answerContainer.appendChild(submitBtn);

        // Antworten -> farbige Auswahl
        task.answers.forEach((answer, index) => {
            let btn = document.createElement("button");
            btn.textContent = answer;
            btn.classList.add("button", "answer-button");
            btn.onclick = () => setMatchingColors(index, btn);
            answerContainer.appendChild(btn);
        });
        return;
    }

    // 3) Sonstige Aufgaben (Single oder Multi)
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
 *  FLUSS AUFWÄRTS => Zuordnungs-Spiel (Orange ↔ Hellblau)
 ***********************************************************/
const pairColors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
let colorIndex = 0; // Nur relevant, falls du pro Paar unterschiedliche Farben haben willst
                   // Hier kannst du es aber weglassen, wenn du IMMER die gleiche Farbe
                   // für jedes neue Paar nimmst.

let selectedTerm = null;
let selectedMatch = null;
let selectedPairs = {};
let colorMap = {};

function setupMatchingGame(pairs) {
    let container = document.getElementById("answers-container");
    container.innerHTML = "<p>Verbinde Orange (lateinische Wörter) mit Hellblau (deutsche Bedeutung) per Klick!</p>";

    // Zurücksetzen
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

/**
 * Klick auf Term oder Match
 */
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

    // Haben wir beides?
    if (selectedTerm && selectedMatch) {
        // Neues Paar anlegen/ändern
        addPair(selectedTerm.value, selectedMatch.value, selectedTerm.button, selectedMatch.button);

        // Reset
        selectedTerm = null;
        selectedMatch = null;
    }
}

/**
 * Paar speichern + Farbe anwenden
 */
function addPair(term, match, termBtn, matchBtn) {
    // Falls term schon verbunden war -> entfernen
    if (selectedPairs[term]) {
        let oldMatch = selectedPairs[term];
        removeColor(term, oldMatch);
        delete selectedPairs[term];
    }

    // Falls match schon verbunden war (umgekehrt)
    for (let t in selectedPairs) {
        if (selectedPairs[t] === match) {
            removeColor(t, match);
            delete selectedPairs[t];
            break;
        }
    }

    // Neues Paar
    selectedPairs[term] = match;

    // Nimm eine Farbklasse
    let colorClass = pairColors[colorIndex];
    colorIndex = (colorIndex + 1) % pairColors.length;

    // Speichere im colorMap
    colorMap[term]  = colorClass;
    colorMap[match] = colorClass;

    // Füge die Klasse hinzu
    termBtn.classList.add(colorClass);
    matchBtn.classList.add(colorClass);
}

/**
 * Entfernt die Farbe von term+match
 */
function removeColor(term, match) {
    let colorClassTerm  = colorMap[term];
    let colorClassMatch = colorMap[match];

    if (colorClassTerm) {
        let btns = document.querySelectorAll("button");
        btns.forEach(b => {
            if (b.textContent === term) {
                b.classList.remove(colorClassTerm);
            }
        });
        delete colorMap[term];
    }
    if (colorClassMatch) {
        let btns = document.querySelectorAll("button");
        btns.forEach(b => {
            if (b.textContent === match) {
                b.classList.remove(colorClassMatch);
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
 * Überprüfen
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
        setTimeout(backToSubregions, 1000);
    } else {
        alert("Falsch! ❌ Bitte versuche es nochmal (du kannst die Zuordnungen ändern).");
    }
}

/***********************************************************
 *  FLUSS ABWÄRTS => Mehrfachauswahl (5 richtige), farbig
 ***********************************************************/
function setMatchingColors(index, button) {
    // 4 Farben: blau, gelb, rosa, grün
    const colors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];

    // Erst alle entfernen
    button.classList.remove(...colors);

    if (selectedAnswers.includes(index)) {
        // Abwählen
        selectedAnswers = selectedAnswers.filter(i => i !== index);
    } else {
        // Neu
        selectedAnswers.push(index);
        let colorClass = colors[selectedAnswers.length % colors.length];
        button.classList.add(colorClass);
    }
}

function checkFiveAnswers(correctAnswers) {
    selectedAnswers.sort();
    correctAnswers.sort();
    if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
        setTimeout(backToSubregions, 1000);
    } else {
        alert("Falsch! ❌ Du musst GENAU fünf richtige Antworten auswählen.");
    }
}

/***********************************************************
 *  Multi-Choice Handler (z.B. in 'Der Markt')
 ***********************************************************/
function handleMultiChoice(index, button, correctAnswers, subregion) {
    let maxLen = correctAnswers.length;
    if (selectedAnswers.includes(index)) {
        // abwählen
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

    // Wenn Anzahl gleich => Check
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
