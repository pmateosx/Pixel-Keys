class Game {
    constructor(ctx) {
        this.ctx = ctx
        
        this.background = new Background(ctx)
        this.player = new Player(ctx)

        this.keyPiece = [
            new keyPiece(ctx, -750, 100),
            new keyPiece(ctx, 950, -1800),
            new keyPiece(ctx, 950, -3000)
        ]

        this.enemy = [
            //enemigo de pruebas
            //new Enemy(ctx, 350, 150),

             // primera llave
            new Enemy(ctx, -650, -250),
            new Enemy(ctx, -750, -450),
            new Enemy(ctx, -750, 150),

            // segunda llave
            new Enemy(ctx, 950, -1350),
            new Enemy(ctx, 1000, -1700),
            new Enemy(ctx, 450, -1750),
            new Enemy(ctx, 450, -1400),

            //tercera llave
            new Enemy(ctx, 650, -3100),
            new Enemy(ctx, 1000, -3100),
            new Enemy(ctx, 970, -2890),
            new Enemy(ctx, 450, -3000),
            new Enemy(ctx, 350, -2600),
        ]

        this.obstacles = [
            //new Obstacles(ctx, 650, -250, 'arbol'),
            //new Obstacles(ctx, 350, -650, 'arbol')
        ]

        this.intervalId = undefined
        this.fps = 1000/60

        this.keysTaken = 0

        // imagen de vida de jugador 

        this.img = new Image()
        this.img.src = './assets/images/game-ui/UI - points.png'
        this.img.isReady = false
        this.img.onload = () => {
                this.img.isReady = true
            }
        
        
        this.ambient = new Audio('./assets/sounds/ambient.mp3')
        this.ambient.volume = 0.2
        this.sound = new Audio('./assets/sounds/music-large.mp3')
        this.sound.volume = 0.5
        this.keySound = new Audio('./assets/sounds/keysound.mp3')
        this.keySound.volume = 0.5
        this.walkSound = new Audio('./assets/sounds/walk.mp3')
        this.shot = new Audio('./assets/sounds/shot.mp3')
        this.shot.volume = 0.2
        this.enemyDead = new Audio('./assets/sounds/enemy-dead.mp3')
        this.enemyDead.volume = 0.2
        
            
    }

    start() {
        if(!this.intervalId){
            this.ambient.loop = true
            this.ambient.play()
            this.sound.loop = true
            this.sound.play()

            this.intervalId = setInterval(() => {
                this.clear()
                this.draw()
                this.win()
                this.gameOver()
                this.soundEffects()
                this.move()
                this.checkTheNearest() 
                this.playerLife()
                this.checkCollision()
                this.checkPlayerDistance()
                this.checkHealthEnemy()
                this.soundButton()
                
            }, this.fps)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      }

    move() {
        this.moveKeys()
        this.moveEnemys()
        this.moveObstacles()
        this.background.move()
        this.player.move()
    }

    moveKeys() {
        const colliding = this.background.isBackgroundColliding()
        this.keyPiece.forEach(key => key.setBackgroundColliding(colliding))
        this.keyPiece.forEach(keyPiece => keyPiece.move())
    }

    moveEnemys(){
        const collidingEnemy = this.background.isBackgroundColliding()
        this.enemy.forEach(oneEnemy => oneEnemy.setBackgroundColliding(collidingEnemy))
        this.enemy.forEach(enemy=> enemy.move())
    }

    moveObstacles(){
        const collidingObstacles = this.background.isBackgroundColliding()
        this.obstacles.forEach(oneObstacle => oneObstacle.setBackgroundColliding(collidingObstacles))
        this.obstacles.forEach(obstacle=> obstacle.move())
    }

    draw() {
        this.background.draw()
        this.playerLife()
        this.keyPiece.forEach(keyPiece => keyPiece.draw())
        this.obstacles.forEach(obstacles => obstacles.draw())
        this.enemy.forEach(enemy => enemy.draw())
        this.player.draw()
    }

    setupListeners(event) {
        this.background.setupListeners(event)
        this.player.setupListeners(event)
        this.keyPiece.forEach(key => key.setupListeners(event))
        this.enemy.forEach(enemy => enemy.setupListeners(event))
        this.obstacles.forEach(obstacles => obstacles.setupListeners(event))
    }

    gameOver(){
        if(this.player.health <= 0){
            this.stop()
            const gameOverScreen = document.getElementById('game-over')
            const gameOverRestart = document.getElementById('game-over-button')
    
            gameOverScreen.classList.remove("display-off")
            gameOverScreen.classList.add("display-on")
    
            gameOverRestart.classList.remove("display-off")
            gameOverRestart.classList.add("display-on")
        }

    }

    checkTheNearest() {
        if (this.enemy.length <= 0){
            this.player.nearestEnemy = undefined
        } else if (this.enemy.length === 1) {
            this.player.nearestEnemy = this.enemy[0]
        } else {
            let a, b, c, NewEnemyObject
            let enemiesWithDistance = this.enemy.map(enemy => {
                a = enemy.x - this.player.x;
                b = enemy.y - this.player.y;
                c = Math.sqrt( a*a + b*b );
                NewEnemyObject = {
                    distance: c,
                    x: enemy.x,
                    y: enemy.y
                }
                return NewEnemyObject
            }).sort((a, b) => {
                return a.distance - b.distance
            })

            this.player.nearestEnemy = enemiesWithDistance[0]
            this.player.enemyDistance = enemiesWithDistance[0].distance
        } 
    }

     checkPlayerDistance(){
        // claculamos la distancia unicamente para comprobar el player
        if (this.enemy.length <= 0){
            this.player.nearestEnemy = undefined
        } else {
        let a, b, c, NewEnemyObject
        let enemiesWithDistance = this.enemy.map(enemy => {
            a = enemy.x - this.player.x;
            b = enemy.y - this.player.y;
            c = Math.sqrt( a*a + b*b );
            NewEnemyObject = {
                distance: c,
                x: enemy.x,
                y: enemy.y
            }
            return NewEnemyObject
        })

        this.enemy.forEach((e, index) => {
            e.playerDistance = enemiesWithDistance[index].distance
        })
    }
    } 

    checkCollision(){
        // colision con llave        
        const keyColliding = this.keyPiece.find(keyPiece => this.player.collidesWith(keyPiece))

        if(keyColliding){
            this.keySound.currentTime = 0
            this.keySound.play()

            this.keyPiece = this.keyPiece.filter(keyPiece => keyPiece !== keyColliding)
            this.keysTaken++

            // curamos al jugador
            this.player.health += 10
            if( this.player.health >= 100){
                this.player.health = 100
            }

            // metemos mas enemigos en el mapa
/*              this.enemy.push(
                new Enemy (this.ctx, this.player.x + 350, this.player.y - 390),
                new Enemy (this.ctx, this.player.x + 350, this.player.y - 620),
                new Enemy (this.ctx, this.player.x + 350, this.player.y - 510),
                new Enemy (this.ctx, this.player.x + 350, this.player.y - 350)
            )  */
        }

        // colision con enemigo
        const enemyColliding = this.enemy.find(enemy => this.player.collidesWith(enemy))
    
        if(enemyColliding && this.player.ticks % 100 === 0){
            this.player.health -= 20
        } 

        // colision de balas con enemigo
        this.player.bullets.forEach((bullet, index) => {
            this.enemy.forEach(enemy => {
                if(enemy.collidesWith(bullet)) {
                    enemy.health -= bullet.damage
                    this.player.bullets.splice(index, 1)
                }
            })
        })

        // colision de balas enemigas con player

        this.enemy.forEach(enemyUnit =>{
            enemyUnit.enemyBullets.forEach((enemyBulletUnit, index) => {
                if(this.player.bulletImpact(enemyBulletUnit)){
                    this.player.health -= enemyBulletUnit.damage
                    //enemyUnit.enemyBullets.splice(index, 1)
                }
            })
        })

/*         this.enemy.enemyBullets.forEach((enemyBulletUnit, index) => {
            if(this.player.bulletImpact(enemyBulletUnit)){
                this.player.health -= enemyBulletUnit.damage
                this.enemy.enemyBullets.splice(index, 1)
            }
        }) */
    }

 /*    checkObstacleColliding(){   
        const keyColliding = this.keyPiece.find(keyPiece => this.player.collidesWith(keyPiece))
        
        
        this.obstacles.forEach(obstacle => {
            this.player.obstacleColliding(obstacle)
        })
    } */

/*     PRUEBA CON OBSTACULOSBLOQUANDO MAPA
        checkObstacleColliding(){
        this.obstacles.forEach(element => { // element = obstacle
            if( this.player.y <= element.y + element.height && 
            this.player.y >= element.y && 
            this.player.x + this.player.width >= element.x && 
            this.player.x <= element.x + element.width &&
            this.player.y + this.player.height > element.y + element.height
            //this.previousY > element.y + element.height
            ){
                return true
            } else  {
                return false
            }
        })
    } */

    checkHealthEnemy(){
        this.enemy.forEach(enemy => {
            if(enemy.health <= 0){
                enemy.yFrame = 0
                enemy.xFrame = 0
                this.enemyDead.currentTime = 0
                this.enemyDead.play()
                
                setInterval(() =>{
                    enemy.xFrame++
                }, this.fps)
                setTimeout(this.clearEnemies(), 1500)
            }
        })
    }
    
    clearEnemies() {
        if(this.enemy.length > 0){
          this.enemy = this.enemy.filter(enemyUnit => enemyUnit.health > 0)
        }
      }


    playerLife(){
        // vida del player
        if(this.player.health > 0){
            const lifePointsBar = this.player.health * 210 / 100
      
            this.ctx.save()
            this.ctx.fillStyle = '#5b4a42'
            this.ctx.fillRect(74, 45, 210, 70)
            this.ctx.restore()
            this.ctx.save()
                this.ctx.fillStyle = '#67c115'
                this.ctx.fillRect(74, 45, lifePointsBar, 70)
            this.ctx.restore()
          }

  // pintamos la imagen de la vida
          if (this.img.isReady) {
            this.ctx.drawImage(
                this.img,
                0,
                25,
                this.img.width,
                this.img.height
            )
        } 
        this.ctx.fillStyle = '#463127'
        this.ctx.font = 'bold 34px monospace'
        this.ctx.fillText(`Keys ${this.keysTaken}/3`, 80, 119)
    }

    stop() {
        clearInterval(this.intervalId)
    }

    win(){
        
        const winScreen = document.getElementById('win-screen')
        const nameInput = document.getElementById('name-input')
        const sendInput = document.getElementById('send-button')
        if(this.keysTaken >= 3){
            this.stop()
            winScreen.classList.remove("display-off")
            winScreen.classList.add("display-on")

            nameInput.classList.remove("display-off")
            nameInput.classList.add("display-on")

            sendInput.classList.remove("display-off")
            sendInput.classList.add("display-on")

            const diploma = document.getElementById('diploma')
            const name = document.getElementById('name')
            const sendButton = document.getElementById('send-button')
        
            sendButton.onclick = () => {
              name.innerText = nameInput.value
              name.classList.remove("display-off")
              name.classList.add("display-on")
             
              diploma.classList.remove("display-off")
              diploma.classList.add("display-on")

              winScreen.classList.remove("display-on")
              winScreen.classList.add("display-off")
  
              nameInput.classList.remove("display-on")
              nameInput.classList.add("display-off")
  
              sendInput.classList.remove("display-on")
              sendInput.classList.add("display-off")
          
            }
        }   
    }

    soundEffects(){
        if(this.player.isRunning){
            this.walkSound.currentTime = 0
            this.walkSound.play()
            this.walkSound.volume = 0.03
        } else {
            this.walkSound.pause()
        }

 /*        console.log(this.player.isRunning); */
    }

    soundButton(){
        const isPlaying = false;
        const soundButton = document.getElementById('sound-button')

        // hacer sonido para disparo
/*         if(this.player.isShooting){
            this.shot.play()
        } */

        soundButton.onclick = () => {
            if (this.sound.paused || this.ambient.paused){
                this.sound.play()
                this.ambient.play()
                this.enemyDead.volume = 0.2
                this.keySound.volume = 0.4
                this.walkSound.volume = 0.2
            } else{
              this.sound.pause()
              this.ambient.pause()
              this.enemyDead.volume = 0
              this.keySound.volume = 0
              this.walkSound.volume = 0
          }
        }
    }
}