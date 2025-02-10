
// This holds some player information, like color and position.
// It also has some player methods for managing how a player moves.


class Block {
  
    constructor(_color, _displaySize) {        
        this.blockColor = _color;
        this.score = 0;
        this.displaySize = _displaySize;

        this.positionArray= new Array(this.displaySize);

        for (let i = 0; i < this.displaySize; i++){
            this.positionArray[i]=0;
        }
         

    }

    clear() {

        for (let i = 0; i < this.displaySize; i++){
            this.positionArray[i]=0;
        }
         
    } 
  }