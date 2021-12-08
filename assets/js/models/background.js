class Background {
  constructor(ctx){
    this.ctx = ctx
    // esto deberia estar condicionado por el inicio del personaje
    // podemos hacerlo con this.player.x?
    this.x = 0
    this.y = 0

    this.speed = 6
    this.vx = 0
    this.vy = 0

    this.img = new Image()
    this.img.src = './assets/images/backgrounds/poketest2.png'
    this.img.isReady = false
    this.img.onload = () => {
      this.img.isReady = true
      this.width = this.img.width * 3
      this.height = this.img.height * 3
    }

    this.movements = {
      up: false,
      down: false,
      left: false,
      right: false
    }
  }

  draw(){
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

    move() {
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

        //colission with canvas border 
        if(this.x <= this.ctx.canvas.width - this.width){
            this.x = this.ctx.canvas.width - this.width
        }
        if(this.x > 0){
            this.x = 0
        } 

        if(this.y <= this.ctx.canvas.height - this.height){
            this.y = this.ctx.canvas.height - this.height
        }
        if(this.y > 0){
            this.y = 0
        }

        this.x += this.vx
        this.y += this.vy

      }
}