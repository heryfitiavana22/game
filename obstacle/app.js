var allClass ={
    btnUp : document.querySelector('.up'),
    btnLeft : document.querySelector('.left'),
    btnRight : document.querySelector('.right'),
    btnDown : document.querySelector('.down'),
    obj : document.querySelector('.objet'),
    obstacleToRemove : document.getElementsByClassName('obstacle'),
    tableGame : document.querySelector('.table-Game'),
    btnRestart : document.querySelector('.restart')
}

allClass.btnRestart.style.display = 'none';

var objetCntrl = {
    fromUp : 330,
    fromLeft : 115,
    initPosition : function () {
        this.fromUp = 330;
        this.fromLeft = 115;
    },
    deplacement : function () {
        allClass.obj.style.marginTop = this.fromUp + 'px';
        allClass.obj.style.marginLeft = this.fromLeft + 'px';
    },

    isPlacementOverflow : function() {
        if (this.fromUp <= 0) {
            this.fromUp = 0;
        }else if (this.fromUp >= 330) {
            this.fromUp = 330;
        }
    
        if (this.fromLeft <= 0) {
            this.fromLeft = 0;
        } else if (objetCntrl.fromLeft >= 248) {
            this.fromLeft = 248;
        } 
    }

}

var obstacleCntrl = {
    fromLeft : [0,100,200],
    fromUp : [],
    listLeft : [],
    allObstacle : [],
    leng : 0,
    initObstacle : function() {
        this.fromLeft = [0,100,200];
        this.fromUp = [];
        this.listLeft = [];
        this.allObstacle = [];
        
    },
    obstacleCreator : function() {
        var random = Math.floor(Math.random() * 3);
        var obsCreate = document.createElement('div');
        obsCreate.className = 'obstacle';
        obsCreate.style.marginLeft = this.fromLeft[random] + 'px';
        this.listLeft.push(this.fromLeft[random]);

        this.allObstacle.push(obsCreate);
        this.fromUp.push(0);
        this.leng = this.allObstacle.length

        allClass.tableGame.insertBefore(obsCreate, allClass.obj);
    },

    checkingCollision : function() {
        for (i=0; i<this.allObstacle.length; i++) {
            if ( ((obstacleCntrl.listLeft[i] == 0) && ((this.fromUp[i]+15) == objetCntrl.fromUp) && (objetCntrl.fromLeft <= 100)) ||
            ((obstacleCntrl.listLeft[i] == 100) && ((this.fromUp[i]+15) == objetCntrl.fromUp) && ((objetCntrl.fromLeft >= 50) && (objetCntrl.fromLeft <= 200))) ||
            ((obstacleCntrl.listLeft[i] == 200) && ((this.fromUp[i]+15) == objetCntrl.fromUp) && (objetCntrl.fromLeft >= 150) )){
                areaGame.onGameOver();
            }
        }
    },
 
    moveObstacle : function() {
        
        for (i=0; i<this.allObstacle.length; i++) {
            this.fromUp[i] = this.fromUp[i] + 1;
            this.allObstacle[i].style.marginTop = this.fromUp[i] + 'px';

            if (this.fromUp[i] == 365) {
                this.allObstacle[i].style.display = 'none';
                this.allObstacle[i].remove()
            }
            
            if ( ((obstacleCntrl.listLeft[i] == 0) && ((this.fromUp[i]+15) == objetCntrl.fromUp) && (objetCntrl.fromLeft <= 100)) ||
            ((obstacleCntrl.listLeft[i] == 100) && ((this.fromUp[i]+15) == objetCntrl.fromUp) && ((objetCntrl.fromLeft >= 50) && (objetCntrl.fromLeft <= 200))) ||
            ((obstacleCntrl.listLeft[i] == 200) && ((this.fromUp[i]+15) == objetCntrl.fromUp) && (objetCntrl.fromLeft >= 150) )){
                areaGame.onGameOver();
            }
        }
    }, 


    removeObstacle : function() {
        for (i=0; i<(allClass.obstacleToRemove.length); i++) {
            allClass.tableGame.removeChild(allClass.tableGame.childNodes[3])
        }
        // avoid bug
        for (i=0; i<(allClass.obstacleToRemove.length); i++) {
            allClass.tableGame.removeChild(allClass.tableGame.childNodes[3])
        }
        
    },

}

var areaGame = {
    intervalMoveObstacle : 0,
    intervalObstacleCreator : 0,
    to : 0,
    runGame : function() {
        setTimeout(()=>{
            this.intervalMoveObstacle = setInterval(() => {
                console.log('lance move');
                obstacleCntrl.moveObstacle();
            }, 20) 
        },1500)
        this.intervalObstacleCreator = setInterval(() => {
            console.log('lance creator');
            obstacleCntrl.obstacleCreator();
        }, 2000);

        
              
    },
    
    onGameOver : function() {
        obstacleCntrl.initObstacle();
        clearInterval(this.intervalMoveObstacle);
        clearInterval(this.intervalObstacleCreator);
        this.intervalMoveObstacle = 0;
        this.intervalObstacleCreator = 0;
        allClass.btnRestart.style.display = 'initial';
    },

    restart : function() {
        allClass.btnRestart.style.display = 'none';
        objetCntrl.initPosition();
        objetCntrl.deplacement();
        obstacleCntrl.removeObstacle();
        this.runGame();    
    }
}
areaGame.runGame();

window.onkeydown = function(e) {
    console.log(e);
}
 
allClass.btnUp.addEventListener('click', () => {
    objetCntrl.fromUp -= 5;
    objetCntrl.isPlacementOverflow();
    objetCntrl.deplacement();
    obstacleCntrl.checkingCollision();
});

allClass.btnLeft.addEventListener('click', () => {
    objetCntrl.fromLeft -= 5;
    objetCntrl.isPlacementOverflow();
    objetCntrl.deplacement();
    obstacleCntrl.checkingCollision();
});

allClass.btnRight.addEventListener('click', () => {
    objetCntrl.fromLeft += 5;
    objetCntrl.isPlacementOverflow();
    objetCntrl.deplacement();
    obstacleCntrl.checkingCollision();
})

allClass.btnDown.addEventListener('click', () => {
    objetCntrl.fromUp += 5;
    objetCntrl.isPlacementOverflow();
    objetCntrl.deplacement();
    obstacleCntrl.checkingCollision();
});



allClass.btnRestart.addEventListener('click', () => {
    areaGame.restart();
});
