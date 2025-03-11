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

// Indizes für Subregionen mit mehreren Aufgaben
let dieBewohnerTaskIndex = 0;
let marketTaskIndex = 0;

// Status der Aufgaben: "unanswered", "correct", "wrong"
let answeredStatus = {
    "Weg": "unanswered",
    "Baum": "unanswered",
    "Die Bewohner": ["unanswered", "unanswered"],
    "Der Markt": ["unanswered", "unanswered"],
    "Fluss aufwärts": "unanswered",
    "Der Hafen": "unanswered",
    "Fluss abwärts": "unanswered"
};

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
 *  ACHTUNG: In "Weg" wurden zwei weitere Aufgaben hinzugefügt.
 ***********************************************************/
const questions = {
    "Weg": [
      {
        question: "Finde das Relativpronomen und klicke es an.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
      },
      {
        question: "Finde die Verben und markiere sie!",
        answers: ["Sunt", "item", "quae", "appellantur", "aleces"],
        correct: [0, 3]
      },
      {
        question: "Konjugiere die Verben in der richtigen Reihenfolge.",
        ordering: true,
        groups: [
          {
            prompt: "Konjugiere das Verb 'Sunt':",
            words: ["sum", "es", "est", "sumus", "estis", "sunt"]
          },
          {
            prompt: "Konjugiere das Verb 'Appellare':",
            words: ["appello", "appellas", "appellat", "appellamus", "appellatis", "appellant"]
          }
        ]
      }
    ],
    "Baum": [{
        question: "Suche das Subjekt des Satzes...",
        answers: ["bos", "cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],
    "Die Bewohner": [
      {
        question: "Übersetze: Dicebant servos mispel iuribus praeditos esse et penitus a dominis pendere",
        answers: [
            "Die Sklaven haben keine Rechte und sind abhängig von ihren Herren.",
            "Sie sagten, dass die Sklaven keinerlei Rechte hätten und vollständig von ihren Herren abhängig sind.",
            "Die Sklaven sagen, dass sie keine Rechte haben und abhängig von ihren Herren sind."
        ],
        correct: 1
      },
      {
        question: "Gib den AcI-Auslöser an.",
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
        question: "Markiere die beiden Flüsse. Gallia est omnis divisa in parttes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae nostra galli appellantur.",
        answers: ["Rhodano", "Garumna", "Belgarum", "Aquitani"],
        correct: [0, 1]
      }
    ],
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu...",
        pairs: [
            { term: "caelo", match: "Himmel" },
            { term: "sacris", match: "Opfer" },
            { term: "deos", match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben? Haec civitas longe plurimum totius Gallie.",
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
 *  ORDERING AUFGABEN (NEU)
 ***********************************************************/
/* Globale Variablen für Ordering-Task */
let currentOrderingGroups = null;
let currentOrderingGroupIndex = 0;
let currentOrderingSelection = [];

function setupOrderingTask(groups) {
    currentOrderingGroups = groups;
    currentOrderingGroupIndex = 0;
    currentOrderingSelection = [];
    setupOrderingGroup(currentOrderingGroups[currentOrderingGroupIndex]);
}

function setupOrderingGroup(group) {
    // Zeige den Prompt im Fragebereich
    document.getElementById("question-text").textContent = group.prompt;
    // Erstelle Buttons für die Wörter (shuffle optional)
    let words = group.words.slice(); // Kopie
    // Shuffle (optional – hier einfache Implementierung)
    for (let i = words.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    // Erstelle die Buttons
    let container = document.getElementById("answers-container");
    container.innerHTML = ""; // Leeren
    currentOrderingSelection = [];
    // Erstelle einen Container für die ausgewählte Reihenfolge
    let orderDisplay = document.createElement("div");
    orderDisplay.id = "order-display";
    orderDisplay.style.marginBottom = "10px";
    container.appendChild(orderDisplay);
    // Erstelle Buttons für jedes Wort
    words.forEach(word => {
        let btn = document.createElement("button");
        btn.textContent = word;
        btn.classList.add("button", "answer-button");
        btn.onclick = () => selectOrderingWord(word, btn, group);
        container.appendChild(btn);
    });
}

function selectOrderingWord(word, button, group) {
    // Füge die Auswahl hinzu, deaktiviere Button
    currentOrderingSelection.push(word);
    button.disabled = true;
    // Weise eine Farbe zu (wie bei Multi-Choice)
    const colors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
    let colorClass = colors[currentOrderingSelection.length % colors.length];
    button.classList.add(colorClass);
    // Zeige aktuelle Auswahl an
    document.getElementById("order-display").textContent = "Auswahl: " + currentOrderingSelection.join(", ");
    // Prüfe, ob alle Wörter ausgewählt wurden
    if (currentOrderingSelection.length === group.words.length) {
        checkOrderingGroup(group);
    }
}

function checkOrderingGroup(group) {
    let correct = true;
    for (let i = 0; i < group.words.length; i++) {
        if (currentOrderingSelection[i] !== group.words[i]) {
            correct = false;
            break;
        }
    }
    if (correct) {
        alert("Richtig! Du hast eine Mispel erhalten.");
        stars++;
        updateStars();
        currentOrderingGroupIndex++;
        if (currentOrderingGroupIndex < currentOrderingGroups.length) {
            // Nächste Gruppe starten
            setupOrderingGroup(currentOrderingGroups[currentOrderingGroupIndex]);
        } else {
            // Alle Ordering-Gruppen abgeschlossen
            handleNextTask(currentSubregion);
        }
    } else {
        alert("Falsch! Keine Wiederholung möglich.");
        handleNextTask(currentSubregion);
    }
}

/***********************************************************
 *  HILFSFUNKTIONEN FÜR STANDARD-AUFGABEN
 ***********************************************************/
function applyRegionClass(region) {
    document.body.classList.remove("region-wald", "region-dorf", "region-fluss");
    if (region === "wald")  document.body.classList.add("region-wald");
    if (region === "dorf")  document.body.classList.add("region-dorf");
    if (region === "fluss") document.body.classList.add("region-fluss");
}

function subregionToClassName(subregion) {
    return "question-" + subregion.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function applySubregionClass(subregion) {
    const taskScreen = document.getElementById("task-screen");
    taskScreen.classList.remove(
      "question-weg", "question-baum", "question-die-bewohner",
      "question-der-markt", "question-fluss-aufwärts",
      "question-der-hafen", "question-fluss-abwärts"
    );
    const newClass = subregionToClassName(subregion);
    taskScreen.classList.add(newClass);
}

/***********************************************************
 *  showSubregions(region)
 ***********************************************************/
function showSubregions(region) {
    currentRegion = region;
    document.body.classList.remove("wald-background", "fluss-background");
    if (region === "wald")  document.body.classList.add("wald-background");
    if (region === "fluss") document.body.classList.add("fluss-background");
    applyRegionClass(region);

    document.getElementById("game-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";

    let container = document.getElementById("subregion-container");
    container.innerHTML = "";

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = () => {
            if (region === "dorf" && sub === "Die Bewohner") dieBewohnerTaskIndex = 0;
            if (region === "dorf" && sub === "Der Markt") marketTaskIndex = 0;
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
    applySubregionClass(subregion);

    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("task-screen").style.display = "block";

    let tasks = questions[subregion];
    if (!tasks) {
        console.error("Keine Frage für Subregion:", subregion);
        return;
    }

    let status = answeredStatus[subregion];
    let chosenTask;
    if (Array.isArray(tasks) && tasks.length > 1) {
        let idx = (subregion === "Die Bewohner") ? dieBewohnerTaskIndex : marketTaskIndex;
        if (status[idx] !== "unanswered") {
            alert("Diese Aufgabe wurde bereits beantwortet. Keine Wiederholung möglich!");
            backToSubregions();
            return;
        }
        chosenTask = tasks[idx];
    } else {
        if (status !== "unanswered") {
            alert("Diese Aufgabe wurde bereits beantwortet. Keine Wiederholung möglich!");
            backToSubregions();
            return;
        }
        chosenTask = tasks[0];
    }

    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = chosenTask.question;

    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";
    selectedAnswers = [];

    if (chosenTask.sentence) {
        let p = document.createElement("p");
        p.style.fontStyle = "italic";
        p.textContent = chosenTask.sentence;
        answerContainer.appendChild(p);
    }

    // Wenn es sich um eine Ordering-Aufgabe handelt
    if (chosenTask.ordering) {
        setupOrderingTask(chosenTask.groups);
        return;
    }

    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(chosenTask.pairs);
        return;
    }

    if (subregion === "Fluss abwärts") {
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Bestätigen";
        submitBtn.classList.add("button", "submit-button");
        submitBtn.onclick = () => checkFiveAnswers(chosenTask.correct);
        answerContainer.appendChild(submitBtn);

        chosenTask.answers.forEach((answer, idx) => {
            let btn = document.createElement("button");
            btn.textContent = answer;
            btn.classList.add("button", "answer-button");
            btn.onclick = () => setMatchingColors(idx, btn);
            answerContainer.appendChild(btn);
        });
        return;
    }

    chosenTask.answers.forEach((answer, idx) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");
        if (!Array.isArray(chosenTask.correct)) {
            btn.onclick = () => {
                if (idx === chosenTask.correct) {
                    setAnswerStatus(subregion, "correct");
                    stars++;
                    updateStars();
                    alert("Richtig! Du hast eine Mispel erhalten.");
                    handleNextTask(subregion);
                } else {
                    setAnswerStatus(subregion, "wrong");
                    alert("Falsch! Keine Wiederholung möglich.");
                    handleNextTask(subregion);
                }
            };
        } else {
            btn.onclick = () => handleMultiChoice(idx, btn, chosenTask.correct, subregion);
        }
        answerContainer.appendChild(btn);
    });
}

/***********************************************************
 *  setAnswerStatus(subregion, result)
 ***********************************************************/
function setAnswerStatus(subregion, result) {
    let tasks = questions[subregion];
    if (Array.isArray(tasks) && tasks.length > 1) {
        if (subregion === "Die Bewohner") {
            answeredStatus[subregion][dieBewohnerTaskIndex] = result;
        } else if (subregion === "Der Markt") {
            answeredStatus[subregion][marketTaskIndex] = result;
        }
    } else {
        answeredStatus[subregion] = result;
    }
}

/***********************************************************
 *  handleNextTask(subregion)
 ***********************************************************/
function handleNextTask(subregion) {
    let tasks = questions[subregion];
    if (Array.isArray(tasks) && tasks.length > 1) {
        if (subregion === "Die Bewohner") dieBewohnerTaskIndex++;
        if (subregion === "Der Markt") marketTaskIndex++;
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  MULTI-CHOICE
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
    if (selectedAnswers.length === maxLen) {
        let sortedSel = [...selectedAnswers].sort();
        let sortedCor = [...correctAnswers].sort();
        if (JSON.stringify(sortedSel) === JSON.stringify(sortedCor)) {
            setAnswerStatus(subregion, "correct");
            stars++;
            updateStars();
            alert("Richtig! Du hast eine Mispel erhalten.");
            handleNextTask(subregion);
        } else {
            setAnswerStatus(subregion, "wrong");
            alert("Falsch! Keine Wiederholung möglich.");
            handleNextTask(subregion);
        }
    }
}

/***********************************************************
 *  FLUSS ABWÄRTS: 5er-Auswahl
 ***********************************************************/
function setMatchingColors(index, button) {
    const colors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
    button.classList.remove(...colors);
    if (selectedAnswers.includes(index)) {
        selectedAnswers = selectedAnswers.filter(i => i !== index);
    } else {
        selectedAnswers.push(index);
        let c = colors[selectedAnswers.length % colors.length];
        button.classList.add(c);
    }
}

function checkFiveAnswers(correctAnswers) {
    selectedAnswers.sort();
    correctAnswers.sort();
    if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
        setAnswerStatus(currentSubregion, "correct");
        stars++;
        updateStars();
        alert("Richtig! Du hast eine Mispel erhalten.");
    } else {
        setAnswerStatus(currentSubregion, "wrong");
        alert("Falsch! Keine Wiederholung möglich.");
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  ORDERING AUFGABEN (NEU)
 ***********************************************************/
let currentOrderingGroups = null;
let currentOrderingGroupIndex = 0;
let currentOrderingSelection = [];

function setupOrderingTask(groups) {
    currentOrderingGroups = groups;
    currentOrderingGroupIndex = 0;
    currentOrderingSelection = [];
    setupOrderingGroup(currentOrderingGroups[currentOrderingGroupIndex]);
}

function setupOrderingGroup(group) {
    // Zeige den Prompt
    document.getElementById("question-text").textContent = group.prompt;
    // Erstelle zufällig sortierte Buttons für die Wörter
    let words = group.words.slice();
    for (let i = words.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    let container = document.getElementById("answers-container");
    container.innerHTML = "";
    currentOrderingSelection = [];
    let orderDisplay = document.createElement("div");
    orderDisplay.id = "order-display";
    orderDisplay.style.marginBottom = "10px";
    container.appendChild(orderDisplay);
    words.forEach(word => {
        let btn = document.createElement("button");
        btn.textContent = word;
        btn.classList.add("button", "answer-button");
        btn.onclick = () => selectOrderingWord(word, btn, group);
        container.appendChild(btn);
    });
}

function selectOrderingWord(word, button, group) {
    currentOrderingSelection.push(word);
    button.disabled = true;
    const colors = ["matching-blue", "matching-yellow", "matching-pink", "matching-green"];
    let colorClass = colors[currentOrderingSelection.length % colors.length];
    button.classList.add(colorClass);
    document.getElementById("order-display").textContent = "Auswahl: " + currentOrderingSelection.join(", ");
    if (currentOrderingSelection.length === group.words.length) {
        checkOrderingGroup(group);
    }
}

function checkOrderingGroup(group) {
    let correct = true;
    for (let i = 0; i < group.words.length; i++) {
        if (currentOrderingSelection[i] !== group.words[i]) {
            correct = false;
            break;
        }
    }
    if (correct) {
        alert("Richtig! Du hast eine Mispel erhalten.");
        stars++;
        updateStars();
        currentOrderingGroupIndex++;
        if (currentOrderingGroupIndex < currentOrderingGroups.length) {
            setupOrderingGroup(currentOrderingGroups[currentOrderingGroupIndex]);
        } else {
            handleNextTask(currentSubregion);
        }
    } else {
        alert("Falsch! Keine Wiederholung möglich.");
        handleNextTask(currentSubregion);
    }
}

/***********************************************************
 *  STANDARD-FUNKTIONEN
 ***********************************************************/
function applyRegionClass(region) {
    document.body.classList.remove("region-wald", "region-dorf", "region-fluss");
    if (region === "wald")  document.body.classList.add("region-wald");
    if (region === "dorf")  document.body.classList.add("region-dorf");
    if (region === "fluss") document.body.classList.add("region-fluss");
}

function subregionToClassName(subregion) {
    return "question-" + subregion.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function applySubregionClass(subregion) {
    const taskScreen = document.getElementById("task-screen");
    taskScreen.classList.remove(
      "question-weg", "question-baum", "question-die-bewohner",
      "question-der-markt", "question-fluss-aufwärts",
      "question-der-hafen", "question-fluss-abwärts"
    );
    const newClass = subregionToClassName(subregion);
    taskScreen.classList.add(newClass);
}

/***********************************************************
 *  STERNE & NAVIGATION
 ***********************************************************/
function updateStars() {
    document.getElementById("stars-count").textContent = stars;
}

function backToRegions() {
    document.body.classList.remove("wald-background", "fluss-background");
    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
}

function backToSubregions() {
    document.getElementById("task-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";
}
