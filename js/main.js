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
function Tetromino(blockArr, colorName, colorHex) {
  this.blocks = blockArr;
  this.color = new Object();
  this.color.name = colorName;
  this.color.hex = colorHex;
}

// Individual tetromino objects.
var iTet = new Tetromino([0x0F00, 0x2222, 0x00F0, 0x4444], 'cyan',   '#00cccc');
var jTet = new Tetromino([0x8E00, 0x6440, 0x0E20, 0x44C0], 'blue',   '#0000cc');
var lTet = new Tetromino([0x2E00, 0x4460, 0x0E80, 0xC440], 'orange', '#cc8400');
var oTet = new Tetromino([0xCC00, 0xCC00, 0xCC00, 0xCC00], 'yellow', '#cccc00');
var sTet = new Tetromino([0x6C00, 0x4620, 0x06C0, 0x8C40], 'green',  '#00cc00');
var tTet = new Tetromino([0x4E00, 0x4640, 0x0E40, 0x4C40], 'magenta','#cc00cc');
var zTet = new Tetromino([0x0C60, 0x4C80, 0xC600, 0x2640], 'red',    '#cc0000');

// Tetromino Array
var tetArr = [iTet, jTet, lTet, oTet, sTet, tTet, zTet];

// Random Tetromino Pice from array.
var nextPiece = tetArr[Math.floor(Math.random() * tetArr.length)];
// var nextPiece = tetArr[Math.round(Math.random(0, tetArr.length-1))];

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

//




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
  var blocks = tetromino.blocks[directionIndex];  // declaring blocks property to 'object' type.

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
    if (blocks & bit) {
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

// function occupiedCheck(tetromino, x, y, directionIndex) {
//
//   result = false // reseting the baseline result to false.
//
//   tetCellCheck(tetromino, x, y, directionIndex, function(x, y)){
//
//   }
// }



























//
