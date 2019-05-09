import Entity from './entity';

import {Body} from 'matter-js';
import {Howl} from 'howler';
import getResource from './image_loader';

let bacteriaSound = new Howl({src:'./res/sfx/bacteria_die1.ogg', volume: 0.6});
let bacteriaMergeSound = new Howl({src:'./res/sfx/merge_sound.ogg', volume: 0.15});

function randRange(min, max) {
    return (Math.random() * (max - min)) + min;
}

function randDirection() {
    return {
        x: randRange(-1.0, 1.0),
        y: randRange(-1.0, 1.0),
    };
}

// WanderingBacteria will travel aimlessly 
// through the map
class WanderingBacteria extends Entity {
    constructor(x, y) {
        super(x, y, 48, 43, {
            isStatic: false,
            tag: 'germ',
        });
        this.identified = false;

        this.damage = 6;
        this.size = 1.0; // size multiplier.
        this.speed = 0.05;
        this.scaleCount = 0;

        // we can't get any more than 4* bigger.
        this.maxScale = 4;

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
        if (this.scaleCount >= this.maxScale) {
            // we're too big!
            return;
        }

        // we only play the merge sound after
        // the first merge. 
        if (this.scaleCount > 1) {
            bacteriaMergeSound.play();
        }

        this.size += 0.15;

        this.width *= this.size;
        this.height *= this.size;
        Body.scale(this.body, this.size, this.size);
        this.scaleCount++;
    }

    hit(other) {
        switch (other.body.tag) {
        case 'cis':
            // we die!
            super.damaged(this.health);
            break;
        case 'germ':
            if (this.size >= other.size && this.timeAlive > other.timeAlive) {
                other.silentlyDie();
                this.grow();
            } else if (this.timeAlive >= other.timeAlive) {
                other.silentlyDie();
                this.grow();
            }
            break;
        default:
            this.damaged(other.damage);
        }
    }

    attack(entity) {
        // TODO gravitate them towards the CIS.
    }

    // move in a random path
    changePath() {
        // generate a random direction -1, to 1
        const dir = randDirection();

        // slow it down a bit!
        let xf = (this.body.mass * (dir.x * this.speed)) * randRange(-0.1, 0.1);
        let yf = (this.body.mass * (dir.y * this.speed)) * randRange(-0.1, 0.1);
        // apply the force
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

        const SECOND = parseInt(window.sessionStorage.getItem('secondDuration'));
        if ((new Date().getTime() - this.dirTimer) > moveChangeTime * SECOND) {
            if (randRange(0, 500) > 450) {
                this.identified = true;
            }

            this.changePath();
            this.dirTimer = new Date().getTime();
        }
    }

    render(cam, ctx) {
        // TODO only render healthbar when we hover or click an entity?
        // this.renderHealthBar(cam, ctx);
        
        this.img = this.identified ? this.defaultImage : this.imgSil;

        const { x, y } = this.body.position;
        
        const xPos = (x - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y;
        ctx.drawImage(this.img, xPos, yPos, this.width, this.height);
        
        if (window.sessionStorage.getItem('debug') === 'true') {
            ctx.fillStyle = "#ff00ff";
            ctx.strokeRect(xPos, yPos, this.width, this.height);
            ctx.stroke();
        }
    }
}

export default WanderingBacteria;