import { GameState } from './state';

function getCursorPosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x:x, y:y};
}

class Game {
    constructor() {
        this.container = document.querySelector("#game-container");
        this.ctx = this.container.getContext("2d");
        this.events = [];

        // initial game state...
        this.currentState = new GameState();

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
                console.log('clicked at ', x, y);
                break;
            }
        }

        const curr = this.currentState;
        if (curr) {
            curr.update();
        }
    }

    render(ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 800, 600);

        const curr = this.currentState;
        if (curr) {
            curr.render(ctx);
        }
    }

    start() {
        // TODO: fix this timestep.
        const targetFPS = 60.0;
        setInterval(() => {
            const ctx = this.ctx;
            ctx.font = "16px Verdana";

            this.update();
            this.render(ctx);
        }, 1000 / targetFPS);
    }
}

new Game().start();