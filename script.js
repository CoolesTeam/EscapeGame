/***********************************************************
 *  FUNKTIONEN FÜR START- & INTRO-SEITE
 ***********************************************************/
function showIntro() {
  // Willkommensbildschirm ausblenden
  document.getElementById("welcome-screen").style.display = "none";
  // Intro einblenden
  document.getElementById("intro-screen").style.display = "block";
}

function startGame() {
  // Intro ausblenden
  document.getElementById("intro-screen").style.display = "none";
  // Hauptspiel einblenden
  document.getElementById("game-screen").style.display = "block";
  updateStars();
}

/***********************************************************
 *  GLOBALE VARIABLEN
 ***********************************************************/
let stars = 0;               // Anzahl gesammelter Sterne
let currentRegion = "";      // Wald, Dorf oder Fluss
let currentSubregion = "";   // z.B. Weg, Baum, Die Bewohner ...
let selectedAnswers = [];    // Zwischenspeicher bei Mehrfachauswahl

// Indizes für Mehrfach-Aufgaben
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
 ***********************************************************/
const questions = {
    "Weg": [{
        question: "Finde das Relativpronomen und klicke es an.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2 // Single Choice
    }],
    "Baum": [{
        question: "Suche das Subjekt des Satzes heraus und klicke es an.",
        sentence: "Est bos cervi figura, cuius a media fronte inter aures unum cornu exsistit excelsius magisque directum his, quae nobis nota sunt, cornibus.",
        answers: ["bos", "cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0 // Single Choice
    }],

    // "Die Bewohner" => 2 Aufgaben => Single-Choice
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
        answers: [
          "dicebant",
          "iuribus",
          "praeditos"
        ],
        correct: 0
      }
    ],

    // "Der Markt" => 2 Aufgaben => Mehrfachauswahl
    "Der Markt": [
      {
        question: "Klicke die drei Stämme von Gallien an.",
        sentence: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.",
        answers: ["Belgae", "Gallia", "Aquitani", "Celtae", "Galli"],
        correct: [0, 2, 3] // 3 richtige
      },
      {
        question: "Markiere die beiden Flüsse.",
        sentence: "Eorum una pars, quam Gallos obtinere dictum est, initium capit a flumine Rhodano, continetur Garumna flumine, Oceano finibus Belgarum",
        answers: ["Rhodano", "Garumna", "Belgarum", "Aquitani"],
        correct: [0, 1] // 2 richtige
      }
    ],

    // "Fluss aufwärts" => Zuordnungs-Spiel
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu (Orange ↔ Hellblau).",
        pairs: [
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],

    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        sentence: "Haec civitas longe plurimum totius Galliae",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2 // Single Choice
    }],

    // "Fluss abwärts" => 5-fach Mehrfachauswahl
    "Fluss abwärts": [{
        question: "Markiere alle Adjektive.",
        sentence: "Sacrificia publica ac privata procurant, religiones interpretantur. Ad hos magnus adulescentium numerus disciplinae causa concurrit magnoque hi sind apud eos honore. Nam fere de omnibus controversiis publicis privatisque constituunt",
        answers: ["publica", "controversiis", "privata", "disciplinae", "magnus", "magno", "omnibus", "interpretantur"],
        correct: [0, 2, 4, 5, 6]
    }]
};

/***********************************************************
 *  Region -> Subregion
 ***********************************************************/
function showSubregions(region) {
    currentRegion = region;
    // Game-Screen ausblenden
    document.getElementById("game-screen").style.display = "none";
    // Subregion-Screen einblenden
    document.getElementById("subregion-screen").style.display = "block";
    
    let container = document.getElementById("subregion-container");
    container.innerHTML = "";

    // Erzeuge Buttons für jede Subregion
    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = function () {
          // Reset Indizes falls wir "Die Bewohner" / "Der Markt" auswählen
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
 *  startTask -> Anzeige der Frage/Aufgabe
 ***********************************************************/
function startTask(subregion) {
    let taskScreen = document.getElementById("task-screen");

    // Hintergrundbild setzen & korrekt skalieren
    if (subregion === "Weg" || subregion === "Baum") {
        taskScreen.style.backgroundImage = "url('Wald.jpg')";
    } 
    else if (subregion === "Fluss aufwärts" || subregion === "Der Hafen" || subregion === "Fluss abwärts") {
        taskScreen.style.backgroundImage = "url('Fluss.jpg')";
    } 
    else {
        taskScreen.style.backgroundImage = "url('Standard.jpg')";
    }

    // Stile setzen, damit das Bild vollständig angezeigt wird
    taskScreen.style.backgroundSize = "cover";  // Skaliert das Bild, damit es den gesamten Bereich füllt
    taskScreen.style.backgroundPosition = "center"; // Zentriert das Bild
    taskScreen.style.backgroundRepeat = "no-repeat"; // Verhindert Wiederholung des Bildes

    // *** Standard-Logik bleibt gleich ***
    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("task-screen").style.display = "block";

    let task = questions[subregion][0];
    if (!task) {
        console.error("Fehler: Keine Frage für diese Unterregion gefunden!");
        return;
    }

    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = task.question;

    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";

    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");
        btn.onclick = () => handleSelectAnswers(index, btn, task.correct);
        answerContainer.appendChild(btn);
    });
}

    let tasks = questions[subregion];
    if (!tasks) {
        console.error("Fehler: Keine Frage für diese Unterregion gefunden!");
        return;
    }

    let task;
    // "Die Bewohner" => 2 Aufgaben => Index
    if (subregion === "Die Bewohner") {
        task = tasks[dieBewohnerTaskIndex];
    }
    // "Der Markt" => 2 Aufgaben => Index
    else if (subregion === "Der Markt") {
        task = tasks[marketTaskIndex];
    }
    else {
        // Standard: 1 Aufgabe
        task = tasks[0];
    }

    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = task.question;

    // Container für Antworten leeren
    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    // Falls ein Satz existiert (z.B. Der Markt, Die Bewohner)
    if (task.sentence) {
        let sentenceElement = document.createElement("p");
        sentenceElement.textContent = task.sentence;
        sentenceElement.style.fontStyle = "italic";
        sentenceElement.style.marginBottom = "10px";
        answerContainer.appendChild(sentenceElement);
    }

    // Fluss aufwärts => Zuordnungs-Spiel
    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }

    // Standard: Erzeuge Buttons für die Antworten
    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");
        // Klick -> Single/Mehrfach-Logik
        btn.onclick = () => handleSelectAnswers(index, btn, task.correct);
        answerContainer.appendChild(btn);
    });

    // 1) "Die Bewohner" => 2 Aufgaben, Single Choice -> checkBewohnerAnswers
    if (subregion === "Die Bewohner") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkBewohnerAnswers(task.correct);
        answerContainer.appendChild(submitBtn);
    }

    // 2) "Der Markt" => 2 Aufgaben, Multi Choice -> checkMarketAnswers
    if (subregion === "Der Markt") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkMarketAnswers(task.correct);
        answerContainer.appendChild(submitBtn);
    }

    // 3) "Fluss abwärts" => 5 richtige -> checkFiveAnswers
    if (subregion === "Fluss abwärts") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkFiveAnswers(task.correct);
        answerContainer.appendChild(submitBtn);
    }
}

/***********************************************************
 *  Single vs. Multi Choice
 ***********************************************************/
function handleSelectAnswers(index, button, correctAnswers) {
    // Falls Array => Mehrfachauswahl
    if (Array.isArray(correctAnswers)) {
        let maxLen = correctAnswers.length;
        if (selectedAnswers.includes(index)) {
            // Button wurde abgewählt
            selectedAnswers = selectedAnswers.filter(i => i !== index);
            button.classList.remove("selected");
            button.style.backgroundColor = "";
        } else {
            if (selectedAnswers.length < maxLen) {
                selectedAnswers.push(index);
                button.classList.add("selected");
                button.style.backgroundColor = "orange";
            } else {
                alert(`Du kannst nur ${maxLen} Antworten auswählen!`);
            }
        }
    } else {
        // Single => Sofort auswerten
        if (index === correctAnswers) {
            stars++;
            updateStars();
            alert("Richtig! ⭐ Du hast einen Stern erhalten.");
        } else {
            alert("Falsch! ❌ Versuch es nochmal.");
        }
        // Zurück zur Subregion
        setTimeout(backToSubregions, 1000);
    }
}

/***********************************************************
 *  "Die Bewohner" => 2 Aufgaben (Single Choice)
 ***********************************************************/
function checkBewohnerAnswers(correctAnswers) {
    // Single Choice => selectedAnswers[0] == correctAnswers
    if (!Array.isArray(correctAnswers)) {
        if (selectedAnswers.length === 1 && selectedAnswers[0] === correctAnswers) {
            stars++;
            updateStars();
            alert("Richtig! ⭐ Du hast einen Stern erhalten.");
        } else {
            alert("Falsch! ❌ Versuch es nochmal.");
        }
    } else {
        alert("Fehler: 'Die Bewohner' hat single choice!");
    }

    // Nächste Aufgabe oder zurück
    if (dieBewohnerTaskIndex === 0) {
        dieBewohnerTaskIndex = 1;
        setTimeout(() => startTask("Die Bewohner"), 1000);
    } else {
        setTimeout(backToSubregions, 1000);
    }
}

/***********************************************************
 *  "Der Markt" => 2 Aufgaben (Multi Choice)
 ***********************************************************/
function checkMarketAnswers(correctAnswers) {
    // Sortiere Arrays & vergleiche
    selectedAnswers.sort();
    correctAnswers.sort();
    if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Du musst GENAU die richtige Anzahl auswählen.");
    }

    if (marketTaskIndex === 0) {
        marketTaskIndex = 1;
        setTimeout(() => startTask("Der Markt"), 1000);
    } else {
        setTimeout(backToSubregions, 1000);
    }
}

/***********************************************************
 *  "Fluss abwärts" => 5 korrekte (Multi Choice)
 ***********************************************************/
function checkFiveAnswers(correctAnswers) {
    selectedAnswers.sort();
    correctAnswers.sort();
    if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Du musst GENAU fünf richtige Antworten auswählen.");
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  FLUSS AUFWÄRTS => Zuordnungs-Spiel
 ***********************************************************/
let selectedTerm = null;
let selectedMatch = null;
let selectedPairs = {};

function setupMatchingGame(pairs) {
    let container = document.getElementById("answers-container");
    container.innerHTML = "<p>Verbinde Orange (Fragen) mit Hellblau (Antworten) per Klick!</p>";

    selectedPairs = {};

    let leftDiv  = document.createElement("div");
    let rightDiv = document.createElement("div");
    leftDiv.style.display  = "inline-block";
    leftDiv.style.marginRight = "50px";
    leftDiv.style.verticalAlign = "top";
    rightDiv.style.display = "inline-block";
    rightDiv.style.verticalAlign = "top";

    // Linke Buttons (Orange)
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

    // Rechte Buttons (Hellblau)
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
    if (type === "term") {
        selectedTerm = value;
        highlightButton(button);
    } else {
        selectedMatch = value;
        highlightButton(button);
    }
    // Wenn wir ein term + match haben -> Zuordnung
    if (selectedTerm && selectedMatch) {
        selectedPairs[selectedTerm] = selectedMatch;
        console.log(`Verbindung: ${selectedTerm} ↔ ${selectedMatch}`);
        selectedTerm  = null;
        selectedMatch = null;
    }
}

// Kurz rotes Highlight
function highlightButton(btn) {
    btn.style.border = "3px solid red";
    setTimeout(() => {
        btn.style.border = "none";
    }, 400);
}

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
        alert("Falsch! ❌ Bitte versuche es nochmal.");
        selectedPairs = {};
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
