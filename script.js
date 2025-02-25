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
let marketTaskIndex = 0;

/***********************************************************
 *  SUBREGIONEN & HINTERGRUNDWECHSEL
 ***********************************************************/
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

function showSubregions(region) {
    currentRegion = region;
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";

    let container = document.getElementById("subregion-container");
    container.innerHTML = "";

    // Hintergrundbild ändern
    document.body.classList.remove("wald-background", "fluss-background");
    if (region === "wald") {
        document.body.classList.add("wald-background");
    } else if (region === "fluss") {
        document.body.classList.add("fluss-background");
    }

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = function () {
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
    
    // Prüfe, ob die Antwort bereits ausgewählt wurde
    if (selectedAnswers.includes(index)) {
        selectedAnswers = selectedAnswers.filter(i => i !== index);
        button.classList.remove(...colors); // Entfernt alle möglichen Farben
    } else {
        selectedAnswers.push(index);
        let colorClass = colors[selectedAnswers.length % colors.length];
        button.classList.add(colorClass);
    }
}

/***********************************************************
 *  startTask -> Anzeige der Frage/Aufgabe
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

    let task = tasks[0];

    document.getElementById("task-title").textContent = `Aufgabe in ${subregion}`;
    document.getElementById("question-text").textContent = task.question;

    let answerContainer = document.getElementById("answers-container");
    answerContainer.innerHTML = "";
    selectedAnswers = [];

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
    }
}

/***********************************************************
 *  NAVIGATION & STERNE
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
