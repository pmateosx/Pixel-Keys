class Game {
    constructor(ctx){
        this.ctx = ctx
        
        this.background = new Background(ctx)
        this.player = new Player(ctx)

        this.intervalId = undefined
        this.fps = 1000/60
    }

    start(){
        if(!this.intervalId){
            this.intervalId = setInterval(() =>{
                this.clear()
                this.draw()
                this.move()
            }, this.fps)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      }

    move(){
        this.background.move()
        this.player.move() 
    }

    draw(){
        this.background.draw()
        this.player.draw()
    }

    setupListeners(event) {
        this.background.setupListeners(event)
        this.player.setupListeners(event)
      }
}