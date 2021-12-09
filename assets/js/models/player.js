class Player {
    constructor(ctx){
        this.ctx = ctx

        this.width = 20 * 3
        this.height = 45 * 3

        this.x = (this.ctx.canvas.width / 2) - (this.width/2)
        this.y = (this.ctx.canvas.height / 2) - (this.height/2)

        this.speed = 3
        this.vx = 0
        this.vy = 0

        this.img = new Image()
        this.img.src = './assets/images/player/playerSplite.png'
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
      if (this.movements.up) {
        this.yFrame = 0
      } else if (this.movements.down) {
        this.yFrame = 1
      } else if (this.movements.left) {
        this.yFrame = 2
      } else if (this.movements.right) {
        this.yFrame = 3
      }

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
          break
        case KEY_DOWN:
          this.movements.down = status
          break
        case KEY_RIGHT:
          this.movements.right = status
          break
        case KEY_LEFT:
          this.movements.left = status
          break
        default:
          break
      }
  
      if (!this.movements.up && !this.movements.down && !this.movements.left && !this.movements.right) {
        this.isRunning = false
        this.xFrame = 0
      } else {
        this.isRunning = true
      }
    }

      //checker para ver si chocamos con la key
      collidesWith(keyPiece){
          return this.x < keyPiece.x + keyPiece.width &&
          this.x + this.width > keyPiece.x &&
          this.y < keyPiece.y + keyPiece.height &&
          this.y + this.height > keyPiece.y
      }
}