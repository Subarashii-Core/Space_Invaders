import { INITIAL_FRAMES, PATH_BLACKBIRD_IMAGE, PATH_ENGINE_IMAGE, PATH_ENGINE_SPRITES, PATH_ENTERPRISE_IMAGE, PATH_FALCON_IMAGE, PATH_SPACESHIP_IMAGE } from "../utils/constants.js";
import Projectile from "./projetcile.js";

class Player{
    constructor(canvasWidth, canvasHeight) {
        this.alive = true;
        this.width = 48 * 2;
        this.height = 48 * 2;
        // this.width = 772 / 10;
        // this.height = 1389 / 10;
        // this.width = 778 / 10;
        // this.height = 1112 / 11;
        // this.width = 548 / 10;
        // this.height = 1152 /10;
        this.velocity = 450;

        this.position = {
            x: canvasWidth/2 - this.width/2,
            y: canvasHeight - this.height - 30,
        };
        // this.image = this.getImage(PATH_ENTERPRISE_IMAGE);
        // this.image = this.getImage(PATH_FALCON_IMAGE);
        // this.image = this.getImage(PATH_BLACKBIRD_IMAGE);
        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITES);

        this.sx = 0;
        this.framesCounter = INITIAL_FRAMES;
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    moveLeft(deltaTime){
        this.position.x -= this.velocity * deltaTime / 1000
    }

    moveRight(deltaTime){
        this.position.x += this.velocity * deltaTime / 1000
    }

    draw(ctx) {
        ctx.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );

        ctx.drawImage(
            this.engineSprites, 
            this.sx,
            0, 
            48, 
            48,
            this.position.x,
            this.position.y + 10,
            this.width,
            this.height
        );

        ctx.drawImage(
            this.engineImage, 
            this.position.x, 
            this.position.y + 8, 
            this.width, 
            this.height
        );

        this.update();
    }

    update() {
        if (this.framesCounter === 0){
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.framesCounter = INITIAL_FRAMES;
        }

        this.framesCounter--;
    }

    shoot(projectiles){
        const p = new Projectile({
            x: this.position.x + this.width /2 -1,
            y: this.position.y + 4,
            },
            -600
        );

        projectiles.push(p);
    }

    hit(projectile){
        return(
            projectile.position.x >= this.position.x + 20 && 
            projectile.position.x <= this.position.x + 20 + this.width - 38 && 
            projectile.position.y >= this.position.y + 22 &&
            projectile.position.y <= this.position.y + 22 + this.height - 34
        )
    }
}

export default Player;