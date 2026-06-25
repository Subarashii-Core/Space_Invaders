class Projectile{
    constructor (position, velocity){
        this.position = position;
        this.width = 2;
        this.height = 20;
        this.velocity = velocity;
    }

    draw(ctx){
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime){
        this.position.y += this.velocity * deltaTime / 1000;
    }
}

export default Projectile;