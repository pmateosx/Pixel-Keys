class Game {
    constructor(ctx) {
        this.ctx = ctx
        
        this.background = new Background(ctx)
        this.player = new Player(ctx)
        this.keyPiece = [
            new keyPiece(ctx, 750, 700),
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
        this.background.move()
        this.player.move() 
        this.moveKeys()
    }

    moveKeys() {
        this.keyPiece.forEach(keyPiece => keyPiece.move())
    }

    drawKeyPieces() {
        this.ctx.save()
        this.ctx.fillStyle= "rgba(255, 255, 255, 0.8)"
        this.ctx.fillRect(20, 15, 116, 38)
        this.ctx.restore()
        this.ctx.font = 'bold 20px monospace'
        this.ctx.fillText(`Keys ${this.keysTaken}/${this.keyPiece.length}`, 30, 40)
    }

    draw() {
        this.background.draw()
        this.player.draw()
        this.keyPiece.forEach(keyPiece => keyPiece.draw())
        this.drawKeyPieces()
    }

    setupListeners(event) {
        this.background.setupListeners(event)
        this.player.setupListeners(event)
        this.keyPiece.forEach(key => key.setupListeners(event))
    }

    checkCollision(){
        const keyColiding = this.keyPiece.find(keyPiece => this.player.collidesWith(keyPiece))

        if(keyColiding){
            this.keyPiece = this.keyPiece.filter(keyPiece => keyPiece !== keyColiding)
            this.keysTaken++
        }
    }
}