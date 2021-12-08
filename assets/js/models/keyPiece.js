class keyPiece {
    constructor(ctx, x, y){
        this.ctx = ctx
        this.x = x
        this.y = y

        this.width = 25
        this.height = 35

        this.img = new Image()
        this.img.src = 'assets/images/keyPiece/key-white.png'
        this.img.isReady = false
        this.img.onload = () => {
            this.img.isReady = true
        }

        this.horizontalFrames = 12
        this.verticalFrames = 1

        this.xFrame = 0 
        this.yFrame = 0 

        this.ticks = 0
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
    }

    move(){
        if(this.ticks % 10 === 0) {
            this.xFrame++
            if(this.xFrame >= (this.horizontalFrames -1)){
                this.xFrame = 0
            }
        }
    }

}