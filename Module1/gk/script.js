
var movesNum; 
var movescell = document.getElementById("movesnum"); 
var tile1 = document.getElementsByClassName("Tile Tile1")[0];
var tile2 = document.getElementsByClassName("Tile Tile2")[0];
var tile3 = document.getElementsByClassName("Tile Tile3")[0];
var tile4 = document.getElementsByClassName("Tile Tile4")[0];
var tile5 = document.getElementsByClassName("Tile Tile5")[0];
var tile6 = document.getElementsByClassName("Tile Tile6")[0];
var tile7 = document.getElementsByClassName("Tile Tile7")[0];
var tile8 = document.getElementsByClassName("Tile Tile8")[0];

var emptyRow, emptyCol;

var randomizePuzzle = function() {
  movesNum = 0;
  movescell.innerHTML = movesNum; 
  [emptyRow, emptyCol] = [2, 2]; 
  var positions = [ [1,1], [1,2], [1,3], [2,1], [2,3], [3,1], [3,2], [3,3] ]; 
  var tiles = [tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8];
  for (let i=7; i>=0; i--) {
    let r = Math.round(Math.random() * i); 
    let poppedPos = positions.splice(r, 1); 
    tiles[i].style.gridRow = poppedPos[0][0];
    tiles[i].style.gridColumn = poppedPos[0][1];
  }
}

var solvePuzzle = function() {
  movesNum = 0;
  movescell.innerHTML = movesNum; 
  [emptyRow, emptyCol] = [3, 2];
  tile1.style.gridRow = 1;
  tile1.style.gridColumn = 1;
  tile2.style.gridRow = 1;
  tile2.style.gridColumn = 2;
  tile3.style.gridRow = 1;
  tile3.style.gridColumn = 3;
  tile4.style.gridRow = 2;
  tile4.style.gridColumn = 1;
  tile5.style.gridRow = 2;
  tile5.style.gridColumn = 2;
  tile6.style.gridRow = 2;
  tile6.style.gridColumn = 3;
  tile7.style.gridRow = 3;
  tile7.style.gridColumn = 1;
  tile8.style.gridRow = 3;
  tile8.style.gridColumn = 3;
}


var moveTile = function() {
  thisRow = this.style.gridRow.charAt(0);
  thisCol = this.style.gridColumn.charAt(0);
  
  if (emptyRow == thisRow) {
    if (parseInt(thisCol)+1 == emptyCol || parseInt(thisCol)-1 == emptyCol) {
      let tmpCol = thisCol; 
      this.style.gridColumn = emptyCol.toString(); 
      emptyCol = tmpCol;
      movesNum++;
    }
  } else if (emptyCol == thisCol) {
    if (parseInt(thisRow)+1 == emptyRow || parseInt(thisRow)-1 == emptyRow) {
      let tmpRow = thisRow; 
      this.style.gridRow = emptyRow.toString(); 
      emptyRow = tmpRow;
      movesNum++;
    }
  }
  movescell.innerHTML = movesNum; 
}

tile1.onclick = moveTile;
tile2.onclick = moveTile;
tile3.onclick = moveTile;
tile4.onclick = moveTile;
tile5.onclick = moveTile;
tile6.onclick = moveTile;
tile7.onclick = moveTile;
tile8.addEventListener("click", moveTile); 

document.getElementById("newgame").onclick = randomizePuzzle;
document.getElementById("solveit").onclick = solvePuzzle;

randomizePuzzle();
