let svg = document.querySelector('svg');

class Ball {
    constructor(posX,posY,rayon) {
        this.positionX = posX;
        this.positionY = posY;
        this.rayon = rayon;
        this.docHTML = undefined;
    }
    // create and display player
    createAndDisplayPlayer() {
        //indice : indice player (player1,player2,...) so it's easy for accessing on this
        let ballHTML = '<circle class="ball" cx="'+this.positionX+'" cy="'+this.positionY+'" r="'+this.rayon+'" style="fill:rgb(33, 170, 33); stroke: rgb(8, 238, 8); stroke-width:2" />';
        svg.insertAdjacentHTML('beforeend', ballHTML);

        // get document html of player 
        this.docHTML = document.querySelector('.ball');
    }
    moveBall() {
        let i = 0,
        isXplus = true, isYplus = true,
        isXminus = false, isYminus = true;
        console.log('x '+(this.positionX));
        console.log('y '+this.positionY);
        let inter = setInterval(() => {

            // checking if x,y must  plus or minus
            if(isXplus && isYplus) {
                this.positionX++;
                this.positionY++;
                // jerena raha midona amin'ny sisiny gauche le x 
                if(this.positionX >= (700-this.rayon)) {
                    isXplus = false;
                    isXminus = true;
                }
                // jerena raha midona amle farany ambany le y
                if(this.positionY >= (400-this.rayon)) {
                    isYplus = false;
                    isYminus = true;
                }

            } else if(isXminus && isYminus) {
                this.positionX--;
                this.positionY--; 
                // jerena raha midona amin'ny sisiny droite le x
                if(this.positionX <= this.rayon) {
                    isXplus = true;
                    isXminus = false;
                }
                // jerena raha midona amin'ny farany ambony le y
                if(this.positionY <= this.rayon) {
                    isYplus = true;
                    isYminus = false;
                }

            } else if(isXplus && isYminus) {
                this.positionX++;
                this.positionY--; 
                // jerena raha midona amin'ny sisiny gauche le x
                if(this.positionX >= (700-this.rayon)) {
                    isXplus = false;
                    isXminus = true;
                }
                // jerena raha midona amin'ny farany ambony le y
                if(this.positionY <= this.rayon) {
                    isYplus = true;
                    isYminus = false;
                }

            } else if(isXminus && isYplus) {
                this.positionX--;
                this.positionY++; 
                // jerena raha midona amin'ny sisiny droite le x
                if(this.positionX <= this.rayon) {
                    isXplus = true;
                    isXminus = false;
                }
                // jerena raha midona amin'ny farany ambony le y
                if(this.positionY >= (400-this.rayon)) {
                    isYplus = false;
                    isYminus = true;
                }

            }
            
            this.docHTML.attributes.cx.nodeValue = this.positionX;
            this.docHTML.attributes.cy.nodeValue = this.positionY;
            i++;
            // if(i == 400) {
            //     clearInterval(inter);
            //     console.log('tapitra');
            // }
        },10)
        
    }
}

let ballGame = new Ball(75,70,20);
ballGame.createAndDisplayPlayer()

window.onkeydown = (e) => {
    if(e.keyCode == 76) {
        ballGame.moveBall()
    }

}