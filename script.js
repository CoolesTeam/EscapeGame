let stars = 0;
let currentRegion = "";
let currentSubregion = "";
let selectedAnswers = [];

/* Für "Die Bewohner" mehrere Aufgaben */
let dieBewohnerTaskIndex = 0;
/* Für "Der Markt" mehrere Aufgaben */
let marketTaskIndex = 0;

/* Regionen und Unterregionen */
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/* Fragen & Antworten */
const questions = {
    /* WEG */
    "Weg": [{
        question: "Finde das Reflexivpronomen und klicke es an.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
    }],
    /* BAUM */
    "Baum": [{
        question: "Suche das Subjekt des Satzes heraus und klicke es an.",
        sentence: "Est bos cervi figura, cuius a media fronte inter aures unum cornu exsistit excelsius magisque directum his, quae nobis nota sunt, cornibus.",
        answers: ["bos cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],
    /* DIE BEWOHNER => 2 Aufgaben */
    "Die Bewohner": [
      {
        question: "Übersetze den Satz: 'Dicebant servos nullis iuribus praeditos esse et penitus a dominis pendere.'",
        answers: [
            "Die Sklaven haben keine Rechte und sind abhängig von ihren Herren.",
            "Sie sagten, dass die Sklaven keinerlei Rechte hätten und vollständig von ihren Herren abhängig sind.",
            "Die Sklaven sagen, dass sie keine Rechte haben und abhängig von ihren Herren sind."
        ],
        correct: 1  // Single choice
      },
      {
        question: "Gib den AcI Auslöser an.",
        answers: [
            "dicebant",   // richtig
            "iuribus",    // falsch
            "praeditos"   // falsch
        ],
        correct: 0    // Single choice => "dicebant"
      }
    ],
    /* DER MARKT => 2 Aufgaben */
    "Der Markt": [
      {
        question: "Klicke die drei Stämme von Gallien an.",
        sentence: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.",
        answers: ["Belgae", "Gallia", "Aquitani", "Celtae", "Galli"],
        correct: [0, 2, 3]
      },
      {
        question: "Markiere die beiden Flüsse.",
        sentence: "Eorum una pars, quam Gallos obtinere dictum est, initium capit a flumine Rhodano, continetur Garumna flumine, Oceano finibus Belgarum",
        answers: ["Rhodano", "Garumna", "Belgarum", "Aquitani"],
        correct: [0, 1] 
      }
    ],
    /* FLUSS AUFWÄRTS */
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu (Orange ↔ Hellblau).",
        pairs: [
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],
    /* DER HAFEN */
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        sentence: "Haec civitas longe plurimum totius Galliae",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],
    /* FLUSS ABWÄRTS => 5 Auswahlen */
    "Fluss abwärts": [{
        question: "Markiere alle Adjektive.",
        sentence: "Sacrificia publica ac privata procurant, religiones interpretantur. Ad hos magnus adulescentium numerus disciplinae causa concurrit magnoque hi sunt apud eos honore. Nam fere de omnibus controversiis publicis privatisque constituunt",
        answers: ["publica", "controversiis", "privata", "disciplinae", "magnus", "magno", "omnibus", "interpretantur"],
        correct: [0, 2, 4, 5, 6]
    }]
};

/* START-SEITE => Intro => Spiel */
function showIntro() {
    // Verstecke die Startseite => "start-screen"
    document.getElementById('start-screen').style.display = 'none';
    // Zeige das Intro => "intro-screen"
    document.getElementById('intro-screen').style.display = 'flex';
}

function startGame() {
    // Verstecke das Intro => "intro-screen"
    document.getElementById('intro-screen').style.display = 'none';
    // Zeige den Spielbildschirm => "game-screen"
    document.getElementById('game-screen').style.display = 'block';
    updateStars();
}

/* showSubregions => identisch */
function showSubregions(region) {
    currentRegion = region;
    // Verstecke game-screen
    document.getElementById('game-screen').style.display = 'none';
    // Zeige subregion-screen
    document.getElementById('subregion-screen').style.display = 'block';
    
    let container = document.getElementById('subregion-container');
    container.innerHTML = "";

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = function () { 
          // Falls wir "Die Bewohner" neu betreten => Index 0
          if (region === "dorf" && sub === "Die Bewohner") {
              dieBewohnerTaskIndex = 0;
          }
          // Falls wir "Der Markt" neu betreten => Index 0
          if (region === "dorf" && sub === "Der Markt") {
              marketTaskIndex = 0;
          }
          startTask(sub); 
        };
        container.appendChild(btn);
    });
}

/* startTask => 2 Index-Variablen für "Die Bewohner" & "Der Markt" */
function startTask(subregion) {
    currentSubregion = subregion;
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('task-screen').style.display = 'block';

    let tasks = questions[subregion];
    if (!tasks) {
        console.error("Fehler: Keine Frage für diese Unterregion gefunden!");
        return;
    }

    let task;
    // "Die Bewohner" => 2 Tasks
    if (subregion === "Die Bewohner") {
        task = tasks[dieBewohnerTaskIndex];
    }
    // "Der Markt" => 2 Tasks
    else if (subregion === "Der Markt") {
        task = tasks[marketTaskIndex];
    }
    // Sonst => 1 Task
    else {
        task = tasks[0];
    }

    document.getElementById('task-title').textContent = `Aufgabe in ${subregion}`;
    document.getElementById('question-text').textContent = task.question;

    let answerContainer = document.getElementById('answers-container');
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    /* Falls Satz existiert => einblenden */
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

    // Standard => Erzeuge Buttons
    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");
        btn.onclick = () => handleSelectAnswers(index, btn, task.correct);
        answerContainer.appendChild(btn);
    });

    /* "Die Bewohner" => 2 Aufgaben => Bestätigen */
    if (subregion === "Die Bewohner") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkBewohnerAnswers(task.correct);
        answerContainer.appendChild(submitBtn);
    }

    /* "Der Markt" => Bestätigen */
    if (subregion === "Der Markt") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkMarketAnswers(task.correct);
        answerContainer.appendChild(submitBtn);
    }

    /* "Fluss abwärts" => 5 Auswahlen => Bestätigen */
    if (subregion === "Fluss abwärts") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkFiveAnswers(task.correct);
        answerContainer.appendChild(submitBtn);
    }
}

/* handleSelectAnswers => SingleChoice / MultiChoice */
function handleSelectAnswers(index, button, correctAnswers) {
    if (Array.isArray(correctAnswers)) {
        // Mehrfach
        let maxLen = correctAnswers.length; 
        if (selectedAnswers.includes(index)) {
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
        // Single => Sofort
        if (index === correctAnswers) {
            stars++;
            updateStars();
            alert("Richtig! ⭐ Du hast einen Stern erhalten.");
        } else {
            alert("Falsch! ❌ Versuch es nochmal.");
        }
        setTimeout(backToSubregions, 1000);
    }
}

/* DIE BEWOHNER => 2 Aufgaben => checkBewohnerAnswers */
function checkBewohnerAnswers(correctAnswers) {
    // Single choice => wir prüfen, ob selectedAnswers[0] == correctAnswers
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

    if (dieBewohnerTaskIndex === 0) {
        dieBewohnerTaskIndex = 1;
        setTimeout(() => startTask("Die Bewohner"), 1000);
    } else {
        setTimeout(backToSubregions, 1000);
    }
}

/* DER MARKT => 2 Aufgaben => checkMarketAnswers */
function checkMarketAnswers(correctAnswers) {
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

/* FLUSS ABWÄRTS => 5 korrekte */
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

/* FLUSS AUFWÄRTS => Zuordnungs-Spiel (unverändert) */
let selectedTerm = null;
let selectedMatch = null;
let selectedPairs = {};

function setupMatchingGame(pairs) {
    let container = document.getElementById('answers-container');
    container.innerHTML = "<p>Verbinde Orange (Fragen) mit Hellblau (Antworten) per Klick!</p>";

    selectedPairs = {};

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
        selectedTerm = value;
        highlightButton(button);
    } else {
        selectedMatch = value;
        highlightButton(button);
    }
    if (selectedTerm && selectedMatch) {
        selectedPairs[selectedTerm] = selectedMatch;
        console.log(`Verbindung: ${selectedTerm} ↔ ${selectedMatch}`);
        selectedTerm  = null;
        selectedMatch = null;
    }
}

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

/* Sterne & Navigation */
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
