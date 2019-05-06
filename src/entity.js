import Matter, {Body, Common} from 'matter-js';
import getResource from './image_loader';
import {Howl, Howler} from 'howler';

// by default, _all_ entities have
// a health of 100 unless specified otherwise.
const DefaultEntityHealth = 100;

let deathSound = new Howl({src:'./res/sfx/default_death_sound.wav'});
let shieldDownSound = new Howl({src:'./res/sfx/shield_down.wav'});

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

        // by default this our death sound.
        this.deathSound = deathSound;
        this.body = Matter.Bodies.rectangle(x, y, width, height, options);
    }

    damaged(amount) {
        if (this.shielded) {
            return;
        }
        this.health -= amount;
    }

    // invoked when this entity
    // was hit (collided) with the
    // entity other.
    hit(other) {}

    update() {
        if (this.shieldTimer) {
            const SECOND = 1000;
            const elapsed = (new Date().getTime() - this.shieldTimer);
            if (elapsed > (this.shieldDuration * SECOND)) {
                this.shielded = false;
                // shield down!
                shieldDownSound.play();
                this.shieldTimer = null;
            }
        }
    }

    revive() {
        // TODO should this be instant or happen gradually
        // over time, but still relatively fast. e.g. revives
        // a point every 0.5 second?
        this.health = DefaultEntityHealth;
    }

    shieldFor(duration) {
        this.shieldTimer = new Date().getTime();
        this.shieldDuration = duration;
        this.shielded = true;
    }

    render(cam, ctx) {}

    // renders the entities health bar above
    // the head of the entity.
    renderHealthBar(cam, ctx) {
        ctx.fillStyle = "#ff0000";
        const { x, y } = this.body.position;

        // maybe the bar height should be relative to the size of the entity?
        const barHeight = 8;
        const barWidth = this.health;

        // calculate the x position for the bar to be rendered at
        // to be centre aligned.
        const xOff = (this.width - barWidth) / 2;

        ctx.fillRect((x + xOff - (this.width / 2)) - cam.pos.x, (y - (this.height / 2)) - cam.pos.y - (barHeight * 2), barWidth, barHeight);
    }
}

// This is where units are generated from by the player.
export class CentralImmuneSystem extends Entity {
    constructor(x, y) {
        super(x, y, 128, 128, {
            isStatic: true,
            tag: 'cis',
        });

        this.deathSound = new Howl({src:'./res/sfx/cis_death.wav'});
        this.hitShieldSound = new Howl({src:'./res/sfx/shield_hit.wav'});
        this.damage = 100;
        
        // counter for reviving.
        this.startReviveTime = null;

        this.spawnTime = new Date().getTime();
    }

    revive() {
        // start the counter!
        this.startReviveTime = new Date().getTime();
    }

    update() {
        super.update();

        // handles the reviving counter.
        if (this.startReviveTime) {
            // a point every millisecond.
            const healPointInterval = 1;

            // if a {healPointerInterval} has passed
            // heal the CIS, or if we're past full health
            // delete the timer
            const healPoint = (new Date().getTime() - this.startReviveTime) > healPointInterval;
            if (healPoint) {
                if (this.health < DefaultEntityHealth) {
                    // health 10 points at a time.
                    this.health += 10;
                    this.startReviveTime = new Date().getTime();
                } else {
                    this.startReviveTime = null;
                }
            }
        }

        if (this.health <= 0) {
            // game over!
            this.health = 0;
        }
    }

    hit(other) {
        // only germs will damage the health of
        // the CIS.
        if (other.body.tag === 'germ') {
            super.damaged(other.damage);
        }
        if (this.shielded) {
            this.hitShieldSound.play();
        }
    }

    render(cam, ctx) {
        this.renderHealthBar(cam, ctx);

        const { x, y } = this.body.position;
        ctx.fillStyle = "#00ff00";

        const xPos = (x - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y;
        ctx.fillRect(xPos, yPos, this.width, this.height);

        if (this.shielded) {
            ctx.fillStyle = "#0000ff";
            const border = 4;
            ctx.strokeRect(xPos-border, yPos-border, this.width + (border*2), this.height + (border*2));
            ctx.stroke();
        }
    }
}

let bacteriaSound = new Howl({src:'./res/sfx/bacteria_die1.wav'});
let bacteriaMergeSound = new Howl({src:'./res/sfx/merge_sound.wav'});

function randRange(min, max) {
    return (Math.random() * max - min) + min;
}

function randDirection() {
    return {
        x: randRange(-1.0, 1.0),
        y: randRange(-1.0, 1.0),
    };
}

// https://imgur.com/j7VTlvc
export class ForeignGerm extends Entity {
    constructor(x, y) {
        super(x, y, 50, 50, {
            isStatic: false,
            tag: 'germ',
        });
        
        this.identified = false;

        this.damage = 6;
        this.size = 1.0; // size multiplier.
        this.speed = 0.05;

        // time alive + a slightly random offset
        // this is how we base the merging of bacteria
        this.timeAlive = new Date().getTime() - Math.random();

        this.deathSound = bacteriaSound;

        this.defaultImage = getResource('bacteria.png');
        this.imgSil = getResource('bacteria_s.png');

        this.dirTimer = new Date().getTime();
        this.changePath();

        this.img = this.imgSil;
    }

    silentlyDie() {
        this.health = 0;
    }

    grow() {
        this.size *= 1.25;
        Body.scale(this.body, size, size);
    }

    hit(other) {
        switch (other.body.tag) {
        case 'cis':
            super.damaged(this.health);
            break;
        case 'germ':
            if (this.size > other.size || this.timeAlive > other.timeAlive) {
                other.silentlyDie();
                this.size *= 1.25;
                bacteriaMergeSound.play();
            }
            break;
        }
    }

    attack(entity) {
        // TODO gravitate them towards the CIS.
    }

    // move in a random path
    changePath() {
        const dir = randDirection();
        let xf = (this.body.mass * (dir.x * this.speed)) * randRange(-0.1, 0.1);
        let yf = (this.body.mass * (dir.y * this.speed)) * randRange(-0.1, 0.1);
        Body.applyForce(this.body, this.body.position, {
            x: xf,
            y: yf,
        });
    }

    update() {
        super.update();
        
        // a bit gross, but the bacteria slows down
        // when identified + does less damage
        if (this.identified) {
            // TODO rather than set this, scale it and
            // do it once.
            // probably invoke a identify() function
            // once that does this for us.
            this.speed = 0.03;
            this.damage = 4;
        }

        const moveChangeTime = 0.3;

        const SECOND = 1000;
        if ((new Date().getTime() - this.dirTimer) > moveChangeTime * SECOND) {
            if (randRange(0, 500) > 450) {
                this.identified = true;
            }

            this.changePath();
            this.dirTimer = new Date().getTime();
        }
    }

    render(cam, ctx) {
        this.renderHealthBar(cam, ctx);
        
        this.img = this.identified ? this.defaultImage : this.imgSil;

        const { x, y } = this.body.position;
        const xPos = (x - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y;
        ctx.drawImage(this.img, xPos, yPos, this.width * this.size, this.height * this.size);
    }
}
