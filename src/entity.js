import Matter from 'matter-js';

const MaxHealth = 100;

export class Entity {
    constructor(x, y, isStatic) {
        this.health = MaxHealth;
        this.body = Matter.Bodies.rectangle(x, y, 32, 32, {isStatic: isStatic});
    }
    
    update() {
    }

    lerp() {
    }

    render(ctx) {}

    renderHealthBar(ctx) {
        ctx.fillStyle = "#ff0000";
        const { x, y } = this.body.position;

        const barHeight = 8;
        const barWidth = this.health;
        ctx.fillRect(x, y - (barHeight * 2), barWidth, barHeight);
    }
}

export class NexusThingy extends Entity {
    constructor(x, y) {
        super(x, y, false);
    }
    
    update() {

    }

    render(ctx) {
        this.renderHealthBar(ctx);

        const { x, y } = this.body.position;
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x, y, 128, 128);
    }
}

// https://imgur.com/j7VTlvc
export class GermThingy extends Entity {
    constructor(x, y) {
        super(x, y, false);

        const img = new Image();
        img.src = 'https://i.imgur.com/fCKP3ZT.png';
        this.img = img;
    }

    update() {

    }

    render(ctx) {
        this.renderHealthBar(ctx);

        const { x, y } = this.body.position;
        const size = 50;
        ctx.drawImage(this.img, x, y, size, size); 
    }
}