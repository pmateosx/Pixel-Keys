class Enemy {
  constructor(ctx, x, y){
    this.ctx = ctx
    this.x = x
    this.y = y 

    this.width = 35 * 5
    this.height = 43 * 5

    this.speed = 6
    this.vx = 0
    this.vy = 0

    this.health = 150

    this.img = new Image()
    this.img.src = './assets/images/enemy/test2.png'
    this.img.isReady = false
    this.img.onload = () => {
        this.img.isReady = true
    }

    this.horizontalFrames = 24
    this.verticalFrames = 17

    this.xFrame = 0 
    this.yFrame = 1

    this.ticks = 0

    this.movements = {
        up: false,
        down: false,
        left: false,
        right: false
    }

    this.isBackgroundColliding = undefined
  }

  setBackgroundColliding(value) {
    const temp = this.isBackgroundColliding
    this.isBackgroundColliding = value
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
        
        if(this.ticks % 7 === 0) {
          this.xFrame++
          if(this.xFrame >= (this.horizontalFrames)){
              this.xFrame = 0
          }
      }
      console.log(`enemy life ${this.health}`);
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

  collidesWith(bullet){
    console.log('pegaste');
    const xPadding = 60
    const yPadding = 70
    return (
      this.x + xPadding < (bullet.x + bullet.width) &&
      this.x + this.width - xPadding > (bullet.x) &&
      this.y + yPadding < (bullet.y + bullet.height) &&
      this.y + this.height - yPadding > (bullet.y)
    )
  }

  

  move(){
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

    if (this.isBackgroundColliding !== 'left' && this.isBackgroundColliding !== 'right') {
      this.x += this.vx
    }

    if (this.isBackgroundColliding !== 'top' && this.isBackgroundColliding !== 'bottom') {
      this.y += this.vy
    }
  }
}
