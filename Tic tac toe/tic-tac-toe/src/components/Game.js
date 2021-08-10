import React, { Component } from 'react'
import Board from './Board';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xIsNext: true,
            stepNumber: 0,
            history: [
                { squares: Array(9).fill(null) }
            ]
        }
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2)===0
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = 'X';
        
        // let indexA = [];
        // current.squares.forEach(function(e, index) {
        //     if(e === null){
        //         indexA.push(index);
        //     }

        // });

        

        // indexA = indexA.filter(e => e !== i);


        let tempo_board = squares;
        tempo_board[i] = 'X';
        let bestMove;
        let bestScore = Infinity;
        for(let e = 0; e<tempo_board.length; e++){
            if(tempo_board[e] === null){
                tempo_board[e] = 'O';

                let score = AIMoveWithMinimax(tempo_board, 0 , false);
                tempo_board[e] = null;
                if(score < bestScore){
                    bestScore = score;
                    bestMove = e;
                }
            }
            
        }
        

        // let bestMove = randomAIMove(indexA);
        

        squares[bestMove] = 'O';
        this.setState({
            history: history.concat({
                squares: squares
            }),
            stepNumber: history.length
        });



    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to #' + move : 'Start the Game';
            return (
                <li key={move}>
                    <button onClick={() => { this.jumpTo(move) }}>
                        {desc}
                    </button>
                </li>
            )
        });
        let status;
        if (winner === 'X') {
            status = 'Winner is ' + winner;
        }
        else if(winner === 'O'){
            status = 'Winner is ' + winner;
        }
        else {
            status = 'Tied';
        }



        return (
            <div className="Game">
                <div className="game-board">
                    <Board onClick={(i) => this.handleClick(i)}
                        squares={current.squares} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ul>{moves}</ul>
                </div>

            </div>
        )
    }
}

let scores = {
    X: 1,
    O: -1,
    tied: 0
}


function randomAIMove(indexA){
    const randomPick = Math.floor(Math.random() * indexA.length);
    return indexA[randomPick];

}

function AIMoveWithMinimax(board, depth, isMaximizing){
    let winner = calculateWinner(board);
    if (winner !== null){
        return scores[winner];
    }

    if(isMaximizing){
        let bestScore = -Infinity;
        for(let e = 0; e < board.length ; e++){
            if (board[e] === null){
                board[e] = 'O';
                let score = AIMoveWithMinimax(board, depth + 1, false);
                board[e] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }
    else{
        let bestScore = Infinity;
        for(let e = 0; e < board.length ; e++){
            if (board[e] === null){
                board[e] = 'X';
                let score = AIMoveWithMinimax(board, depth + 1, true);
                board[e] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
    
}

function calculateWinner(squares) {
    let winner = null;
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] === squares[c] && squares[a] === squares[b] && squares[b] === squares[c]) {
            winner = squares[a];
        }
    }

    let openSpots = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] == null) {
        openSpots++;
      }
    }

    if (winner == null && openSpots == 0) {
        return 'tied';
    } else {
        return winner;
    }
}
