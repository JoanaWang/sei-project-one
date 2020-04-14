/* eslint-disable no-unused-vars */
/* eslint-disable indent */
function init() {
    // * DOM Elements
    const grid = document.querySelector('.grid')
    const cells = []

    // * Grid variables
    const width = 10
    const cellCount = width * width

    // * Game variables
    let pikaPosition = 1 // Start in the first cell by default
    let currentDirection = 0 // This will store the direction last pressed based on the keyCode

    let currentLength = 1
    let berryPosition = 4

    let berriesEaten = 1 // This effectively is the size of the snake

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
            cell.textContent = i
            grid.appendChild(cell)
            cells.push(cell)
        }
        cells[startingPosition].classList.add('pika') // Put pika in the first cell
    }

    createGrid(pikaPosition) // Generate the grid

    // KEEP THIS TO USE LATER BUT NO BERRIES FOR NOW
    // cells[berryPosition].classList.add('berry')


    function updatePosition() { // This function determines which is the position to fill in next

        const x = pikaPosition % width // if the remainder of modulus is greater than zero then it's gone beyond the width
        const y = Math.floor(pikaPosition / width) // if the 

        if (currentDirection == 39 && x < width - 1) {
            pikaPosition++
            console.log('last pressed right', pikaPosition)
        } else if (currentDirection == 37 && x > 0) {
            pikaPosition--
            console.log('last pressed left', pikaPosition)
        } else if (currentDirection == 38 && y > 0) {
            pikaPosition -= width
            console.log('last pressed up', pikaPosition)
        } else if (currentDirection == 40 && y < width - 1) {
            pikaPosition += width
            console.log('last pressed left', pikaPosition)
        } else {
            pikaPosition = -1
            console.log('invalid')
        }

    }

    let snakeArray = []
        // This will contain the indeces of the cells where the snake is
    let snakeLength = 4 // This is the starting size of the snake, fixed for now
    let renderArray = []
    let removeArray = []


    function updateSnake() { // Based on the latest pika position, should update the snake array

        // Prepare the snake array and render at each of the cells


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
        // Remove pika from all previous cells
        // removeArray = snakeArray.slice(snakeLength)

        // for (x of removeArray) {
        //     cells[x].classList.remove('pika')
        // }
    }



    function randomBerries() {
        cells[berryPosition].classList.remove('berry')
        berryPosition = Math.floor(Math.random() * cellCount)
        cells[berryPosition].classList.add('berry')
    }


    function fillIn(event) {

        currentDirection = event.keyCode
    }


    // Every second that passes executes the function again
    // This does NOT depend on the event but is controlled by the direction

    const timerId = setInterval(() => { // Start the timer
        if (currentDirection !== 0 && pikaPosition >= 0) {
            cells[pikaPosition].classList.remove('pika')
            updatePosition()

            updateSnake()




            // // KEEP THIS BUT USE LATER WHEN INTRODUCING BERRIES
            // if (pikaPosition == berryPosition) {
            //     cells[berryPosition].classList.remove('berry')
            //     cells[pikaPosition].classList.add('pika')

            // } else {
            //     cells[pikaPosition].classList.add('pika')
            //}




        }

    }, 1000)


    // Every X seconds move the berry elsewhere
    // KEEP BUT DISABLE FOR NOW
    // const berryTimer = setInterval(() => {
    //     if (currentDirection !== 0 && pikaPosition >= 0)
    //         randomBerries()
    // }, 3000)



    // * Event listeners

    // This is how we listen to the keyboard
    // Whenever there's a click, start the timer 
    document.addEventListener('keyup', fillIn)

}


window.addEventListener('DOMContentLoaded', init)


// Could think about getting the screen width/size and size the grid based on that to change the space the players would have to play with

// For snake we need to use timers because that decides the speed of the snake i.e. at each passing second 'light up' another cell continuing in the same direction as the last key pressed