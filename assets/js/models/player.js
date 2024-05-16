class Player {
  constructor(ctx){
      this.ctx = ctx

      this.width = 20 * 3
      this.height = 45 * 3

      this.health = 100

      this.isShooting = false
      this.bullets = []
      this.shotSpeed = 6


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

      this.nearestEnemy = undefined
      this.enemyDistance = undefined
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
      this.bullets.forEach(bullets => bullets.draw())
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
  
    // disparar
    if(this.isShooting && this.enemyDistance <= 400){
      this.shot()
    }
  }
  
  move(){
    this.bullets.forEach(bullets => bullets.move())
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
      case KEY_W:
        this.movements.up = status
        break
      case KEY_S:
        this.movements.down = status
        break
      case KEY_D:
        this.movements.right = status
        break
      case KEY_A:
        this.movements.left = status
        break

      case KEY_UP:
        this.shot('up')
        break
      case KEY_DOWN:
        this.shot('down')
        break
      case KEY_RIGHT:
        this.shot('right')
        break
      case KEY_LEFT:
        this.shot('left')
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
        this.x < (keyPiece.x + keyPiece.width - 20) &&
        this.x + this.width > (keyPiece.x + 30) &&
        this.y < (keyPiece.y + keyPiece.height -40) &&
        this.y + this.height > (keyPiece.y + 20)
      )
  }

  bulletImpact(enemyBullet){
    return (
      this.x < (enemyBullet.x + enemyBullet.width - 20) &&
      this.x + this.width > (enemyBullet.x + 30) &&
      this.y < (enemyBullet.y + enemyBullet.height -40) &&
      this.y + this.height > (enemyBullet.y + 20)
    )
  }

  shot(direction) {

    if(this.ticks % 2 === 0){
      let angle = 0
      this.tick = 0

     switch (direction) {
      case 'right':
        angle = Math.PI / 2;
        break;
      case 'left':
        angle = -Math.PI / 2;
        break;
      case 'down':
        angle = 0;
        break;
      case 'up':
        angle = Math.PI;
        break;
      default:
        break;
     }

    let dx = Math.sin(angle) * this.shotSpeed;
    let dy = Math.cos(angle) * this.shotSpeed;

    this.bullets.push(
      new Bullet(this.ctx, this.x + (this.width / 2 - 30), this.y + 20, dx, dy)
    );
    }
  }

/*   obstacleColliding(element){
    if( this.y <= element.y + element.height && 
    this.y >= element.y && 
    this.x + this.width >= element.x && 
    this.x <= element.x + element.width&&
    this.y + this.height > element.y + element.height
    ){  
        return true
    } else  {
        return false
    }
} */

}