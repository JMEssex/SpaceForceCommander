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
function Tetromino(blockArr, colorName, colorHex) = {
  this.blocks = blockArr;
  this.color.name = colorName;
  this.color.hex  = colorHex;
}

// Individual tetromino objects
var i = new Tetromino([0x0F00, 0x2222, 0x00F0, 0x4444], 'cyan',   '#00cccc');
var j = new Tetromino([0x8E00, 0x6440, 0x0E20, 0x44C0], 'blue',   '#0000cc');
var l = new Tetromino([0x2E00, 0x4460, 0x0E80, 0xC440], 'orange', '#cc8400');
var o = new Tetromino([0xCC00, 0xCC00, 0xCC00, 0xCC00], 'yellow', '#cccc00');
var s = new Tetromino([0x6C00, 0x4620, 0x06C0, 0x8C40], 'green',  '#00cc00');
var t = new Tetromino([0x4E00, 0x4640, 0x0E40, 0x4C40], 'magenta','#cc00cc');
var z = new Tetromino([0x0C60, 0x4C80, 0xC600, 0x2640], 'red',    '#cc0000');





////////// HAPPENS IMMEDIATELY //////////


////////// FUNCTIONS //////////
