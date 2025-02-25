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
let dieBewohnerTaskIndex = 0;  // Mehrfach-Aufgaben "Die Bewohner"
let marketTaskIndex = 0;       // Mehrfach-Aufgaben "Der Markt"

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
 ***********************************************************/
const questions = {
    "Weg": [{
        question: "Finde das Relativpronomen und klicke es an.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
    }],
    "Baum": [{
        question: "Suche das Subjekt des Satzes heraus und klicke es an.",
        sentence: "Est bos cervi figura, cuius a media fronte inter aures unum cornu exsistit excelsius magisque directum his, quae nobis nota sunt, cornibus.",
        answers: ["bos", "cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],

    // Die Bewohner => 2 Aufgaben
    "Die Bewohner": [
      {
        question: "Übersetze den Satz: 'Dicebant servos nullis iuribus praeditos esse et penitus a dominis pendere.'",
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

    // Der Markt => 2 Aufgaben (Mehrfachauswahl)
    "Der Markt": [
      {
        question: "Klicke die drei Stämme von Gallien an.",
        sentence: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae...",
        answers: ["Belgae", "Gallia", "Aquitani", "Celtae", "Galli"],
        correct: [0, 2, 3]
      },
      {
        question: "Markiere die beiden Flüsse.",
        sentence: "Eorum una pars, quam Gallos obtinere dictum ist, initium capit a flumine Rhodano...",
        answers: ["Rhodano", "Garumna", "Belgarum", "Aquitani"],
        correct: [0, 1]
      }
    ],

    // Fluss aufwärts => Zuordnung (Paare)
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu (Orange ↔ Hellblau).",
        pairs: [
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],

    // Der Hafen (Single Choice)
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        sentence: "Haec civitas longe plurimum totius Galliae",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],

    // Fluss abwärts => 5-fach Mehrfachauswahl
    "Fluss abwärts": [{
        question: "Markiere alle Adjektive.",
        sentence: "Sacrificia publica ac privata procurant, religiones interpretantur...",
        answers: ["publica", "controversiis", "privata", "disciplinae", "magnus", "magno", "omnibus", "interpretantur"],
        correct: [0, 2, 4, 5, 6]
    }]
};

/***********************************************************
 *  showSubregions(region)
 *  -> Hauptkategorie -> Subkategorien
 ***********************************************************/
function showSubregions(region) {
    currentRegion = region;

    // Entferne alte Hintergründe (falls gesetzt)
    document.body.classList.remove("wald-background", "fluss-background");

    // Füge ggf. Wald-/Fluss-Hintergrund hinzu
    if (region === "wald") {
        document.body.classList.add("wald-background");
    } else if (region === "fluss") {
        document.body.classList.add("fluss-background");
    }

    // Wechsle zum Subregionen-Screen
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";

    let container = document.getElementById("subregion-container");
    container.innerHTML = "";

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = function () {
            // Falls Subregion "Die Bewohner" oder "Der Markt" => Index zurücksetzen
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
 *  "FLUSS ABWÄRTS" -> Farbliche Zuordnung der Antworten
 ***********************************************************/
function setMatchingColors(index, button) {
    const colors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
    
    // Erst entferne alle möglichen matching-Klassen
    button.classList.remove("matching-blue", "matching-yellow", "matching-pink", "matching-green");

    if (selectedAnswers.includes(index)) {
        // War schon ausgewählt -> abwählen
        selectedAnswers = selectedAnswers.filter(i => i !== index);
    } else {
        // Neu auswählen
        selectedAnswers.push(index);

        // Farbliche Markierung basierend auf Anzahl der aktuell ausgewählten
        let colorClass = colors[selectedAnswers.length % colors.length];
        button.classList.add(colorClass);
    }
}

/***********************************************************
 *  startTask(subregion)
 *  -> Subkategorie -> Task-Screen
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

    // Falls in dieser Subregion mehrere Aufgaben (z.B. "Die Bewohner" oder "Der Markt")
    let task;

    // Mehrfach: "Die Bewohner"
    if (subregion === "Die Bewohner") {
        task = tasks[dieBewohnerTaskIndex];
        if (!task) {
            alert("Du hast alle Aufgaben in 'Die Bewohner' erledigt!");
            backToSubregions();
            return;
        }
    }
    // Mehrfach: "Der Markt"
    else if (subregion === "Der Markt") {
        task = tasks[marketTaskIndex];
        if (!task) {
            alert("Du hast alle Aufgaben im Markt erledigt!");
            backToSubregions();
            return;
        }
    }
    // Standard: nur eine Aufgabe
    else {
        task = tasks[0];
    }

    // Titel & Frage
    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = task.question;

    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    // Falls Satz existiert, zeigen wir ihn separat an
    if (task.sentence) {
        let sentenceP = document.createElement("p");
        sentenceP.style.fontStyle = "italic";
        sentenceP.textContent = task.sentence;
        answerContainer.appendChild(sentenceP);
    }

    // Spezialfall: Fluss aufwärts (Zuordnungs-Spiel)
    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }

    // Spezialfall: Fluss abwärts (Farbige Zuordnung + Bestätigungs-Button)
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

    // Standard: Buttons generieren (Single oder Multi)
    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");

        // Single Choice?
        if (!Array.isArray(task.correct)) {
            btn.onclick = () => {
                // Direkte Auswertung
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
        // Mehrfach
        else {
            btn.onclick = () => handleMultiChoice(index, btn, task.correct, subregion);
        }
        answerContainer.appendChild(btn);
    });
}

/***********************************************************
 *  Multi Choice Handler
 ***********************************************************/
function handleMultiChoice(index, button, correctAnswers, subregion) {
    let maxLen = correctAnswers.length;

    // Schon ausgewählt? => abwählen
    if (selectedAnswers.includes(index)) {
        selectedAnswers = selectedAnswers.filter(i => i !== index);
        button.style.backgroundColor = "rgba(0, 123, 255, 0.8)";
        button.style.color = "white";
    } else {
        // Noch nicht ausgewählt
        if (selectedAnswers.length < maxLen) {
            selectedAnswers.push(index);
            // Visualisieren: Orange als Auswahl
            button.style.backgroundColor = "orange";
            button.style.color = "white";
        } else {
            alert(`Du kannst nur ${maxLen} Antworten auswählen!`);
        }
    }

    // Wenn Anzahl der ausgewählten = Anzahl der korrekten => auswerten
    if (selectedAnswers.length === correctAnswers.length) {
        // Sortierter Vergleich
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
 *  "Fluss abwärts" => 5 korrekte => Button-Klick
 ***********************************************************/
function checkFiveAnswers(correctAnswers) {
    // Sortierte Listen vergleichen
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
 *  FLUSS AUFWÄRTS => Zuordnungs-Spiel (Paare)
 ***********************************************************/
let selectedTerm = null;
let selectedMatch = null;
let selectedPairs = {};

function setupMatchingGame(pairs) {
    let container = document.getElementById("answers-container");
    container.innerHTML = "<p>Verbinde Orange (lateinische Wörter) mit Hellblau (deutsche Bedeutung) per Klick!</p>";

    selectedPairs = {};

    let leftDiv  = document.createElement("div");
    let rightDiv = document.createElement("div");
    leftDiv.style.display  = "inline-block";
    leftDiv.style.marginRight = "50px";
    leftDiv.style.verticalAlign = "top";
    rightDiv.style.display = "inline-block";
    rightDiv.style.verticalAlign = "top";

    // Linke Seite (Orange Buttons)
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

    // Rechte Seite (Hellblau Buttons)
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

    // Überprüfen-Button
    let checkBtn = document.createElement("button");
    checkBtn.textContent = "Überprüfen";
    checkBtn.classList.add("button");
    checkBtn.style.marginTop = "20px";
    checkBtn.onclick = () => checkFlussMatches(pairs);
    container.appendChild(document.createElement("br"));
    container.appendChild(checkBtn);
}

function selectFlussItem(value, button, type) {
    // Merke, welches Element ausgewählt wurde (Term oder Match)
    if (type === "term") {
        selectedTerm = value;
        highlightButton(button);
    } else {
        selectedMatch = value;
        highlightButton(button);
    }

    // Wenn wir beides haben => Verknüpfen
    if (selectedTerm && selectedMatch) {
        selectedPairs[selectedTerm] = selectedMatch;
        console.log(`Verbindung: ${selectedTerm} ↔ ${selectedMatch}`);
        // Reset
        selectedTerm  = null;
        selectedMatch = null;
    }
}

// Kurzes visuelles "Highlight"
function highlightButton(btn) {
    btn.style.border = "3px solid red";
    setTimeout(() => {
        btn.style.border = "none";
    }, 300);
}

function checkFlussMatches(pairs) {
    let correct = true;
    for (let pair of pairs) {
        // Prüfen, ob die Zuordnung stimmt
        if (!selectedPairs[pair.term] || selectedPairs[pair.term] !== pair.match) {
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
        alert("Falsch! ❌ Bitte versuche es nochmal.");
        // Zurücksetzen, damit man neu ordnen kann
        selectedPairs = {};
    }
}

/***********************************************************
 *  NÄCHSTE AUFGABE / NAVIGATION
 ***********************************************************/
function handleNextTask(subregion) {
    // Falls wir in 'Die Bewohner' oder 'Der Markt' sind => nächste Teilaufgabe
    if (subregion === "Die Bewohner") {
        dieBewohnerTaskIndex++;
    }
    if (subregion === "Der Markt") {
        marketTaskIndex++;
    }
    // Dann zurück zum Subregion-Screen (oder erneut `startTask()` aufrufen)
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
