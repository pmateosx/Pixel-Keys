class Obstacles {
    constructor(ctx, x, y, type){
        this.ctx = ctx

        this.type = type

        this.x = x
        this.y = y 

        this.width = 200
        this.height = 300

        this.speed = 6
        this.vx = 0
        this.vy = 0

        this.img = new Image()
        this.img.src = `./assets/images/obstacles/${this.type}.png`
        this.img.isReady = false
        this.img.onload = () => {
            this.img.isReady = true
        }

        this.movements = {
            up: false,
            down: false,
            left: false,
            right: false
        }
    }

    draw() {
        if (this.img.isReady) {
            this.ctx.drawImage(
                this.img,
                this.x,
                this.y,
                this.width,
                this.height
            )
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
            if(this.xFrame >= (this.horizontalFrames -1)){
                this.xFrame = 0
            }
        }
    }
}