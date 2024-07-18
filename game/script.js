let btnRef = document.querySelectorAll(".button-option");
let popupRef = document.querySelector(".popup");
let newgameBtn = document.getElementById("new-game");
let restartBtn = document.getElementById("restart");
let onePlayerBtn = document.getElementById("one-player");
let msgRef = document.getElementById("message");
let playerXName = document.getElementById("playerXName");
let playerOName = document.getElementById("playerOName");

// Disable All Buttons
const disableButtons = () => {
  btnRef.forEach((element) => (element.disabled = true));
  popupRef.classList.remove("hide");
};

// Enable all buttons (For New Game and Restart)
const enableButtons = () => {
  btnRef.forEach((element) => {
    element.innerText = "";
    element.disabled = false;
  });
  popupRef.classList.add("hide");
  currentPlayerName = 'X';
  xTurn = true;
  count = 0;
};

// This function is executed when a player wins
const winFunction = (letter) => {
  disableButtons();
  if (letter === "X") {
    msgRef.innerHTML = `&#x1F389; <br> '${playerXName.value || "Player X"}' Wins`;
  } else {
    msgRef.innerHTML = `&#x1F389; <br> '${playerOName.value || "Player O"}' Wins`;
  }
};

// Function for draw
const drawFunction = () => {
  disableButtons();
  msgRef.innerHTML = "&#x1F60E; <br> It's a Draw";
};

// New Game
newgameBtn.addEventListener("click", () => {
  enableButtons();
  singlePlayerMode = false; // Reset to two-player mode for new game
  playerXName.value = '';
  playerOName.value = '';
});

// Restart Game
restartBtn.addEventListener("click", () => {
  enableButtons();
  singlePlayerMode = false; // Reset to two-player mode for new game
});

// One Player Mode
onePlayerBtn.addEventListener("click", () => {
  if (playerXName.value && playerOName.value) {
    singlePlayerMode = true;
    enableButtons();
  } else {
    alert("Please enter names for both players.");
  }
});

// Check Win
const winChecker = () => {
  for (let i of winningPattern) {
    let [element1, element2, element3] = [
      btnRef[i[0]].innerText,
      btnRef[i[1]].innerText,
      btnRef[i[2]].innerText,
    ];
    if (element1 !== "" && element2 !== "" && element3 !== "") {
      if (element1 === element2 && element2 === element3) {
        winFunction(element1);
        return;
      }
    }
  }
};

// Computer Move
const computerMove = () => {
  let bestMove = getBestMove();
  if (bestMove !== null) {
    btnRef[bestMove].innerText = "O";
    btnRef[bestMove].disabled = true;
    xTurn = true;
    count += 1;
    winChecker();
    if (count < 9) checkForDraw();
  }
};

// Minimax Algorithm
const minimax = (depth, isMaximizing) => {
  const winner = checkWinner();
  if (winner === 'X') return -10;
  if (winner === 'O') return 10;
  if (count === 9) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    btnRef.forEach((btn, index) => {
      if (btn.innerText === "") {
        btn.innerText = "O";
        btn.disabled = true;
        count += 1;
        let score = minimax(depth + 1, false);
        btn.innerText = "";
        btn.disabled = false;
        count -= 1;
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    btnRef.forEach((btn, index) => {
      if (btn.innerText === "") {
        btn.innerText = "X";
        btn.disabled = true;
        count += 1;
        let score = minimax(depth + 1, true);
        btn.innerText = "";
        btn.disabled = false;
        count -= 1;
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
};

// Get Best Move for Computer
const getBestMove = () => {
  let bestScore = -Infinity;
  let move;
  btnRef.forEach((btn, index) => {
    if (btn.innerText === "") {
      btn.innerText = "O";
      btn.disabled = true;
      count += 1;
      let score = minimax(0, false);
      btn.innerText = "";
      btn.disabled = false;
      count -= 1;
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  return move;
};

// Display X/O on Click
btnRef.forEach((element) => {
  element.addEventListener("click", () => {
    if (xTurn && !element.disabled) {
      element.innerText = "X";
      element.disabled = true;
      xTurn = false;
      count += 1;
      winChecker();
      if (count < 9) {
        if (singlePlayerMode) {
          computerMove();
        } else {
          xTurn = true;
        }
      } else {
        checkForDraw();
      }
    }
  });
});

// Check for Draw
const checkForDraw = () => {
  if (count === 9) drawFunction();
};

// Check Winner Function
const checkWinner = () => {
  for (let i of winningPattern) {
    let [element1, element2, element3] = [
      btnRef[i[0]].innerText,
      btnRef[i[1]].innerText,
      btnRef[i[2]].innerText,
    ];
    if (element1 !== "" && element1 === element2 && element1 === element3) {
      return element1;
    }
  }
  return null;
};

// Enable Buttons and disable popup on page load
window.onload = () => {
  enableButtons();
  onePlayerBtn.disabled = true;
  playerXName.addEventListener('input', () => {
    onePlayerBtn.disabled = !(playerXName.value && playerOName.value);
  });
  playerOName.addEventListener('input', () => {
    onePlayerBtn.disabled = !(playerXName.value && playerOName.value);
  });
};
