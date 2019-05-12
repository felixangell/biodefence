import Matter, {Events} from 'matter-js';
import CentralImmuneSystem from "./cis";
import Camera from './camera';
import getResource from './image_loader';
import GameOverState from './game_over_state';
import WanderingBacteria from './bacteria';
import Spawner from './spawner';
import DefenceTurret from './defence_turret';

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

        if (window.sessionStorage.getItem('debug') === 'true') {
            ctx.fillStyle = "#ff00ff";
            ctx.strokeRect(x - cam.pos.x, y - cam.pos.y, this.img.width, this.img.height);
            ctx.stroke();
        }
    }
}

function randRange(min, max) {
    return (Math.random() * (max - min)) + min;
}

// this is for when registering a tile,
// we increment this counter.
let lastTileId = 0;

// a very simple 'caching' system so that we
// can re-use tile instances.
let tileRegister = new Map();

function registerTile(imgPath) {
    getResource(imgPath, (img) => {
        let tile = new Tile(lastTileId++, img);
        tileRegister.set(tile.id, tile);
    });
}

function lookupTile(id) {
    return tileRegister.get(id);
}

export class GameMap {
    constructor(stateManager) {
        this.stateManager = stateManager;

        // for now we register a test tile.
        registerTile('ground_tile.jpg');

        // a 1d array of the tile data, i.e.
        // the tile ids [ 0 0 0 0, 1 0 1 0 ]
        // would represent a 4x2 map.
        this.tileData = [];

        this.bodies = new Map();

        // how many tiles in size the game map is.
        this.width = 16;
        this.height = 16;

        this.activePowerups = new Map();

        // TODO allow this to support multiple
        // event listeners
        this.on = new Map();

        const { width, height } = document.getElementById('game-container');

        let viewport = {
            width: width,
            height: height,
        };
        const mapDimension = {
            width: this.width * TileSize,
            height: this.height * TileSize,
        };
        this.cam = new Camera(viewport, mapDimension);

        this.spawners = [];

        // this could be changed depending on the difficulty
        // of the game, i.e. the more spawners the harder!
        const spawnerBoxCount = 4;
        const size = spawnerBoxCount / 2;
        
        console.log(viewport);
        const mapWidth = this.width * TileSize;
        const regionSize = mapWidth / size;

        let offs = 0;
        if (window.sessionStorage.getItem('debug') === 'true') {
            // move the spawners closer in when debugging
            offs = (2 * TileSize);
        }

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                console.log(x, y, regionSize);
                this.spawners.push(new Spawner(x * regionSize + offs, y * regionSize + offs, this));
            }
        }

        // fill the map up with 0 tiles
        for (let i = 0; i < this.width * this.height; i++) {
            this.tileData[i] = 0;
        }

        // our physics engine is created here,
        // and we disable the gravity as the game
        // is top down.
        this.engine = Matter.Engine.create();
        this.engine.enableSleeping = true;
        // disable gravity.
        this.engine.world.gravity.scale = 0;

        Matter.Engine.run(this.engine);

        // entitiy list, with a few test entities
        // added.
        this.entities = new Map();

        const cisX = mapDimension.width / 2;
        const cisY = mapDimension.height / 2;
        this.cis = new CentralImmuneSystem(cisX, cisY);
        this.addEntity(this.cis);

        Events.on(this.engine, 'collisionActive', (event) => {
            for (const body of event.pairs) {
                const a = this.entities.get(body.bodyA);
                const b = this.entities.get(body.bodyB);

                a.hit(b);
                b.hit(a);
            }
        });

        this.elapsedTime = new Date().getTime();

        // default to focus on the CIS.
        this.focusOnCIS();

        this.addEntity(new DefenceTurret(cisX + 400, cisY - 400));
        this.addEntity(new DefenceTurret(cisX - 400, cisY - 400));
        this.addEntity(new DefenceTurret(cisX - 400, cisY + 400));
    }

    onAgeIncrease(newAge) {
        // TODO
    }

    spawnBacteria() {
        let x = randRange(0, 1280);
        let y = randRange(0, 720);

        const germ = new WanderingBacteria(x, y);
        germ.attack(this.cis);
        this.addEntity(germ);
    }

    focusOnCIS() {
        const { x, y } = this.cis.body.position;

        const { width, height } = document.getElementById('game-container');

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

    addPowerup(powerup) {
        // ensure that we don't have too many
        // powerups going at once.
        if (this.activePowerups.has(powerup.title)) {
            const active = this.activePowerups.get(powerup.title);
            if (active.length >= powerup.activeLimit) {
                return false;
            }
        } else {
            this.activePowerups.set(powerup.title, []);
        }

        this.activePowerups.get(powerup.title).push(powerup);
        // trigger any listeners
        if (this.on.has('powerupGained')) {
            this.on.get('powerupGained')(powerup);
        }
        powerup.onInvoke(this);
        // FIXME
        this.activePowerups.delete(powerup.title);
        return true;
    }

    // addEntity will add the given entity to the world,
    // but most importantly it adds the entities physics
    // body to the physics engines world register.
    addEntity(e) {
        if (this.on.has('entityAdd')) {
            this.on.get('entityAdd')(e);
        }

        Matter.World.addBody(this.engine.world, e.body);
        this.entities.set(e.body, e);
    }

    removeEntity(e) {
        // NASTY ISH HACK.
        // gross check here to see if the CIS died.
        // 
        // basically when the CIS dies, we start a timer
        // to let the explosion sound finish
        // before we jump right into the death state.
        if (e.constructor.name === 'CentralImmuneSystem') {
            this.gameOverTimer = new Date().getTime();
        }

        Matter.World.remove(this.engine.world, e.body);
        this.entities.delete(e.body);
    }

    tickSpawners() {
        for (let spawner of this.spawners) {
            spawner.doTick();
        }
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

        // if we have a gameover timer set,
        // wait for 15 seconds to pass and then
        // transition into the gameover state.
        if (this.gameOverTimer) {
            const SECOND = parseInt(window.sessionStorage.getItem('secondDuration'));
            if ((new Date().getTime() - this.gameOverTimer) > 5 * SECOND) {
                this.stateManager.requestState(new GameOverState());
            }
        }
    }

    render(ctx) {
        const tiledViewport = {
            width: Math.ceil(this.cam.viewport.width / TileSize) + 1,
            height: Math.ceil(this.cam.viewport.height / TileSize) + 1,
        };

        let camTx = Math.floor(this.cam.pos.x / TileSize);
        let camTy = Math.floor(this.cam.pos.y / TileSize);

        // here we render the game map
        // looping through each tile, looking the
        // tile id up in the tile cache
        // and rendering it, if it exists.
        for (let y = camTy; y < camTy + tiledViewport.height; y++) {
            for (let x = camTx; x < camTx + tiledViewport.width; x++) {
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

        // we have to render these above the entities
        // we dothis since the spawners are only ever
        // rendered in debug so they must be visible over
        // the entity to be able to see them!
        for (const spawner of this.spawners) {
            spawner.render(this.cam, ctx);
        }

        ctx.fillStyle = "#ffff00";
        ctx.fillText(`${camTx}, ${camTy}, entities: ${this.entities.size}, bodies: ${this.engine.world.bodies.length}`, 128, 128);
    }
}
