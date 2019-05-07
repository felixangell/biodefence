import Entity from './entity';

import {Body} from 'matter-js';
import {Howl} from 'howler';
import getResource from './image_loader';

let bacteriaSound = new Howl({src:'./res/sfx/bacteria_die1.wav', volume: 0.6});
let bacteriaMergeSound = new Howl({src:'./res/sfx/merge_sound.wav', volume: 0.15});

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
class ForeignGerm extends Entity {
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

export default ForeignGerm;