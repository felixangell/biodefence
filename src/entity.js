const MaxHealth = 100;

export class Entity {
    constructor(x, y) {
        this.pos = { x, y };
        this.delta = { x: 1, y: 0 };
        this.accel = 0;
        this.health = MaxHealth;
    }

    update() {
    }

    lerp() {
        // clamp accel
        if (this.accel >= 1) this.accel = 1;
        if (this.accel <= 0) this.accel = 0;
    
        this.pos.x += this.delta.x * this.accel;
        this.pos.y += this.delta.y * this.accel;
    }

    render(ctx) {}

    renderHealthBar(ctx) {
        ctx.fillStyle = "#ff0000";
        const { x, y } = this.pos;

        const barHeight = 8;
        const barWidth = this.health;
        ctx.fillRect(x, y - (barHeight * 2), barWidth, barHeight);
    }
}

export class NexusThingy extends Entity {
    update() {

    }

    render(ctx) {
        this.renderHealthBar(ctx);

        const { x, y } = this.pos;
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x, y, 128, 128);
    }
}

// https://imgur.com/j7VTlvc
export class GermThingy extends Entity {
    constructor(x, y) {
        super(x, y);

        const img = new Image();
        img.src = 'https://i.imgur.com/fCKP3ZT.png';
        this.img = img;
    }

    update() {
        this.lerp();
        this.delta.x = 1;
        this.accel += 0.01;
    }

    render(ctx) {
        this.renderHealthBar(ctx);

        const { x, y } = this.pos;
        const size = 50;
        ctx.drawImage(this.img, x, y, size, size); 
    }
}