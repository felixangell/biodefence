import WanderingBacteria from "./bacteria";

let spawnerCount = 0;

// TODO use a better rand function?
function randRange(min, max) {
    return (Math.random() * (max - min)) + min;
}

/**
    the way the game works is in each corner of the map we have
    spawners, these spawners will emit bacteria and diseases which will
    make their way to the center of the map which is where the CIS is.

    as the game progresses, the spawners properties change so that they
    spawn more rapidly or have a chance of spawning more diseases, etc.
 */
class Spawner {
    constructor(x, y, map) {
        this.spawnRate = 0.1;
        this.x = x;
        this.y = y;
        this.map = map;

        // radius in pixels.
        this.radius = 128;

        // assign the spawner an ID
        this.id = spawnerCount++;
        console.log('Created spawner', this.id, ' at', [this.x, this.y]);

        this.numSpawns = 0;

        // tick is the 'age' of the spawner
        this.tick = 0;

        // the most amount of bacteria we can spawn
        // in the current tick
        this.spawnLimit = 10;
    }

    spawn(e) {
        this.map.addEntity(e);
        this.numSpawns++;
    }

    // increments a tick, and changes the properties of the spawner
    doTick() {
        console.log('spawner', this.id, 'ticked!');

        let rad = this.radius / 2;

        let x = randRange(this.x - rad, this.x + rad);
        let y = randRange(this.y - rad, this.y + rad);

        console.log('spawning entity at', x, y);

        this.spawn(new WanderingBacteria(x, y));
        this.tick++;
    }

    render(cam, ctx) {
        const debug = window.sessionStorage.getItem('debug') === 'true';
        if (!debug) {
            return;
        }

        // we only render a little box in debug so we know
        // where the spawners are.
        ctx.fillStyle = "#ff00ff";

        const xPos = this.x - cam.pos.x;
        const yPos = this.y - cam.pos.y;

        // render the spawner id above the box.
        ctx.fillText(`${this.id} - ${this.numSpawns}`, xPos, yPos - 32);

        ctx.strokeStyle = "#ff00ff";
        ctx.strokeRect(xPos, yPos, 32, 32);

        // render the radius
        ctx.strokeStyle = "#00ffff";
        ctx.strokeRect(xPos - (this.radius), yPos - (this.radius), 32 + (this.radius*2), 32 + (this.radius*2));

        ctx.stroke();

        ctx.strokeStyle = "#000";

    }
}

export default Spawner;