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

const damageWhenUnidentified = 2;
const damageWhenIdentified = 1;

// PhagocyteBacteria
class PhagocyteBacteria extends Entity {
    constructor(x, y) {
        super(x, y, 154, 154, {
            isStatic: false,
            tag: 'phagocyte',
        });
        this.identified = true;

        this.baseDamage = damageWhenUnidentified;
        this.size = 1.0; // size multiplier.
        this.speed = 0.05;
        this.scaleCount = 0;

        // we can't get any more than 4* bigger.
        this.maxScale = 4;

        // time alive + a slightly random offset
        // this is how we base the merging of bacteria
        this.timeAlive = new Date().getTime() - Math.random();

        this.deathSound = bacteriaSound;

        this.defaultImage = getResource('phagocyte.png');

        this.dirTimer = new Date().getTime();
        this.changePath();

        this.img = this.imgSil;
    }

    silentlyDie() {
        this.health = 0;
    }

    hit(other) {
        // TODO handle the diseases.
        switch (other.body.tag) {
        case 'germ':
            break;
        default:
            // anything that isn't in this switch case doesn't do anything
            console.log('phagocyte', other.body.tag);
            return;
        }

        console.log('phagocyte hit by ', other.health, ' dealing ', other.damage);

        // kill the entity that hit us.
        other.die();
        
        // take some damage
        this.damaged(Math.min(other.damage, 1));
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
        
        if (this.identified) {
            this.baseDamage = this.damageWhenIdentified;
            this.speed = 0.03;
        }
        // 2x1, 2x2, 2x3, 2x4
        // when identified
        // 1x1, 1x2, 1x3, 1x4
        this.damage = this.baseDamage * this.scaleCount;

        const moveChangeTime = 0.3;

        const SECOND = parseInt(window.sessionStorage.getItem('secondDuration'));
        if ((new Date().getTime() - this.dirTimer) > moveChangeTime * SECOND) {
            // regenerate some health
            if (this.health < 100) {
                this.health += 0.001;
            }

            this.changePath();
            this.dirTimer = new Date().getTime();
        }
    }

    render(cam, ctx) {
        this.renderHealthBar(cam, ctx);
        
        const { x, y } = this.body.position;
        
        const xPos = (x - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y;
        ctx.drawImage(this.defaultImage, xPos, yPos, this.width, this.height);
        
        if (window.sessionStorage.getItem('debug') === 'true') {
            ctx.fillStyle = "#ff00ff";
            ctx.strokeRect(xPos, yPos, this.width, this.height);
            ctx.stroke();
        }
    }
}

export default PhagocyteBacteria;