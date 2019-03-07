import { GermThingy } from "./entity";

export class GameMap {
    constructor() {
        this.entities = [
            new GermThingy(50, 50),
        ];
    }

    update() {
        for (const e of this.entities) {
            e.update();
        }
    }

    render(ctx) {
        for (const e of this.entities) {
            e.render(ctx);
        }
    }
}