var X = 'X';
var O = 'O';
var BLANK = '';
var NO_WINNER = 'NO';
var winner;
var curPlayer;
var theBoard;
var moves;
var computer = BLANK;

var getImageForPlayer = function(player) {
  if (player === X) {
    return '<img src="img/bacon-x.png">';
  } else {
    return '<img src="img/egg-o.png">';
  }
}

var switchPlayer = function() {
  curPlayer = (curPlayer === X) ? O : X;
  if (curPlayer === X) {
    document.getElementById("bacon-turn").setAttribute("src", "./img/bacon_act.svg");
    document.getElementById("egg-turn").setAttribute("src", "./img/egg_in.svg");
    document.getElementById("up-arrow").setAttribute("class", "fa fa-caret-up");
    document.getElementById("left-arrow").setAttribute("class", "fa fa-caret-left");
    document.getElementById("down-arrow").setAttribute("class", "fa fa-caret-down inactive");
    document.getElementById("right-arrow").setAttribute("class", "fa fa-caret-right inactive");
  } else {
    document.getElementById("bacon-turn").setAttribute("src", "./img/bacon_in.svg");
    document.getElementById("egg-turn").setAttribute("src", "./img/egg_act.svg");
    document.getElementById("up-arrow").setAttribute("class", "fa fa-caret-up inactive");
    document.getElementById("left-arrow").setAttribute("class", "fa fa-caret-left inactive");
    document.getElementById("down-arrow").setAttribute("class", "fa fa-caret-down");
    document.getElementById("right-arrow").setAttribute("class", "fa fa-caret-right");

  }
};

var canMove = function(board, i, j) {
  if (board[i][j] === BLANK) {
    return true;
  } else {
    document.getElementById('curPlayer').innerHTML = 'Select a blank cell for ' + getImageForPlayer(curPlayer);
    return false;
  }
};

// State of the game: 1) board: 3x3 array, 2) current player
// Event listener: 1) Click on cell, 2) Click on reset button
//
// Reset: clear board, reset current player to X
//
// Click: find out which cell,
//        check if this move is possible,
//        fill in cell
//        decide if game has a winner,
//        update current player

var getPos = function(id) {
  var arr = id.split('_');

  return {
    i: parseInt(arr[1]),
    j: parseInt(arr[2])
  };
};

var isValidPos = function(i, j) {
  return i >= 0 && i <= 2 && j >= 0 && j <= 2;
};

var hasWonDirection = function(board, player, i, j, iDelta, jDelta) {
  var count = 0;

  for (var delta = -2; delta <= 2; delta++) {
    var x = i + iDelta * delta;
    var y = j + jDelta * delta;

    if (isValidPos(x, y) && board[x][y] === player) {
      count++;
    }
  }

  return count === 3;
};

var hasWon = function(board, player, i, j) {
  var directions = [
    [0, 1],  // row
    [1, 0],  // column
    [1, 1],  // backslash
    [1, -1]  // slash
  ];

  for (var k = 0; k < directions.length; k++) {
    var direction = directions[k];

    if (hasWonDirection(board, player, i, j, direction[0], direction[1])) {
      return true;
    }
  }

  return false;
};

var calculateScore = function(board, who, i, j, player) {
  var won = hasWon(board, who, i, j);
  if (won && who === player) {
    return 10;
  } else if (won && who !== player) {
    return -10;
  } else {
    for (var k = 0; k < board.length; k++) {
      for (var l = 0; l < board[k].length; l++) {
        if (board[k][l] === BLANK) {
          return null;
        }
      }
    }
    return 0;
  }
};

var minimax = function(board, who, player) {
  var allPossibleMoves = [];
  var i;
  var j;
  var currentScore;
  var position;
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      if (board[i][j] === BLANK) {
        allPossibleMoves.push({ i: i, j: j });
      }
    }
  }

  var allPossibleScores = [];
  for (i = 0; i < allPossibleMoves.length; i++) {
    var currentMove = allPossibleMoves[i];
    board[currentMove.i][currentMove.j] = who;
    currentScore = calculateScore(board, who, currentMove.i, currentMove.j, player);
    if (currentScore === null) {
      var result = minimax(board, (who === X) ? O : X, player);
      currentScore = result.score;
    }
    board[currentMove.i][currentMove.j] = BLANK;
    allPossibleScores.push(currentScore);
  }

  if (who === curPlayer) {
    var maxScore = -100;

    for (i = 0; i < allPossibleMoves.length; i++) {
      currentScore = allPossibleScores[i];
      if (currentScore > maxScore) {
        maxScore = currentScore;
        position = allPossibleMoves[i];
      }
    }

    return { position: position, score: maxScore };
  } else {
    var minScore = 100;

    for (i = 0; i < allPossibleMoves.length; i++) {
      currentScore = allPossibleScores[i];
      if (currentScore < minScore) {
        minScore = currentScore;
        position = allPossibleMoves[i];
      }
    }

    return { position: position, score: minScore };
  }
};

var getComputerPos = function(board) {
  return minimax(board, curPlayer, curPlayer).position;

  /* randomly choose a position
  var values = [0,1,2,3,4,5,6,7,8];
  while (values.length > 0) {
    var index = Math.floor(Math.random() * values.length);
    var value = values[index];
    var x = Math.floor(value / 3);
    var y = value % 3;
    if (board[x][y] === BLANK) {
      return {
        i: x,
        j: y
      };
    }

    values.splice(index, 1);
  }
//???why return i:0 j:0
  return {
    i: 0,
    j: 0
  };
  */
};

var makeComputerMove = function() {
  setTimeout(function() { 
    if (winner !== BLANK) {
      return;
    }

    if (curPlayer !== computer) {
      return;
    }

    var pos = getComputerPos(theBoard);

    // eslint-disable-next-line no-use-before-define
    makeMove(pos.i, pos.j, theBoard);
  }, 700);
};

var makeMove = function(i, j, board) {
  if (!canMove(board, i, j)) {
    return;
  }

  moves++;
  board[i][j] = curPlayer;
  var element = document.getElementById('a_' + i + '_' + j);
  //element.textContent = curPlayer;
  element.className = 'cell cell' + curPlayer;

  if (hasWon(board, curPlayer, i, j)) {
    winner = curPlayer;
    document.getElementById("ding").play();
    setTimeout(function() { 
      document.getElementById('menu').style.visibility = 'visible';
      document.getElementById('overlays').style.visibility = 'visible';
      document.getElementById('controls').style.visibility = 'hidden';
    }, 1500);
    if (winner === O) {
      document.getElementById('curPlayer').innerHTML = 'Eggcellent!';
      document.getElementById('userInfo').innerHTML = '<strong>Egg wins!</strong> Play again?';
    } else {
      document.getElementById('curPlayer').innerHTML = "Ssssmokin'!";
      document.getElementById('userInfo').innerHTML = '<strong>Bacon wins!</strong> Play again?';
    }
    return;
  } else if (moves === 9) {
    winner = NO_WINNER;
    document.getElementById('menu').style.visibility = 'visible';
    document.getElementById('overlays').style.visibility = 'visible';
    document.getElementById('controls').style.visibility = 'hidden';
    document.getElementById('curPlayer').innerHTML = 'Nice fry.';
    document.getElementById('userInfo').innerHTML = "<strong>It's a draw!</strong> Play again?";
    return;
  } else {
    document.getElementById("sizzle").play();
  }

  switchPlayer();

  makeComputerMove();
};

var onCellClick = function() {
  // console.log("click cell " + this.id);
  if (winner !== BLANK) {
    return;
  }

  var pos = getPos(this.id);

  makeMove(pos.i, pos.j, theBoard);
};

var onGameTypeClick = function() {
  onResetClick();
  document.getElementById('menu').style.visibility = 'hidden';
  document.getElementById('overlays').style.visibility = 'hidden';
  document.getElementById('controls').style.visibility = 'visible';
  // console.log(this.id);
  computer = this.id.substring(2);
  // console.log(computer);
  makeComputerMove();
};

var init = function() {
  var i;
  var cells = document.getElementsByClassName('cell');
  // console.log(cells);
  for (i = 0; i < cells.length; i++) {
    // console.log("add click cell " + cells[i].id);
    cells[i].addEventListener('click', onCellClick);
  }

  var gameTypes = document.getElementsByClassName('gameType');
  // console.log(cells);
  for (i = 0; i < gameTypes.length; i++) {
    // console.log("add click cell " + cells[i].id);
    gameTypes[i].addEventListener('click', onGameTypeClick);
  }
};

var onResetClick = function() {
  winner = BLANK;
  curPlayer = O;
  moves = 0;
  theBoard = [
    [BLANK, BLANK, BLANK],
    [BLANK, BLANK, BLANK],
    [BLANK, BLANK, BLANK]
  ];

  var cells = document.getElementsByClassName('cell');
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerHTML = BLANK;
    cells[i].className = 'cell';
  }

  switchPlayer();
  makeComputerMove();
};

var onMenuClick = function() {
  document.getElementById('menu').style.visibility = 'visible';
  document.getElementById('overlays').style.visibility = 'visible';
  console.log("holla");
};

document.getElementById('reset').addEventListener('click', onResetClick);
document.getElementById('menu-btn').addEventListener('click', onMenuClick);
init();
onResetClick();
