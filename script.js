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
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu (Orange ↔ Hellblau).",
        pairs: [
            { term: "caelo", match: "Himmel" },
            { term: "sacris", match: "Opfer" },
            { term: "deos", match: "Götter" },
            { term: "imperium", match: "Macht" }
        ]
    }],
    "Der Hafen": [{
        question: "Wie wird dieser Stamm beschrieben?",
        sentence: "Haec civitas longe plurimum totius Galliae",
        answers: ["der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
        correct: 2
    }],
    "Fluss abwärts": [{
        question: "Markiere alle Adjektive.",
        sentence: "Sacrificia publica ac privata procurant, religiones interpretantur...",
        answers: ["publica", "controversiis", "privata", "disciplinae", "magnus", "magno", "omnibus", "interpretantur"],
        correct: [0, 2, 4, 5, 6]
    }]
};

/***********************************************************
 *  FUNKTION ZUM HINTERGRUNDBILD-WECHSEL
 ***********************************************************/
function updateBackground(subregion) {
    let taskScreen = document.getElementById("task-screen");

    if (subregion === "Weg" || subregion === "Baum") {
        taskScreen.style.backgroundImage = 'url("Wald.jpg")';
    } 
    else if (subregion === "Fluss aufwärts" || subregion === "Der Hafen" || subregion === "Fluss abwärts") {
        taskScreen.style.backgroundImage = 'url("Fluss.jpg")';
    } 
    else {
        taskScreen.style.backgroundImage = 'none';
    }
}

/***********************************************************
 *  Funktion zur Auswahl einer Subregion
 ***********************************************************/
function startTask(subregion) {
    currentSubregion = subregion;
    document.getElementById("subregion-screen").style.display = "none";
    document.getElementById("task-screen").style.display = "block";

    updateBackground(subregion);

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

/***********************************************************
 *  Navigation
 ***********************************************************/
function backToSubregions() {
    document.getElementById("task-screen").style.display = "none";
    document.getElementById("subregion-screen").style.display = "block";
}

function updateStars() {
    document.getElementById("stars-count").textContent = stars;
}
