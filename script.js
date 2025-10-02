let flowchartData = {};
let currentQuestion = 'q1';
let questionsAnswered = [];

// Fetch the flowchart data
fetch('flowchart.json')
    .then(response => response.json())
    .then(data => {
        flowchartData = data;
        displayQuestion(currentQuestion);
    })
    .catch(error => console.error('Error loading flowchart:', error));

function displayProgress() {
    const progress = document.getElementById('progress-indicator');
    if (!progress) return;
    progress.textContent = `Vraag ${questionsAnswered.length + 1}`;
}

function displayQuestion(questionId) {
    if (!questionsAnswered.length || questionsAnswered[questionsAnswered.length - 1] !== questionId) {
        questionsAnswered.push(questionId);
    }
    displayProgress();
    const question = flowchartData[questionId];
    if (!question) {
        console.error('Question not found:', questionId);
        return;
    }

    document.getElementById('question').textContent = question.question;
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    Object.entries(question.answers).forEach(([key, answer]) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        
        button.addEventListener('click', () => {
            if (answer.popup) {
                showPopup(answer.popup, answer.next);
            } else {
                handleNavigation(answer.next);
            }
        });

        answersContainer.appendChild(button);
    });
}

function showPopup(text, nextQuestionId) {
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const popupNext = document.getElementById('popup-next');

    popupText.textContent = text;
    popup.style.display = 'flex';
    setTimeout(() => popup.classList.add('active'), 10);

    popupNext.onclick = () => {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
            handleNavigation(nextQuestionId);
        }, 300);
    };
}

function handleNavigation(nextId) {
    if (nextId.startsWith('e')) {
        // Navigate to end page
        window.location.href = `end${nextId.slice(1)}.html`;
    } else {
        currentQuestion = nextId;
        displayQuestion(nextId);
    }
}