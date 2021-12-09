class Enemy {
    constructor(ctx, x, y){
        this.ctx = ctx
        this.x = x
        this.y = y 

        this.width = 60*2
        this.height = 120*2

        this.speed = 6
        this.vx = 0
        this.vy = 0

        this.health = 100

        this.img = new Image()
        this.img.src = '#'
        this.img.isReady = false
        this.img.onload = () => {
            this.img.isReady = true
        }

        this.horizontalFrames = 4
        this.verticalFrames = 1

        this.xFrame = 0 
        this.yFrame = 0 

        this.ticks = 0

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
                    this.img.height * this.verticalFrames,
                    this.x,
                    this.y,
                    this.width,
                    this.height
            )
            this.ticks++

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
          this.vx = -this.speed
        }
        if (this.movements.left) {
          this.vx = this.speed
        }
        
        if (this.movements.up) {
            this.vy = this.speed
        }
        if (this.movements.down) {
            this.vy = -this.speed
        }

     

        if(this.ticks % 10 === 0) {
            this.xFrame++
            if(this.xFrame >= (this.horizontalFrames)){
                this.xFrame = 0
            }
        }
    }
}
