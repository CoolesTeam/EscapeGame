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
let wegTaskIndex = 0;
let baumTaskIndex = 0;
let dieBewohnerTaskIndex = 0;
let marketTaskIndex = 0;
let flussAufwaertsTaskIndex = 0;
let hafenTaskIndex = 0;
let flussAbwaertsTaskIndex = 0;  // Neuer Index für "Fluss abwärts"

// Status der Aufgaben – für Mehrfachaufgaben als Array
let answeredStatus = {
    "Weg": ["unanswered", "unanswered", "unanswered"],
    "Baum": ["unanswered", "unanswered"],
    "Die Bewohner": ["unanswered", "unanswered", "unanswered"],
    "Der Markt": ["unanswered", "unanswered"],
    "Fluss aufwärts": ["unanswered", "unanswered", "unanswered"],
    "Der Hafen": ["unanswered", "unanswered", "unanswered"],
    "Fluss abwärts": ["unanswered", "unanswered", "unanswered"]
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
 *  ACHTUNG: Für "Weg" wurden drei Aufgaben, für "Baum" zwei, 
 *  für "Die Bewohner" drei, für "Fluss aufwärts" drei, für "Der Hafen" drei 
 *  und für "Fluss abwärts" nun drei Aufgaben definiert.
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
    "Baum": [
      {
        question: "Suche das Subjekt des Satzes...",
        sentence: "Est bos cervi figura, cuius a media fronte inter aures unum cornu exsistit excelsius magisque directum his, quae nobis nota sunt, cornibus.",
        answers: ["bos", "cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
      },
      {
        question: "Untersuche die Phrase: „quae nobis nota sunt” genauer und gib an, in welchem Kasus “nobis” steht. Klicke den richtigen Kasus an.",
        answers: ["Nominativ", "Genitiv", "Dativ", "Akkusativ", "Ablativ"],
        correct: 2
      }
    ],
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
      },
      {
        question: "Gib den AcI-Auslöser des Satzes an.",
        answers: ["dicebant", "nullis", "iuribus", "praeditos"],
        correct: 0
      }
    ],
    "Der Markt": [
      {
        question: "Klicke die drei Stämme an:",
        sentence: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur...",
        answers: ["Belgae", "Gallia", "Aquitani", "Celtae", "Galli"],
        correct: [0, 2, 3]
      },
      {
        question: "Markiere die beiden Flüsse. Eorum una pars, quam Gallos obtinere dictum est, initium capit a flumine Rhodano, continetur Garumna flumine, Oceano, finibus Belgarum.",
        answers: ["Rhodano", "Garumna", "Belgarum", "Aquitani"],
        correct: [0, 1]
      }
    ],
    "Fluss aufwärts": [
      {
        question: "Merktext: Frauen trugen einfache Kleider und Röcke, die gerade oder als Glockenrock geschnitten waren. Auch Blusen und Röcke sind belegt, manche Darstellungen auf römischen Fresken zeigen auch keltische Frauen in Pumpenhosen ähnlich den Bracae, darüber trugen Frauen zuweilen wie die Männer einen Chiton, der jedoch länger war und meist bis zu den Knöcheln reichte. Das obere Ende des Chitons wurde über Brust und Rücken umgeschlagen und mit Fibeln über den Schultern zusammengesteckt.\n\nWelche Art von Kleidung trugen die Frauen laut dem Text?",
        answers: ["Hosen und T-Shirts", "Einfache Kleider und Röcke", "Anzüge"],
        correct: 1
      },
      {
        question: "Unteraufgabe: Wahr oder Falsch: Frauen trugen immer einen Chiton, der bis zu den Knien reichte?",
        answers: ["Wahr", "Falsch"],
        correct: 0
      },
      {
        question: "Ordne die Begriffe richtig zu...",
        pairs: [
            { term: "caelo", match: "Himmel" },
            { term: "sacris", match: "Opfer" },
            { term: "deos", match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
      }
    ],
    "Der Hafen": [
      {
        question: "Wie wird dieser Stamm beschrieben? Haec civitas longe plurimum totius Gallie.",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
      },
      {
        question: "Krieger:\nEinheitliche Uniformen wie die der Römer gab es bei den Galliern nicht. Manche hochgestellten Krieger trugen bronzene Brustpanzer, doch ein so großes metallenes Objekt war sehr teuer. Die meisten Krieger haben wohl in ihrer Alltagskleidung gekämpft, ergänzt um Schwert und Schild – der Standardausrüstung für den gallischen Kämpfer.\nGlaubt man den lateinischen Historikern, traten sie oft auch mit nacktem Oberkörper zur Schlacht an.\n\nWas trugen die hochgestellten Krieger der Gallier laut dem Text?",
        answers: ["Einheitliche Uniformen", "Bronzene Brustpanzer", "Roben"],
        correct: 1
      },
      {
        question: "Unteraufgabe: Die meisten Krieger kämpften in spezieller Ausrüstung.",
        answers: ["Wahr", "Falsch"],
        correct: 1
      }
    ],
    "Fluss abwärts": [
      {
        question: "Markiere alle Adjektive...",
        answers: ["publica", "controversiis", "privata", "disciplinae", "magnus", "magno", "omnibus", "interpretantur"],
        correct: [0, 2, 4, 5, 6]
      },
      {
        question: "Ranglisten:\nDie Gesellschaft in Gallien war stark hierarchisch strukturiert. An der Spitze standen die Druiden, die nicht nur religiöse Führer, sondern auch Berater und Lehrer waren. Ihnen folgten die Kriegshäuptlinge, die militärische Anführer der Stämme darstellten. Die breite Masse bestand aus Bauern und Handwerkern, während die Sklaven am unteren Ende der sozialen Hierarchie standen.\n\nWer stand an der Spitze der gallischen Gesellschaft?",
        answers: ["Die Bauern", "Die Sklaven", "Die Druiden"],
        correct: 2
      },
      {
        question: "Unteraufgabe: Die Kriegshäuptlinge waren die obersten religiösen Führer in Gallien.",
        answers: ["Wahr", "Falsch"],
        correct: 1
      }
    ]
};

/***********************************************************
 *  ORDERING AUFGABEN
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
    document.getElementById("question-text").textContent = group.prompt;
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
            if (region === "fluss" && sub === "Fluss aufwärts") flussAufwaertsTaskIndex = 0;
            if (region === "fluss" && sub === "Der Hafen") hafenTaskIndex = 0;
            if (region === "fluss" && sub === "Fluss abwärts") flussAbwaertsTaskIndex = 0;
            startTask(sub);
        };
        container.appendChild(btn);
    });
}

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
    let idx;
    if (Array.isArray(tasks) && tasks.length > 1) {
        if (subregion === "Die Bewohner") {
            idx = dieBewohnerTaskIndex;
        } else if (subregion === "Der Markt") {
            idx = marketTaskIndex;
        } else if (subregion === "Weg") {
            idx = wegTaskIndex;
        } else if (subregion === "Baum") {
            idx = baumTaskIndex;
        } else if (subregion === "Fluss aufwärts") {
            idx = flussAufwaertsTaskIndex;
        } else if (subregion === "Der Hafen") {
            idx = hafenTaskIndex;
        } else if (subregion === "Fluss abwärts") {
            idx = flussAbwaertsTaskIndex;
        } else {
            idx = 0;
        }
        // Überspringe bereits beantwortete Aufgaben
        while (idx < tasks.length && status[idx] !== "unanswered") {
            idx++;
        }
        if (idx >= tasks.length) {
            alert("Alle Aufgaben in dieser Kategorie wurden bereits beantwortet.");
            backToSubregions();
            return;
        }
        // Aktualisiere den entsprechenden Index
        if (subregion === "Die Bewohner") dieBewohnerTaskIndex = idx;
        else if (subregion === "Der Markt") marketTaskIndex = idx;
        else if (subregion === "Weg") wegTaskIndex = idx;
        else if (subregion === "Baum") baumTaskIndex = idx;
        else if (subregion === "Fluss aufwärts") flussAufwaertsTaskIndex = idx;
        else if (subregion === "Der Hafen") hafenTaskIndex = idx;
        else if (subregion === "Fluss abwärts") flussAbwaertsTaskIndex = idx;
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
    // Nur wenn ein Matching-Spiel vorliegt (Erkennung über "pairs")
    if (subregion === "Fluss abwärts" && chosenTask.pairs) {
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
    // Standard-Multiple-Choice (inkl. Fluss abwärts, wenn kein Matching-Spiel)
    chosenTask.answers && chosenTask.answers.forEach((answer, idx) => {
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

function setAnswerStatus(subregion, result) {
    let tasks = questions[subregion];
    if (Array.isArray(tasks) && tasks.length > 1) {
        if (subregion === "Die Bewohner") {
            answeredStatus[subregion][dieBewohnerTaskIndex] = result;
        } else if (subregion === "Der Markt") {
            answeredStatus[subregion][marketTaskIndex] = result;
        } else if (subregion === "Weg") {
            answeredStatus[subregion][wegTaskIndex] = result;
        } else if (subregion === "Baum") {
            answeredStatus[subregion][baumTaskIndex] = result;
        } else if (subregion === "Fluss aufwärts") {
            answeredStatus[subregion][flussAufwaertsTaskIndex] = result;
        } else if (subregion === "Der Hafen") {
            answeredStatus[subregion][hafenTaskIndex] = result;
        } else if (subregion === "Fluss abwärts") {
            answeredStatus[subregion][flussAbwaertsTaskIndex] = result;
        }
    } else {
        answeredStatus[subregion] = result;
    }
}

function handleNextTask(subregion) {
    let tasks = questions[subregion];
    if (Array.isArray(tasks) && tasks.length > 1) {
        if (subregion === "Die Bewohner") {
            dieBewohnerTaskIndex++;
        } else if (subregion === "Der Markt") {
            marketTaskIndex++;
        } else if (subregion === "Weg") {
            wegTaskIndex++;
        } else if (subregion === "Baum") {
            baumTaskIndex++;
        } else if (subregion === "Fluss aufwärts") {
            flussAufwaertsTaskIndex++;
        } else if (subregion === "Der Hafen") {
            hafenTaskIndex++;
        } else if (subregion === "Fluss abwärts") {
            flussAbwaertsTaskIndex++;
        }
    }
    if (
        (subregion === "Weg" && wegTaskIndex < questions["Weg"].length) ||
        (subregion === "Baum" && baumTaskIndex < questions["Baum"].length) ||
        (subregion === "Die Bewohner" && dieBewohnerTaskIndex < questions["Die Bewohner"].length) ||
        (subregion === "Der Markt" && marketTaskIndex < questions["Der Markt"].length) ||
        (subregion === "Fluss aufwärts" && flussAufwaertsTaskIndex < questions["Fluss aufwärts"].length) ||
        (subregion === "Der Hafen" && hafenTaskIndex < questions["Der Hafen"].length) ||
        (subregion === "Fluss abwärts" && flussAbwaertsTaskIndex < questions["Fluss abwärts"].length)
    ) {
        setTimeout(() => startTask(subregion), 1000);
    } else {
        setTimeout(backToSubregions, 1000);
    }
}

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
        alert("Richtig! Du hast eine Mispel erhalten.");
    } else {
        setAnswerStatus(currentSubregion, "wrong");
        alert("Falsch! Keine Wiederholung möglich.");
    }
    setTimeout(backToSubregions, 1000);
}

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
