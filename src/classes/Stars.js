class Stars{
    constructor(position, velocity, radius, color, opacity){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = opacity;
    }

    draw(ctx){
        ctx.save();
        ctx.globalAlpha = this.opacity;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore();
    }

    update(ctx, canvasHeight, deltaTime){
        this.draw(ctx);

        this.position.y += this.velocity.y * deltaTime / 1000;

        if(this.position.y - this.radius > canvasHeight){
            this.position.y = -this.radius;
            this.position.x = Math.random() * window.innerWidth;
        }
    }
}

function randomBetween(min, max){
    return Math.random() *(max - min) + min;
}

function createStar(canvasWidth){
    const types = [
        { radius: 0.8, speed: 12, opacity: 0.5 },
        { radius: 1,   speed: 18, opacity: 0.10 },
        { radius: 1.2, speed: 30, opacity: 0.12 },

        { radius: 1.5, speed: 36, opacity: 0.15 },
        { radius: 1.8, speed: 42, opacity: 0.18 },

        { radius: 2.2, speed: 48, opacity: 0.22 },
        { radius: 2.6, speed: 54, opacity: 0.25 },

        { radius: 3,   speed: 60, opacity: 0.28 }
    ];

    const type = types[Math.floor(Math.random() * types.length)];

    return new Stars(
        {
            x: Math.random() * canvasWidth,
            y: Math.random() * - canvasWidth
        },
        {
            x: randomBetween(-0.2, 0.2),
            y: type.speed + randomBetween(-0.2, 0.2)
        },
        type.radius + randomBetween(-0.3, 0.3),
        "white",
        type.opacity + randomBetween(-0.1, 0.1)
    );
}

export {createStar};
export default Stars;