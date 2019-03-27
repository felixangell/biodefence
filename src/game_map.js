import Matter, {Events} from 'matter-js';
import { CentralImmuneSystem, ForeignGerm } from "./entity";
import Camera from './camera';

const TileSize = 192;

// This is likely to change. We store
// the id of the tile and the image that
// the tile uses.
export class Tile {
    constructor(id, img) {
        this.id = id;
        this.img = img;
    }
    
    update() { }

    // render draws the tile to the given
    // context at the coordinates x, y.
    render(cam, ctx, x, y) {
        ctx.drawImage(this.img, x - cam.pos.x, y - cam.pos.y);
    }
}

// this is for when registering a tile,
// we increment this counter.
let lastTileId = 0;

// a very simple 'caching' system so that we
// can re-use tile instances.
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
        // for now we register a test tile.
        registerTile('https://i.imgur.com/FoeO51W.png');

        // a 1d array of the tile data, i.e.
        // the tile ids [ 0 0 0 0, 1 0 1 0 ]
        // would represent a 4x2 map.
        this.tileData = [];

        this.bodies = new Map();

        // how many tiles in size the game map is.
        this.width = 64;
        this.height = 64;
        
        let viewport = {
            width: this.width * TileSize,
            height: this.height * TileSize,
        };
        this.cam = new Camera(viewport);

        // fill the map up with 0 tiles
        for (let i = 0; i < this.width * this.height; i++) {
            this.tileData[i] = 0;
        }

        // our physics engine is created here,
        // and we disable the gravity as the game
        // is top down.
        this.engine = Matter.Engine.create();
        // disable gravity.
        this.engine.world.gravity.scale = 0;

        Matter.Engine.run(this.engine);
        
        // entitiy list, with a few test entities
        // added.
        this.entities = new Map();

        const xCentre = (this.width * TileSize) / 2;
        const yCentre = (this.height * TileSize) / 2;

        this.cis = new CentralImmuneSystem(1280, 720);
        this.addEntity(this.cis);

        Events.on(this.engine, 'collisionStart', (event) => {
            for (const body of event.pairs) {
                const a = this.entities.get(body.bodyA);
                const b = this.entities.get(body.bodyB);
                
                a.hit(b);
                b.hit(a);
            }
        });

        let randInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        };

        for (let i = 0; i < 100; i++) {
            let x = randInRange(0, 1280);
            let y = randInRange(0, 720);
            const germ = new ForeignGerm(x, y);
            // for now presume they are identified.
            germ.identified = true;
            germ.attack(this.cis);
            this.addEntity(germ);
        }

        // default to focus on the CIS.
        this.focusOnCIS();
    }

    focusOnCIS() {
        const { x, y } = this.cis.body.position;
        
        const { width, height } = document.querySelector('#game-container');    
    
        // TODO we should take into account the bodies
        // size so that we can perfectly centre it.
        let xOff = (width / 2);
        let yOff = (height / 2);

        // work out where we need to look for the 
        // point to be in the centre of the screen.
        let px = x - xOff;
        let py = y - yOff;

        this.cam.focusOnPoint(px, py);
    }

    // addEntity will add the given entity to the world,
    // but most importantly it adds the entities physics
    // body to the physics engines world register.
    addEntity(e) {
        Matter.World.addBody(this.engine.world, e.body);
        this.entities.set(e.body, e);
    }

    removeEntity(e) {
        Matter.World.remove(this.engine.world, e.body);
        this.entities.delete(e.body);
    }

    update() {
        for (const [body, e] of this.entities) {
            // if we've died we want to remove the entity
            // from the game.
            if (e.health <= 0) {
                this.removeEntity(e);
            } else {
                e.update();
            }
        }
    }

    render(ctx) {
        // here we render the game map
        // looping through each tile, looking the 
        // tile id up in the tile cache
        // and rendering it, if it exists.
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const id = this.tileData[x + y * this.height];

                const tile = lookupTile(id);
                if (tile) {
                    tile.render(this.cam, ctx, x * TileSize, y * TileSize);
                }
            }
        }

        // we have to render the entities _after_
        // we render the tilemap.
        for (const [body, e] of this.entities) {
            e.render(this.cam, ctx);
        }
    }
}