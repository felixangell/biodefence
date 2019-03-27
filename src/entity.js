import Matter, {Body, Common} from 'matter-js';

// by default, _all_ entities have
// a health of 100 unless specified otherwise.
const DefaultEntityHealth = 100;

export class Entity {

    // creates a new entity,
    // isStatic defines whether the entity
    // is a static body or not, i.e. if it
    // will move at all.
    constructor(x, y, width, height, options) {
        this.health = DefaultEntityHealth;

        // we have to store the size since for
        // some reason the physics engine doesnt
        // store it.
        this.width = width;
        this.height = height;
        this.damage = 1;

        this.body = Matter.Bodies.rectangle(x, y, width, height, options);
    }

    // invoked when this entity
    // was hit (collided) with the
    // entity other.
    hit(other) {}
    
    update() {}

    render(cam, ctx) {}

    // renders the entities health bar above 
    // the head of the entity.
    renderHealthBar(cam, ctx) {
        ctx.fillStyle = "#ff0000";
        const { x, y } = this.body.position;

        const barHeight = 8;
        const barWidth = this.health;
        ctx.fillRect(x - cam.pos.x, y - cam.pos.y - (barHeight * 2), barWidth, barHeight);
    }
}

// This is where units are generated from by the player.
export class CentralImmuneSystem extends Entity {
    constructor(x, y) {
        super(x, y, 128, 128, {
            isStatic: true,
            tag: 'cis',
        });

        // CIS deals two damage
        this.damage = 2;
    }
    
    update() {
        if (this.health < 0) {
            // game over!
            this.health = 0;
        }
    }

    hit(other) {
        // only germs will damage the health of
        // the CIS.
        if (other.body.tag === 'germ') {
            this.health -= other.damage;
        }
    }

    render(cam, ctx) {
        this.renderHealthBar(cam, ctx);

        const { x, y } = this.body.position;
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x - cam.pos.x, y - cam.pos.y, this.width, this.height);
    }
}

// https://imgur.com/j7VTlvc
export class ForeignGerm extends Entity {
    constructor(x, y) {
        super(x, y, 50, 50, {
            isStatic: false,
            tag: 'germ',
        });
        this.damage = 1;

        // this germ has not been identified yet!
        this.identified = false;

        // FIXME proper image loading.
        const img = new Image();
        img.src = 'https://i.imgur.com/fCKP3ZT.png';
        this.img = img;
    }

    hit(other) {
        if (other.body.tag === 'cis') {
            // we hit the CIS, this bacterias health should die

            // TODO we need to see how much damage the CIS
            // would deal to this bacteria?
            this.health = 0;
        }
    }

    attack(entity) {
        let force = 0.02 * this.body.mass * Math.random();

        Body.applyForce(this.body, this.body.position, { 
            x: force, 
            y: force,
        });
    }

    update() {
    }

    render(cam, ctx) {
        this.renderHealthBar(cam, ctx);

        if (!this.identified) {
            // TODO
            // render the silhouette instead
            return
        }

        const { x, y } = this.body.position;
        ctx.drawImage(this.img, x - cam.pos.x, y - cam.pos.y, this.width, this.height); 
    }
}