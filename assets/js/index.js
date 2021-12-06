window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const game = new Game(ctx)

    const startButton = document.getElementById('start-button')

    startButton.onclick = () => {
        game.start()
        startButton.style.display = 'none'
    }

    window.addEventListener('keydown', (event) => {
        game.setupListeners(event)
      })
    
      window.addEventListener('keyup', (event) => {
        game.setupListeners(event)
      })
})