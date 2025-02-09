let stars = 0;
let progress = 0;
let timer;
let timeLeft;

const questions = {
    wald: [
        {
            question: "Finde das Reflexivpronomen und markiere es rot.",
            answers: ["Sunt", "item", "quae", "appellantur"],
            correct: 2,
            timeLimit: 15
        }
    ],
    dorf: [
        {
            question: "Übersetze den Satz: 'Dicebant servos nullis iuribus praeditos esse.'",
            answers: [
                "Die Sklaven haben keine Rechte und sind abhängig von ihren Herren.",
                "Sie sagten, dass die Sklaven keinerlei Rechte hätten und vollständig abhängig sind.",
                "Die Sklaven sagen, dass sie keine Rechte haben und abhängig von ihren Herren sind."
            ],
            correct: 1,
            timeLimit: 10
        }
    ],
    fluss: [
        {
            question: "Bringe die Tabelle in die richtige Reihenfolge.",
            answers: ["caelo - Himmel", "sacris - Opfer", "deos - Götter", "imperium - Macht"],
            correct: ["caelo - Himmel", "sacris - Opfer", "deos - Götter", "imperium - Macht"],
            timeLimit: 30
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
    let answerContainer = document.getElementById('answers-container');
    answerContainer.innerHTML = "";

    selectedQuestion.answers.forEach((answer, index) => {
        let btn = document.createElement("button");
        btn.textContent = answer;
        btn.onclick = function() { checkAnswer(index); };
        answerContainer.appendChild(btn);
    });

    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('task-screen').style.display = 'block';

    startTimer(selectedQuestion.timeLimit);
}

function startTimer(seconds) {
    clearInterval(timer);
    timeLeft = seconds;
    let timerText = document.getElementById('timer-text');
    timerText.textContent = `Zeit: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = `Zeit: ${timeLeft}s`;
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
