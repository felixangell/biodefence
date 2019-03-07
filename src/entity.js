const MaxHealth = 100;

export class Entity {
    constructor(x, y) {
        this.pos = { x, y };
        this.health = MaxHealth;
    }

    update() {}
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

export class GermThingy extends Entity {
    update() {

    }

    render(ctx) {
        this.renderHealthBar(ctx);

        const { x, y } = this.pos;
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(x, y, 32, 32); 
    }
}