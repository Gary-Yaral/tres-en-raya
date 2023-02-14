const body = document.querySelector("body")
const currentTurn = document.querySelector("#current_turn")
const btns = document.querySelectorAll(".board_button")
const newGameBtn = document.querySelector("#btn_new")
const winnerName = document.querySelector(".winner_name")
const modal = document.querySelector(".modal")
const resetData = document.querySelector(".scores_reset")
modal.onclick = hideModal
resetData.onclick = resetStore

let counter = 0 
let start = false 
let lastWinner = null
let currentPlayer = null
let winner = null
let winningNumbersString = null
let KEY = "tic_tac_toe"
let scores = { 0: 0, 1: 0 }
const letters = { 0: "X", 1: "O" }

const PLAYER_NAMES = {
  0: "Player 1",
  1: "Player 2"
}

const initialState = {
  0: {
    numbers:[],
    letter: null
  },
  1:{
    numbers:[],
    letter: null
  }
}

let currentPlay = { ...initialState }

const winningNumbers = [
  // Rows
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  // Columns
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  // Diagonal
  [1, 5, 9],
  [3, 5, 7]
]

disabledButtons()
loadStorage(KEY)
loadScores(scores)

body.onclick = function(event) {
  const element = event.target
  const btnID = element.id
  const pressedProp = element.getAttribute("pressed")
  const isPressed = pressedProp === "false" ? false : true
  const isBoardBtn = element.classList.contains("board_button")
  if(isBoardBtn && !isPressed && start) {
    element.setAttribute("pressed", true)
    element.innerHTML = currentPlay[currentPlayer].letter
    saveGameData(btnID)
    if(!findWinner()) loadNextTurn()
    if(findWinner()) {
      disabledButtons()
    }
    if(counter === 9) {
      // Empate
      restartGame()
      winnerName.innerHTML = "Draws"
      showModal()
    }
    
  }

  if(element.id === "btn_new") {
    startGame()
  }
} 

function startGame() {
    const letterID = getInitialLetter()
    const currentID =  getInitialPlayerID()
    start = true
    currentPlayer = currentID
    currentPlay[currentPlayer].letter = letters[letterID]
    currentPlay[currentPlayer ? 0 : 1].letter = letters[letterID ? 0: 1]
    currentTurn.innerHTML = `${PLAYER_NAMES[currentPlayer]}: ${currentPlay[currentPlayer].letter}`
    resetBtns()
    hideButtonStart()
}

function saveGameData(btnID) {
    currentPlay[currentPlayer].numbers.push(parseInt(btnID))
    const array = currentPlay[currentPlayer].numbers
    currentPlay[currentPlayer].numbers = array.sort((a, b) => a - b)
    counter++
}

function loadNextTurn() {
  currentPlayer = currentPlayer ? 0 : 1
  currentTurn.innerHTML = `${PLAYER_NAMES[currentPlayer]}: ${currentPlay[currentPlayer].letter}`
}

function getInitialPlayerID() {
  return Math.floor(Math.random() * 2);
}

function getInitialLetter() {
  return Math.floor(Math.random() * 2);
}

function findWinner() {
  let areThereWinner = false
  let p1 = currentPlay[0].numbers
  let p2 = currentPlay[1].numbers
  if(counter >= 5) {
    winningNumbers.forEach(numbers => {
      let n1 = numbers[0]
      let n2 = numbers[1]
      let n3 = numbers[2]

      if(p1.includes(n1) && p1.includes(n2) && p1.includes(n3)) {
        winner = 0
        areThereWinner = true
        scores[winner]++
        saveScores(scores, KEY)
        loadScores(scores)
        showModal()
        restartGame()
      }
      
      if(p2.includes(n1) && p2.includes(n2) && p2.includes(n3)) {
        winner = 1
        areThereWinner = true
        scores[winner]++
        saveScores(scores, KEY)
        loadScores(scores)
        showModal()
        restartGame()
      }

    })

    return areThereWinner
  }
}

function resetBtns() {
  btns.forEach(btn => {
    btn.innerHTML = ""
    btn.classList.remove("button-disabled")
  })
}

function disabledButtons() {
  btns.forEach(btn => {
    btn.classList.add("button-disabled")
  })
}

function hideButtonStart() {
  newGameBtn.style.display = "none"
  currentTurn.style.display = "flex"
}

function restartGame() {
  newGameBtn.style.display = "flex"
  currentTurn.innerHTML = ""
  currentPlay[0].numbers = []
  currentPlay[1].numbers = []
  counter = 0
  start = false
  winnerName.innerHTML = PLAYER_NAMES[winner]
  btns.forEach(btn => {
    btn.setAttribute("pressed", false)
  })
}

function hideModal() {
  modal.classList.add("hide_modal")
}

function showModal() {
  modal.classList.remove("hide_modal")
}

function loadStorage(KEY) {
  let store = localStorage.getItem(KEY)
  if(store) {
    scores = {...JSON.parse(store)}
  } 
}

function saveScores(data, KEY) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function loadScores(scores) {
  document.querySelector("#data_p1").innerHTML = scores[0]
  document.querySelector("#data_p2").innerHTML = scores[1]
}

function resetStore() {
  localStorage.removeItem(KEY)
  location = ""
}