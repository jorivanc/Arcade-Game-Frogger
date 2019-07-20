
"use strict";

//Protected constants so values cannot be modified.
const CONSTANTS = Object.freeze({
    CANVAS_WIDTH      : 400,
    CANVAS_HEIGHT     : 505,
    GRID_CELL_WIDTH   : 101,
    GRID_CELL_HEIGHT  : 83,
    STONE_ROWS        : [63,146,229],
    STONE_COLUMNS     : [0,100,201,302,403],
    ENEMY_IMAGE_WIDTH : 100,
    PLAYER_IMAGE_SIZE : 100
});
//as the player passes more levels the difficulty (amount and speed of the enemies) will also be increase by the deltaDifficulty
let deltaDifficulty = 0;

// Enemies/Bugs our player must avoid
//I will use ES6 classes
class Enemy {
  constructor(){
    //initial location will be specified as coordinates (X,Y)
    //X position will be initialized with a number between 0 and -400 so the whole enemy is behin the begining of the screen
    this.x = - Math.floor(Math.random() * 400);
    //There are 3 rows of stone (where the enemies should be placed) Y position will be initialized with a random value from one of the Stone-row positions
    this.y = CONSTANTS.STONE_ROWS[Math.floor(Math.random() * CONSTANTS.STONE_ROWS.length)];
    // Enemy's SPEED: will be a random speed between 100 and a factor of the deltaDifficulty depending on how many levels the player has successfully passed
    this.speed = Math.floor(Math.random() * deltaDifficulty * 10 + 100);

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
        this.resetEnemy();
      }
  }

  //resets enemy's position (x,y) and speed in order to avoid patterns of movement (to make eneies movements less predictible)
  resetEnemy(){
    if((deltaDifficulty)%10===0){
      deltaDifficulty+=2;
      addNewEnemy();
      }
    this.x = - Math.floor(Math.random() * 200);
    this.y = CONSTANTS.STONE_ROWS[Math.floor(Math.random() * CONSTANTS.STONE_ROWS.length)];
    this.speed = Math.floor(Math.random() * deltaDifficulty * 10 + 100);
  }

  // Draw the enemy on the screen, required method for game
  render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}//end Enemy class


// bonus items the player should collect in order to increase his/her score or lives
// they will appear one at the time in random locations
class Bonus{
  constructor(type){

    this.x = CONSTANTS.STONE_COLUMNS[Math.floor(Math.random() * CONSTANTS.STONE_COLUMNS.length)];
    this.y = CONSTANTS.STONE_ROWS[Math.floor(Math.random() * CONSTANTS.STONE_ROWS.length)];
    this.type = type;
    if(this.type === 'star') this.sprite = 'images/Star.png';
    if(this.type === 'heart') this.sprite = 'images/Heart.png';
  }//end constructor

  update(dt){
    //Not sure if theres need to update
  }//end update

  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}//end Star



// Player class
// This class requires an update(), render() and
// a handleInput() method.
// the property level is increased when the player reaches the river/water
// the score increases 10 points when the player passes a level, and 2 points when the player reaches a star.
// players are given 5 lives/chances to get the highest score possible
//1 live will be added if the player collects a heart
class Player{
  constructor(){
      this.x = Math.floor(CONSTANTS.CANVAS_WIDTH / 2);
      this.y = Math.floor(CONSTANTS.CANVAS_HEIGHT - CONSTANTS.PLAYER_IMAGE_SIZE);
      this.level = 1;
      this.score = 0;
      this.lives = 5;
      // The image/sprite for our player, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/char-boy.png';
      //this.tempWin = null;
  }//end constructor

  // Update the players's position, required method for game
  update() {
      if(this.checkCollisions()) {
          this.resetStartPosition();
          //If the player doesnt have enough lives a heart will be available so he/she can increase the lives amount
          if(this.lives <= Math.ceil(Math.random()*2+1) && allHearts.length === 0)
            allHearts.push(new Bonus('heart'));
        }
      if(this.reachedWater()) this.levelPassed();
      if(this.checkReachStar()) this.reachedStar();
      if(this.checkReachHeart()) this.reachedHeart();
      }

  //when the player catches a star the score is increase and a new star is placed in a new location
  reachedStar(){
        this.score +=2;
        allStars.pop();
        allStars.push(new Bonus('star'));
      }

  //when the player catches a star the score is increase and a new star is placed in a new location
  reachedHeart(){
      this.lives +=1;
      allHearts.pop();
    }

  //Checks if the pyater reaches/crosses to the water area
  reachedWater(){
      return (this.y - CONSTANTS.GRID_CELL_HEIGHT <= - CONSTANTS.PLAYER_IMAGE_SIZE+10);
  }

  //displays modal popup window, increases the player's score and sets the difficulty for the next level
  levelPassed(){
    displayModal(modalLevelpassed,["level",this.level]);
    this.score += 10;
    this.level++;
    deltaDifficulty++;
    hideModal(modalLevelpassed);
    this.resetStartPosition();
  }

  //Checks if the player has collected a star
  checkReachStar(){
    for(const star of allStars){
     if(Math.abs(this.x - star.x) < 75 && Math.abs(this.y - star.y) < 60){
        return true;
      }
    }
      return false;
  }

  //Checks if the player has collected a heart
  checkReachHeart(){
    for(const heart of allHearts){
     if(Math.abs(this.x - heart.x) < 75 && Math.abs(this.y - heart.y) < 60){
        return true;
      }
    }
      return false;
  }

  //Checks if the player collided with and enemy/bug
  checkCollisions(){
    for(const enemy of allEnemies){
     if(Math.abs(this.x - enemy.x) < 75 && Math.abs(this.y - enemy.y) < 60){
        this.lives--;
        if(this.lives===0){
          displayModal(modalGameOver,["gameover",this.score,this.level]);
          hideModal(modalGameOver);
          this.restartGame();
          }
        return true;
      }
    }
      return false;
  }

  //Resets all the initial parameters of the game
  restartGame(){
      this.level = 1;
      this.score = 0;
      this.lives = 5;
      deltaDifficulty = 0;
      allStars = [new Bonus('star')];
      allHearts = [];
      allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
  }

  //Places the player in the initial position
  resetStartPosition(){
    this.x = Math.floor(CONSTANTS.CANVAS_WIDTH / 2);
    this.y = Math.floor(CONSTANTS.CANVAS_HEIGHT - CONSTANTS.PLAYER_IMAGE_SIZE);
  }

  // Draw the player on the screen, along with the score lives available and current level
  render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
      ctx.font = "bold 30px 'Comic Sans MS'";
      ctx.fillStyle = "rgba(24, 25, 26, 0.7)";
      ctx.fillText(`Score: ${this.score}`, 30, CONSTANTS.CANVAS_HEIGHT+CONSTANTS.GRID_CELL_HEIGHT-20);
      ctx.fillText(`Lives: ${this.lives}`, CONSTANTS.CANVAS_HEIGHT - 1.5*CONSTANTS.GRID_CELL_WIDTH, CONSTANTS.CANVAS_HEIGHT+CONSTANTS.GRID_CELL_HEIGHT-20);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillText(`Level: ${this.level}`, 30, CONSTANTS.GRID_CELL_HEIGHT);
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

  //Sets a new image for the player's character
  setNewSprite(newSprite){
    this.sprite = `${newSprite}`;
  }
}//end Player class

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
// Place the player object in a variable called player
let player = new Player();
let allStars = [new Bonus('star')];
let allHearts = [];



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

function addNewEnemy(){
  deltaDifficulty-=1;
  allEnemies.push(new Enemy);
}
