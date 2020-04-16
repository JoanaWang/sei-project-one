/* eslint-disable no-unused-vars */
/* eslint-disable indent */
function init() {

    // * DOM Elements
    const grid = document.querySelector('.grid')
    const gridWrapper = document.querySelector('.grid-wrapper')
    const cells = []
    const score = document.querySelector('#score')
    const end = document.querySelector('.game-over')


    score.textContent = '00'

    // * Grid variables
    const width = 10
    const cellCount = width * width

    // * Game variables
    let pikaPosition = 44 // Start in the first cell by default
    let currentDirection = 0 // This will store the direction last pressed based on the keyCode
    let previousDirection = 0 // This will store the direction before the one just pressed so we don't allow it to go back where it came

    let berryPosition = 47
        // This is the starting size of the snake
    let snakeLength = 4
    let berriesEaten = 0


    // This will contain the indices of all the cells where the snake has been to
    let snakeArray = []

    // This will do something when a specific key is pressed -> event.keyCode
    // Every key on the keyboard has a specific code
    // 38 up
    // 40 down
    // 37 left
    // 39 right

    // This will create the grid to start with 
    function createGrid(startingPosition) {
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div')
                //cell.textContent = i
            grid.appendChild(cell)
            cells.push(cell)
        }

        // This is the initial position of the snake depending on the initial size
        for (i = snakeLength - 1; i >= 0; i--) {
            snakeArray.push(pikaPosition - i)
        }

        // Put pika at starting position
        for (x of snakeArray) {
            cells[x].classList.add('pika')
        }


    }
    // Generate the grid
    createGrid(pikaPosition)

    // Put initial berry on grid
    cells[berryPosition].classList.add('berry')

    function updateDirection(event) {

        // Update based on event

        previousDirection = currentDirection
        currentDirection = event.keyCode

        // Depending on combination of events figure out final direction to take

        if (previousDirection == 39 && currentDirection == 37) { //was going right and decided to go left, still go right
            currentDirection = 39
        } else if (previousDirection == 37 && currentDirection == 39) { //was going left and decided to go right, still go left
            currentDirection = 37
        } else if (previousDirection == 38 && currentDirection == 40) { //was going up and decided to go down, still go up
            currentDirection = 38
        } else if (previousDirection == 40 && currentDirection == 38) { //was going down and decided to go up, still go down
            currentDirection = 40
        }

    }







    // Starts with the initial position

    //This is the latest position of the snake to be rendered
    let renderArray = snakeArray.slice(-snakeLength)



    // This function determines which is the position to fill in next
    function updatePosition() {

        // These are the boundaries of the grid      
        const x = pikaPosition % width // if the remainder of modulus is greater than zero then it's gone beyond the width
        const y = Math.floor(pikaPosition / width) // if the 


        if (currentDirection == 39 && x < width - 1 && !renderArray.includes(pikaPosition + 1)) { // Going 
            pikaPosition++
        } else if (currentDirection == 37 && x > 0 && !renderArray.includes(pikaPosition - 1)) { // Going left 
            pikaPosition--
        } else if (currentDirection == 38 && y > 0 && !renderArray.includes(pikaPosition - width)) { // Going up 
            pikaPosition -= width
        } else if (currentDirection == 40 && y < width - 1 && !renderArray.includes(pikaPosition + width)) { // Going down 
            pikaPosition += width

        } else {
            gridWrapper.setAttribute('style', 'z-index: 1')
            end.setAttribute('style', 'z-index: 30')
                // alert('You\'ve gone outside the board!')
            pikaPosition = -1
        }

    }




    // When the snake eats a berry, increase its size
    function eatBerries() {
        if (pikaPosition == berryPosition) {
            cells[berryPosition].classList.remove('berry')
            snakeLength++ // Increase the snake length by 1
            berriesEaten++
            score.textContent = berriesEaten * 10
        }
    }

    // Prep for checkBerries
    let numberOfBerries = 0
    const add = (a, b) => a + b


    // Every time, check whether there are any berries on the grid
    function checkBerries() {

        let berryCheck = []
            // First check if there is any berry displayed at that point in time (i.e. in case it's been just eaten)
        for (cell of cells) { // Check every single cell

            // Append the TRUE/FALSE check as 1/0
            berryCheck.push(cell.classList.contains('berry') * 1)

        }

        // Sum the array to find out if there are any berries
        const numberOfBerries = berryCheck.reduce(add)

        return numberOfBerries
    }



    // Based on the latest pika position, should update the snake array
    function updateSnake() {

        // Every time pika moves, add that index to the snake array so that we keep the history of where it's been

        snakeArray.push(pikaPosition)
            // But then only render the last X cells according to the supposed snake size

        renderArray = snakeArray.slice(-snakeLength)

        // Then we'll iterate through only those to render pika
        for (x of snakeArray) {
            if (renderArray.includes(x)) {
                cells[x].classList.add('pika')
            } else {
                cells[x].classList.remove('pika')
            }

        }
    }




    // function moveSnake(event) {
    //     previousDirection = currentDirection
    //     currentDirection = event.keyCode
    // }


    // Check which cells are free
    function checkFree(renderArray) {
        let freeArray = []

        for (i = 0; i < cellCount; i++) { // for each of the original cells
            if (!renderArray.includes(i)) { //check if that cell has NOT been taken by the snake
                freeArray.push(i) // if it's free, then add it to freeArray
            }

        }
        return freeArray
    }



    // Every second that passes executes the function again
    // This does NOT depend on the event but is controlled by the direction


    // Start the timer 
    const berryTimer = setInterval(() => {
        if (numberOfBerries == 0 && currentDirection !== 0 && pikaPosition >= 0) { // If there's no berry displayed, start the timer 
            // Go and drop a berry somewhere random
            cells[berryPosition].classList.remove('berry')

            // Before randomly dropping a berry need to check which cells are free

            const freeArray = checkFree(renderArray)

            //From the cells that are free, pick one randomly
            berryPosition = freeArray[Math.floor(Math.random() * freeArray.length)]
                //Put the berry there
            cells[berryPosition].classList.add('berry')
        }
    }, 500)


    const timerId = setInterval(() => { // Start the timer
        if (currentDirection !== 0 && pikaPosition >= 0) {
            cells[pikaPosition].classList.remove('pika')
            updatePosition()
            eatBerries()
            updateSnake()
            numberOfBerries = checkBerries()
            if (checkFree(renderArray).length == 0) {
                alert('You WIN!!!')
            }

        }

    }, 200)


    // * Event listeners

    // This is how we listen to the keyboard
    // Whenever there's a click, start the timer 
    document.addEventListener('keyup', updateDirection)

}


window.addEventListener('DOMContentLoaded', init)


// Could think about getting the screen width/size and size the grid based on that to change the space the players would have to play with

// For snake we need to use timers because that decides the speed of the snake i.e. at each passing second 'light up' another cell continuing in the same direction as the last key pressed