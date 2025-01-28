let questions = [];
let currqueindex = 0;
let score = 0;
let answeredQuestions = [];
let timerInterval; // Timer interval reference
let totalTime = 600; // Total time in seconds (10 minutes)

// Load questions from JSON
fetch('questionbank.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
    })
    .catch(error => console.error("Error Loading Questions", error));

// Function to start the quiz
function startQuiz() {
    document.getElementById('instruction-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('question-numbers-container').style.display = 'block';
    displayQuestion(); // Display the first question
    initializeQuestionBoxes(); // Initialize question number boxes
    startTimer(); // Start the timer
}

// Function to initialize question number boxes
function initializeQuestionBoxes() {
    const questionNumbersContainer = document.getElementById('question-numbers');
    questionNumbersContainer.innerHTML = ''; // Clear existing boxes

    // Create a question box for each question
    for (let i = 0; i < questions.length; i++) {
        const box = document.createElement('div');
        box.classList.add('question-box');
        box.innerText = i + 1;
        box.setAttribute('data-index', i);
        box.addEventListener('click', () => showQuestion(i)); // Clicking on box shows the question
        questionNumbersContainer.appendChild(box);
    }
}

// Function to display the current question
function displayQuestion() {
    const questionref = document.getElementById('question');
    const optionref = document.getElementById('options');
    const feedbackref = document.getElementById('feedback');

    optionref.innerHTML = '';
    feedbackref.innerText = '';

    const currentque = questions[currqueindex];
    questionref.innerHTML = `<strong>Question ${currqueindex + 1} / ${questions.length}</strong><br>${currentque.question}`;

    currentque.options.forEach((option, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.innerText = option;
        button.className = 'btn option-btn';
        button.onclick = () => checkAnswer(index);
        li.appendChild(button);
        optionref.appendChild(li);
    });
}

// Function to check the answer
function checkAnswer(selectedIndex) {
    const currentque = questions[currqueindex];
    const feedbackref = document.getElementById('feedback');
    const scoreRef = document.getElementById('score');

    if (selectedIndex === currentque.correctAnswer) {
        feedbackref.innerText = 'Correct!!';
        feedbackref.style.color = 'green';
        score++;
        updateQuestionBox(currqueindex, 'correct');
    } else {
        feedbackref.innerText = 'OOPS :( Wrong!!';
        feedbackref.style.color = 'red';
        updateQuestionBox(currqueindex, 'incorrect');
    }

    scoreRef.innerText = `Score: ${score}`;
    answeredQuestions[currqueindex] = true;

    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true);
}

// Function to update the color of the question box based on answer
function updateQuestionBox(index, status) {
    const box = document.querySelector(`#question-numbers .question-box[data-index="${index}"]`);
    if (status === 'correct') {
        box.classList.add('correct');
    } else if (status === 'incorrect') {
        box.classList.add('incorrect');
    } else {
        box.classList.add('skipped');
    }
}

// Handle next question button click
document.getElementById('next-btn').addEventListener('click', () => {
    currqueindex++;
    if (currqueindex < questions.length) {
        displayQuestion();
    } else {
        showScore(); // Show the final score when all questions are answered
    }
});

// Function to show score at the end
function showScore() {
    clearInterval(timerInterval); // Stop the timer
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your final score: ${score} / ${questions.length}</p>
    `;
}

// Timer Functions
function startTimer() {
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    document.getElementById('quiz-container').appendChild(timerElement);

    updateTimerDisplay(timerElement);

    timerInterval = setInterval(() => {
        totalTime--;

        if (totalTime >= 0) {
            updateTimerDisplay(timerElement);
        } else {
            clearInterval(timerInterval); // Stop the timer
            alert("Time is up!");
            showScore(); // Automatically show score when time runs out
        }
    }, 1000);
}

function updateTimerDisplay(timerElement) {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
