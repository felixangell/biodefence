import Entity from './entity';

import {Body} from 'matter-js';
import {Howl} from 'howler';
import getResource from './image_loader';
import { GameInfo } from './engine';

let bacteriaSound = new Howl({src:'./res/sfx/bacteria_die1.ogg', volume: 0.6});
let bacteriaMergeSound = new Howl({src:'./res/sfx/merge_sound.ogg', volume: 0.15});

const damageWhenUnidentified = 2;
const damageWhenIdentified = 1;

const bacteriaSize = 116;

/*
    having a TB bacteria hit the CIS stops hydration and nutrition
    regen completely for 4 seconds
*/
class TuberCulosisBacteria extends Entity {
    constructor(x, y) {
        super(x, y, bacteriaSize, bacteriaSize, {
            isStatic: false,
            tag: 'tuberculosis',
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

        this.defaultImage = getResource('tuberculosis.png');
        this.imgSil = getResource('tuberculosis_s.png');

        this.dirTimer = new Date().getTime();
        super.changePathHoming();

        this.img = this.imgSil;
    }

    silentlyDie() {
        this.health = 0;
    }

    hit(other) {
        switch (other.body.tag) {
        case 'cis':
            this.silentlyDie();
            break;

        // NOOP for 'friendlies'
        case 'chickenpox': break;
        case 'germ': break;
        case 'common_cold': break;
        case 'salmonella': break;
        case 'tuberculosis': break;

        case 'turret':
            // the turret will shoot a bullet at this bacteria
            // so we dont deal damage here.
            break;
        case 'phagocyte':
            this.die();
            break;
        case 'antibody':
            this.die();
            break;
        default:
            alert(`unimplemented tag ${other.body.tag}...`);
        }
    }

    attack(entity) {
        // TODO gravitate them towards the CIS.
    }

    update() {
        super.update();

        this.identified = GameInfo.isDiseaseIdentified(this.body.tag);
        
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
            super.changePathHoming();
            this.dirTimer = new Date().getTime();
        }
    }

    render(cam, ctx) {
        if (this.showHealthBar) {
            this.renderHealthBar(cam, ctx);
        }
        
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

export default TuberCulosisBacteria;