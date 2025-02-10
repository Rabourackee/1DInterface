
// This holds some player information, like color and position.
// It also has some player methods for managing how a player moves.


class Player {
  
    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.score = 0;
        this.displaySize = _displaySize;
        this.attack = false;
        this.build = false;
        this.bed=true;
    }



    // Move player based on keyboard input
    move(_direction) {

        // increments or decrements player position
        if (blocks.positionArray[this.position + _direction]==0){
            this.position = this.position + _direction;
        }

        // if player hits the edge of display, loop around
        // if (this.position == -1) {
        //     this.position = this.displaySize - 1;
        // } else if (this.position == this.displaySize) {
        //     this.position = 0;
        // } 

        if (this.position == -1) {
            this.position = 0;
        } else if (this.position == this.displaySize) {
            this.position = this.displaySize-1;
        } 
         
    } 
  }