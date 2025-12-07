///// Global variable
let calculationNumber = []
let clickedItem = []
let currentNumber = ""
let result = 0
let checkIsProcess = false

let screenResult = document.querySelector(".result")
let clearButton = document.querySelector(".clear-result")
let number = document.querySelector(".button-number")

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
  const specificNumber = document.createElement("span")
  specificNumber.setAttribute("class", "number-calculator")
  specificNumber.setAttribute("id", `${index}`)
  if (
    !operators.includes(indexNumber) ||
    !operators.includes(clickedItem[clickedItem.length - 1])
  ) {
    if (
      clickedItem.length === 0 &&
      operators.includes(indexNumber) &&
      checkIsProcess === false &&
      calculationNumber.length === 0
    ) {
      clickedItem.push(0)
      calculationNumber.push(0)
      specificNumber.innerText = 0 + indexNumber
    } else {
      specificNumber.innerText = indexNumber
    }
    clickedItem.push(indexNumber)
    console.log(clickedItem)
  }

  if (!isNaN(indexNumber)) {
    currentNumber += indexNumber
  } else if (indexNumber === ".") {
    if (!currentNumber.includes(".")) {
      if (currentNumber === "") {
        currentNumber = "0."
        specificNumber.innerText = 0 + indexNumber
      } else {
        currentNumber += "."
      }
    }
  } else {
    if (currentNumber !== "") {
      calculationNumber.push(parseFloat(currentNumber))
      currentNumber = ""
    }
    calculationNumber.push(indexNumber)
  }
  screenResult.appendChild(specificNumber)
}

const finalResult = () => {
  screenResult.innerHTML = ""
  // reference: https://stackoverflow.com/questions/69816276/javascript-arrays-filter-by-type
  const onlyNumbers = calculationNumber.filter((num) => typeof num === "number")

  const finalSolve = document.createElement("span")
  finalSolve.setAttribute("class", "solve")
  finalSolve.innerText = ""
  screenResult.appendChild(finalSolve)

  if (calculationNumber.includes("+")) {
    result = 0
    onlyNumbers.forEach((num) => {
      result += num
    })
    finalSolve.innerText = result
  } else if (calculationNumber.includes("-")) {
    result = onlyNumbers[0]
    onlyNumbers.slice(1).forEach((num) => {
      result -= num
    })
    finalSolve.innerText = result
  } else if (calculationNumber.includes("×")) {
    result = onlyNumbers[0]
    onlyNumbers.slice(1).forEach((num) => {
      result *= num
    })
    finalSolve.innerText = result
  } else if (calculationNumber.includes("÷")) {
    result = onlyNumbers[0]
    onlyNumbers.slice(1).forEach((num) => {
      result /= num
    })
    finalSolve.innerText = result
  }
  calculationNumber = [result]
  checkIsProcess = true
  clickedItem = []
}

const clearNumber = () => {
  screenResult.innerHTML = ""
  calculationNumber = []
  clickedItem = []
  result = 0
  checkIsProcess = false
}

///// Events
for (let i = 0; i < calculator.length; i++) {
  calculator[i].addEventListener("click", () => {
    clickButton(i)
  })
}

clearButton.addEventListener("click", clearNumber)
equalButton.addEventListener("click", finalResult)
