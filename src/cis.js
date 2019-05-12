import Entity from './entity';

import getResource from './image_loader';
import {Engine} from './engine';

let cisHitSound = new Howl({src:'./res/sfx/cis_hit_sound.wav', volume:0.8});

class HashSet {
    constructor() {
        this.data = new Map();
    }

    add(...values) {
        for (const value of values) {
            this.data.set(value, true); 
        }
    }

    has(value) {
        return this.data.has(value);
    }
}

// This is where units are generated from by the player.
class CentralImmuneSystem extends Entity {
    constructor(x, y) {
        // gross hardcoded width, but hey ho
        super(x, y, 213, 227, {
            isStatic: true,
            tag: 'cis',
        });

        // all of the _tags_ that the CIS is immune to.
        this.immunities = new HashSet();

        // DEFAULT IMMUNITIES
        // by default, these are all friendly
        // so they dont cause damage to the cis
        this.immunities.add(
            'antibody',
            'phagocyte'
        );

        Engine.listenFor('addImmunity', (evt) => {
            const immunity = evt.detail;
            this.immunities.add(immunity);
        });

        this.image = getResource('cis.png');
        this.shieldedImage = getResource('cis_shielded.png');

        this.deathSound = new Howl({src:'./res/sfx/cis_death.ogg'});
        this.hitShieldSound = new Howl({src:'./res/sfx/shield_hit.ogg'});
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

    damaged(damage) {
        super.damaged(damage);
        cisHitSound.play();
    }

    // when this is called, we are _being_ hit, not hitting
    // another object per se. that being said we sitll want
    // to damage germs, etc.
    hit(other) {
        if (this.shielded) {
            this.hitShieldSound.play();
            return;
        }

        Engine.emit('cisTakenDamage');

        if (!this.immunities.has(other.body.tag)) {
            this.damaged(other.damage);
        }
    }

    render(cam, ctx) {
        this.renderHealthBar(cam, ctx);

        const { x, y } = this.body.position;
        ctx.fillStyle = "#00ff00";

        const xPos = (x - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y;

        const image = this.shielded ? this.shieldedImage : this.image;
        ctx.drawImage(image, xPos, yPos);
        
        if (window.sessionStorage.getItem('debug') === 'true') {
            ctx.fillStyle = "#ff00ff";
            ctx.strokeRect(xPos, yPos, this.width, this.height);
            ctx.stroke();
        }
    }
}

export default CentralImmuneSystem;