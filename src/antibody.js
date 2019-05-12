import {Howl} from 'howler';
import Entity from "./entity";
import {Body} from 'matter-js';
import getResource from './image_loader';
import { GameInfo } from './engine';

let deadAntibodySound = new Howl({src:'./res/sfx/antibody_die.ogg'})

class Antibody extends Entity {
    constructor(x, y) {
        super(x, y, 154, 154, {
            isStatic: false,
            tag: 'antibody',
        });

        this.damage = 6;
        this.speed = 0.05;

        // time alive + a slightly random offset
        // this is how we base the merging of bacteria
        this.timeAlive = new Date().getTime() - Math.random();
        this.deathSound = deadAntibodySound;
        this.img = getResource('antibody.png');
    
        this.dirTimer = new Date().getTime();
        super.changePath();    
    }

    update() {
        super.update();

        const moveChangeTime = 0.3;

        const SECOND = parseInt(window.sessionStorage.getItem('secondDuration'));
        if ((new Date().getTime() - this.dirTimer) > moveChangeTime * SECOND) {
            super.changePath();
            this.dirTimer = new Date().getTime();
        }
    }

    hit(other) {
        const { tag } = other.body;
        if (!tag) {
            throw new Error('no such tag on body', other.body);
        }

        // friendly.
        switch (tag) {
        case 'turret':
        case 'cis':
        case 'phagocyte':
            return;
        }

        if (!GameInfo.isDiseaseIdentified(tag)) {
            GameInfo.discoverDisease(tag);
        }
        this.die();
    }

    render(cam, ctx) {
        super.renderHealthBar(cam, ctx);

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

export default Antibody;