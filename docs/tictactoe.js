"use strict";

(() => {
  window.addEventListener("load", () => {
    // *****************************************************************************
    // #region Constants and Variables

    // Canvas references
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // UI references
    const restartButton = document.querySelector("#restart");
    const xButton = document.querySelector("#btn-X");
    const oButton = document.querySelector("#btn-O");
    const playerScoreText = document.querySelector("#player-symbol");
    const messageText = document.querySelector("#message");

    // Constants
    const CELLS_PER_AXIS = 3;
    const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
    const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;

    // Game objects
    let currentPlayerSymbol = "";
    let isGameStarted = false;
    let grids;

    // #endregion

    // *****************************************************************************
    // #region Game Logic

    // 1. Game initialization function
    function startGame() {
      grids = Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill("");
      renderGrid();
      messageText.textContent = "";
    }

    // 2. Function to render the grid and update the canvas
    function renderGrid() {
      for (let i = 0; i < grids.length; i++) {
        const x = (i % CELLS_PER_AXIS) * CELL_WIDTH;
        const y = Math.floor(i / CELLS_PER_AXIS) * CELL_HEIGHT;
        ctx.clearRect(x, y, CELL_WIDTH, CELL_HEIGHT); // Clear the cell
        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, CELL_WIDTH, CELL_HEIGHT); // Draw the cell borders

        // If there's a symbol in the grid, draw it
        if (grids[i] !== "") {
          ctx.fillStyle = "white";
          ctx.font = "100px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(grids[i], x + CELL_WIDTH / 2, y + CELL_HEIGHT / 2);
        }
      }
    }

    // 3. Function to update the grid when a player clicks a cell
    function updateGridAt(x, y) {
      if (!isGameStarted) {
        alert("Please select your symbol (X or O) to start the game.");
        return;
      }
      const gridCoordinates = convertCartesiansToGrid(x, y);
      const index =
        gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column;

      // Only update if the clicked cell is empty
      if (grids[index] === "") {
        grids[index] = currentPlayerSymbol;
        renderGrid();
        if (checkForWin(currentPlayerSymbol)) {
          messageText.textContent = `Player ${currentPlayerSymbol} wins!`;
          isGameStarted = false; // Stop the game after winning
        } else {
          togglePlayer();
        }
      }
    }

    function togglePlayer() {
      currentPlayerSymbol = currentPlayerSymbol === "X" ? "O" : "X";
      playerSymbolText.textContent = currentPlayerSymbol; // Update displayed symbol
    }
    // 4. Function to restart the game and reset the grid and player symbol
    function restartGame() {
      currentPlayerSymbol = ""; // Reset to default symbol
      playerScoreText.textContent = ""; // Update UI
      isGameStarted = false;
      grids = Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill(""); // Reset grid
      renderGrid(); // Re-render the empty grid
      messageText.textContent = ""; 
    }

     // 5. Function to check for a winning condition
     function checkForWin(symbol) {
        // Check rows, columns, and diagonals for a win
        for (let i = 0; i < CELLS_PER_AXIS; i++) {
          // Check rows
          if (grids[i * CELLS_PER_AXIS] === symbol &&
              grids[i * CELLS_PER_AXIS + 1] === symbol &&
              grids[i * CELLS_PER_AXIS + 2] === symbol) {
            return true;
          }
  
          // Check columns
          if (grids[i] === symbol &&
              grids[i + CELLS_PER_AXIS] === symbol &&
              grids[i + 2 * CELLS_PER_AXIS] === symbol) {
            return true;
          }
        }
  
        // Check diagonals
        if (grids[0] === symbol && grids[4] === symbol && grids[8] === symbol) {
          return true;
        }
        if (grids[2] === symbol && grids[4] === symbol && grids[6] === symbol) {
          return true;
        }
  
        return false; // No win condition met
      }
    // #endregion

    // *****************************************************************************
    // #region Helper Functions

    // 1. Converts canvas coordinates to grid coordinates
    function convertCartesiansToGrid(xPos, yPos) {
      return {
        column: Math.floor(xPos / CELL_WIDTH),
        row: Math.floor(yPos / CELL_HEIGHT),
      };
    }

    // #endregion

    // *****************************************************************************
    // #region Event Listeners

    // 1. Handle clicks on the canvas to place symbols
    canvas.addEventListener("mousedown", (event) => {
      updateGridAt(event.offsetX, event.offsetY);
    });

    // 2. Handle symbol selection for player X
    xButton.addEventListener("click", () => {

      if (!isGameStarted) {
        currentPlayerSymbol = "X";
        playerScoreText.textContent = "X";
        isGameStarted = true; // Mark the game as started after symbol selection
      }
    });

    // 3. Handle symbol selection for player O
    oButton.addEventListener("click", () => {
        if (!isGameStarted) {
            currentPlayerSymbol = "O";
            playerScoreText.textContent = "O";
            isGameStarted = true; // Mark the game as started after symbol selection
          }
    });

    // 4. Handle the restart button to reset the game
    restartButton.addEventListener("click", restartGame);

    // Start the game initially
    startGame();

    // #endregion
  });
})();
