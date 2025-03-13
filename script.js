document.getElementById('start-btn').addEventListener('click', startTimedEvent);

function startTimedEvent() {
    // Get user input
    const keySequence = document.getElementById('key-sequence').value.trim().toLowerCase().split('');
    const timeLimit = parseInt(document.getElementById('time-limit').value, 10);
    // Validate user input
    if (keySequence.length === 0 || keySequence.length > 10 || isNaN(timeLimit) || timeLimit <= 0) {
        alert('Please enter a valid key sequence (1-10 characters) and time limit.');
        return;
    }
    // Disable the button to prevent starting another event
    document.getElementById('start-btn').disabled = true;
    let userInput = [];
    let timer = timeLimit;
    let milliseconds = 0;
    let timerInterval;
    // Display the sequence of keys the user has to press
    const keyDisplayContainer = document.getElementById('key-sequence-display');
    keyDisplayContainer.innerHTML = '';  // Clear any previous display
    keySequence.forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = key;
        keyDisplayContainer.appendChild(keyElement);
    });
    // Start the countdown timer
    timerInterval = setInterval(() => {
        milliseconds += 10;
        if (milliseconds >= 1000) {
            milliseconds = 0;
            timer--;
        }
        // Format the timer with minutes, seconds, and milliseconds
        const formattedTime = formatTime(timer, milliseconds);
        document.getElementById('timer-display').textContent = formattedTime;
        // Stop the timer when both seconds and milliseconds are 0
        if (timer <= 0 && milliseconds === 0) {
            clearInterval(timerInterval);
            checkSequence(userInput, keySequence); // Time's up, check sequence
        }
    }, 10); // Update every 10 milliseconds
    // Listen for keypresses
    document.addEventListener('keydown', (event) => {
        if (userInput.length === keySequence.length || (timer <= 0 && milliseconds === 0)) return;
        const keyPressed = event.key.toLowerCase();
        userInput.push(keyPressed);
        // Check if the user input matches the sequence so far
        if (userInput[userInput.length - 1] !== keySequence[userInput.length - 1]) {
            document.getElementById('feedback').textContent = 'Incorrect key! Try again.';
            userInput = []; // Reset input if wrong key is pressed
            resetKeyDisplay();
        } else {
            // Pop the key that was pressed
            document.querySelectorAll('.key')[userInput.length - 1].classList.add('pressed');
        }
        // If sequence is completed
        if (userInput.length === keySequence.length) {
            clearInterval(timerInterval);
            checkSequence(userInput, keySequence);
        }
    });
    function checkSequence(input, target) {
        if (input.join('') === target.join('')) {
            document.getElementById('feedback').textContent = 'Success! You pressed the correct sequence!';
            document.getElementById('feedback').style.color = 'green';
        } else {
            document.getElementById('feedback').textContent = 'Time is up or the sequence was incorrect. Try again!';
            document.getElementById('feedback').style.color = 'red';
        }
        // Enable button to allow restarting the event
        document.getElementById('start-btn').disabled = false;
    }
    function resetKeyDisplay() {
        // Reset the key sequence display after a wrong input
        const keyElements = document.querySelectorAll('.key');
        keyElements.forEach(element => {
            element.classList.remove('pressed');
        });
    }
    function formatTime(seconds, milliseconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        const ms = milliseconds;
        // Always show two digits for minutes and seconds, and three digits for milliseconds
        return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}:${ms < 100 ? '0' : ''}${ms}`;
    }
}