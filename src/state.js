import { GameMap } from './game_map';
import { HUD } from './HUD';
export class GameState {
    constructor() {
        this.hud = new HUD();
        this.map = new GameMap();
    }

    update() {
        this.hud.update();
        this.map.update();
    }

    render(ctx) {
        this.map.render(ctx);

        // hud renders over everything.
        this.hud.render(ctx);
    }
}
