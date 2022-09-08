alert('Utiliser Z,S,Q,D pour déplacer le joueur 1')
alert('Utiliser la flèche haut,bas,gauche,droite pour déplacer le joueur 2')
alert('appuyer sur l pour lancer le jeu')

let svg = document.querySelector('svg'),
    scoreP1 = document.querySelector('.scorePlayer1'),
    scoreP2 = document.querySelector('.scorePlayer2'),
    btnContinue = document.querySelector('.continue');

let widthAreaGame = 650,
    heightAreaGAme = 350,
    isGameOver = false,
    isGameRun = false,
    scorePlayer1 = 0,
    scorePlayer2 = 0,
    playerLooser = 1;
// player 1 loose eto satria mba ho eo aminazy ny baolina voalohany

class Player {
    constructor(color,posX,posY,w,h,indice) {
        this.color = color;
        this.positionX = posX;
        this.positionY = posY;
        this.width = w;
        this.height = h;
        this.indice = indice;
        this.docHTML = undefined;
        this.intervalSpeed = [];
    }
    // create and display player
    createAndDisplayPlayer() {
        //indice : indice player (player1,player2,...) so it's easy for accessing on this
        // let playerHTML = '<circle class="player'+this.indice+'" cx="'+this.positionX+'" cy="'+this.positionY+'" r="'+this.rayon+'" stroke="'+this.color+'" stroke-width="2" fill="none" />';
        let playerHTML = '<rect class="player'+this.indice+'" x="'+this.positionX+'" y="'+this.positionY+'" width="'+this.width+'" height="'+this.height+'" style="fill:'+this.color+';stroke:none" />';
        svg.insertAdjacentHTML('beforeend', playerHTML);

        // get document html of player 
        this.docHTML = document.querySelector('.player'+this.indice);
        // console.log(this.docHTML);
    }

    // player can't move if game over
    // move player
    moveUp() {;
        // amle click voalohany ihany no affectena le setinterval mampietsika
        if(this.intervalSpeed[0] == undefined) {
            this.intervalSpeed[0] = setInterval(() => {
                // player can move up if positionY >= 0 (tsy mietsika rehf le tonga farany ambony)
                if((this.positionY >= (0)) && !isGameOver) {
                    this.positionY -= 1;
                }
                
                // we can accede directly in cy of circle and move it (avoid remove and display player if moving)
                this.docHTML.attributes.y.nodeValue = this.positionY;
            },10)
        }    
    }
    moveDown() {
        // amle click voalohany ihany no affectena le setinterval mampietsika
        if(this.intervalSpeed[1] == undefined) {
            this.intervalSpeed[1] = setInterval(() => {
                // afaka mietsika rehefa positionY mbola ambanin' hauteur anle svg 
                if((this.positionY  <= (heightAreaGAme - this.height)) && !isGameOver) {
                    this.positionY += 1;
                }
                
                // we can accede directly in y of circle and move it 
                this.docHTML.attributes.y.nodeValue = this.positionY;
            },10)
        } 
    }
    moveLeft() {
        // amle click voalohany ihany no affectena le setinterval mampietsika
        if(this.intervalSpeed[2] == undefined) {
            this.intervalSpeed[2] = setInterval(() => {
                // ao amin partie any iany izy no afaka mietsika
                if((this.positionX >= (0)) && !isGameOver) {
                    this.positionX -= 1;
                }
                
                // we can accede directly in cx of circle and move it 
                this.docHTML.attributes.x.nodeValue = this.positionX;
            },10)
        } 
    }
    
    moveRight() {
        // amle click voalohany ihany no affectena le setinterval mampietsika
        if(this.intervalSpeed[3] == undefined) {
            this.intervalSpeed[3] = setInterval(() => {
                // ao amin zone de jeu any iany izy no afaka mietsika
                if((this.positionX <= (widthAreaGame-this.width)) && !isGameOver ) {
                    this.positionX += 1;
                }
        
                // we can accede directly in cx of circle and move it 
                this.docHTML.attributes.x.nodeValue = this.positionX;
            },10)
        } 
    }

    // stop move
    stopMoveUp() {
        clearInterval(this.intervalSpeed[0])
        this.intervalSpeed[0] = undefined;
    }
    stopMoveDown() {
        clearInterval(this.intervalSpeed[1])
        this.intervalSpeed[1] = undefined;
    }
    stopMoveLeft() {
        clearInterval(this.intervalSpeed[2])
        this.intervalSpeed[2] = undefined;
    }
    stopMoveRight() {
        clearInterval(this.intervalSpeed[3])
        this.intervalSpeed[3] = undefined;
    }

    // get position player 
    get position() {
        return {
            posX : this.positionX,
            posY : this.positionY,
            widthPlayer :this.width,
            heightPlayer : this.height
        }
    }
}

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
    moveBall(p1,p2) {
        let deviationX = 1,
            deviationY = 1,
            isXplus = true, isYplus = true;

        let inter = setInterval(() => {
            // check collision between ball and players and get value returned by collision
            let valueByCollision = checkCollision(this,p1,p2,isXplus,isYplus,deviationX,deviationY);

            // update value
             deviationX = valueByCollision.deviationX;
             deviationY = valueByCollision.deviationY;
             isXplus = valueByCollision.isXplus;
             isYplus = valueByCollision.isYplus;
    
            // checking if x,y must  plus or minus
            if(isXplus && isYplus) {
                this.positionX += deviationX;
                this.positionY += deviationY;
                // jerena raha midona amin'ny sisiny droite  na mihoatra le positionX anle ball ary gameOver zany raha midona
                if(this.positionX >= (widthAreaGame-this.rayon)) {
                    clearInterval(inter);
                    console.log('tapitra');
                    // game over
                    isGameOver = true;

                    // score player 1 ++
                    scorePlayer1++;
                    scoreP1.innerHTML = scorePlayer1;

                    // player 2 loose
                    playerLooser = 2;

                    btnContinue.style.display = 'initial';
                }
                // jerena raha midona amle farany ambany le positionY anle  
                if(this.positionY >= (heightAreaGAme-this.rayon)) {
                    isYplus = false;
                }

            } else if(!isXplus && !isYplus) {
                this.positionX -= deviationX;
                this.positionY -= deviationY;
                // jerena raha midona amin'ny sisiny gauche na mihoatra le positionX anle ball ary gameOver zany raha midona
                if(this.positionX <= this.rayon) {
                    clearInterval(inter);
                    console.log('tapitra');
                    // game over
                    isGameOver = true;

                    //score player 2
                    scorePlayer2++;
                    scoreP2.innerHTML = scorePlayer2;

                    // player 1 loose
                    playerLooser = 1;

                    btnContinue.style.display = 'initial';
                }
                // jerena raha midona amin'ny farany ambony le positionY anle ball
                if(this.positionY <= this.rayon) {
                    isYplus = true;
                }

            } else if(isXplus && !isYplus) {
                this.positionX += deviationX;
                this.positionY-= deviationY;
                // jerena raha midona amin'ny sisiny droite na mihoatra le positionX anle ball ary gameOver zany raha midona
                if(this.positionX >= (widthAreaGame-this.rayon)) {
                    clearInterval(inter);
                    console.log('tapitra');
                    // game over
                    isGameOver = true;

                    // score player 1 ++
                    scorePlayer1++;
                    scoreP1.innerHTML = scorePlayer1;

                    // player 2 loose
                    playerLooser = 2;

                    btnContinue.style.display = 'initial';
                }
                // jerena raha midona amin'ny farany ambony le positionY anle ball
                if(this.positionY <= this.rayon) {
                    isYplus = true;
                }

            } else if(!isXplus && isYplus) {
                this.positionX -= deviationX;
                this.positionY += deviationY;
                // jerena raha midona amin'ny sisiny gauche na mihoatra le positionX anle ball ary gameOver zany raha midona
                if(this.positionX <= this.rayon) {
                    clearInterval(inter);
                    console.log('tapitra');
                    // game over
                    isGameOver = true;

                    //score player 2
                    scorePlayer2++;
                    scoreP2.innerHTML = scorePlayer2;

                    // player 1 loose
                    playerLooser = 1;

                    btnContinue.style.display = 'initial';
                }
                // jerena raha midona amle farany ambany le positionY anle  
                if(this.positionY >= (heightAreaGAme-this.rayon)) {
                    isYplus = false;
                }

            } 
            
            this.docHTML.attributes.cx.nodeValue = this.positionX;
            this.docHTML.attributes.cy.nodeValue = this.positionY;
    
        },1)
        
    }
}

function checkCollision(ball,p1,p2,isXp,isYP,deviX,deviY) {
    // passage par adresse ny an' js , noho izany mitady fika isika de ito :
    // get current value 
    let isXplus = isXp, isYplus = isYP,
        deviationX = deviX, deviationY = deviY;

    // get position top,bottom,middle,right,left player 1 and 2
    let positionP1 = {
        posTop : p1.position.posY,
        posBottom : p1.position.posY + p1.position.heightPlayer,
        posMiddle : p1.position.posY + (p1.position.heightPlayer/2),
        posLeft : p1.position.posX,
        posRight : p1.position.posX + p1.position.widthPlayer
    },
    positionP2 = {
        posTop : p2.position.posY,
        posBottom : p2.position.posY + p2.position.heightPlayer,
        posMiddle : p2.position.posY + (p2.position.heightPlayer/2),
        posLeft : p2.position.posX,
        posRight : p2.position.posX + p2.position.widthPlayer
    },

    // get postion top,bottom,right,left ball 
    positionBall = {
        posTop : ball.positionY - ball.rayon,
        posBottom : ball.positionY + ball.rayon,
        posMiddle : ball.positionY,
        posLeft : ball.positionX - ball.rayon,
        posRight : ball.positionX + ball.rayon
    };

    // checking collision player 1
    // jerena ny tapany ambony sy ambany
    if((positionBall.posLeft >= (positionP1.posRight-1)) && positionBall.posLeft <= (positionP1.posRight+1) &&
       (positionBall.posBottom > (positionP1.posTop)) && 
       (positionBall.posMiddle < (positionP1.posMiddle))) {
           // zaraina roa le tapany ambony
           // jerena raha partie ambany amle tapany ambony
            if ( (positionBall.posBottom > (positionP1.posTop + (p1.height/4))) && 
                 (positionBall.posMiddle < (positionP1.posMiddle)) ) {
                    deviationX = 0.75;
                    deviationY = 0.9;
                    console.log('partie ambany tapany ambony p1');
            }else {
                deviationX = 0.7;
                deviationY = 0.45;
                console.log('partie ambony tapany ambony p1');
            }
            isXplus = true;
            isYplus = false;
            
    } else if((positionBall.posLeft >= (positionP1.posRight-1)) && positionBall.posLeft <= (positionP1.posRight+1) &&
        (positionBall.posMiddle >= (positionP1.posMiddle)) && 
        (positionBall.posTop <= (positionP1.posBottom))) {
            // zaraina roa le tapany ambany
           // jerena raha partie ambany amle tapany ambany
            if( (positionBall.posMiddle >= (positionP1.posMiddle)) && 
                (positionBall.posTop <= (positionP1.posBottom - (p1.height/4))) ) {
                    deviationX = 1.1;
                    deviationY = 0.65;
                    console.log('partie ambany tapany ambany p1');
            }else {
                deviationX = 0.8;
                deviationY = 0.7;
                console.log('partie ambony tapany ambany p1');
            }
            isXplus = true;
            isYplus = true;
    }  

    // checking collision player 2
    // jerena ny tapany ambony sy ambany
    if((positionBall.posRight >= (positionP2.posLeft-1)) && (positionBall.posRight <= (positionP2.posLeft+1)) &&
       (positionBall.posBottom > (positionP2.posTop)) && 
       (positionBall.posMiddle < (positionP2.posMiddle))) {
           // zaraina roa le tapany ambony
           // jerena raha partie ambany amle tapany ambony
            if ( (positionBall.posBottom > (positionP2.posTop + (p2.height/4))) && 
                 (positionBall.posMiddle < (positionP2.posMiddle)) ) {
                    deviationX = 0.9;
                    deviationY = 0.5;
                    console.log('partie ambany tapany ambony p2');
            }else {
                deviationX = 0.8;
                deviationY = 0.6;
                console.log('partie ambony tapany ambony p2');
            }
            isXplus = false;
            isYplus = false;
    } else if((positionBall.posRight >= (positionP2.posLeft-1)) && (positionBall.posRight <= (positionP2.posLeft+1)) &&
        (positionBall.posMiddle >= (positionP2.posMiddle)) && 
        (positionBall.posTop <= (positionP2.posBottom))) {
            // zaraina roa le tapany ambany
           // jerena raha partie ambany amle tapany ambany
            if( (positionBall.posMiddle >= (positionP2.posMiddle)) && 
                (positionBall.posTop <= (positionP2.posBottom - (p2.height/4))) ) {
                    deviationX = 1;
                    deviationY = 0.475;
                    console.log('partie ambany tapany ambany p2');
            }else {
                deviationX = 1.1;
                deviationY = 0.6;
                console.log('partie ambony tapany ambany p2');
            }
            isXplus = false;
            isYplus = true;
    } 

    return {
        isXplus, isYplus, 
        deviationX, deviationY
    }
}

let player1 = undefined,
    player2 = undefined;

let ballGame = undefined;

function init() {
    player1 = new Player('blue', 50, 25, 5,70, 1),
    player2 = new Player('red', 600, 250, 5,70, 2);

    player1.createAndDisplayPlayer();
    player2.createAndDisplayPlayer();

    let posBallX = 75, posBallY = 60;
    if(playerLooser == 2) {
        posBallX = 580;
        posBallY = 250;
    }
    ballGame = new Ball(posBallX,posBallY,20);
    ballGame.createAndDisplayPlayer()

    isGameOver = false;
}
init()


function continueGame() {
    btnContinue.style.display = 'none';
    player1.docHTML.remove()
    player2.docHTML.remove()
    ballGame.docHTML.remove()
    init();
    console.log('continue');
}

// button controller 
window.onkeydown = (e) => {
    // player 1 
    if(e.keyCode == 90) {

        player1.moveUp()
    } else if(e.keyCode == 83) {
        player1.moveDown()
    } else if(e.keyCode == 81) {
       player1.moveLeft()
    } else if(e.keyCode == 68) {
        player1.moveRight()
    }

    // player 2 
    if(e.keyCode == 38) {
        player2.moveUp()
    } else if(e.keyCode == 40) {
        player2.moveDown()
    } else if(e.keyCode == 37) {
        player2.moveLeft()
    } else if(e.keyCode == 39) {
        player2.moveRight()
    }
    // afaka mietsika le ball rehefa tsy gameover
    if((e.keyCode == 76) && !isGameOver) {
        ballGame.moveBall(player1,player2)
    }

}

// stop movement if key up 
window.onkeyup = (e) => {
    // player 1 
    if(e.keyCode == 90) {
        player1.stopMoveUp()
    } else if(e.keyCode == 83) {
        player1.stopMoveDown()
    } else if(e.keyCode == 81) {
        player1.stopMoveLeft()
    } else if(e.keyCode == 68) {
        player1.stopMoveRight()
    }

    // Player 2
    if(e.keyCode == 38) {
        player2.stopMoveUp()
    } else if(e.keyCode == 40) {
        player2.stopMoveDown()
    } else if(e.keyCode == 37) {
       player2.stopMoveLeft()
    } else if(e.keyCode == 39) {
        player2.stopMoveRight()
    }
    // console.log(e);
}
