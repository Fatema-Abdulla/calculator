///// Global variable
let calculationNumber = []
let clickedItem = []
let currentNumber = ""
let previousResult = ""
let expression = ""
let result = 0
let isAfterEqual = false
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
  allNumber.setAttribute("class", "numbers")
  allNumber.setAttribute("id", `n${i}`)
  allNumber.innerText = itemCalculator[i]
  number.appendChild(allNumber)
}

let calculator = document.querySelectorAll(".numbers")
let equalButton = document.querySelector("#n14")

///// Function

const clickButton = (index) => {
  let indexNumber = calculator[index].innerText
  let lastItem = clickedItem[clickedItem.length - 1]

  const specificNumber = document.createElement("span")
  specificNumber.setAttribute("class", "number-calculator")
  specificNumber.setAttribute("id", `${index}`)

  if (
    (operators.includes(indexNumber) && operators.includes(lastItem)) ||
    (indexNumber === "." && currentNumber.includes("."))
  ) {
    return
  } else if (
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

  if (isAfterEqual === true) {
    if (operators.includes(indexNumber)) {
      calculationNumber = [previousResult]
      clickedItem = [previousResult]
      currentNumber = ""
      isAfterEqual = false
    }

    if (indexNumber === ".") {
      if (previousResult.includes(".")) return
      currentNumber = previousResult + "."
      isAfterEqual = false
      specificNumber.innerText = "."
      screenResult.appendChild(specificNumber)
      return
    }
  }

  if (!isNaN(indexNumber)) {
    currentNumber += indexNumber
    console.log(currentNumber)
  } else if (indexNumber === ".") {
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
  } else {
    if (currentNumber !== "") {
      calculationNumber.push(currentNumber)
      currentNumber = ""
    }
    console.log(clickedItem)
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

  if (
    calculationNumber.length === 0 ||
    itemBeforeEqual === "." ||
    operators.includes(itemBeforeEqual) ||
    itemBeforeEqual === undefined
  ) {
    showResult.innerText = "Syntax Error"
    return
  }

  // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
  // reference: https://mathjs.org/index.html
  // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
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

  // reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
  // reference : https://javascript.info/localstorage
  const historyItem = {
    expression: calculationNumber.join(""),
    result: strResult,
    date: new Date().toString().slice(3, 25),
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
  const finalOperation = document.createElement("p")
  const showFinalResult = document.createElement("p")
  const currentDate = document.createElement("p")

  finalOperation.setAttribute("class", "container-result")
  showFinalResult.setAttribute("class", "container-final-result")
  currentDate.setAttribute("class", "time")

  finalOperation.innerText = item.expression
  showFinalResult.innerText = item.result
  currentDate.innerText = item.date

  history.appendChild(finalOperation)
  history.appendChild(showFinalResult)
  history.appendChild(currentDate)
}

const clearHistory = () => {
  localStorage.removeItem("history")
  historyData = []
  history.innerHTML = ""
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
  historyData.forEach((item) => {
    renderHistory(item)
  })
})
