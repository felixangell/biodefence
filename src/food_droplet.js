import Entity from './entity';

import {Body} from 'matter-js';
import getResource from './image_loader';
import { Engine } from './engine';

function getCursorPosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x:x, y:y, r: 15};
}

function circleIntersectsRect(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

class FoodDroplet extends Entity {
    constructor(x, y) {
        super(x, y, 0, 0, {
            isStatic: true,
            tag: 'food_droplet',
        });
        this.width = 48;
        this.height = 43;

        this.size = 1.0; // size multiplier.
        this.speed = 0.05;
        this.scaleCount = 0;

        // time alive + a slightly random offset
        // this is how we base the merging of bacteria
        this.timeAlive = new Date().getTime() - Math.random();

        this.defaultImage = getResource('food.png');
   
        // hack
        this.container = document.querySelector('#game-container');
        
        this.handleClick = this.handleClick.bind(this);
        Engine.listenFor('click', this.handleClick);
    }

    handleClick(e) {
        if (!this.xp || !this.yp) {
            return;
        }
        const pos = getCursorPosition(this.container, e);

        const bounds = {
            x: this.xp, y: this.yp, w: this.width, h: this.health,
        };
        if (circleIntersectsRect(pos, bounds)) {
            Engine.emit('eatFood');
            this.die();
        }
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
    }

    update() {
        super.update();
    }

    render(cam, ctx) {
        const { x, y } = this.body.position;
        
        const xPos = (x - (this.width / 2)) - cam.pos.x;
        this.xp = xPos;
        const yPos = (y - (this.height / 2)) - cam.pos.y;
        this.yp = yPos;
        ctx.drawImage(this.defaultImage, xPos, yPos, this.width, this.height);
        
        if (window.sessionStorage.getItem('debug') === 'true') {
            ctx.fillStyle = "#ff00ff";
            ctx.strokeRect(xPos, yPos, this.width, this.height);
            ctx.stroke();
        }
    }
}

export default FoodDroplet;