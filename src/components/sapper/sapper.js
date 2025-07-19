import { useEffect, useRef } from "react";
import style from "./sapper.module.css";
import gameOverSound from "../assets/audio/game-over.mp3";
import mineIcon from "../assets/images/mine.png";

function Sapper() {
  const boardRef = useRef(null);
  const dialogRef = useRef(null);
  const sizeRef = useRef(null);
  const mineRef = useRef(null);

useEffect(() => {
  document.title = "Сапёр";

  const oldLink = document.querySelector("link[rel='icon']");
  if (oldLink) document.head.removeChild(oldLink);

  const newLink = document.createElement("link");
  newLink.rel = "icon";
  newLink.type = "image/png";
  newLink.href = mineIcon;
  document.head.appendChild(newLink);

  return () => {
    document.head.removeChild(newLink);
  };
}, []);

  useEffect(() => {
    let boardSize = 10;
    let selectedAmountOfMines = 10;
    let grid = [];
    let isGameOver = false;
    let revealedCellsCount = 0;

    const board = boardRef.current;
    const dialog = dialogRef.current;

    function startGame() {
      isGameOver = false;
      revealedCellsCount = 0;
      grid = [];

      board.innerHTML = '';
      board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;

      createBoard();
      placeMines();
      calculateNeighbors();
    }

    function createBoard() {
      for (let row = 0; row < boardSize; row++) {
        const rowArr = [];
        for (let col = 0; col < boardSize; col++) {
          const cell = document.createElement("div");
          cell.classList.add(style.cell);

          const cellData = {
            element: cell,
            row,
            col,
            isMine: false,
            mineCount: 0,
            isRevealed: false,
            isFlagged: false,
          };

          cell.addEventListener("click", () => revealCell(cellData));
          cell.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            toggleFlag(cellData);
          });

          rowArr.push(cellData);
          board.appendChild(cell);
        }
        grid.push(rowArr);
      }
    }

    function placeMines() {
      let count = 0;
      while (count < selectedAmountOfMines) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!grid[row][col].isMine) {
          grid[row][col].isMine = true;
          count++;
        }
      }
    }

    function calculateNeighbors() {
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          const cellData = grid[row][col];
          if (cellData.isMine) continue;

          let count = 0;
          for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
              const newRow = row + r;
              const newCol = col + c;
              if (
                newRow >= 0 && newRow < boardSize &&
                newCol >= 0 && newCol < boardSize &&
                grid[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          cellData.mineCount = count;
        }
      }
    }

    function revealCell(cellData) {
      if (isGameOver || cellData.isRevealed) return;

      const cell = cellData.element;

      if (cellData.isFlagged) {
        cellData.isFlagged = false;
        cell.classList.remove(style.flagged);
      }

      cellData.isRevealed = true;
      revealedCellsCount++;
      cell.classList.add(style.revealed);

      if (cellData.isMine) {
        isGameOver = true;

        const explosionSound = new Audio(gameOverSound);
        explosionSound.volume = 0.2;
        explosionSound.currentTime = 0;
        explosionSound.play();

        revealAllMines();
        showDialog("Вы проиграли. Хотите сыграть ещё раз?");
        return;
      }

      if (cellData.mineCount > 0) {
        cell.textContent = cellData.mineCount;
      } else {
        revealNeighbors(cellData.row, cellData.col);
      }

      checkWin();
    }

    function revealAllMines() {
      grid.forEach(row => {
        row.forEach(cell => {
          if (cell.isMine) {
            cell.element.classList.add(style.revealed, style.mine);
          }
        });
      });
    }

    function revealNeighbors(row, col) {
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const nr = row + r;
          const nc = col + c;
          if (
            nr >= 0 && nr < boardSize &&
            nc >= 0 && nc < boardSize
          ) {
            const neighbor = grid[nr][nc];
            if (!neighbor.isRevealed && !neighbor.isMine) {
              revealCell(neighbor);
            }
          }
        }
      }
    }

    function toggleFlag(cellData) {
      if (isGameOver || cellData.isRevealed) return;
      cellData.isFlagged = !cellData.isFlagged;
      cellData.element.classList.toggle(style.flagged);
    }

    function checkWin() {
      if (revealedCellsCount === boardSize * boardSize - selectedAmountOfMines) {
        isGameOver = true;
        showDialog("Ура! Вы выиграли. Сыграем ещё?");
      }
    }

    function showDialog(message) {
      const p = dialog.querySelector("p");
      if (p) {
        p.textContent = message;
        dialog.showModal();
      }
    }

    // Кнопки
    const startButton = document.getElementById("startGame");
    const dialogButton = document.getElementById("dialogButton");

    startButton?.addEventListener("click", () => {
      boardSize = parseInt(sizeRef.current.value);
      selectedAmountOfMines = parseInt(mineRef.current.value);
      startGame();
    });

    dialogButton?.addEventListener("click", () => {
      dialog.close();
      startGame();
    });

    startGame();
  }, []);

  return (
    <div className={style.body_sapper}>
      <div className={style.control_panel}>
        <label>
          Размер доски:
          <input ref={sizeRef} type="number" id="boardSize" min="5" max="20" defaultValue="10" />
        </label>
        <label>
          Количество бомб:
          <input ref={mineRef} type="number" id="mineCount" min="1" max="50" defaultValue="10" />
        </label>
        <button className={style.sapper_button} id="startGame">Начать игру</button>
      </div>

      <dialog ref={dialogRef} id="dialog" className={style.sapper_dialog}>
        <p></p>
        <button className={style.sapper_button} id="dialogButton">OK</button>
      </dialog>

      <div ref={boardRef} id="board" className={style.board}></div>

    </div>
  );
}

export default Sapper;
