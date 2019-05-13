import Entity from "./entity";
import getResource from './image_loader';
import Matter from 'matter-js';

const turretNoise = new Howl({src:'./res/sfx/turret_select.wav', volume: 0.4});

function euclidean(a, b) {
    return Math.sqrt((b.x - a.x) + (b.y - a.y));
}

class BetterDefenceTurret extends Entity {
    constructor(x, y) {
        super(x, y, 154, 154, {
            isStatic: true,
            tag: 'turret',
        });

        // radius in pixels.
        this.radius = 512;
        const halfRad = this.radius * 0.5;

        // override the bounding rectangle with a custom one
        // this will be the rectangle in which other entities
        // enter they will be shot.
        this.body = Matter.Bodies.rectangle(x-halfRad, y-halfRad, this.width+(this.radius), this.height+(this.radius), this.options);
        this.body.isSensor = true;


        this.damage = 1;
        this.speed = 0.05;

        this.currentTarget = new Map();

        // time alive + a slightly random offset
        // this is how we base the merging of bacteria
        this.timeAlive = new Date().getTime() - Math.random();
        this.deathSound = new Howl({src:'./res/sfx/killert_death.wav'});
        this.img = getResource('defence_turret.png');
    }

    // this will shoot a bullet at the given entity from
    // this turret.
    hit(other) {
        // just in case we filter tags that we don't want
        // to attack.
        switch (other.body.tag) {
        // these are ok to kill!
        case 'germ': break;
        case 'chickenpox': break;
        case 'salmonella': break;
        case 'tuberculosis': break;
        case 'common_cold': break;

        // any that aren't caught above we return from this
        // function
        default:
            return;
        }

        if (this.currentTarget) {
            if (this.currentTarget.size < 3 && !this.currentTarget.has(other.id)) {
                this.currentTarget.set(other.id, other);
            }
        }
    }

    update() {
        super.update();

        if (this.currentTarget.size > 0) {
            for (const [_, t] of this.currentTarget) {
                if (t.health <= 0) {
                    this.currentTarget.delete(t.id);
                } else {
                    t.damaged(this.damage);
                }
            }
        }
    }

    render(cam, ctx) {
        super.renderHealthBar(cam, ctx);

        const { x, y } = this.body.position;
        
        const xPos = (x - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y;
        ctx.drawImage(this.img, xPos, yPos, this.width, this.height);

        ctx.fillStyle = "#ff0000";
        {
            // NOTE This is a very gross hack to stop the weird line rendering
            // when we have no target.
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();
        }

        ctx.beginPath();
        for (const [_, target] of this.currentTarget) {
            if (target && target.health > 0) {
                const { x, y } = target.body.position;
    
                ctx.fillStyle = "#ff0000";
    
                ctx.moveTo(xPos + (this.width / 2), yPos + (this.height / 2));
                ctx.lineTo(x - cam.pos.x, y - cam.pos.y);
            }
        }

        ctx.closePath();
        ctx.fill();

        ctx.lineWidth = 1;

        // render the radius bounding box
        {
            ctx.strokeStyle = "#ff0000";

            // this is the radius bounding box
            const halfRad = this.radius * 0.5;
            ctx.strokeRect(xPos-halfRad, yPos-halfRad, this.width+(this.radius), this.height+(this.radius));
        }

        if (window.sessionStorage.getItem('debug') === 'true') {
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(xPos, yPos, this.width, this.height);
            ctx.stroke();
        }
    }
}

export default BetterDefenceTurret;