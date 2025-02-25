/* Allgemeine Stile */
body {
    font-family: Arial, sans-serif;
    text-align: center;
    background: url("background.jpg") no-repeat center center fixed;
    background-size: cover;
    margin: 0;
    height: 100vh;
    overflow: hidden;
    color: black;
}

/* Willkommensbildschirm */
#welcome-screen {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

/* Erklärungsbildschirm */
#intro-screen {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
}

#intro-box {
    background: rgba(255, 255, 255, 0.95);
    color: black;
    padding: 25px;
    border-radius: 10px;
    width: 60%;
    max-width: 600px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
}

/* Buttons */
.button {
    padding: 15px 30px;
    font-size: 18px;
    border: none;
    cursor: pointer;
    transition: 0.3s;
    margin: 10px;
    border-radius: 8px;
}

/* Region-Buttons (frei positionierbar) */
.region-button {
    position: absolute;
    background-color: rgba(0, 123, 255, 0.8);
    color: white;
}

/* Antwort-Buttons */
.answer-button {
    background-color: rgba(0, 123, 255, 0.8);
    color: white;
}

/* Farben für die Zuordnung in 'Fluss abwärts' */
.matching-blue { background-color: blue; color: white; }
.matching-yellow { background-color: yellow; color: black; }
.matching-pink { background-color: pink; color: black; }
.matching-green { background-color: green; color: white; }

/* Zurück-Buttons */
.back-button {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 10px;
    border: 2px solid white;
    border-radius: 5px;
}
