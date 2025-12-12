///// Global variable
let calculationNumber = []
let clickedItem = []
let currentNumber = ""
let previousResult = ""
let expression = ""
let result = 0
let checkIsProcess = false

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

  if (operators.includes(indexNumber) && operators.includes(lastItem)) {
    return
  } else if (
    clickedItem.length === 0 &&
    operators.includes(indexNumber) &&
    checkIsProcess === false &&
    calculationNumber.length === 0
  ) {
    clickedItem.push(0)
    calculationNumber.push(0)
    specificNumber.innerText = 0 + indexNumber
  } else if (indexNumber === "." && currentNumber.includes(".")) {
    return
  } else {
    specificNumber.innerText = indexNumber
  }
  if(checkIsProcess === false && indexNumber === "."){
    clickedItem.push(0)
  }
  clickedItem.push(indexNumber)

  if (indexNumber === "." && operators.includes(lastItem)) {
    checkIsProcess = false
  }

  if (indexNumber === "." && checkIsProcess === true) {
    previousResult = result.toString()
    if (previousResult.includes(".")) {
      return
    }
  }

  if (!isNaN(indexNumber)) {
    currentNumber += indexNumber
  } else if (indexNumber === ".") {
    if (!currentNumber.includes(".")) {
      if (currentNumber === "") {
        if (checkIsProcess === false) {
          currentNumber = "0."
          console.log(clickedItem)
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

  localStorage.setItem("expression", clickedItem.join(""))
  localStorage.setItem("lastResult", strResult)
  localStorage.setItem("data", new Date().toString().slice(16, 25))
  historyResult()

  showResult.innerText = strResult
  calculationNumber = [strResult]
  clickedItem = []
  currentNumber = ""
  previousResult = ""
  checkIsProcess = true
}

const clearNumber = () => {
  screenResult.innerHTML = ""
  currentNumber = ""
  previousResult = ""
  calculationNumber = []
  clickedItem = []
  result = 0
  checkIsProcess = false
}

const historyResult = () => {
  let formula = localStorage.getItem("expression")
  let saveResult = localStorage.getItem("lastResult")
  let data = localStorage.getItem("data")

  const specificResult = document.createElement("span")
  const showFinalResult = document.createElement("p")
  const currentDate = document.createElement("p")

  specificResult.setAttribute("class", "container-result")
  showFinalResult.setAttribute("class", "container--final-result")
  currentDate.setAttribute("class", "time")

  specificResult.innerText = formula
  showFinalResult.innerText = saveResult
  currentDate.innerText = data

  history.appendChild(specificResult)
  history.appendChild(showFinalResult)
  history.appendChild(currentDate)
}

const clearHistory = () => {
  localStorage.clear()
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
