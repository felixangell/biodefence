import Matter from 'matter-js';

// by default, _all_ entities have
// a health of 100 unless specified otherwise.
const DefaultEntityHealth = 100;

export class Entity {

    // creates a new entity,
    // isStatic defines whether the entity
    // is a static body or not, i.e. if it
    // will move at all.
    constructor(x, y, isStatic) {
        this.health = DefaultEntityHealth;
        this.body = Matter.Bodies.rectangle(x, y, 32, 32, {isStatic: isStatic});
    }

    update() {
    }

    render(ctx) {}

    // renders the entities health bar above
    // the head of the entity.
    renderHealthBar(ctx) {
        ctx.fillStyle = "#ff0000";
        const { x, y } = this.body.position;

        const barHeight = 8;
        const barWidth = this.health;
        ctx.fillRect(x, y - (barHeight * 2), barWidth, barHeight);
    }
}

// This is where units are generated from by the player.
export class CentralImmuneSystem extends Entity {
    constructor(x, y) {
        super(x, y, false);
    }

    update() {}

    render(ctx) {
        this.renderHealthBar(ctx);

        const { x, y } = this.body.position;
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x, y, 128, 128);
    }
}

// https://imgur.com/j7VTlvc
export class ForeignGerm extends Entity {
    constructor(x, y) {
        super(x, y, false);

        // this germ has not been identified yet!
        this.identified = false;

        // FIXME proper image loading.
        const img = new Image();
        img.src = 'https://i.imgur.com/fCKP3ZT.png';
        this.img = img;
    }

    update() {}

    render(ctx) {
        this.renderHealthBar(ctx);

        if (!this.identified) {
            // TODO
            // render the silhouette instead
            var img = this.img;
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var pix = ctx.getImageData(0,0,canvas.width,canvas.height);
            console.log(pix.data[0]);
            console.log(pix.data[1]);
            console.log(pix.data[2]);
            console.log(pix.data[3]);
            //console.log(img);
            return
        }

        const { x, y } = this.body.position;
        const size = 50;
        ctx.drawImage(this.img, x, y, size, size);
    }
}
