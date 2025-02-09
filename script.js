let stars = 0;
let timer;
let timeLeft;

/* Fragen korrekt geordnet */
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

/* Versteckt den Einführungsbildschirm */
function hideIntro() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function goTo(location) {
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
