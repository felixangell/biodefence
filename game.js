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
        this.container = document.querySelector("#game-container");
        this.ctx = this.container.getContext("2d");
        this.entities = [];
        this.events = [];

        this.container.addEventListener("click", (event) => {
            this.events.push({
                type: "click",
                event: event,
            });
        });
    }

    update() {
        // clear the events queue thing
        while (this.events.length > 0) {
            const { type, event } = this.events.shift();

            // process event types...
            switch (type) {
            case "click":
                const { x, y } = getCursorPosition(this.container, event);
                this.entities.push(new Box(x, y));
                break;
            }
        }

        for (const entity of this.entities) {
            entity.update();
        }
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