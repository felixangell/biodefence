export class Entity {
    constructor(x, y) {
        this.pos = { x, y };
    }

    update() {}
    render(ctx) {}
}

export class NexusThingy extends Entity {
    update() {

    }

    render(ctx) {
        const { x, y } = this.pos;
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x, y, 128, 128);
    }
}

export class GermThingy extends Entity {
    update() {

    }

    render(ctx) {
        const { x, y } = this.pos;
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(x, y, 32, 32); 
    }
}