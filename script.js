// 1. Get elements from the page
const quote = document.getElementById("quote");
const input = document.getElementById("input");
const timeBox = document.getElementById("time");
const wpmBox = document.getElementById("wpm");
const accuracyBox = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart");

// 2. Sentences and variables
const sentences = [
  "The old wooden clock in the hallway ticked quietly through the night.",
  "Freshly baked bread filled the small kitchen with a warm aroma.",
  "JavaScript makes web pages interactive and fun.",
  "Practice makes progress, so keep typing every day.",
  "Keep your hands relaxed and tap each key with care."
];

const TOTAL_TIME = 60;        // testt time is written
let timeLeft = TOTAL_TIME;
let timer = null;
let sentence = "";
let totalCorrect = 0;         // correct letters from finished sentences
let totalTyped = 0;           // typed letters from finished sentences

// 3. Show a random sentence (inside a span)
function newSentence() {
  sentence = sentences[Math.floor(Math.random() * sentences.length)];
  quote.innerHTML = "";
  for (const letter of sentence) {
    quote.innerHTML += "<span>" + letter + "</span>";
  }
}

// 4. Timer: runs every 1 second
function startTimer() {
  clearInterval(timer);       // make sure no old timer is running
  timer = setInterval(function () {
    timeLeft--;
    timeBox.textContent = timeLeft;
    if (timeLeft === 0) finish();
  }, 1000);
}

// 5. Runs every time the user types
input.addEventListener("input", function () {
  if (timer === null) startTimer();   // start on first key

  const letters = quote.querySelectorAll("span");
  const typed = input.value;
  let correct = 0;

  // color each letter
  letters.forEach(function (span, i) {
    if (typed[i] === undefined) {
      span.className = "";                      // not typed yet
    } else if (typed[i] === sentence[i]) {
      span.className = "text-emerald-300";      // correct
      correct++;
    } else {
      span.className = "text-rose-300";         // wrong
    }
  });

  // add this sentence to the earlier sentences
  const allCorrect = totalCorrect + correct;
  const allTyped = totalTyped + typed.length;

  // WPM and accuracy
  const minutes = (TOTAL_TIME - timeLeft) / 60;
  if (minutes > 0) {
    wpmBox.textContent = Math.round(allCorrect / 5 / minutes);
  }
  if (allTyped > 0) {
    accuracyBox.textContent = Math.round((allCorrect / allTyped) * 100) + "%";
  }

  // sentence finished: save the score, clear the box, show a new sentence
  if (typed.length === sentence.length) {
    totalCorrect = allCorrect;
    totalTyped = allTyped;
    input.value = "";
    newSentence();
  }
});

// 6. Stop the test (only when time is up)
function finish() {
  clearInterval(timer);
  input.disabled = true;
}

// 7. Restart
function restart() {
  clearInterval(timer);
  timer = null;
  timeLeft = TOTAL_TIME;
  totalCorrect = 0;
  totalTyped = 0;
  timeBox.textContent = TOTAL_TIME;
  wpmBox.textContent = 0;
  accuracyBox.textContent = "100%";
  input.value = "";
  input.disabled = false;
  input.focus();
  newSentence();
}

restartBtn.addEventListener("click", restart);

// 8. Start
newSentence();
