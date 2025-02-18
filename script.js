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
 *  HINTERGRUNDBILD JE NACH REGION SETZEN
 ***********************************************************/
function setBackgroundForRegion(region) {
    let gameScreen = document.getElementById("game-screen");

    if (region === "wald") {
        gameScreen.style.backgroundImage = "url('Wald.jpg')";
    } else if (region === "fluss") {
        gameScreen.style.backgroundImage = "url('Fluss.jpg')";
    } else {
        gameScreen.style.backgroundImage = "url('Standard.jpg')";
    }

    // Stile setzen, um das Bild korrekt anzuzeigen
    gameScreen.style.backgroundSize = "cover";
    gameScreen.style.backgroundPosition = "center";
    gameScreen.style.backgroundRepeat = "no-repeat";
}

/***********************************************************
 *  FUNKTION: Hintergrundbild für Aufgaben setzen
 ***********************************************************/
function setBackgroundForTask(subregion) {
    let taskScreen = document.getElementById("task-screen");

    if (subregion === "Weg" || subregion === "Baum") {
        taskScreen.style.backgroundImage = "url('Wald.jpg')";
    } else if (subregion === "Fluss aufwärts" || subregion === "Der Hafen" || subregion === "Fluss abwärts") {
        taskScreen.style.backgroundImage = "url('Fluss.jpg')";
    } else {
        taskScreen.style.backgroundImage = "url('Standard.jpg')";
    }

    // Stile setzen, um das Bild korrekt darzustellen
    taskScreen.style.backgroundSize = "cover";
    taskScreen.style.backgroundPosition = "center";
    taskScreen.style.backgroundRepeat = "no-repeat";
}

/***********************************************************
 *  Region -> Subregion
 ***********************************************************/
function showSubregions(region) {
    currentRegion = region;

    // Hintergrundbild sofort für die gewählte Region setzen
    setBackgroundForRegion(region);

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
            startTask(sub);
        };
        container.appendChild(btn);
    });
}

/***********************************************************
 *  startTask -> Anzeige der Frage/Aufgabe
 ***********************************************************/
function startTask(subregion) {
    currentSubregion = subregion;

    // Subregion-Screen ausblenden
    document.getElementById("subregion-screen").style.display = "none";
    // Task-Screen einblenden
    document.getElementById("task-screen").style.display = "block";

    // Hintergrundbild setzen
    setBackgroundForTask(subregion);

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

    if (task.sentence) {
        let sentenceElement = document.createElement("p");
        sentenceElement.textContent = task.sentence;
        sentenceElement.style.fontStyle = "italic";
        sentenceElement.style.marginBottom = "10px";
        answerContainer.appendChild(sentenceElement);
    }

    task.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("button", "answer-button");
        btn.onclick = () => handleSelectAnswers(index, btn, task.correct);
        answerContainer.appendChild(btn);
    });
}

/***********************************************************
 *  HILFSFUNKTIONEN
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
