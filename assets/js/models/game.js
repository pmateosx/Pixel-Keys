class Game {
    constructor(ctx) {
        this.ctx = ctx
        
        this.background = new Background(ctx)
        this.player = new Player(ctx)
        this.keyPiece = [
            new keyPiece(ctx, -750, 100),
            // new keyPiece(ctx, 950, -1800),
            // new keyPiece(ctx, 950, -3000)
        ]

        this.enemy = [
            new Enemy(ctx, 450, 350),
            new Enemy(ctx, 450, 450),
        ]

        this.obstacles = [
            new Obstacles(ctx, 650, -250, 'arbol'),
            new Obstacles(ctx, 350, -650, 'arbol')
        ]

        this.intervalId = undefined
        this.fps = 1000/60

        this.keysTaken = 0
    }

    start() {
        if(!this.intervalId){
            this.intervalId = setInterval(() => {
                this.clear()
                this.draw()
                this.move()
                this.checkCollision()
            }, this.fps)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      }

    move() {
        this.moveKeys()
        this.background.move()
        this.player.move() 
        //this.staticElementsMove()
        this.enemy.forEach(enemy => enemy.move())
        this.obstacles.forEach(obstacles => obstacles.move())
    }

    moveKeys() {
        const colliding = this.background.isBackgroundColliding()
        this.keyPiece.forEach(key => key.setBackgroundColliding(colliding))
        this.keyPiece.forEach(keyPiece => keyPiece.move())
    }

    // pendiente de pasar a otro metodo
    drawKeyPieces() {
        this.ctx.save()
        this.ctx.fillStyle= "rgba(255, 255, 255, 0.8)"
        this.ctx.fillRect(20, 15, 250, 60)
        this.ctx.restore()
        this.ctx.font = 'bold 40px monospace'
        this.ctx.fillText(`Keys ${this.keysTaken}/3`, 40, 60)
    }

    draw() {
        this.background.draw()
        this.keyPiece.forEach(keyPiece => keyPiece.draw())
        this.enemy.forEach(enemy => enemy.draw())
        this.obstacles.forEach(obstacles => obstacles.draw())
        this.drawKeyPieces()
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
        clearInterval(this.intervalId)
        
        this.ctx.save()
    
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.font = 'bold 32px sans-serif'
        this.ctx.fillText(`Game Over!`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2)
    
        this.ctx.restore()
    }

    checkCollision(){
        // colision con llave
        const keyColliding = this.keyPiece.find(keyPiece => this.player.collidesWith(keyPiece))

        if(keyColliding){
            this.keyPiece = this.keyPiece.filter(keyPiece => keyPiece !== keyColliding)
            this.keysTaken++
        }

        // colision con enemigo
        const enemyColliding = this.enemy.find(enemy => this.player.collidesWith(enemy))
    
        if(enemyColliding && this.player.ticks % 100 === 0){
            this.player.health -= 10
            if(this.player.health === 0){
                this.gameOver()
            }
        } 

        this.obstacles.forEach(obstacle => this.collidesWithObstacles(obstacle))
    }

    collidesWithObstacles(obstacle){

                if( this.player.y <= obstacle.y + obstacle.height && 
                this.player.y >= obstacle.y && 
                this.player.x + this.player.width >= obstacle.x && 
                this.player.x <= obstacle.x + obstacle.width &&
                this.player.y + this.player.height > obstacle.y + obstacle.height){
                    this.background.vy = 0
                }
            }
}