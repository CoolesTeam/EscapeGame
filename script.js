let stars = 0;
let progress = 0;
let timer;
let timeLeft;

const questions = {
    wald: {
        weg: [
            {
                question: "Finde das Reflexivpronomen und markiere es rot.",
                answers: ["Sunt", "item", "quae", "appellantur", "aleces"],
                correct: 2,
                timeLimit: null
            },
            {
                question: "Finde die Verben und markiere sie grün.",
                answers: ["Sunt", "item", "quae", "appellantur", "aleces"],
                correct: [0, 3],
                timeLimit: null
            },
            {
                question: "Konjugiere die Verben 'Sunt' und 'Appellare'",
                answers: ["sum", "es", "est", "sumus", "estis", "sunt", "appello", "appellas", "appellat", "appellamus", "appellatis", "appellant"],
                correct: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                timeLimit: null
            }
        ],
        baum: [
            {
                question: "Suche das Subjekt des Satzes und ziehe es in die Lücke.",
                answers: ["bos cervi figura", "quae nobis nota sunt", "cornibus"],
                correct: 0,
                timeLimit: null
            },
            {
                question: "In welchem Kasus steht 'nobis'?",
                answers: ["Nominativ", "Genitiv", "Dativ", "Akkusativ", "Ablativ"],
                correct: 2,
                timeLimit: 15
            },
            {
                question: "Auf welches Wort bezieht sich 'quae'?",
                answers: ["bos", "cervi", "figura", "cornibus"],
                correct: 3,
                timeLimit: null
            },
            {
                question: "Dekliniere 'Figura' und 'Cornibus' im Singular.",
                answers: ["figura", "figurae", "figurae", "figuram", "figura", "cornus", "corn-us/os/i", "corn-ui/u", "cornum", "cornu"],
                correct: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                timeLimit: 90
            }
        ]
    },
    dorf: {
        bewohner: [
            {
                question: "Übersetze den Satz.",
                answers: ["Sie sagten, dass die Sklaven keinerlei Rechte hätten und vollständig abhängig sind.", "Die Sklaven haben keine Rechte und sind abhängig von ihren Herren", "Die Sklaven sagen, dass sie keine Rechte haben."],
                correct: 0,
                timeLimit: null
            },
            {
                question: "Gib den AcI Auslöser an.",
                answers: ["dicebant", "praeditos", "esse", "dominis"],
                correct: 0,
                timeLimit: 15
            }
        ],
        markt: [
            {
                question: "Markiere die drei Stämme von Gallien lila.",
                answers: ["Belgae", "Aquitani", "Celtae", "Galli"],
                correct: [0, 1, 2],
                timeLimit: 60
            },
            {
                question: "Markiere die beiden Flüsse.",
                answers: ["Rhodano", "Garumna", "Belgarum", "Oceanus"],
                correct: [0, 1],
                timeLimit: null
            },
            {
                question: "Dekliniere die Flüsse 'Rhodano' und 'Garumna' im Singular.",
                answers: ["Rhodannus", "Garunna", "Rhodani", "Garunnae", "Rhodano", "Garunnae", "Rhodanum", "Garunnam", "Rhodano", "Garunna"],
                correct: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                timeLimit: null
            }
        ]
    },
    fluss: {
        flussaufwaerts: [
            {
                question: "Bringe diesen Tabelleninhalt in die richtige Reihenfolge.",
                answers: ["caelo - Himmel", "sacris - Opfer, Heiligtum", "deos - Götter", "imperium - Macht, Einfluss"],
                correct: [0, 1, 2, 3],
                timeLimit: 30
            }
        ],
        hafen: [
            {
                question: "Wie wird dieser Stamm beschrieben?",
                answers: ["der stärkste Stamm", "der größte Stamm", "der kleinste Stamm", "der mächtigste Stamm"],
                correct: 0,
                timeLimit: 10
            }
        ],
        flussabwaerts: [
            {
                question: "Markiere alle Adjektive:",
                answers: ["publica", "privata", "magnus", "magno", "omnibus", "publicis", "privatisque"],
                correct: [0, 1, 2, 3, 4, 5, 6],
                timeLimit: null
            }
        ]
    }
};
