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
 *  ACHTUNG: Bei "Die Bewohner" wurde die erste Frage angepasst.
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
            { term: "caelo",    match: "Himmel" },
            { term: "sacris",   match: "Opfer" },
            { term: "deos",     match: "Götter" },
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
 *  HILFSFUNKTIONEN FÜR REGION- & SUBREGION-KLASSEN
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
      "question-der-markt", "question-fluss-aufwärts", "question-der-hafen", "question-fluss-abwärts"
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
                    alert("Richtig! ⭐ Du hast einen Stern erhalten.");
                    handleNextTask(subregion);
                } else {
                    setAnswerStatus(subregion, "wrong");
                    alert("Falsch! ❌ Keine Wiederholung möglich.");
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
            alert("Richtig! ⭐ Du hast einen Stern erhalten.");
            handleNextTask(subregion);
        } else {
            setAnswerStatus(subregion, "wrong");
            alert("Falsch! ❌ Keine Wiederholung möglich.");
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
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        setAnswerStatus(currentSubregion, "wrong");
        alert("Falsch! ❌ Keine Wiederholung möglich.");
    }
    setTimeout(backToSubregions, 1000);
}

/***********************************************************
 *  FLUSS AUFWÄRTS: Zuordnungs-Spiel (1 Versuch)
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

    let leftDiv = document.createElement("div");
    let rightDiv = document.createElement("div");
    leftDiv.style.display = "inline-block";
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
        selectedTerm = { value, button };
    } else {
        selectedMatch = { value, button };
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
    let c = pairColors[colorIndex];
    colorIndex = (colorIndex + 1) % pairColors.length;
    colorMap[term] = c;
    colorMap[match] = c;
    termBtn.classList.add(c);
    matchBtn.classList.add(c);
}

function removeColor(term, match) {
    let cTerm = colorMap[term];
    let cMatch = colorMap[match];
    if (cTerm) {
        document.querySelectorAll("button").forEach(b => {
            if (b.textContent === term) b.classList.remove(cTerm);
        });
        delete colorMap[term];
    }
    if (cMatch) {
        document.querySelectorAll("button").forEach(b => {
            if (b.textContent === match) b.classList.remove(cMatch);
        });
        delete colorMap[match];
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
 *  applyRegionClass & applySubregionClass
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
      "question-der-markt", "question-fluss-aufwärts", "question-der-hafen", "question-fluss-abwärts"
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
