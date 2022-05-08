import React from "react"
import './App-styles.css'

function valid(board, row, col, val) {
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === val || board[row][i] === val) {
            return false;
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[parseInt(row / 3) * 3 + i][parseInt(col / 3) * 3 + j] === val) {
                return false;
            }
        }
    }
    return true;
}

function solveSudokuHelper(board, row, col) {
    if (col === 9) return solveSudokuHelper(board, row + 1, 0);
    if (row === 9) return true;
    if (board[row][col] !== null && board[row][col] !== 0) return solveSudokuHelper(board, row, col + 1);
    for (let i = 1; i <= 9; i++) {
        if (valid(board, row, col, i)) {
            board[row][col] = i;
            if (solveSudokuHelper(board, row, col + 1)) return true;
        }
    }
    board[row][col] = null;
    return false;
}

function solveSudoku(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let curVal = board[i][j];
            board[i][j] = null;
            if (curVal !== null && curVal !== 0 && !valid(board, i, j, curVal)) return false;
            board[i][j] = curVal;
        }
    }
    return solveSudokuHelper(board, 0, 0);
}


export default function App() {
    var temp = Array(9);
    for (let i = 0; i < 9; i++) {
        temp[i] = Array(9);
        for (let j = 0; j < 9; j++) {
            temp[i][j] = 0;
        }
    }

    const [submitted, setSubmitted] = React.useState(false);
    const [values, setValues] = React.useState(temp);

    function handleChange(e) {
        e.preventDefault();
        let row = parseInt(e.target.id / 9);
        let col = e.target.id % 9;
        function f(oldValues) {
            let newValues = Array(9);
            for (let i = 0; i < 9; i++) {
                newValues[i] = Array(9);
                for (let j = 0; j < 9; j++) {
                    newValues[i][j] = oldValues[i][j];
                }
            }
            newValues[row][col] = (isNaN(e.target.value) ? 0 : e.target.value % 10);
            return newValues;
        }
        setValues(f);
    }

    function handleSubmit() {
        setSubmitted(true);
    }

    var cells = Array(9);
    for (let i = 0; i < 9; i++) {
        cells[i] = Array(9);
    }
    
    function handleReset() {
        setSubmitted(false);
        let newValues = Array(9);
        for (let i = 0; i < 9; i++) {
            newValues[i] = Array(9);
            for (let j = 0; j < 9; j++) {
                newValues[i][j] = 0;
            }
        }
        setValues(newValues);
    }

    if (submitted) {
        var solved = Array(9);
        for (let i = 0; i < 9; i++) {
            solved[i] = Array(9);
            for (let j = 0; j < 9; j++) {
                solved[i][j] = values[i][j];
            }
        }
        let val = solveSudoku(solved);
        if (!val) {
            return (
                <div className="app">
                    <h1 className="title"> Invalid board</h1> 
                    <button className="reset" onClick={handleReset}> Reset </button>
                </div>
            )
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let color = (parseInt(i / 3) * 3 + parseInt(j / 3)) % 2 ? "rgb(215, 151, 113)" : "rgb(255, 235, 201)";
                cells[i][j] = <div className="result-cell" style = {{background: color}} > {solved[i][j]} </div>
            }
        }
        return (
            <div className="app">
                <h1 className="title"> Solved Board </h1>
                <div className = "result">
                    {cells}
                </div>
                <button className="reset" onClick={handleReset}> Reset </button>
            </div>

        );
    }


    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let color = (parseInt(i / 3) * 3 + parseInt(j / 3)) % 2 ? "rgb(215, 151, 113)" : "rgb(255, 235, 201)";
            cells[i][j] = <input min={0} max={10} className="cell" id = {i * 9 + j} value={values[i][j] ? values[i][j] : ""} onChange = {handleChange} style = {{background: color}} autoComplete="off" />
        }
    }
    


    return (
        <div className= "app">
            <h1 className="title"> Sudoku Solver </h1>
            <div className="board">
                {cells}
            </div>
            <button className = "submit" onClick={handleSubmit}> Solve </button>
        </div>
    );
}