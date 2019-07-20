
"use strict";

//Protects the object so the constants values cannot be modified.
const CONSTANTS = Object.freeze({
    CANVAS_WIDTH      : 400,
    CANVAS_HEIGHT     : 505,
    GRID_CELL_WIDTH   : 101,
    GRID_CELL_HEIGHT  : 83,
    STONE_ROWS        : [63,146,229],     //MAKE SURE THESE ARE THE CORRECT POSITIONS Y FOR STONES ???????????????
    ENEMY_IMAGE_WIDTH : 100,               //MAKE SURE THIS IS THE CORRECT SIZE/LENGTH OF THE BUG ???????????????
    PLAYER_IMAGE_SIZE : 100
});

// Enemies our player mus.t avoid
//I will use ES6 classes
class Enemy {
  constructor(){
    //initial location will be specified as coordinates (X,Y)
    //X position will be initialized with a number between 0 and -200 so the whole enemy is behin the begining of the screen
    this.x = - Math.floor(Math.random() * 200);
    //There are 3 rows of stone (where the enemies should be placed) Y position will be initialized with a random value from one of the Stone-row positions
    this.y = CONSTANTS.STONE_ROWS[Math.floor(Math.random() * CONSTANTS.STONE_ROWS.length)];
    // Enemy's SPEED: will be a random speed between 50 and 650
    this.speed = Math.floor(Math.random() * 500 + 50);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
  }//end constructor

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      this.x += this.speed * dt;
      if(this.x > CONSTANTS.CANVAS_WIDTH + CONSTANTS.ENEMY_IMAGE_WIDTH){
        this.x = - Math.floor(Math.random() * 200);
      }
  }

  // Draw the enemy on the screen, required method for game
  render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}//end Enemy class

// how to position the rows and columns
// rows from 0 to 6
// col from 0 to 5
// ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player{
  constructor(){
      this.x = Math.floor(CONSTANTS.CANVAS_WIDTH / 2);
      this.y = Math.floor(CONSTANTS.CANVAS_HEIGHT - CONSTANTS.PLAYER_IMAGE_SIZE);
      // The image/sprite for our player, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/char-boy.png';
      this.collided = false;
  }//end constructor

  // Update the players's position, required method for game
  // Parameter: dt, a time delta between tick
  update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      // this.x += this.speed * dt;
      // if(this.x > CONSTANTS.CANVAS_WIDTH + CONSTANTS.ENEMY_IMAGE_WIDTH){
      //   this.x = - Math.floor(Math.random() * 200);
      }

  checkCollisions(){

  }

  // Draw the player on the screen, required method for game
  render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }


  handleInput(key){
    switch(key){
      case 'up' :
                  if(this.y - CONSTANTS.GRID_CELL_HEIGHT > - CONSTANTS.PLAYER_IMAGE_SIZE+10)
                    this.y -= CONSTANTS.GRID_CELL_HEIGHT;
                  break;
      case 'right' :
                  if(this.x + CONSTANTS.GRID_CELL_WIDTH < CONSTANTS.CANVAS_WIDTH+10 )
                    this.x += CONSTANTS.GRID_CELL_WIDTH;
                    break;
      case 'down' :
                  if(this.y + CONSTANTS.GRID_CELL_HEIGHT < CONSTANTS.CANVAS_HEIGHT - CONSTANTS.PLAYER_IMAGE_SIZE+10)
                    this.y += CONSTANTS.GRID_CELL_HEIGHT;
                    break;
      case 'left' :
                  if(this.x - CONSTANTS.GRID_CELL_WIDTH > - CONSTANTS.PLAYER_IMAGE_SIZE)
                    this.x -= CONSTANTS.GRID_CELL_WIDTH;
                    break;
    }
  }
  // console.log(this.x);
  // console.log(`${this.x + CONSTANTS.GRID_CELL_WIDTH} < ${CONSTANTS.CANVAS_WIDTH }`);

}//end Player class

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
// Place the player object in a variable called player
let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
