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

    this.isShooting = false
    this.enemyBullets = []
    this.shotSpeed = 2

    this.playerX = (this.ctx.canvas.width / 2) - (this.width/2)
    this.playerY = (this.ctx.canvas.height / 2) - (this.height/2)

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

    this.playerDistance = undefined

    this.isBackgroundColliding = undefined
  }

  setBackgroundColliding(value) {
    const temp = this.isBackgroundColliding
    this.isBackgroundColliding = value
  }

  draw(){
    if(this.img.isReady){
      this.enemyBullets.forEach(oneEnemyBullet => oneEnemyBullet.draw())
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
    //barra de vida enemigos

    if(this.health > 0){
      const lifePointsBar = this.health * this.width /300

      this.ctx.save()
      this.ctx.fillStyle = '#A6A6A6'
      this.ctx.fillRect(this.x + 45, this.y + 35, 87, 8)
      this.ctx.restore()
      this.ctx.save()
          this.ctx.fillStyle = '#F22D1B'
          this.ctx.fillRect(this.x + 45, this.y + 35, lifePointsBar, 8)
      this.ctx.restore()
    }
        this.ticks++
        
        if(this.ticks % 7 === 0) {
          this.xFrame++
          if(this.xFrame >= (this.horizontalFrames)){
              this.xFrame = 0
          }
        }
    }

    // disparo 
    this.shot()
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
    const xPadding = 60
    const yPadding = 70
    return (
      this.x + xPadding < (bullet.x + bullet.width) &&
      this.x + this.width - xPadding > (bullet.x) &&
      this.y + yPadding < (bullet.y + bullet.height) &&
      this.y + this.height - yPadding > (bullet.y)
    )
  }

  // formula mágica del angulo
  getPlayerAngle() {
    this.dx = this.playerX - this.x
    this.dy = this.playerY - this.y
    this.angle = Math.atan2(this.dx, this.dy)

    this.vx = Math.sin(this.angle)
    this.vy = Math.cos(this.angle)
}

  move(){
    //movemos la bala
    this.enemyBullets.forEach(bullets => bullets.move())

    //movemos al personaje
    if(this.playerDistance <= 400){
      this.getPlayerAngle()
      this.x += this.vx * (this.speed - 3)
      this.y += this.vy * (this.speed - 3) 
    }

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

    this.getPlayerAngle()
    if(this.angle <= 3 && this.angle >= 1.5){
      this.yFrame = 1
    } else if (this.angle <= 1.5 && this.angle >= 0.5){
      this.yFrame = 5
    } else if (this.angle <= 0.5 && this.angle >= -1.5){
      this.yFrame = 5
    } else if (this.angle <= -1.5 && this.angle >= -3){
      this.yFrame = 4
    } else {
      this.yFrame = 2
    }
  }

  shot() {
    if(this.ticks % 90 === 0 && this.playerDistance <= 400){
      // calcalmos el trayectoria con la formula
      let dx = this.playerX - this.x
      let dy = this.playerY - this.y
      let angle = Math.atan2(dx, dy)

      this.enemyBullets.push(
        new EnemyBullet(this.ctx, this.x + (this.width/2 -30), (this.y + 20), Math.sin(angle) * this.shotSpeed, Math.cos(angle) * this.shotSpeed)
        )
    }
  }
}
