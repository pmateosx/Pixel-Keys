class Bullet {
    constructor(ctx, x, y, vx, vy){
        this.ctx = ctx

        this.x = x
        this.y = y

        this.damage = 15

        this.width = 14*5
        this.height = 14*5

        this.vx = vx
        this.vy = vy

        this.img = new Image()
        this.img.src = './assets/images/bullet/Projectile_sprite.png'
        this.img.isReady = false
        this.img.onload = () => {
                this.img.isReady = true
            }

        this.horizontalFrames = 8
        this.verticalFrames = 1

        this.yFrame= 0
        this.xFrame = 0

        this.ticks = 0

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
                    this.img.height * this.verticalFrames,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                )
            }
    
            this.ticks++
            
            if(this.ticks % 10 === 0) {
                this.xFrame++
                if(this.xFrame >= (this.horizontalFrames)){
                    this.xFrame = 0
                }
            } 
        }
    
    move(){
        this.x += this.vx
        this.y += this.vy

        if (this.isBackgroundColliding !== 'left' && this.isBackgroundColliding !== 'right') {
            this.x += this.vx
          }
  
        if (this.isBackgroundColliding !== 'top' && this.isBackgroundColliding !== 'bottom') {
        this.y += this.vy
        }
    }
}