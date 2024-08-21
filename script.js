let questions = [];
let currentQuestion = 0;
let answers = [];
let startTime;
let timerInterval;

document.getElementById("start-quiz").addEventListener("click", startQuiz);
document.getElementById("next-question").addEventListener("click", nextQuestion);
document.getElementById("prev-question").addEventListener("click", prevQuestion);
document.getElementById("submit-quiz").addEventListener("click", submitQuiz);

// Charger les questions depuis data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        answers = Array(questions.length).fill(null);
    })
    .catch(error => console.error('Error loading questions:', error));

function startQuiz() {
    const pseudo = document.getElementById("pseudo").value;
    const email = document.getElementById("email").value;

    if (!pseudo || !email) {
        alert("Veuillez renseigner tous les champs.");
        return;
    }

    document.getElementById("start-page").style.display = "none";
    document.getElementById("quiz-page").style.display = "block";

    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);

    loadQuestion();
}

function loadQuestion() {
    const question = questions[currentQuestion];
    const questionContainer = document.getElementById("question-container");

    questionContainer.innerHTML = `
        <img src="${question.img}" alt="Image Question">
        <p>${question.text}</p>
        <div class="toggle-button-group">
            ${question.choices.map((choice, index) => `
                <input type="radio" id="choice-${index}" name="choice" value="${index}" ${answers[currentQuestion] === index ? 'checked' : ''}>
                <label for="choice-${index}" class="toggle-button">${choice}</label>
            `).join('')}
        </div>
    `;

    document.getElementById("prev-question").style.display = currentQuestion > 0 ? 'inline' : 'none';
    document.getElementById("next-question").style.display = currentQuestion < questions.length - 1 ? 'inline' : 'none';
    document.getElementById("submit-quiz").style.display = currentQuestion === questions.length - 1 ? 'inline' : 'none';
}

function nextQuestion() {
    saveAnswer();
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

function prevQuestion() {
    saveAnswer();
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function saveAnswer() {
    const selectedOption = document.querySelector('input[name="choice"]:checked');
    if (selectedOption) {
        answers[currentQuestion] = parseInt(selectedOption.value);
    }
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.getElementById("timer").textContent = `Temps : ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function submitQuiz() {
    saveAnswer();
    clearInterval(timerInterval);

    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;
    const finalTime = document.getElementById("timer").textContent.split(" : ")[1];

    document.getElementById("quiz-page").style.display = "none";
    document.getElementById("result-page").style.display = "block";

    document.getElementById("final-time").textContent = finalTime;
    document.getElementById("correct-answers").textContent = correctAnswers;

    saveResults(finalTime, correctAnswers);
}

function saveResults(finalTime, correctAnswers) {
    const pseudo = document.getElementById("pseudo").value;
    const email = document.getElementById("email").value;

    fetch('https://script.google.com/macros/s/AKfycbxOOHaOolAiUrlV-Kjul_O3ZbDDnPEvTI30IwBVktkVHHPj3CefYJCg0pazRggC-RyJ/exec', {
        mode: 'no-cors', // Test serveur local
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pseudo: pseudo,
            email: email,
            time: finalTime,
            correctAnswers: correctAnswers
        }),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}

