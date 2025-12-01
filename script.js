///// Global variable
let clickedNumber = []
let clickedItem = []
let currentNumber = ""
let result = 0

let screenResult = document.querySelector(".result")
let clearButton = document.querySelector(".clear-result")
let number = document.querySelector(".button-number")

const itemCalculator = [
  1,
  2,
  3,
  "+",
  4,
  5,
  6,
  "-",
  7,
  8,
  9,
  "×",
  ".",
  0,
  "=",
  "÷",
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
    specificNumber.innerText = indexNumber
    clickedItem.push(indexNumber)
  }

  console.log("clickeditem: " + clickedItem)
  if (!isNaN(indexNumber)) {
    currentNumber += indexNumber
  } else if (indexNumber === ".") {
    if (!currentNumber.includes(".")) {
      if (currentNumber === "") {
        currentNumber = "0."
      } else {
        currentNumber += "."
      }
    }
  } else {
    if (currentNumber !== "") {
      clickedNumber.push(currentNumber)
      currentNumber = ""
    }
    clickedNumber.push(indexNumber)
    console.log(clickedNumber)
  }
  screenResult.appendChild(specificNumber)
}

const finalResult = () => {
  if (clickedNumber.includes("+")) {
    // reference: https://stackabuse.com/bytes/strip-non-numeric-characters-from-a-string-in-javascript/
    const onlyNumbers = clickedNumber.filter((num) => num >= "0" && num <= "9")
    console.log(onlyNumbers)
    onlyNumbers.forEach((num) => {
      result += parseFloat(num)
    })
    const total = document.createElement("span")
    total.setAttribute("class", "total")
    total.innerText = result
    screenResult.appendChild(total)
  } else if (clickedNumber.includes("-")) {
    const onlyNumbers = clickedNumber.filter((num) => num >= "0" && num <= "9")
    console.log(onlyNumbers)
    let resultSub = parseFloat(onlyNumbers[0])
    onlyNumbers.forEach((num) => {
      resultSub -= parseFloat(num)
    })
    const sub = document.createElement("span")
    sub.setAttribute("class", "sub")
    sub.innerText = resultSub
    screenResult.appendChild(sub)
  }
  clickedNumber = []
  clickedItem = []
}

const clearNumber = () => {
  screenResult.innerText = ""
  clickedNumber = []
  clickedItem = []
  result = 0
}

///// Events
for (let i = 0; i < calculator.length; i++) {
  calculator[i].addEventListener("click", () => {
    clickButton(i)
  })
}

clearButton.addEventListener("click", clearNumber)
equalButton.addEventListener("click", finalResult)
