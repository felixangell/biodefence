import Entity from './entity';

import {Body} from 'matter-js';
import {Howl} from 'howler';
import getResource from './image_loader';

let bacteriaSound = new Howl({src:'./res/sfx/bacteria_die1.ogg', volume: 0.6});
let bacteriaMergeSound = new Howl({src:'./res/sfx/merge_sound.ogg', volume: 0.15});

const damageWhenUnidentified = 2;
const damageWhenIdentified = 1;

// NeutrophilsBacteria will travel aimlessly 
// through the map
class NeutrophilsBacteria extends Entity {
    constructor(x, y) {
        super(x, y, 48, 43, {
            isStatic: false,
            tag: 'neutrophils',
        });
        this.identified = false;

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

        this.defaultImage = getResource('bacteria.png');
        this.imgSil = getResource('bacteria_s.png');

        this.dirTimer = new Date().getTime();
        super.changePath();

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
            this.silentlyDie();
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
        case 'turret':
            // the turret will shoot a bullet at this bacteria
            // so we dont deal damage here.
            break;
        default:
            console.log('unimplemented tag!', other.body.tag);
            this.damaged(other.damage);
        }
    }

    attack(entity) {
        // TODO gravitate them towards the CIS.
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
            super.changePath();
            this.dirTimer = new Date().getTime();
        }
    }

    render(cam, ctx) {
        super.renderHealthBar(cam, ctx);
        
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

export default NeutrophilsBacteria;