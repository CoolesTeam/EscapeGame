let stars = 0;
let progress = 0;
let timer;
let timeLeft;

const questions = {
    wald: [
        {
            question: "Was braucht man zum Zaubertrank?",
            answers: ["Mispel", "Eiche", "Tanne", "Beere"],
            correct: 0
        }
    ],
    fluss: [
        {
            question: "Was wird dort gefischt?",
            answers: ["Wal", "Hai", "Fisch", "Ratte"],
            correct: 2
        }
    ],
    dorf: [
        {
            question: "Wer ist der Häuptling der Gallier?",
            answers: ["Majestix", "Asterix", "Miraculix", "Troubadix"],
            correct: 0
        }
    ],
    druiden: [
        {
            question: "Wofür waren die Druiden verantwortlich?",
            answers: ["Religionswissen", "Opferbesorgung", "Lehrer", "Alles zusammen"],
            correct: 3
        }
    ],
    staemme: [
        {
            question: "Wie wird dieser Stamm Galliens beschrieben?",
            answers: ["Klein", "Sehr stark", "Neutral", "Unbedeutend"],
            correct: 1
        }
    ],
    adjektive: [
        {
            question: "Markiere alle Adjektive:",
            answers: ["publica", "privata", "magnus", "magno", "omnibus", "publicis", "privatisque"],
            correct: [0, 1, 2, 3, 4, 5, 6] 
        }
    ],
    volk: [
        {
            question: "Was ist mit 'parvum imperium' gemeint?",
            answers: ["Einfaches Volk", "Großes Reich", "Mächtige Herrscher", "Adlige"],
            correct: 0
        },
        {
            question: "Übersetze: 'et a nobilibus et druidibus valde pendebant'",
            answers: ["Sie waren unabhängig", "Sie waren von Adligen und Druiden abhängig", "Sie regierten selbst", "Sie waren unbedeutend"],
            correct: 1
        }
    ],
    sklaven: [
        {
            question: "Übersetze den Satz: 'Dominos servos nullis iuribus praeditos esse et penitus a dominis pendere dicebant.'",
            answers: ["Sklaven hatten keinerlei Rechte und waren vollständig abhängig", "Sklaven waren frei", "Sklaven waren mächtig", "Sklaven hatten Rechte"],
            correct: 0
        },
        {
            question: "Gib den AcI-Auslöser an.",
            answers: ["dicebant", "praeditos", "esse", "dominos"],
            correct: 0
        }
    ],
    latein: [
        {
            question: "Bringe diesen Tabelleninhalt in die richtige Reihenfolge.",
            answers: [
                "caelo - Himmel",
                "sacris - Opfer, Heiligtum",
                "deos - Götter",
                "imperium - Macht, Einfluss"
            ],
            correct: [0, 1, 2, 3] 
        }
    ]
};

let currentLocation = "";

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function goTo(location) {
    currentLocation = location;
    document.getElementById('task-title').textContent = `Aufgabe in ${location}`;
    
    const selectedQuestion = questions[location][0];

    document.getElementById('question-text').textContent = selectedQuestion.question;
    selectedQuestion.answers.forEach((answer, index) => {
        let btn = document.getElementById(`answer${index}`);
        btn.textContent = answer;
        btn.onclick = function() { checkAnswer(index); };
        btn.classList.remove("correct", "wrong");
    });

    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('task-screen').style.display = 'block';

    startTimer(10);
}

function startTimer(seconds) {
    clearInterval(timer);
    timeLeft = seconds;

    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Die Zeit ist abgelaufen!");
            backToMap();
        }
    }, 1000);
}

function checkAnswer(index) {
    clearInterval(timer);

    let correctIndex = questions[currentLocation][0].correct;
    if (Array.isArray(correctIndex)) {
        if (correctIndex.includes(index)) {
            stars++;
            document.getElementById('correct-sound').play();
            alert("Richtig! ⭐ Du hast einen Stern erhalten.");
        } else {
            document.getElementById('wrong-sound').play();
            alert("Falsch! ❌ Versuch es erneut.");
        }
    } else {
        if (index === correctIndex) {
            stars++;
            document.getElementById('correct-sound').play();
            alert("Richtig! ⭐ Du hast einen Stern erhalten.");
        } else {
            document.getElementById('wrong-sound').play();
            alert("Falsch! ❌ Versuch es erneut.");
        }
    }

    document.getElementById('stars-count').textContent = stars;

    setTimeout(backToMap, 1000);
}

function backToMap() {
    document.getElementById('task-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}
