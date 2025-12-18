///// Global variable
let calculationNumber = []
let clickedItem = []
let currentNumber = ""
let previousResult = ""
let expression = ""
let result = 0
let isAfterEqual = false

// Load history from localStorage
let historyData = JSON.parse(localStorage.getItem("history")) || []

let screenResult = document.querySelector(".result")
let clearButton = document.querySelector(".clear-result")
let number = document.querySelector(".button-number")
let history = document.querySelector(".container")
let historyClearButton = document.querySelector(".clear-history")

const itemCalculator = [
  1,
  2,
  3,
  "÷",
  4,
  5,
  6,
  "×",
  7,
  8,
  9,
  "-",
  0,
  ".",
  "=",
  "+",
]

const operators = ["+", "-", "×", "÷"]

// display the number in array
for (let i = 0; i < itemCalculator.length; i++) {
  const allNumber = document.createElement("span")
  allNumber.setAttribute("class", "calculator-item")
  allNumber.setAttribute("id", `n${i}`)
  allNumber.innerText = itemCalculator[i]
  number.appendChild(allNumber)
}

let calculator = document.querySelectorAll(".calculator-item")
let equalButton = document.querySelector("#n14")

///// Function
const clickButton = (index) => {
  let indexNumber = calculator[index].innerText
  let lastItem = clickedItem[clickedItem.length - 1]

  const specificNumber = document.createElement("span")
  specificNumber.setAttribute("class", "number-calculator")

  // Prevent double operators or multiple dots
  if (
    (operators.includes(indexNumber) && operators.includes(lastItem)) ||
    (indexNumber === "." && currentNumber.includes("."))
  ) {
    return
  } else if (
    // Handle operator as first input
    clickedItem.length === 0 &&
    operators.includes(indexNumber) &&
    isAfterEqual === false &&
    calculationNumber.length === 0
  ) {
    clickedItem.push(0)
    calculationNumber.push(0)
    specificNumber.innerText = 0 + indexNumber
  } else {
    specificNumber.innerText = indexNumber
  }
  clickedItem.push(indexNumber)

  // Handle input after "="
  if (isAfterEqual === true) {
    if (
      operators.includes(indexNumber) ||
      (indexNumber !== "." && !operators.includes(indexNumber))
    ) {
      calculationNumber = [previousResult]
      clickedItem = [previousResult]
      currentNumber = ""
      isAfterEqual = false
    }

    // Handle dot after result
    if (indexNumber === ".") {
      if (previousResult.includes(".")) return
      currentNumber = "."
      specificNumber.innerText = "."
      screenResult.appendChild(specificNumber)
      isAfterEqual = false
      return
    }
  }

  let checkLastLetter = currentNumber.endsWith(".")

  // Handle numbers
  if (!isNaN(indexNumber)) {
    currentNumber += indexNumber
  }
  // Handle decimal point
  else if (indexNumber === ".") {
    if (!currentNumber.includes(".")) {
      if (currentNumber === "") {
        if (isAfterEqual === false) {
          currentNumber = "0."
          specificNumber.innerText = 0 + indexNumber
        }
      } else {
        currentNumber += "."
        specificNumber.innerText = "."
      }
    }
  }

  // Handle operators
  else {
    if (isAfterEqual === false && checkLastLetter === true) {
      currentNumber += 0
      specificNumber.innerText = 0 + indexNumber
    }
    if (currentNumber !== "") {
      calculationNumber.push(currentNumber)
      currentNumber = ""
    }
    calculationNumber.push(indexNumber)
  }
  screenResult.appendChild(specificNumber)
}

const finalResult = () => {
  screenResult.innerHTML = ""
  let itemBeforeEqual = clickedItem[clickedItem.length - 2]

  const showResult = document.createElement("span")
  showResult.setAttribute("class", "solve")
  screenResult.appendChild(showResult)

  // Syntax validation
  if (
    calculationNumber.length === 0 ||
    itemBeforeEqual === "." ||
    operators.includes(itemBeforeEqual) ||
    itemBeforeEqual === undefined
  ) {
    showResult.innerText = "Syntax Error"
    return
  }

  // Configure math.js for high precision
  math.config({
    number: "BigNumber",
    precision: 64,
  })

  expression = calculationNumber
    .filter((item) => item !== "=")
    .join("")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/(\d+(\.\d+)?)/g, 'bignumber("$1")') // only take the number excepted operations

  result = math.evaluate(expression)

  let strResult = result.toString()

  const historyItem = {
    expression: calculationNumber.join(""),
    result: strResult,
    date: new Date().toString().slice(3, 21),
  }

  historyData.push(historyItem)
  localStorage.setItem("history", JSON.stringify(historyData))

  renderHistory(historyItem)

  showResult.innerText = strResult
  calculationNumber = [strResult]
  clickedItem = []
  currentNumber = ""
  previousResult = strResult
  isAfterEqual = true
}

const clearNumber = () => {
  screenResult.innerHTML = ""
  currentNumber = ""
  previousResult = ""
  calculationNumber = []
  clickedItem = []
  result = 0
  isAfterEqual = false
}

const renderHistory = (item) => {
  const emptyMessage = history.querySelector(".container-empty-history")
  if (emptyMessage) {
    emptyMessage.remove()
  }

  const eachResultContainer = document.createElement("div")
  const finalOperation = document.createElement("p")
  const showFinalResult = document.createElement("p")
  const currentDate = document.createElement("p")

  eachResultContainer.setAttribute("class", "container-each-result")
  finalOperation.setAttribute("class", "container-history-result")
  showFinalResult.setAttribute("class", "container-final-result")
  currentDate.setAttribute("class", "time")

  finalOperation.innerText = item.expression
  showFinalResult.innerText = item.result
  currentDate.innerText = item.date

  history.appendChild(eachResultContainer)
  eachResultContainer.appendChild(finalOperation)
  eachResultContainer.appendChild(showFinalResult)
  eachResultContainer.appendChild(currentDate)
}

const clearHistory = () => {
  localStorage.removeItem("history")
  historyData = []
  history.innerHTML = ""

  const emptyHistory = document.createElement("p")
  emptyHistory.setAttribute("class", "container-empty-history")
  emptyHistory.innerText = "History Empty!!"
  history.appendChild(emptyHistory)
}

///// Events
for (let i = 0; i < calculator.length; i++) {
  calculator[i].addEventListener("click", () => {
    clickButton(i)
  })
}

clearButton.addEventListener("click", clearNumber)
equalButton.addEventListener("click", finalResult)
historyClearButton.addEventListener("click", clearHistory)

//// AI : ChatGPT
window.addEventListener("load", () => {
  history.innerHTML = ""

  if (historyData.length === 0) {
    const emptyHistory = document.createElement("p")
    emptyHistory.setAttribute("class", "container-empty-history")
    emptyHistory.innerText = "History Empty!!"
    history.appendChild(emptyHistory)
  } else {
    historyData.forEach((item) => {
      renderHistory(item)
    })
  }
})
