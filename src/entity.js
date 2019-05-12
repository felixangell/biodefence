import Matter, {Body} from 'matter-js';
import getResource from './image_loader';
import {Howl} from 'howler';
import {Engine, GameInfo} from './engine';

// by default, _all_ entities have
// a health of 100 unless specified otherwise.
const DefaultEntityHealth = 100;

let deathSound = new Howl({src:'./res/sfx/default_death_sound.ogg'});
let shieldUpSound = new Howl({src:'./res/sfx/shield_up.ogg'});
let shieldDownSound = new Howl({src:'./res/sfx/shield_down.ogg'});

let entityId = 0;

function dist(a, b) {
    return Math.sqrt((b.x - a.x) + (b.y - a.y));
}

function randRange(min, max) {
    return (Math.random() * (max - min)) + min;
}

function randDirection() {
    return {
        x: randRange(-1.0, 1.0),
        y: randRange(-1.0, 1.0),
    };
}

class Entity {

    // creates a new entity,
    // isStatic defines whether the entity
    // is a static body or not, i.e. if it
    // will move at all.
    constructor(x, y, width, height, options) {
        this.health = DefaultEntityHealth;

        this.id = entityId++;

        // we have to store the size since for
        // some reason the physics engine doesnt
        // store it.
        this.width = width;
        this.height = height;
        this.damage = 1;
        this.identified = true;
        this.options = options;
        this.showHealthBar = false;

        // by default this our death sound.
        this.deathSound = deathSound;
        this.body = Matter.Bodies.rectangle(x, y, width, height, options);

        // the icon image that will be shown
        // when the entity is clicked.
        this.iconImage = getResource('default_icon.png');

        window.addEventListener('click', (event) => {
            // if mouse intersects this entities bounds:

            Engine.emit('setPreview', this);
        });
    }

    // will damage this entity by amount, though
    // if it's shielded then nothing happens.
    // if we have no health, a death sound is played.
    damaged(amount) {
        if (this.shielded) {
            return;
        }

        this.showHealthBar = true;

        this.health -= amount;
        if (this.health == 0) {
            this.deathSound.play();
        }
    }

    // invoked when this entity
    // was hit (collided) with the
    // entity other.
    hit(other) {}

    changePath() {
        let dir = randDirection();
        // slow it down a bit
        let xf = (this.body.mass * (dir.x * this.speed)) * 0.1;
        let yf = (this.body.mass * (dir.y * this.speed)) * 0.1;

        // apply the force
        Body.applyForce(this.body, this.body.position, {
            x: xf,
            y: yf,
        });
    }

    // move in a random path
    changePathHoming() {
        const center = GameInfo.getCenterMap();
        const { x, y } = this.body.position;
        
        let dir = randDirection();
        if (randRange(0, 100) > 90) {
            let xd = Math.sign(center.x - x);
            let yd = Math.sign(center.y - y);

            dir = {
                x: xd,
                y: yd,
            };
        }

        // slow it down a bit
        let xf = (this.body.mass * (dir.x * this.speed)) * 0.1;
        let yf = (this.body.mass * (dir.y * this.speed)) * 0.1;

        // apply the force
        Body.applyForce(this.body, this.body.position, {
            x: xf,
            y: yf,
        });
    }
    

    update() {
        const { x, y } = this.body.position;
        if (x < -this.width) {
            this.die();
        }
        if (y < -this.height) {
            this.die();
        }
        
        if (this.shieldTimer) {
            const SECOND = parseInt(window.sessionStorage.getItem('secondDuration'));
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
        shieldUpSound.play();
    }

    die() {
        this.health = 0;
    }

    render(cam, ctx) {}

    // renders the entities health bar above
    // the head of the entity.
    renderHealthBar(cam, ctx) {
        ctx.fillStyle = "#ff0000";
        const { x, y } = this.body.position;

        // maybe the bar height should be relative to the size of the entity?
        const barHeight = 18;
        const barWidth = this.health;

        // calculate the x position for the bar to be rendered at
        // to be centre aligned.
        const xOff = (this.width - barWidth) / 2;

        const xPos = (x + xOff - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y - (barHeight * 2);
        ctx.fillRect(xPos, yPos, barWidth, barHeight);

        // this is stupid but the api only returns the text
        // width, apparently the letter 'M' is a good approximation
        // of the height of all characters in the font set.
        const metrics = ctx.measureText('M');

        ctx.fillStyle = "#fff";
        ctx.fillText(this.health.toFixed(2), xPos, yPos + barHeight - 2);

        // add a nice outline to the healthbar
        ctx.strokeStyle = "#000";
        ctx.strokeRect(xPos, yPos, barWidth, barHeight);
        ctx.stroke();

        // TODO(Felix): render the health vlaue
        // health/max health
        // inside the bar
    }
}

export default Entity;