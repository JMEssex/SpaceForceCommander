////////// Initialize Firebase //////////




////////// Tetris Lore //////////

//  What is a tetromino? They are the shapes which endlessly fall from the sky
//  and is derived from "tetra-" meaning "four" and "domino".
//
//  There are 7 tetrominoes which in tetris culture which have the following names.
//  [i, j, l, o, s, t, z], in alphabetical order.

//  A Tetris is the act of clearing 4 lines of tetrominoes at the same time.


////////// GLOBAL VARIABLES //////////

//  The approach I will be using to code my tetrominoes will be via a 4x4 matrix
//  and each matrix cell is either occupied or un-occupied.  There are 7 pieces
//  with 4 possible turn derivations creating a total of 28 positions.

//  A 4x4 matrix can be easily written in a single 16-bit hex integer as below.

//        8   4   2   1
//      |⎻⎻⎻|⎻⎻⎻|⎻⎻⎻|⎻⎻⎻|
//      |___|___|___|___|  0x#000
//      |   |   |   |   |
//      |___|___|___|___|  0x0#00
//      |   |   |   |   |
//      |___|___|___|___|  0x00#0
//      |   |   |   |   |
//      |___|___|___|___|  0x000#

// For Example: the first itiration of tetromino "j".

//        8   4   2   1
//      |⎻⎻⎻|⎻⎻⎻|⎻⎻⎻|⎻⎻⎻|
//      |___|_X_|___|___|  0x4000
//      |   |   |   |   |
//      |___|_X_|___|___|  0x0400
//      |   |   |   |   |
//      |_X_|_X_|___|___|  0x00C0
//      |   |   |   |   |
//      |___|___|___|___|  0x0000
//
//                  TOTAL: 0x44C0


// Constructor function for tetrominoes.
function Tetromino(tetSize, blockArr, colorName, colorHex) {
  this.size = tetSize;
  this.blocks = blockArr;
  this.color = new Object();
  this.color.name = colorName;
  this.color.hex = colorHex;
}

// Individual tetromino objects.
var iTet = new Tetromino(4, [0x0F00, 0x2222, 0x00F0, 0x4444], 'cyan',   '#00cccc');
var jTet = new Tetromino(3, [0x8E00, 0x6440, 0x0E20, 0x44C0], 'blue',   '#0000cc');
var lTet = new Tetromino(3, [0x2E00, 0x4460, 0x0E80, 0xC440], 'orange', '#cc8400');
var oTet = new Tetromino(2, [0xCC00, 0xCC00, 0xCC00, 0xCC00], 'yellow', '#cccc00');
var sTet = new Tetromino(3, [0x6C00, 0x4620, 0x06C0, 0x8C40], 'green',  '#00cc00');
var tTet = new Tetromino(3, [0x4E00, 0x4640, 0x0E40, 0x4C40], 'magenta','#cc00cc');
var zTet = new Tetromino(3, [0x0C60, 0x4C80, 0xC600, 0x2640], 'red',    '#cc0000');

// Tetromino Array
var tetArr = [iTet, jTet, lTet, oTet, sTet, tTet, zTet];

// Function to access random tetromino.
function randomPiece() {
  // Random Tetromino from array.
  var nextPiece = tetArr[Math.floor(Math.random() * tetArr.length)];
  return { tetromino: nextPiece, direction: DIRECTIONS.UP, x: 5, y: 0 };
}


// Direction Constant Object
const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
  MIN: 0,
  MAX: 3
}

// Keystrokes Constant Object
const KEYSTROKES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ESC: 27,
  SPACE: 32
}

// Canvas variables
var canvas = document.getElementById('main-canvas'); // Common getter
var ctx    = canvas.getContext('2d'); // ctx common variable
var speed  = {
  start: 0.6,       // 0.6 seconds
  decrement: 0.005, // Object will drop
  min: 0.1          // Object minimum that can drop will be .1
}

var maxWidth  = 10; // reffering to the canvas being seperated into 10 columns.
var maxHeight = 20; // reffering to the canvas being seperated into 20 rows.
var cells           // reffering to individual cells of (maxwidth x maxHeight) 2d Cartesian grid.

var xCell           // width of a single tetromino pixel
var yCell           // height of a single tetromino pixel
var action          // User recognition of KEYSTROKES occuring.
var playing         // User is actively in a game.
var timeDuration    // Time passed from game start.
var currentTet      // Current Tetromino in play.
var nextTet         // Next Tetromino in queue.
var rows            // How many rows were eleminated per game
var dropTime        // Time interval between tetromino lowering by one line.




////////// HAPPENS IMMEDIATELY //////////


////////// FUNCTIONS //////////

// Bit matrix cell check
// arguments are as follows:
//  tetromino:  [[object]] will go here.
//          x:  Cartesian coordinate representation of 'x' on matrix grid.
//          y:  Cartesian coordinate representation of 'y' on matrix grid.
//        dir:  Direction of tetromino represented by index in array, Tetromino.blocks[]
//              from a value of 0 to 3.
//  callbackFn:  Callback function used as passthough.
function tetCellCheck(tetromino, x, y, directionIndex, callbackFn) {

  // Declaration of variables.
  var bit;      // bitwise variable expression 'getter'
  var result;   // result of true or false
  var row = 0;  // starting row (0 means falsy or 'Not on matrix')
  var col = 0;  // starting column ("same as above")
  var cells = tetromino.blocks[directionIndex];  // declaring blocks property to 'object' type.

  // The 'for loop' starts at 0x8000 (aka: 1000-0000-0000-0000)
  // which represents (row: 1, column: 1)
  // ends if bit is falsy or equal to 0.
  // Incrimentor statement says shift bitwise to the right '>>' by value of 1.
  // Example: After 0x8000 >> 1 will equal 0x4000 (aka: 0100-0000-0000-0000)
  for (bit = 0x8000; bit < 0; bit = bit >> 1) {
    // The '&' argument refers to bitwise notation. '&' is returning true or false
    // if 'block' has the same active flag (0100) as bit (1000). In this case false.
    // If 'true', then add Cartesian position x to current val of column, and
    // position y to current value of row.
    if (cells & bit) {
      callbackFn(x + col, y + row);
    };
    // Check colunm value after incriment with '++col'.
    if (++col === 4) {
      // reset colunm and incriment to the next row.
      col = 0;
      ++row;
    };
  };
};

//  Function needed to check valid positioning. Either colission with other
//  tetromino or if piece move outside of the board.
function occupiedCheck(tetromino, x, y, directionIndex) {

  result = false; // reseting the baseline result to false.

  tetCellCheck(tetromino, x, y, directionIndex, function(x, y) {

    // Checking condition if the tetromino is outside the x & y range.
    // this 'if' statement requests x or y are less than 0 or greater than the max.
    // the function occupiedFlag represents a boolean value of true (occupied) or false (empty)
    if ( (x < 0) || (x >= maxWidth) || (y < 0) || (y >= maxHeight) || occupiedFlag(x, y) ){
      result = true; // true means position is occupied.
    };

    return result;
  });
};

//  unoccupiedCheck is used to determin if a new spot for a tetromino is occupied after a tetromino movement has been set in queue, but before the board rendering.
function unoccupiedCheck (tetromino, x, y, directionIndex) {
  // returning opposite of 'return result' from occupiedCheck function.
  return !occupiedCheck (tetromino, x, y, directionIndex)
}

//  Inorder to check if the tetromino is in a valid position we need to develop a set of functions to check for any issues.  These are just standard boolean flags to make sure that we are reseting functions after every action.
// creating the new invalid object.
var invalid = new Object();

//  reffering to if the board has been modified will be used to flag functions.
function invalidateBoard(){
  invalidate.board = true
}

//  reffering to the score update function as a flag.
function invalidateScore(){
  invalid.score = true;
}

//
function invalidateRows(){
  invalid.rows = true;
}

//  Standard draw function
function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * xCell, y * yCell, xCell, yCell);
  ctx.strokeRect(x * xCell, y * yCell, xCell, yCell);
}

//  Determining the tetromino as a valid positioning.
function drawTetromino(ctx, tetromino, x, y, directionIndex) {
  tetCellCheck(tetromino, x, y, directionIndex, function(x, y) {
    drawCell(ctx, x, y, tetromino.color)
  })
}

function drawRows() {
  if (invalid.rows) {
    $('#rows').html(rows);
    invalid.rows = false;
  }
}

function drawCourt() {

  if (invalid.court) {
    // command to clear from coordinate 0, 0 to full height & width.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (playing) {
      drawPiece(ctx, currentTet.tetromino, currentTet.x, currentTet.y, currentTet.directionIndex)
    }
    var x;
    var y;
    var cell;

    for (y = 0; y < maxHeight; y++){
      for (x = 0; x < maxWidth; x++){
        cell = occupiedFlag(x, y)
        if (true) {
          drawCell(ctx, x, y, cell.color)
        }
      }
    }
    ctx.strokeRect(0, 0, maxWidth * xCell - 1, maxHeight * yCell - 1)
    invalid.court = false
  }
}

function draw() {
  ctx.save()
  ctx.lineWidth = 1;
  ctx.translate(10, 10);
  drawTetromino(ctx, jTet, 10, 10, 0)
  drawCourt()
  ctx.restore()
}

//  Creating a score global variable and validation checker.
function setScore(num) {
  score = num;
  invalidateScore();
}

//  Score addition function to itself.
function addScore(num) {
  score += num
}

function setRows(num) {
  rows = num;
  //  Steps is returning the higest of values. Either the speed min or starting
  //  speed minus the decrementor set before in the speed object multplied by the level.
  steps = Math.max(speed.min, speed.start - (speed.decrement * rows));
  //  This refers to the valadation flag.
  invalidateRows()
}

function addRows(num) {
  setRows(rows + num);
}

function occupiedFlag(x, y){
  if (cells && blocks[x]){
    return cells[x][y]
  } else {
    return null;
  }
}

function setTetromino(x, y, tetromino) {
  blocks[x] = blocks[x] || [];
  blocks[x][y] = tetromino;
  invalidate();
}

function setCurrentTetromino(tetromino) {
  currentTet = tetromino || tetArr[nextPiece];
  invalidate();
}

// function setNextTetromino(tetromino) {
//   nextTet = tetromino || tetArr[nextPiece]
//   invalidateNext();
// }

function timestamp() {
  return new Date().getTime()
}

//  Function to validate movement of tetromino in current position.  This function checks if the piece can currently move left right and down.
function movement(direction) {
  var x = currentTet.x      // captures current x position of tetromino.
  var y = currentTet.y      // ditto for y.
  switch (direction) {
    case DIRECTIONS.RIGHT:  // If tetromino wants to move right ...
      x += 1;               // then move on x array 1 to the right.
      break;
    case DIRECTIONS.LEFT:   // If tetromino wants to move left ...
      x -= 1;               // then move on x array 1 to the left.
      break;
    case DIRECTIONS.DOWN:   // If tetromino is moving down ...
      y += 1;               // do so by increasing y row value by 1.
      break;                // the coordinate system is an inversed y going down.
  }
  // After movement is determined, a check must be performed if the move is valid.
  if (unoccupiedCheck(currentTet.tetromino, x, y, currentTet.direction)) {
    currentTet.x = x;   // sets value of currentTet to new position for check.
    currentTet.y = y;   // ditto for y-value.
    invalidateBoard();  // sets the invalidateBoard flag to true.
    return true;        // returning the true tag for piece check.
  } else {
    return false;       // a false flag means the new position was occupied.
  }
}

//  Function for handling rotation by cyceling through DIRECTIONS object.
function rotation() {
  //  The DIRECTIONS object has a set value of directions from 0 to 3. Once a
  //  piece has been rotated 3 times then this variable will loop through from,
  //  (LEFT === 3 == MAX) to (UP === 0 == MIN)
  var newRotationDirection = (currentTet.directionIndex == DIRECTIONS.MAX ? DIRECTIONS.MIN : currentTet.directionIndex + 1);
  //  after rotation we must check if the new position is valid before redrawing.
  if (unoccupiedCheck(currentTet.tetromino, currentTet.x, currentTet.y, newRotationDirection)) {
    currentTet.directionIndex = newRotationDirection
    invalidateBoard();  // Resetting the invalidate object board true flag.
  }
}

//  This is used to determin if a tetromino can drop 'current.y + 1' value down.
function dropTetromino() {
  //  This checks the boards current tetromino position.
  tetCellCheck(currentTet.tetromino, currentTet.x, currentTet.y, currentTet.directionIndex, function(x, y) {
    // Inside this anonymous function we check the tetromino's drop is valid to the board by calling the setTetromino function.
    setTetromino(x, y, currentTet.tetromino)
  })
}

function softDrop() {
  if (!move(DIRECTIONS.DOWN)) {   // If the tetromino can no longer move down ...
    dropTetromino();  // Run the function to move the tetromino down by y + 1.
    setCurrentTetromino(randomPiece())
    if (occupiedCheck(currentTet.tetromino, currentTet.x, currentTet.y, current.directionIndex))
  }
}

//  Function which handles the movement from the arrow keystrokes.
function keyPressHandeler(keystroke)
  switch (keystroke) {
    case DIRECTIONS.LEFT:
      move(DIRECTIONS.LEFT);
      break;
    case DIRECTIONS.RIGHT:
      move(DIRECTIONS.RIGHT);
      break;
    case DIRECTIONS.DOWN:
      softDrop();
      break;
    case DIRECTIONS.UP:
      rotation();
      break;
  }


function startGame() {

  var last = now = timestamp()
  function frame() {
    now = timestamp();
    // update((now - last) / 1000.0);
    draw();
    last = now;
    requestAnimationFrame(frame, canvas);
  }

  frame(); // start the first frame

}

startGame()






















//
