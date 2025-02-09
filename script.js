function showIntro() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('intro-screen').style.display = 'flex';
}

function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function showSubregions(region) {
    console.log("Region geklickt:", region);
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('subregion-screen').style.display = 'block';

    document.getElementById('subregion-title').textContent = `Wähle eine Aufgabe in ${region}`;
    
    let container = document.getElementById('subregion-container');
    container.innerHTML = ""; 

    let subregions = {
        wald: ["Weg", "Baum"],
        dorf: ["Die Bewohner", "Der Markt"],
        fluss: ["Fluss aufwärts", "Der Hafen", "Fluss abwärts"]
    };

    subregions[region].forEach(sub => {
        let btn = document.createElement("button");
        btn.textContent = sub;
        btn.classList.add("button", "subregion-button");
        btn.onclick = function () { startTask(sub); };
        container.appendChild(btn);
    });
}

function startTask(subregion) {
    console.log("Unterregion geklickt:", subregion);
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('task-screen').style.display = 'block';

    document.getElementById('task-title').textContent = `Aufgabe in ${subregion}`;
}

function backToRegions() {
    document.getElementById('subregion-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

function backToSubregions() {
    document.getElementById('task-screen').style.display = 'none';
    document.getElementById('subregion-screen').style.display = 'block';
}
