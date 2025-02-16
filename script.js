let stars = 0;
let currentRegion = "";
let currentSubregion = "";
let selectedAnswers = [];

/* Regionen und Unterregionen */
const subregions = {
    wald: ["Weg", "Baum"],
    dorf: ["Die Bewohner", "Der Markt"],
    fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
};

/* Fragen & Antworten */
const questions = {
    "Weg": [{
        question: "Finde das Reflexivpronomen und markiere es rot.",
        answers: ["Sunt", "item", "quae", "appellantur"],
        correct: 2
    }],
    "Baum": [{
        question: "Suche das Subjekt des Satzes heraus und klicke es an.",
        sentence: "Est bos cervi figura, cuius a media fronte inter aures unum cornu exsistit excelsius magisque directum his, quae nobis nota sunt, cornibus.",
        answers: ["bos cervi figura", "cornibus", "quae", "nota sunt"],
        correct: 0
    }],
    "Die Bewohner": [{
        question: "Übersetze den Satz: 'Dicebant servos nullis iuribus praeditos esse et penitus a dominis pendere.'",
        answers: [
            "Die Sklaven haben keine Rechte und sind abhängig von ihren Herren.",
            "Sie sagten, dass die Sklaven keinerlei Rechte hätten und vollständig von ihren Herren abhängig sind.",
            "Die Sklaven sagen, dass sie keine Rechte haben und abhängig von ihren Herren sind."
        ],
        correct: 1
    }],
    "Der Markt": [{
        question: "Klicke die drei Stämme von Gallien an.",
        sentence: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.",
        answers: ["Belgae", "Aquitani", "Celtae", "Romani"],
        correct: [0, 1, 2]
    }],
    "Fluss aufwärts": [{
        question: "Ordne die Begriffe richtig zu.",
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
        answers: ["publica", "privata", "magnus", "magno", "omnibus"],
        correct: [0, 1, 2, 3, 4]
    }]
};

/* Navigation */
function showIntro() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('intro-screen').style.display = 'flex';
}

function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updateStars();
}

function showSubregions(region) {
    currentRegion = region;
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('subregion-screen').style.display = 'block';
    
    let container = document.getElementById('subregion-container');
    container.innerHTML = ""; 

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = function () { startTask(sub); };
        container.appendChild(btn);
    });
}

function startTask(subregion) {
    currentSubregion = subregion;
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('task-screen').style.display = 'block';
    document.getElementById('task-title').textContent = `Aufgabe in ${subregion}`;

    let task = questions[subregion][0];
    let answerContainer = document.getElementById('answers-container');
    answerContainer.innerHTML = "";

    if (!task) {
        console.error("Fehler: Keine Frage für diese Unterregion gefunden!");
        return;
    }

    if (subregion === "Fluss aufwärts") {
        setupMatchingGame(task.pairs);
        return;
    }
}

/* Zuordnungs-Spiel für "Fluss aufwärts" */
function setupMatchingGame(pairs) {
    let container = document.getElementById('answers-container');
    container.innerHTML = `<p>Verbinde die Begriffe:</p>`;

    let terms = pairs.map(p => p.term);
    let matches = pairs.map(p => p.match);

    let termContainer = document.createElement("div");
    termContainer.classList.add("matching-container");

    let matchContainer = document.createElement("div");
    matchContainer.classList.add("matching-container");

    terms.forEach(term => {
        let btn = document.createElement("button");
        btn.textContent = term;
        btn.classList.add("match-button", "orange-button");
        btn.onclick = function () { selectMatch(term, btn, "term"); };
        termContainer.appendChild(btn);
    });

    matches.forEach(match => {
        let btn = document.createElement("button");
        btn.textContent = match;
        btn.classList.add("match-button", "blue-button");
        btn.onclick = function () { selectMatch(match, btn, "match"); };
        matchContainer.appendChild(btn);
    });

    container.appendChild(termContainer);
    container.appendChild(matchContainer);

    let submitBtn = document.createElement("button");
    submitBtn.textContent = "Überprüfen";
    submitBtn.classList.add("button", "submit-button");
    submitBtn.onclick = function () { checkMatches(pairs); };
    container.appendChild(submitBtn);
}

/* Überprüfung der Zuordnungen */
function checkMatches(pairs) {
    let selectedPairs = {};
    let isCorrect = true;

    pairs.forEach(pair => {
        if (selectedPairs[pair.term] !== pair.match) {
            isCorrect = false;
        }
    });

    if (isCorrect) {
        stars++;
        updateStars();
        alert("Richtig! ⭐ Du hast einen Stern erhalten.");
    } else {
        alert("Falsch! ❌ Versuche es noch einmal.");
    }

    setTimeout(backToSubregions, 1000);
}

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
