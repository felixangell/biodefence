import { GermThingy, NexusThingy } from "./entity";

export class Tile {
    constructor(id, img) {
        this.id = id;
        this.img = img;
    }
    
    update() { }
    render(ctx, x, y) {
        ctx.drawImage(this.img, x, y);
    }
}

let lastTileId = 0;
let tileRegister = new Map();

function registerTile(imgLink) {
    const img = new Image();
    img.src = imgLink;
    img.onload = () => {
        let tile = new Tile(lastTileId++, img);
        tileRegister.set(tile.id, tile);
    };
}

function lookupTile(id) {
    return tileRegister.get(id);
}

export class GameMap {
    constructor() {
        registerTile('https://i.imgur.com/FoeO51W.png');

        this.tileData = [];
        this.width = 64;
        this.height = 64;
        for (let i = 0; i < this.width * this.height; i++) {
            this.tileData[i] = 0;
        }

        this.entities = [
            // spawn a nexus thingy at 256, 256
            new NexusThingy(256, 256),

            // spawn a germ thingy at 50, 50
            new GermThingy(50, 50),
        ];
    }

    update() {
        for (const e of this.entities) {
            e.update();
        }
    }

    render(ctx) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const id = this.tileData[x + y * this.height];
                const tileSize = 192;

                const tile = lookupTile(id);
                if (tile) {
                    tile.render(ctx, x * tileSize, y * tileSize);
                }
            }
        }

        for (const e of this.entities) {
            e.render(ctx);
        }
    }
}