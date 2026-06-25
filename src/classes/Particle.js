class Particle{
    constructor(position, velocity, radius, color){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1

    }

    draw(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.opacity;
        ctx.arc(
            this.position.x, 
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update(deltaTime){
        this.position.x += this.velocity.x * deltaTime /1000;
        this.position.y +=this.velocity.y * deltaTime /1000;
        this.opacity -= 1.5 * deltaTime /1000
        if(this.opacity < 0)this.opacity = 0 
    }
}

export default Particle;