import Entity from './entity';

import getResource from './image_loader';

// This is where units are generated from by the player.
class CentralImmuneSystem extends Entity {
    constructor(x, y) {
        super(x, y, 128, 128, {
            isStatic: true,
            tag: 'cis',
        });

        this.image = getResource('cis.png');
        this.shieldedImage = getResource('cis_shielded.png');

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

        const image = this.shielded ? this.shieldedImage : this.image;
        ctx.drawImage(image, xPos, yPos);
    }
}

export default CentralImmuneSystem;