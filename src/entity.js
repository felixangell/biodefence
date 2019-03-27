import Matter, {Body, Common} from 'matter-js';

// by default, _all_ entities have
// a health of 100 unless specified otherwise.
const DefaultEntityHealth = 100;

export class Entity {

    // creates a new entity,
    // isStatic defines whether the entity
    // is a static body or not, i.e. if it
    // will move at all.
    constructor(x, y, width, height, options) {
        this.health = DefaultEntityHealth;

        // we have to store the size since for
        // some reason the physics engine doesnt
        // store it.
        this.width = width;
        this.height = height;
        this.damage = 1;

        this.body = Matter.Bodies.rectangle(x, y, width, height, options);
    }

    // invoked when this entity
    // was hit (collided) with the
    // entity other.
    hit(other) {}

    update() {}

    render(cam, ctx) {}

    // renders the entities health bar above
    // the head of the entity.
    renderHealthBar(cam, ctx) {
        ctx.fillStyle = "#ff0000";
        const { x, y } = this.body.position;

        const barHeight = 8;
        const barWidth = this.health;

        // calculate the x position for the bar to be rendered at
        // to be centre aligned.
        const xOff = (this.width - barWidth) / 2;

        ctx.fillRect((x + xOff) - cam.pos.x, y - cam.pos.y - (barHeight * 2), barWidth, barHeight);
    }
}

// This is where units are generated from by the player.
export class CentralImmuneSystem extends Entity {
    constructor(x, y) {
        super(x, y, 128, 128, {
            isStatic: true,
            tag: 'cis',
        });

        this.damage = 100;
    }

    update() {
        if (this.health < 0) {
            // game over!
            this.health = 0;
        }
    }

    hit(other) {
        // only germs will damage the health of
        // the CIS.
        if (other.body.tag === 'germ') {
            this.health -= other.damage;
        }
    }

    render(cam, ctx) {
        this.renderHealthBar(cam, ctx);

        const { x, y } = this.body.position;
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x - cam.pos.x, y - cam.pos.y, this.width, this.height);
    }
}

// https://imgur.com/j7VTlvc
export class ForeignGerm extends Entity {
    constructor(x, y) {
        super(x, y, 50, 50, {
            isStatic: false,
            tag: 'germ',
        });
        this.damage = 6;

        // FIXME proper image loading.
        const img = new Image();
        img.src = 'https://imgur.com/7cnVX3A';//'https://i.imgur.com/fCKP3ZT.png';
        this.img = img;

        // this germ has not been identified yet!
        this.identified = true;

    }

    hit(other) {
        if (other.body.tag === 'cis') {
            // we hit the CIS, this bacterias health should die

            // TODO we need to see how much damage the CIS
            // would deal to this bacteria?
            this.health = 0;
        }
    }

    attack(entity) {
        let force = 0.02 * this.body.mass * Math.random();

        Body.applyForce(this.body, this.body.position, {
            x: force,
            y: force,
        });
    }

    update() {
    }

    render(cam, ctx) {
        this.renderHealthBar(cam, ctx);
        /*
         *
        */
        if (!this.identified) {
            // TODO
            // render the silhouette instead
            /*var img = this.img;
            //var canvas = document.createElement('canvas');
            //canvas.width = img.width;
            //canvas.height = img.height;
            var imgData = ctx.getImageData(this.body.position,this.body.position,img.width,img.height);
            var pix = imgData.data;
            //console.log(img);
            //return
            for (var i=0, n = pix.length; i < n; i+= 4){
                //set red to 0
                pix[i] = 0;
                //set green to 0
                pix[i+1] = 0;
                //set blue to 0
                pix[i+2] = 0;
                //retain the alpha value
                pix[i+3] = pix[i+3];
              }*/
          //ctx.putImageData(imgData,this.pos.x,this.pos.y);//,x - cam.pos.x, y - cam.pos.y, size, size);
          return;
        }

        const { x, y } = this.body.position;
        ctx.drawImage(this.img, x - cam.pos.x, y - cam.pos.y, this.width, this.height);
    }
}
