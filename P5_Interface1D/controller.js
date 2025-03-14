// const audio1 = new Audio('P5_Interface1D\Project_14.mp3');
// audio1.loop = true; // Enable looping
// audio1.play();

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
                //audio1.play();

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
                    if (playerOne.position+1==display.displaySize-1 || playerOne.position+1==display.displaySize){
                        playerTwo.bed=false;
                    }

                    // attacking the other player if it is next to this player
                    if (playerOne.position+1==playerTwo.position || playerOne.position-1==playerTwo.position){
                        // teleport the other player to its bed
                        if(playerTwo.bed==true){
                            playerTwo.position = display.displaySize-1;
                        }
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

                    if (playerTwo.position-1==0 || playerTwo.position==0){
                        playerOne.bed=false;
                    }

                    if (playerTwo.position+1==playerOne.position || playerTwo.position-1==playerOne.position){
                        if(playerOne.bed==true){
                            playerOne.position = 0;
                        }
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
                if (typeof createVictoryCelebration === 'function') { createVictoryCelebration(score.winner); }

                break;

            // Not used, it's here just for code compliance
            default:
                break;
        }
    }
}

const synth1 = new Tone.Synth({
    oscillator: { type: "sine" }
    }).toDestination();

const synth2 = new Tone.Synth({
    oscillator: { type: "square" }
    }).toDestination();

const synth3 = new Tone.Synth({
    oscillator: { type: "sawtooth" }
    }).toDestination();


// This function gets called when a key on the keyboard is pressed
function keyPressed() {
    //create a synth and connect it to the main output (your speakers)

    // Move player one to the left if letter A is pressed
    if (key == 'A' || key == 'a') {
        playerOne.move(-1);
        synth1.triggerAttackRelease(tones[playerOne.position+12], "8n");


        // Set the values you want to send (each between 0 and 6)
        let led1 = int(map(playerOne.position, 0, 40, 0, 6))+1; // Example value for the first LED strip
        let led2 = int(map(displaySize-playerTwo.position, 0, 40, 0, 6))+1; // Example value for the first LED strip
        // Build the string to send (numbers separated by a space, ending with a newline)
        let outStr = led1 + " " + led2 + "\n";
        sendSerialData(outStr);
        console.log("Sent to Arduino: " + outStr);
      }
    
    // And so on...
    if (key == 'D' || key == 'd') {
        playerOne.move(1);
        synth1.triggerAttackRelease(tones[playerOne.position+12], "8n");


        // Set the values you want to send (each between 0 and 6)
        let led1 = int(map(playerOne.position, 0, 40, 0, 6))+1; // Example value for the first LED strip
        let led2 = int(map(displaySize-playerTwo.position, 0, 40, 0, 6))+1; // Example value for the first LED strip       
        // Build the string to send (numbers separated by a space, ending with a newline)
        let outStr = led1 + " " + led2 + "\n";
        sendSerialData(outStr);
        console.log("Sent to Arduino: " + outStr);
    }    

    if (key == 'W' || key == 'w') {
        synth3.triggerAttackRelease("C5", "32n");
        playerOne.attack = true;
    }    

    if (key == 'S' || key == 's') {
        playerOne.build = true;
        synth3.triggerAttackRelease("C3", "8n");
    }    

    if (key == 'J' || key == 'j') {
    playerTwo.move(-1);
    synth2.triggerAttackRelease(tones[displaySize-playerTwo.position], "8n");

    // Set the values you want to send (each between 0 and 6)
    let led1 = int(map(playerOne.position, 0, 40, 0, 6))+1; // Example value for the first LED strip
    let led2 = int(map(displaySize-playerTwo.position, 0, 40, 0, 6))+1; // Example value for the first LED strip    
    // Build the string to send (numbers separated by a space, ending with a newline)
    let outStr = led1 + " " + led2 + "\n";
    sendSerialData(outStr);
    console.log("Sent to Arduino: " + outStr);
    }
    
    if (key == 'L' || key == 'l') {
    playerTwo.move(1);
    synth2.triggerAttackRelease(tones[displaySize-playerTwo.position], "8n");

    // Set the values you want to send (each between 0 and 6)
    let led1 = int(map(playerOne.position, 0, 40, 0, 6))+1; // Example value for the first LED strip
    let led2 = int(map(displaySize-playerTwo.position, 0, 40, 0, 6))+1; // Example value for the first LED strip
    //  Build the string to send (numbers separated by a space, ending with a newline)
    let outStr = led1 + " " + led2 + "\n";
    sendSerialData(outStr);
    console.log("Sent to Arduino: " + outStr);
    }

    if (key == 'I' || key == 'i') {
        playerTwo.attack = true;
        synth3.triggerAttackRelease("C5", "32n");
    } 

    if (key == 'K' || key == 'k') {
        playerTwo.build = true;
        synth3.triggerAttackRelease("C3", "8n");
    }    
    
    // When you press the letter R, the game resets back to the play state
    if (key == 'R' || key == 'r') {
    controller.gameState = "PLAY";
    }

  }





  function sendSerialData(data) {
    if (writer1 && writer2) {
      // Encode and write the data to both ports
      const encodedData = new TextEncoder().encode(data);
      writer1.write(encodedData);
      writer2.write(encodedData);
    } else {
      console.error("One or both serial ports are not open. Click the 'Connect to Both Arduinos' button.");
    }
  }