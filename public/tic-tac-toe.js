// Your code here
let squares = [['', '', '']
                ,['', '', '']
                ,['', '', '']];
let currentPlayer = 'X';
let winnerCandidate = '';

window.addEventListener('DOMContentLoaded', event => {

    // check LocalStorage
    savedGame();

    localStorage.setItem('player', currentPlayer); // localStorage

    // game play
    const padElement = document.getElementById('ttt-pad');
    const clickSquare = gameClickSquare();
    padElement.addEventListener('click', clickSquare);

    // new game button
    const newGameButton = document.getElementById('new-game-button');
    const clickNewGame = event => {
        localStorage.clear();
        window.location.reload();
    }
    newGameButton.addEventListener('click', clickNewGame);

    // give up button
    const giveUPButton = document.getElementById('give-up-button');
    const clickGiveUp = giveUpClick(clickSquare, newGameButton, padElement);
    giveUPButton.addEventListener('click', clickGiveUp);

});


function checkWin(squares, row, col) {
    if (squares[row][0] === squares[row][1] && squares[row][0] === squares[row][2]) {
        return true;
    }
    if (squares[0][col] === squares[1][col] && squares[0][col] === squares[2][col]) {
        return true;
    }
    if (row === col) {
        if (squares[0][0] === squares[1][1] && squares[0][0] === squares[2][2]) {
            return true;
        }
    }
    if (Number(row) + Number(col) === 2) {
        if (squares[0][2] === squares[1][1] && squares[0][2] === squares[2][0]) {
            return true;
        }
    }

    return false;
}

function checkTie(squares) {
    for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
            if (squares[i][j] === '') {
                return false
            }
        }
    }
    return true;
}


function gameClickSquare() {

    const clickSquare = event => {
        if (event.target.tagName === 'IMG') {
            return
        }
        const curRow = event.target.dataset.row;
        const curCol = event.target.dataset.col;
        if (squares[curRow][curCol] !== '') {
            return
        }

        const imgElement = document.createElement('img');
        if (currentPlayer === 'X') {
            squares[curRow][curCol] = 'X';
            imgElement.setAttribute("src", "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg");
            currentPlayer = 'O';
            winnerCandidate = 'X';

            localStorage.setItem('player', currentPlayer); // localStorage
        } else {
            squares[curRow][curCol] = 'O';
            imgElement.setAttribute('src', "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg");
            currentPlayer = 'X';
            winnerCandidate = 'O';

            localStorage.setItem('player', currentPlayer); // localStorage
        }
        event.target.appendChild(imgElement);
        localStorage.setItem('grid', JSON.stringify(squares));   // localStorage

        if (checkWin(squares, curRow, curCol)) {
            const h1Element = document.getElementById('game-result');
            h1Element.innerText = `Winner: ${winnerCandidate}`;
            localStorage.setItem('result', h1Element.innerHTML); // localStorage

            const newGameButton = document.getElementById('new-game-button');
            newGameButton.disabled = false;
            localStorage.setItem('newGameButton', 'false'); // localStorage

            const giveUPButton = document.getElementById('give-up-button');
            giveUPButton.disabled = true;
            localStorage.setItem('giveUPButton', 'true'); // localStorage

            event.currentTarget.removeEventListener('click', clickSquare);
        }

        if (checkTie(squares)) {
            const h1Element = document.getElementById('game-result');
            h1Element.innerText = 'Winner: None';
            localStorage.setItem('result', h1Element.innerHTML); // localStorage

            const newGameButton = document.getElementById('new-game-button');
            newGameButton.disabled = false;
            localStorage.setItem('newGameButton', 'false'); // localStorage

            const giveUPButton = document.getElementById('give-up-button');
            giveUPButton.disabled = true;
            localStorage.setItem('giveUPButton', 'true'); // localStorage

            event.currentTarget.removeEventListener('click', clickSquare);
        }

    }

    return clickSquare;
}


function giveUpClick(clickSquare, newGameButton, padElement) {

    const clickGiveUp = event => {
        const h1Element = document.getElementById('game-result');

        if (currentPlayer === 'X') {
            h1Element.innerText = 'Winner: O';
        } else {
            h1Element.innerText = 'Winner: X';
        }
        localStorage.setItem('result', h1Element.innerHTML); // localStorage

        event.target.disabled = true;
        localStorage.setItem('giveUPButton', 'true'); // localStorage

        newGameButton.disabled = false;
        localStorage.setItem('newGameButton', 'false'); // localStorage

        event.target.removeEventListener('click', clickGiveUp);
        padElement.removeEventListener('click', clickSquare);

    }

    return clickGiveUp;
}


function savedGame() {
    const savedPlayer = localStorage.getItem('player');
    if (savedPlayer) {
        currentPlayer = savedPlayer
    }
    const savedSquare = JSON.parse(localStorage.getItem('grid'));
    if (savedSquare) {

        for (let i = 0; i < 3; i += 1) {
            for (let j = 0; j < 3; j += 1) {
                const imgElement = document.createElement('img');
                const cell = document.getElementById(`square${i}${j}`);

                if (savedSquare[i][j] === 'X') {
                    squares[i][j] = 'X';
                    imgElement.setAttribute("src", "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg");
                    cell.appendChild(imgElement);
                } else if (savedSquare[i][j] === 'O') {
                    squares[i][j] = 'O';
                    imgElement.setAttribute('src', "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg");
                    cell.appendChild(imgElement);
                }
            }
        }
    }
    const result = localStorage.getItem('result');
    if (result) {
        document.getElementById('game-result').innerHTML = result;
    }

    const savedNewGameButton = localStorage.getItem('newGameButton');
    const savedGiveUpButton = localStorage.getItem('giveUPButton');


    if (savedNewGameButton === null) {
        document.getElementById('new-game-button').disabled = true;
    } else {
        document.getElementById('new-game-button').disabled = ('true' === savedNewGameButton);
    }

    if (savedGiveUpButton === null) {
        document.getElementById('give-up-button').disabled = false;
    } else {
        document.getElementById('give-up-button').disabled = ('true' === savedGiveUpButton);
    }
}
