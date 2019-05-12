import Entity from "./entity";
import getResource from './image_loader';
import Matter from 'matter-js';

const turretNoise = new Howl({src:'./res/sfx/turret_select.wav', volume: 0.4});

function euclidean(a, b) {
    const ax = a.body.position.x;
    const ay = a.body.position.y;
    const bx = b.body.position.x;
    const by = b.body.position.y;
    return Math.sqrt((bx - ax) + (by - ay));
}

class DefenceTurret extends Entity {
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

        this.currentTarget = null;

        // time alive + a slightly random offset
        // this is how we base the merging of bacteria
        this.timeAlive = new Date().getTime() - Math.random();
        this.deathSound = null;
        this.img = getResource('defence_turret.png');
    }

    // this will shoot a bullet at the given entity from
    // this turret.
    hit(other) {
        // just in case we filter tags that we don't want
        // to attack.
        switch (other.body.tag) {
        // these are ok to kill!
        case 'germ':
            break;

        // any that aren't caught above we return from this
        // function
        default:
            return;
        }

        if (this.currentTarget) {
            // work out the euclidean distance between the targets
            // and target the closest entity.
            if (euclidean(this, this.currentTarget) > euclidean(this, other)) {
                this.currentTarget = other;
            }
        } else {
            this.currentTarget = other;
        }
    }

    update() {
        super.update();

        const target = this.currentTarget;
        if (target != null) {
            if (target.health <= 0) {
                this.currentTarget = null;
            } else {
                target.damaged(this.damage);

                // todo as a turret ages it could become
                // immune?
                this.health -= 0.025;
            }
        }
    }

    render(cam, ctx) {
        super.renderHealthBar(cam, ctx);

        const { x, y } = this.body.position;
        
        const xPos = (x - (this.width / 2)) - cam.pos.x;
        const yPos = (y - (this.height / 2)) - cam.pos.y;
        ctx.drawImage(this.img, xPos, yPos, this.width, this.height);

        const target = this.currentTarget;
        if (target && target.health > 0) {
            const { x, y } = target.body.position;

            ctx.beginPath();
            ctx.moveTo(xPos + (this.width / 2), yPos + (this.height / 2));
            ctx.lineTo(x - cam.pos.x, y - cam.pos.y);
            ctx.lineWidth = 4;
            ctx.stroke();
            
            // delete the target every iteration
            this.currentTarget = null;
        } else {
            // NOTE This is a very gross hack to stop the weird line rendering
            // when we have no target.
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 0);
            ctx.lineWidth = 0;
            ctx.stroke();
        }
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

export default DefenceTurret;