/* eslint-disable no-unused-vars */
/* eslint-disable indent */
function init() {


    // * DOM Elements
    const gridWrapper = document.querySelector('.grid-wrapper')
    const grid = document.querySelector('.grid')
    const cells = []
    const score = document.querySelector('#score')
    const end = document.querySelector('.game-over')
    const start = document.querySelector('.start')

    // * JS functions
    const add = (a, b) => a + b


    // This helps to check which cells are free
    function checkFree(renderArray) {
        let freeArray = []

        for (i = 0; i < cellCount; i++) { // for each of the original cells
            if (!renderArray.includes(i)) { //check if that cell has NOT been taken by the snake
                freeArray.push(i) // if it's free, then add it to freeArray
            }
        }
        return freeArray
    }

    // Need a time delay for splash screens
    function sleep(milliseconds) {
        const date = Date.now()
        let currentDate = null
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds)
    }


    // * Grid variables
    const width = 20
    const height = 10
    const cellCount = width * height

    // * Game variables
    let isPlaying = false // On/off switch for snake to move around
    let snakePosition = Math.floor(cellCount / 2) + 50 // Start in the middle of the grid by default, this is the position of the snake head
    let berryPosition = snakePosition + 5 // Place an initial berry close to the initial position
    let currentDirection = 39 // Store keyCode of last direction pressed
    let previousDirection = 0 // Store keyCode of before last direction pressed so we don't allow it to go back where it came from
    let snakeLength = 4 // Starting size of the snake
    let berriesEaten = 0 // Initial score
    let snakeArray = [] // Store the indices of all the cells where the snake has been to
    let renderArray = [] //This is the latest position of the snake to be rendered


    // * Prepare initial play

    // Create the grid and place snake and berry on grid
    function createGrid(startingPosition) {
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div')
                //cell.textContent = i
            grid.appendChild(cell)
            cells.push(cell)
        }

        // This is the initial position of the snake depending on the initial size
        for (i = snakeLength - 1; i >= 0; i--) {
            snakeArray.push(snakePosition - i)
        }

        // Render the snake at the initial position

        renderArray = snakeArray.slice(-snakeLength)

        for (x of renderArray) {
            cells[x].classList.add('snake')
        }
        cells[renderArray.slice(-1)].classList.add('snakeHead')

        // Put initial berry on grid
        cells[berryPosition].classList.add('berry')

        // Set initial score
        score.textContent = berriesEaten
    }

    // Generate the grid
    createGrid(snakePosition)


    // * Game functions

    // Upon starting the game when a key is pressed, hide the start splash screen and turn on isPlaying
    function startSplash(event) {
        // Upon starting the game, turn off the start splash screen
        start.setAttribute('style', 'z-index: 1')
        isPlaying = true
    }


    // Store the direction to go based on the keys pressed
    function updateDirection(event) {

        // Play sound every time key is pressed
        document.getElementById('turn').play()

        // Store the last 2 directions pressed
        previousDirection = currentDirection
        currentDirection = event.keyCode

        // Depending on combination of events figure out final direction to take
        if (previousDirection == 39 && currentDirection == 37) { //was going right and pressed left, still go right
            currentDirection = 39
        } else if (previousDirection == 37 && currentDirection == 39) { //was going left and pressed right, still go left
            currentDirection = 37
        } else if (previousDirection == 38 && currentDirection == 40) { //was going up and pressed down, still go up
            currentDirection = 38
        } else if (previousDirection == 40 && currentDirection == 38) { //was going down and pressed up, still go down
            currentDirection = 40
        }

    }


    // This function determines which is the position to fill in next
    function updatePosition() {

        // These are the boundaries of the grid      
        const x = snakePosition % width
        const y = Math.floor(snakePosition / width)

        // Move the position if it conforms to the following conditions:
        // 1) What is the direction it wants to go to next?
        // 2) Is it within the grid boundaries?
        // 3) Is that cell already taken by the snake (which is contained in renderArray)?
        if (currentDirection == 39 && x < width - 1 && !renderArray.includes(snakePosition + 1)) { // Go right
            snakePosition++
        } else if (currentDirection == 37 && x > 0 && !renderArray.includes(snakePosition - 1)) { // Go left 
            snakePosition--
        } else if (currentDirection == 38 && y > 0 && !renderArray.includes(snakePosition - width)) { // Go up 
            snakePosition -= width
        } else if (currentDirection == 40 && y < width - 1 && !renderArray.includes(snakePosition + width)) { // Go down 
            snakePosition += width
        } else { // Otherwise, end the game

            currentDirection = 0

            gridWrapper.setAttribute('style', 'z-index: 1') // Hide the grid
            end.setAttribute('style', 'z-index: 30') // Show the game over splash screen

            document.getElementById('end').play() // Play the game over sound
            sleep(3000)
                // Reload the page to start playing again
            window.location.reload()
        }

    }

    // Then based on the latest position, update the array that renders the snake
    function updateSnake() {

        // Every time the snake head moves, add that index to the snake array so that we keep the history of where it's been
        snakeArray.push(snakePosition)

        // But then only render the last X cells according to the latest snake size
        renderArray = snakeArray.slice(-snakeLength)

        // Depending on what direction the snake is going, rotate the head accordingly in preparation for rendering
        let headAngle = 0
        switch (currentDirection) {
            case 37:
                headAngle = 180
                break
            case 39:
                headAngle = 0
                break
            case 38:
                headAngle = 270
                break
            case 40:
                headAngle = 90
                break
        }

        // Then iterate through the cells that contain the snake in order to render them
        for (x of snakeArray) { // Check everywhere that the snake has been to
            if (renderArray.includes(x)) { // If it's currently part of the snake
                if (renderArray.indexOf(x) == renderArray.length - 1) { // If it's the head, i.e. the last cell in the array
                    cells[x].classList.remove('snake') // Stop rendering the body
                    cells[x].setAttribute('style', 'transform: rotate(' + headAngle + 'deg)') // Rotate the head
                    cells[x].classList.add('snakeHead') // Render the head after it's been rotated
                } else { // Otherwise, for the remaining cells just render the body
                    cells[x].classList.remove('snakeHead')
                    cells[x].classList.add('snake')
                }
            } else { // Otherwise, for all remaining locations stop rendering and rotate back to normal
                cells[x].classList.remove('snake')
                cells[x].classList.remove('snakeHead')
                cells[x].setAttribute('style', 'transform: rotate(0deg)')
            }
        }
    }


    // When the snake eats a berry, increase its size
    function eatBerries() {
        if (snakePosition == berryPosition) {
            cells[berryPosition].classList.remove('berry') // Stop rendering the berry at that position
            snakeLength++ // Increase the snake length by 1
            berriesEaten++ // Increate the score by 1
            score.textContent = berriesEaten * 10 // Update the score
            document.getElementById('eat').play() // Play the eat berry sound
        }
    }


    // The berries are dropped in randomly
    function randomBerries() {

        // If there is a berry elsewhere already, remove it first
        cells[berryPosition].classList.remove('berry')

        // Before dropping a berry need to check which cells are free so that it doesn't get placed on the snake itself
        const freeArray = checkFree(renderArray)

        //From the cells that are free, pick one randomly
        berryPosition = freeArray[Math.floor(Math.random() * freeArray.length)]

        //Put the berry there
        cells[berryPosition].classList.add('berry')
    }

    // Every time, check whether there are any berries on the grid
    // This is to force generating a new berry as soon as the existing one gets eaten
    function checkBerries() {

        let berryCheck = []

        // First check if there is any berry displayed at that point in time (i.e. in case it's been just eaten)
        for (cell of cells) { // Check every single cell

            // Append the TRUE/FALSE result as 1/0
            berryCheck.push(cell.classList.contains('berry') * 1)
        }

        // Sum the array to find out if there are any berries i.e. the sum is greater than 0
        return berryCheck.reduce(add)
    }


    // Start the timer for berries
    const berryTimer = setInterval(() => {
        if (checkBerries() == 0 && isPlaying == true) { // If there's no berry displayed, force to re-drop berries randomly
            randomBerries()
        }
    }, 100)

    // Start the timer for the snake

    const timerId = setInterval(() => {
        if (isPlaying == true && currentDirection != 0) { // Once the user presses the first key
            updatePosition() // Recalculate the snake's latest position
            eatBerries() // Check if it has eaten any berry
            updateSnake() // Update the snake based on eatBerries()
            if (checkFree(renderArray).length == 0) { // If there are no empty cells left then it means the player has reached the end of the game
                alert('You\'ve spent way too much time playing this!!!')
            }
        }
    }, 150)


    // * Event listeners

    // When a key is pressed, stop showing the start splash screen and start the game
    document.addEventListener('keydown', startSplash)

    // Every time a key is pressed, update the direction of the snake based on the keyCode
    document.addEventListener('keyup', updateDirection)

}

window.addEventListener('DOMContentLoaded', init)