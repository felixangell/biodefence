class Entity {
    constructor(x, y) {
        this.pos = {x:x, y:y};
        this.delta = {x:0, y:0};
    }
}

class Box extends Entity {
    update() {
        this.pos.x++;
        if (this.pos.x >= 800) {
            this.pos.x = 0;
        }
    }

    render(ctx) {
        ctx.fillStyle = "#ff00ff";

        const {x, y} = this.pos;
        ctx.fillRect(x, y, 32, 32);
    }
}

function getCursorPosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x:x, y:y};
};

class Game {
    constructor() {
        const container = document.querySelector("#game-container");
        this.ctx = container.getContext("2d");
        this.entities = [];

        // hack
        this.mx = 0;
        this.my = 0;
        this.clicked = false;

        container.addEventListener("click", (event) => {
            const { x, y } = getCursorPosition(container, event);
            this.mx = x;
            this.my = y;
            this.clicked = true;
        });
    }

    update() {
        if (this.clicked) {
            this.entities.push(new Box(this.mx, this.my));
        }

        for (const entity of this.entities) {
            entity.update();
        }

        // another dirty hack
        this.clicked = false;
    }

    render(ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 800, 600);

        for (const entity of this.entities) {
            entity.render(ctx);
        }
    }

    start() {
        const targetFPS = 60.0;
        setInterval(() => {
            this.update();
            this.render(this.ctx);
        }, 1000 / targetFPS);
    }
}

new Game().start();