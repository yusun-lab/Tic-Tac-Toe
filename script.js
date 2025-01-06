const displayController = (() => {
    // Function to render a message to the DOM
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return {
        renderMessage,
    }
})();

const Gameboard = (() => {
    // Initialize an empty gameboard
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    // Function to render the gameboard to the DOM
    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        });
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        // Add click event listeners to each square
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        });
    }

    // Function to update the gameboard at a specific index
    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    // Function to get the current state of the gameboard
    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard
    }
})();

const createPlayer = (name, mark) => {
    // Factory function to create a player object
    return {
        name,
        mark
    };
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    // Function to start the game
    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll(".square");
        // Add click event listeners to each square
        squares.forEach((square) => {
            square.addEventListener("click", handleClick);
        });
    }

    // Function to handle a click on a gameboard square
    const handleClick = (event) => {
        if (gameOver) {
            return;
        }
        let index = parseInt(event.target.id.split("-")[1]);
        if (Gameboard.getGameboard()[index] !== "")
            return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkForWin(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins`);
        } else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage("It's a tie");
        }

        // Switch to the other player
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    // Function to restart the game
    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
        gameOver = false;
        document.querySelector("#message").innerHTML = "";
    }

    return {
        start,
        restart,
        handleClick
    }
})();

// Function to check if there is a winning combination on the board
function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Function to check if the game is a tie
function checkForTie(board) {
    return board.every(cell => cell !== "");
}

// Add event listener to the restart button
const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
});

// Add event listener to the start button
const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
    Game.start();
});