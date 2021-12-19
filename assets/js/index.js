window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const game = new Game(ctx)

    const startButton = document.getElementById('start-button')
    const gameLogo = document.getElementById('game-logo')
    const introText = document.getElementById('introText')
    const movements = document.getElementById('movements')
    movements.style.display = 'none'


    startButton.onclick = () => {
        game.start()
        startButton.style.display = 'none'
        gameLogo.style.display = 'none'
        introText.style.display = 'none'
        movements.style.display = 'initial'
        
        // que vuelva a aparecer el boton una vez muera
    }

    window.addEventListener('keydown', (event) => {
        game.setupListeners(event)
      })
    
      window.addEventListener('keyup', (event) => {
        game.setupListeners(event)
      })
})