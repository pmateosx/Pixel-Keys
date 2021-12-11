class Player {
    constructor(ctx){
        this.ctx = ctx

        this.width = 20 * 3
        this.height = 45 * 3

        this.health = 100

        this.x = (this.ctx.canvas.width / 2) - (this.width/2)
        this.y = (this.ctx.canvas.height / 2) - (this.height/2)

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
      console.log(`Vida: ${this.health}`);
    }

    move(){
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
          return (
            this.x < (keyPiece.x + keyPiece.width - 30) &&
            this.x + this.width > (keyPiece.x + 50) &&
            this.y < (keyPiece.y + keyPiece.height -40) &&
            this.y + this.height > (keyPiece.y - 50)
          )
      }
}