import Matter from 'matter-js';
import getResource from './image_loader';
import {Howl} from 'howler';

// by default, _all_ entities have
// a health of 100 unless specified otherwise.
const DefaultEntityHealth = 100;

let deathSound = new Howl({src:'./res/sfx/default_death_sound.wav'});
let shieldDownSound = new Howl({src:'./res/sfx/shield_down.wav'});

class Entity {

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
        this.identified = true;

        // by default this our death sound.
        this.deathSound = deathSound;
        this.body = Matter.Bodies.rectangle(x, y, width, height, options);

        // the icon image that will be shown
        // when the entity is clicked.
        this.iconImage = getResource('default_icon.png');
    }

    // will damage this entity by amount, though
    // if it's shielded then nothing happens.
    // if we have no health, a death sound is played.
    damaged(amount) {
        if (this.shielded) {
            return;
        }
        this.health -= amount;
        if (this.health == 0) {
            this.deathSound.play();
        }
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

        const xPos = (x + xOff - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y - (barHeight * 2);
        ctx.fillRect(xPos, yPos, barWidth, barHeight);

        if (window.sessionStorage.getItem('debug') === 'true') {
            ctx.fillStyle = "#ff00ff";
            ctx.strokeRect(xPos, yPos, barWidth, barHeight);
            ctx.stroke();
        }
    }
}

export default Entity;