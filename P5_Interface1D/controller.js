
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "PLAY";
       
    }
    
    // This is called from draw() in sketch.js with every frame
    update() {

        // STATE MACHINE ////////////////////////////////////////////////
        // This is where your game logic lives
        /////////////////////////////////////////////////////////////////
        switch(this.gameState) {

            // This is the main game state, where the playing actually happens
            case "PLAY":

                // clear screen at frame rate so we always start fresh      
                display.clear();
            
                // displaying the beds of players if they exsist
                if (playerOne.bed==true){
                    display.setPixel(0, color(255,150,150));
                }
                if (playerTwo.bed==true){
                    display.setPixel(display.displaySize-1, color(170,170,255));
                }

                // displaying the positions of the players
                display.setPixel(playerOne.position, playerOne.playerColor);
                display.setPixel(playerTwo.position, playerTwo.playerColor);

                // display all the placed blocks
                for (let i = 0; i < blocks.displaySize; i++){
                    if (blocks.positionArray[i]==1){
                        display.setPixel(i, blocks.blockColor);
                    }
                }

                // if player one is on the attack mode
                if (playerOne.attack == true){
                    // displaying the attcked positions: 2 blocks next to it
                    display.setPixel(playerOne.position +1 ,  color(255,255,255));
                    display.setPixel(playerOne.position -1 ,  color(255,255,255));

                    // destroying the other player's bed if it happens
                    if (playerOne.position+1==display.displaySize-1){
                        playerTwo.bed=false;
                    }

                    // attacking the other player if it is next to this player
                    if (playerOne.position+1==playerTwo.position || playerOne.position-1==playerTwo.position){
                        // teleport the other player to its bed
                        playerTwo.position = display.displaySize-1;
                        // add score for this player if the other player have no bed
                        if (playerTwo.bed==false){
                            playerOne.score++;
                        }
                    }

                    // if blocks existing in the attacked positions, destroy them.
                    if (blocks.positionArray[playerOne.position+1]==1){
                        blocks.positionArray[playerOne.position+1]=0;
                    }
                    if (blocks.positionArray[playerOne.position-1]==1){
                        blocks.positionArray[playerOne.position-1]=0;
                    }

                    // leave the attcking mode
                    playerOne.attack = false;
                }

                // if the play is building a block, set the block position in block array
                if (playerOne.build == true){
                    blocks.positionArray[playerOne.position-1]=1;
                    playerOne.build = false;
                }


                if (playerTwo.attack == true){
                    display.setPixel(playerTwo.position +1 ,  color(255,255,255));
                    display.setPixel(playerTwo.position -1 ,  color(255,255,255));

                    if (playerTwo.position-1==0){
                        playerOne.bed=false;
                    }

                    if (playerTwo.position+1==playerOne.position || playerTwo.position-1==playerOne.position){
                        playerOne.position = 0;
                        if (playerOne.bed==false){
                            playerTwo.score++;
                        }
                    }
                    
                    if (blocks.positionArray[playerTwo.position+1]==1){
                        blocks.positionArray[playerTwo.position+1]=0;
                    }
                    if (blocks.positionArray[playerTwo.position-1]==1){
                        blocks.positionArray[playerTwo.position-1]=0;
                    }
                    playerTwo.attack = false;
                }
                
                if (playerTwo.build == true){
                    blocks.positionArray[playerTwo.position+1]=1;
                    playerTwo.build = false;
                }

                //check if animation is done and we should move on to another state
                //if (frameToShow == collisionAnimation.animation.length-1)  {
    
                    // We've hit score max, this player wins
                    if (playerOne.score >= score.max) {
                        score.winner = playerOne.playerColor;   // store winning color in score.winner
                        this.gameState = "SCORE";               // go to state that displays score
                    
                    // We've hit score max, this player wins
                    } else if (playerTwo.score >= score.max) {
                        score.winner = playerTwo.playerColor;   // store winning color in score.winner
                        this.gameState = "SCORE";               // go to state that displays score

                    // We haven't hit the max score yet, keep playing    
                    } else {
                        // target.position = parseInt(random(0,displaySize));  // move the target to a new random position
                        this.gameState = "PLAY";    // back to play state
                    }
                //} 


                break;

            // This state is used to play an animation, after a target has been caught by a player 
            case "COLLISION":
                
                 // clear screen at frame rate so we always start fresh      
                 display.clear();

                // play explosion animation one frame at a time.
                // first figure out what frame to show
                let frameToShow = collisionAnimation.currentFrame();    // this grabs number of current frame and increments it 
                
                // then grab every pixel of frame and put it into the display buffer
                for(let i = 0; i < collisionAnimation.pixels; i++) {
                    display.setPixel(i,collisionAnimation.animation[frameToShow][i]);                    
                }

                break;

            // Game is over. Show winner and clean everything up so we can start a new game.
            case "SCORE":       
            
                // reset everyone's score
                playerOne.score = 0;
                playerTwo.score = 0;
                playerOne.position = 0;
                playerTwo.position = display.displaySize-1;
                
                blocks.clear();
                playerOne.bed=true;
                playerTwo.bed=true;

                // put the target somewhere else, so we don't restart the game with player and target in the same place
                //target.position = parseInt(random(1,displaySize));

                //light up w/ winner color by populating all pixels in buffer with their color
                display.setAllPixels(score.winner);                    

                break;

            // Not used, it's here just for code compliance
            default:
                break;
        }
    }
}




// This function gets called when a key on the keyboard is pressed
function keyPressed() {

    // Move player one to the left if letter A is pressed
    if (key == 'A' || key == 'a') {
        playerOne.move(-1);
      }
    
    // And so on...
    if (key == 'D' || key == 'd') {
        playerOne.move(1);
    }    

    if (key == 'W' || key == 'w') {
        playerOne.attack = true;
    }    

    if (key == 'S' || key == 's') {
        playerOne.build = true;
    }    

    if (key == 'J' || key == 'j') {
    playerTwo.move(-1);
    }
    
    if (key == 'L' || key == 'l') {
    playerTwo.move(1);
    }

    if (key == 'I' || key == 'i') {
        playerTwo.attack = true;
    } 

    if (key == 'K' || key == 'k') {
        playerTwo.build = true;
    }    
    
    // When you press the letter R, the game resets back to the play state
    if (key == 'R' || key == 'r') {
    controller.gameState = "PLAY";
    }
  }