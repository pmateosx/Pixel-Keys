class Player {
    constructor(ctx){
        this.ctx = ctx

        this.x = 0
        this.y = 0

        this.speed = 2
        this.vx = 0
        this.vy = 0

        this.width = 18*2
        this.height = 39*2

        this.img = new Image()
        this.img.src = 'assets/images/player/playerSplite.png'
        this.img.isReady = false
        
        this.img.onload = () => {
            this.img.isReady = true
        }

        this.horizontalFrames = 7
        this.verticalFrames = 4

        this.xFrame = 0
        this.yFrame = 0

        this.ticks = 0

        this.isRunning = false

        this.movements = {
            up: false,
            down: false,
            left: false,
            right: false
          }
    }

    draw(){
        if(this.img.isReady){
            this.ctx.drawImage(
                this.img,
                (this.img.width * this.xFrame) / this.horizontalFrames,
                (this.img.height * this.yFrame) / this.verticalFrames,
                this.img.width / this.horizontalFrames,
                this.img.height / this.verticalFrames,
                this.x,
                this.y,
                this.width,
                this.height
            )
            this.ticks++
        }
    }

    move(){
        this.x += this.vx
        this.y += this.vy

        if (!this.movements.right && !this.movements.left) {
            this.vx = 0
          }
          if (!this.movements.up && !this.movements.down) {
            this.vy = 0
          }
      
          if (this.movements.right) {
            this.vx = this.speed
          }

          if (this.movements.left) {
            this.vx = -this.speed
          }
      
          if (this.movements.up) {
              this.vy = -this.speed
          }
          if (this.movements.down) {
              this.vy = this.speed
          }

          if (this.x <= 0) {
            this.x = 0
          }
          if (this.x + this.width >= this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.width
          }
      
          if (this.y <= 0) {
            this.y = 0
          }

          if (this.y + this.height >= this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height - this.height
          }

          if(this.isRunning){
            if (this.ticks % 10 === 0) {
                this.xFrame++
                if (this.xFrame >= (this.horizontalFrames - 1)) {
                  this.xFrame = 1
                }
              }
          }

    }

    setupListeners(event) {
        const status = event.type === 'keydown'

        switch(event.keyCode) {
          case KEY_UP:
            this.movements.up = status
            this.isRunning = true
            this.yFrame = 0
            break
          case KEY_DOWN:
            this.movements.down = status
            this.isRunning = true
            this.yFrame = 1
            break
          case KEY_RIGHT:
            this.movements.right = status
            this.isRunning = true
            this.yFrame = 3
            break
          case KEY_LEFT:
            this.movements.left = status
            this.isRunning = true
            this.yFrame = 2
            break
          default:
            break
        }

        if(!status){
            this.isRunning = false
            this.xFrame = 0
        }
      }
}