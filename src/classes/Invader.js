import { PATH_COGS_IMAGE, PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile from "./projetcile.js";

class Invader{
    constructor(position, velocity) {
        this.width = 50 * 0.8;
        this.height = 37 * 0.8;
        this.velocity = 200;
        this.position = position

        this.image = this.getImage(PATH_INVADER_IMAGE);
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

    moveDown(){
        this.position.y += this.height;
    }

    incrementVelocity(boost){
        this.velocity += boost;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    shoot(projectiles){
        const p = new Projectile({
            x: this.position.x + this.width /2 -1,
            y: this.position.y + this.height,
            },
            450
        );

        projectiles.push(p);
    }

    hit(projectile){
        return(
            projectile.position.x >= this.position.x && 
            projectile.position.x <= this.position.x + this.width && 
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        )
    } 
}

export default Invader;
