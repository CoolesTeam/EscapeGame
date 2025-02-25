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
 *  SUBREGIONEN
 ***********************************************************/
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/***********************************************************
 *  FRAGEN & ANTWORTEN (Beispiel)
 ***********************************************************/
const questions = {
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

    "Die Bewohner": [
      {
        question: "Übersetze den Satz: 'Dicebant servos nullis iuribus praeditos esse...'",
        answers: [
            "Die Sklaven haben keine Rechte und sind abhängig von ihren Herren.",
            "Sie sagten, dass die Sklaven keinerlei Rechte hätten...",
            "Die Sklaven sagen, dass sie keine Rechte haben..."
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
    "Fluss aufwärts": [{
        question: "Markiere alle Adjektive.",
        sentence: "Sacrificia publica ac privata procurant...",
        answers: ["publica", "controversiis", "privata", "disciplinae", "magnus", "magno", "omnibus", "interpretantur"],
        correct: [0, 2, 4, 5, 6]
    }],
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        sentence: "Haec civitas longe plurimum totius Galliae",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],
    // -> HIER Das Zuordnungs-Spiel
    "Fluss abwärts": [{
        question: "Ordne die Begriffe richtig zu (Orange ↔ Hellblau).",
        pairs: [
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }]
};

/***********************************************************
 *  showSubregions(region)
 ***********************************************************/
function showSubregions(region) {
    currentRegion = region;

    // Entferne alte Hintergründe
    document.body.classList.remove("wald-background", "fluss-background");

    // Füge ggf. Wald-/Fluss-Hintergrund hinzu
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
            // Falls "Die Bewohner" / "Der Markt" => Index zurücksetzen
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

    // Mehrfach-Aufgaben "Die Bewohner" / "Der Markt"
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
        // Standard: Nur eine Aufgabe
        task = tasks[0];
    }

    // Titel & Frage
    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = task.question;

    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    // Falls Satz vorhanden
    if (task.sentence) {
        let sentenceP = document.createElement("p");
        sentenceP.style.fontStyle = "italic";
        sentenceP.textContent = task.sentence;
        answerContainer.appendChild(sentenceP);
    }

    // Spezialfälle:
    // 1) Fluss aufwärts => Farbiges Mehrfachauswahl
    if (subregion === "Fluss aufwärts") {
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

    // 2) Fluss abwärts => Zuordnungs-Spiel
    if (subregion === "Fluss abwärts") {
        setupMatchingGame(task.pairs);
        return;
    }

    // 3) Ansonsten Single/Mehrfach
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
 *  FLUSS AUFWÄRTS => Farbiges Mehrfachauswahl
 ***********************************************************/
function setMatchingColors(index, button) {
    const colors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];

    button.classList.remove(...colors);

    if (selectedAnswers.includes(index)) {
        // Abwählen
        selectedAnswers = selectedAnswers.filter(i => i !== index);
    } else {
        // Neu auswählen
        selectedAnswers.push(index);
        // Farbklasse anhand der Anzahl bereits ausgewählter
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
 *  FLUSS ABWÄRTS => Zuordnungs-Spiel mit Farben, 
 *  die bleiben bis zur Korrektur
 ***********************************************************/

/* 1) Wir definieren vier Farbklassen für die Paarung. */
const pairColors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
let colorIndex = 0; // globale Laufvariable pro Paar

/* 
   - selectedTerm / selectedMatch: aktiver Klick, 
   - selectedPairs: Dictionary { term -> match }, 
   - colorMap: Dictionary { "caelo": "matching-blue", "Himmel": "matching-blue", ... } 
*/
let selectedTerm = null;
let selectedMatch = null;
let selectedPairs = {};
let colorMap = {}; // Speichert, welche Farbe gerade auf einem Term/Match liegt

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

    // Linke Seite (Orange Buttons: term)
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

    // Rechte Seite (Hellblau Buttons: match)
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

/**
 * Klick auf Term oder Match
 */
function selectFlussItem(value, button, type) {
    // Falls der User zuerst auf Term klickt, dann auf Match (oder umgekehrt)
    // 1) Wenn ein Term ausgewählt ist und wir klicken auf einen Match, bilden wir ein Paar.
    // 2) Umgekehrt genauso.

    if (type === "term") {
        // Wenn wir schon einen Term hatten, entfernen wir die Auswahl
        if (selectedTerm) {
            unhighlightButton(selectedTerm.button, "term");
        }
        selectedTerm = { value, button };
        highlightButton(button);
    } else {
        // type === "match"
        if (selectedMatch) {
            unhighlightButton(selectedMatch.button, "match");
        }
        selectedMatch = { value, button };
        highlightButton(button);
    }

    // Prüfen, ob wir beide Seiten haben
    if (selectedTerm && selectedMatch) {
        // -> Neues Pair bilden
        addPair(selectedTerm.value, selectedMatch.value, selectedTerm.button, selectedMatch.button);

        // zurücksetzen, damit der nächste Klick wieder von vorne beginnt
        selectedTerm = null;
        selectedMatch = null;
    }
}

/**
 * Ein neues Paar in selectedPairs eintragen
 * und beide Buttons mit derselben Farbe belegen.
 */
function addPair(term, match, termBtn, matchBtn) {
    // Prüfen, ob der term schon mit was anderem gematched war
    if (selectedPairs[term]) {
        // Dann altes Match entfernen
        let oldMatch = selectedPairs[term];
        removeColor(term, oldMatch);
        delete selectedPairs[term];
    }

    // Falls umgekehrt der match schon mit einem anderen term verbunden war:
    // => wir suchen, wo (termX -> match) == match
    for (const t in selectedPairs) {
        if (selectedPairs[t] === match) {
            removeColor(t, match);
            delete selectedPairs[t];
            break;
        }
    }

    // Jetzt neues Paar anlegen
    selectedPairs[term] = match;

    // Nächste Farbe aus dem Array
    let colorClass = pairColors[colorIndex];
    colorIndex = (colorIndex + 1) % pairColors.length;

    // Speichere die Farbe in colorMap
    colorMap[term]  = colorClass;
    colorMap[match] = colorClass;

    // Anwenden auf Buttons
    termBtn.classList.add(colorClass);
    matchBtn.classList.add(colorClass);
}

/**
 * Entfernt die zugeordnete Farbe von term + match (sofern vorhanden).
 */
function removeColor(term, match) {
    let colorClassTerm  = colorMap[term];
    let colorClassMatch = colorMap[match];

    // Buttons via DOM suchen oder mit einer eigenen Buttons-Map verwalten.
    // Hier vereinfachend: document.querySelectorAll
    // => wir finden das jeweilige Button-Element und entfernen die Klasse
    if (colorClassTerm) {
        let btns = document.querySelectorAll("button");
        btns.forEach(btn => {
            if (btn.textContent === term) {
                btn.classList.remove(colorClassTerm);
            }
        });
        delete colorMap[term];
    }
    if (colorClassMatch) {
        let btns = document.querySelectorAll("button");
        btns.forEach(btn => {
            if (btn.textContent === match) {
                btn.classList.remove(colorClassMatch);
            }
        });
        delete colorMap[match];
    }
}

/**
 * Kurzes optisches Hervorheben des aktuellen Klicks
 */
function highlightButton(btn) {
    btn.style.border = "3px solid red";
}

/**
 * Wenn man erneut klickt, entfernen wir das rote Hervorheben.
 */
function unhighlightButton(btn, type) {
    if (btn) {
        btn.style.border = (type === "term") ? "3px solid orange" : "3px solid lightblue";
        setTimeout(() => {
            btn.style.border = "none";
        }, 150);
    }
}

/**
 * finaler Check aller Paare
 */
function checkFlussMatches(pairs) {
    let correct = true;

    // pairs = [{term:"caelo",match:"Himmel"},...]
    // => wir prüfen, ob selectedPairs[term] === match
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
        alert("Falsch! ❌ Bitte versuche es nochmal (du kannst beliebig umstellen).");
    }
}

/***********************************************************
 *  Mehrfachauswahl-Handler (z.B. in 'Der Markt')
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

    // Wenn Anzahl gleich => auswerten
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
 *  Aufgaben-Fortschritt / Nächste Aufgabe
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
