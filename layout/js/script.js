let quizApp = document.querySelector(".quiz-app");
let question = document.querySelector(".quiz-app .question");
let answerContent = document.querySelector(".quiz-app .answer-content");
let submitBtn = document.getElementById("submit");
let bulletsContent = document.querySelector(".quiz-app .bullets ");
let bulletsSpans = document.querySelector(".quiz-app .bullets .spans");
let timer = document.querySelector(".countdown");
let currentIndex = 0;
let rightIndex = 0;
let countdownContent;
function getData() {
  let theRequest = new XMLHttpRequest();
  theRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let objQuiz = JSON.parse(this.responseText);
      let qCount = objQuiz.length;
      createQuiz(objQuiz[currentIndex], qCount);
      createBullets(qCount);
      countdown(5, qCount);

      submitBtn.onclick = function () {
        checkAnswer(objQuiz[currentIndex].answer);
        currentIndex++;
        question.innerHTML = "";
        answerContent.innerHTML = "";
        createQuiz(objQuiz[currentIndex], qCount);
        handleBullets();
        clearInterval(countdownContent);
        countdown(5, qCount);
        showResult(qCount);
      };
    }
  };

  theRequest.open("GET", "question.json");
  theRequest.send();
}
getData();

function createQuiz(obj, count) {
  if (currentIndex < count) {
    let titleQuiz = document.createElement("h2");
    let textQiuz = document.createTextNode(obj.question);
    titleQuiz.appendChild(textQiuz);
    question.appendChild(titleQuiz);

    for (let i = 1; i <= 4; i++) {
      let arr = ["A", "B", "C", "D"];
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.id = arr[i - 1];
      input.dataset.answer = arr[i - 1];
      if (i === 1) {
        input.checked = true;
      }
      let label = document.createElement("label");
      label.textContent = obj[arr[i - 1]];
      label.htmlFor = arr[i - 1];

      mainDiv.appendChild(input);
      mainDiv.appendChild(label);
      answerContent.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer) {
  let answer = document.getElementsByName("answer");
  let theChooseAnswer;
  answer.forEach((e) => {
    if (e.checked) {
      theChooseAnswer = e.dataset.answer;
    }
  });
  if (rAnswer === theChooseAnswer) {
    rightIndex++;
  }
}

function createBullets(count) {
  document.querySelector(".count span").textContent = count;
  for (let i = 0; i < count; i++) {
    let bullets = document.createElement("span");
    if (i === 0) {
      bullets.className = "on";
    }
    bulletsSpans.appendChild(bullets);
  }
}

function handleBullets() {
  let allBullets = document.querySelectorAll(".bullets .spans span");
  allBullets.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function countdown(time, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownContent = setInterval(function () {
      minutes = Math.floor(time / 60);
      seconds = Math.floor(time % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      timer.textContent = `${minutes}:${seconds}`;
      if (--time < 0) {
        clearInterval(countdownContent);
        submitBtn.click();
      }
    }, 1000);
  }
}

function showResult(count) {
  if (currentIndex === count) {
    question.remove();
    bulletsContent.remove();
    submitBtn.remove();

    let result = document.createElement("div");
    result.className = "result";
    let span = document.createElement("span");
    let p = document.createElement("p");
    p.textContent = `Your Answer Right :  ${rightIndex} From ${count}`;
    if (rightIndex > count / 2 && rightIndex < count) {
      span.textContent = "Good , ";
      span.style.color = "#0077ff";
    } else if (rightIndex === count) {
      span.textContent = "Perfect , ";
      span.style.color = "#4bca4b";
    } else {
      span.textContent = "Bad , ";
      span.style.color = "#ee4040";
    }
    result.appendChild(span);
    result.appendChild(p);
    quizApp.appendChild(result);
  }
}
