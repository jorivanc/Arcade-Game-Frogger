let playersOption = document.getElementById("players_options");
playersOption.addEventListener('click' , respondPlayersOptions);

//Function that allows the player to choose the character's image(sprite) from a list of images
function respondPlayersOptions(evt){
  player.setNewSprite("images/"+evt.target.alt+".png");
}


let modalLevelpassed = document.getElementById("modal_levelpassed");
let modalGameOver = document.getElementById("modal_gameover");

//Function that displays modal popup windows. depending on the parameters it will show a new level has been passed or the game is over
function displayModal(modal,arguments){
  if (arguments[0] === "level"){
    let message = `!!   LEVEL ${arguments[1]} CLEARED   !!`;
    document.getElementById("level_message").textContent = message;
  }
  if (arguments[0] === "gameover"){
    let message = `! GAME OVER !

LEVELS CLEARED: ${arguments[2]-1}
SCORE: ${arguments[1]}`;
    document.getElementById("gameover_message").textContent = message;
  }
    modal.classList.toggle("hide");
}

//Function that hides modal popup windows.
function hideModal(modal){
  let displayTime = (modal.getAttribute("id") === "modal_gameover" )?  5000 : 1000;
  setTimeout(doHide, displayTime, modal);
}

function doHide(modal){
  modal.classList.toggle("hide");
}
