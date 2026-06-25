import Grid from "./classes/Grid.js";
import Invader from "./classes/Invader.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/player.js";
import Projectile from "./classes/projetcile.js";
import SoundEffects from "./classes/SoundEffects.js";
import Cheats from "./classes/Cheats.js";
import Stars, {createStar} from "./classes/stars.js";
import { gameState, STAR_COUNT } from "./utils/constants.js";

const soundEffects = new SoundEffects()

const startScreen = document.querySelector(".start-screen")
const gameOverScreen = document.querySelector(".game-over")
const scoreUi = document.querySelector(".score-ui")
const scoreElement = document.querySelector(".score>span")
const levelElement = document.querySelector(".level>span")
const highElement = document.querySelector(".high>span")
const buttonPlay = document.querySelector(".button-play")
const buttonRestart = document.querySelector(".button-restart")
const fpsCounter = document.querySelector("#fps")

gameOverScreen.remove();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

let currentState = gameState.START;

const gameData = {
    score: 0,
    level: 1,
    high: 0,
}

const showGameData = () =>{
    scoreElement.textContent = gameData.score
    levelElement.textContent = gameData.level
    highElement.textContent = gameData.high
}

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];
const stars = []; 

for(let i=0; i < 100; i++){
    stars.push(createStar(canvas.width));
}

const initObstacles = () => {
    const x = canvas.width/2 - 50
    const y = canvas.height - 250
    const offset = canvas.width *0.15
    const color = "crimson"

    const obstacle1 = new Obstacle({x: x - offset, y}, 100, 20, color);
    const obstacle2 = new Obstacle({x: x + offset, y}, 100, 20, color);

    obstacles.push(obstacle1)
    obstacles.push(obstacle2)
}

initObstacles();

const cheats = new Cheats();

window.addEventListener("keydown", (event) => {
    cheats.handleInput(event.key);
})

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    }
}

const incrementScore = (value) => {
    gameData.score += value;

    if(gameData.score > gameData.high){
        gameData.high = gameData.score;
    }
}

const drawObstacles = () => {
    obstacles.forEach((obstacle) => obstacle.draw(ctx))
}

const drawProjectiles = (deltaTime) => {
    const projectiles = [...playerProjectiles, ...invaderProjectiles]
    
    projectiles.forEach((Projectile) => {
        Projectile.draw(ctx);
        Projectile.update(deltaTime);
    })
}

const drawStars = (deltaTime) =>{
    stars.forEach(star => {
        star.update(ctx, canvas.height, deltaTime);
    })
}

const drawParticles = (deltaTime) => {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update(deltaTime);
    })
}

const clearProjectiles = () => {
    playerProjectiles.forEach((Projectile, index) => {
        if (Projectile.position.y <= 0){
            playerProjectiles.splice(index, 1)
        }
    })
}

const clearParticles = () => {
    particles.forEach((particle, i) => {
        if(particle.opacity <= 0){
            particles.splice(i, 1);
        }
    })
}

const createExplosion = (position, size, color) => {
    for (let i = 0; i < size; i += 1) {
        const particle = new Particle(
            {
                x: position.x,
                y: position.y,
            },
            {
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
            },
            2,
            color
        );
        particles.push(particle);
    }
}

const checkShootInvaders = () =>{
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if(invader.hit(projectile)){
                soundEffects.playHitSound()
                createExplosion(
                    {
                        x: invader.position.x + invader.width/2,
                        y: invader.position.y + invader.height/2,
                    },
                    15,
                    "#941CFF"
                );

                incrementScore(20);

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }
        })
    })
}

const checkShootPlayer = () =>{
    invaderProjectiles.some((projectile, i) => {
        if(player.hit(projectile)){
            soundEffects.playExplosionSound()
            invaderProjectiles.splice(i, 1)
            gameOver();
        }
    })
}

const checkShootObstacles = () => {
    obstacles.forEach((obstacle) =>{
        playerProjectiles.some((projectile, i) => {
            if(obstacle.hit(projectile)){
                playerProjectiles.splice(i, 1)   
            }
        })
        invaderProjectiles.some((projectile, i) => {
            if(obstacle.hit(projectile)){
                invaderProjectiles.splice(i, 1)   
            }
        })
    })
}

const spawnGrid = () => {
    if (grid.invaders.length === 0){
        soundEffects.playNextLevelSound()

        grid.rows = Math.round(Math.random() * 9 + 1)
        grid.cols = Math.round(Math.random() * 6 + 1)
        grid.restart();

        gameData.level += 1;
    }
}

const gameOver = () => {
    createExplosion({x: player.position.x + player.width/2, y:player.position.y + player.height/2}, 15, "white");
    createExplosion({x: player.position.x + player.width/2, y:player.position.y + player.height/2}, 5, "#4D9BE6");
    createExplosion({x: player.position.x + player.width/2, y:player.position.y + player.height/2}, 5, "crimson");

    currentState = gameState.GAME_OVER;
    player.alive = false;
    document.body.append(gameOverScreen)
}

let lastTime = performance.now()
let fps = 0
let frameCount = 0
let lastFpsUpdate = 0

const gameLoop = (currentTime) => {
    frameCount ++;

    if(currentTime - lastFpsUpdate >= 250){
        fps = Math.round(frameCount * 1000 / (currentTime - lastFpsUpdate))

        frameCount = 0
        lastFpsUpdate = currentTime

        fpsCounter.textContent = `FPS: ${fps}`
    }

    const deltaTime = currentTime - lastTime
    lastTime = currentTime

    //console.log(deltaTime)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(currentState === gameState.START){
        player.alive = false;
        drawStars(deltaTime);
        drawObstacles();
        grid.draw(ctx);
        grid.update(player.alive, deltaTime);
        player.draw(ctx);
    }

    if(currentState == gameState.PLAYING){
        player.alive = true;
        showGameData();
        spawnGrid();

        drawObstacles();
        drawParticles(deltaTime);
        drawProjectiles(deltaTime);
        drawStars(deltaTime);

        clearProjectiles(deltaTime);
        clearParticles(deltaTime);

        checkShootInvaders();
        checkShootPlayer();
        checkShootObstacles();

        grid.draw(ctx);
        grid.update(player.alive, deltaTime);

        ctx.save();

        ctx.translate(
            player.position.x + player.width/2, 
            player.position.y + player.height/2
        )

        if (keys.shoot.pressed && keys.shoot.released){
            soundEffects.playShootSound()
            player.shoot(playerProjectiles);     
            keys.shoot.released = false;
        }

        if(keys.left && player.position.x >= 0){
            player.moveLeft(deltaTime);
            ctx.rotate(-0.15)
        }
        
        if(keys.right && player.position.x <= canvas.width - player.width){
            player.moveRight(deltaTime)
            ctx.rotate(+0.15)
        }

        ctx.translate(
            - player.position.x - player.width/2, 
            - player.position.y - player.height/2
        )

        player.draw(ctx);

        ctx.restore();    
    }

    if(currentState == gameState.GAME_OVER){
        checkShootObstacles();
        drawParticles(deltaTime);
        drawObstacles();
        drawProjectiles(deltaTime)
        drawStars(deltaTime);

        clearProjectiles();
        clearParticles();

        grid.draw(ctx);
        grid.update(player.alive, deltaTime);
    }

    requestAnimationFrame(gameLoop);
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas)

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    
    if(key === "a") keys.left = true;
    if(key === "d") keys.right = true; 
    if(key === "enter") keys.shoot.pressed = true
})

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    
    if(key === "a") keys.left = false;
    if(key === "d") keys.right = false;
    if(key === "enter") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    } 
});

buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = gameState.PLAYING;

        setInterval(() => {
        const invader = grid.getRandomInvader()

        if(invader){
            invader.shoot(invaderProjectiles)
        }

    }, 1000)
})

buttonRestart.addEventListener("click", () => {
    currentState = gameState.PLAYING
    player.alive = true;

    grid.invaders.length = 0;
    grid.invaderVelocity = 1;

    gameData.score = 0
    gameData.level = 0

    invaderProjectiles.length = 0;

    gameOverScreen.remove()
})

requestAnimationFrame(gameLoop);
