import { GameState } from './state';

// this calculates the x and y position of
// the mouse click relevant to the canvas.
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

        // i think im going to have any event listeners
        // added push their events to an event array
        // which is handled in the games update loop!
        // see update()
        this.container.addEventListener("click", (event) => {
            this.events.push({
                type: "click",
                event: event,
            });
        });
    }

    update() {
        // the events from the event listeners
        // are added to this queue and polled
        // from first to last added.
        while (this.events.length > 0) {
            const { type, event } = this.events.shift();
            
            switch (type) {

            case "click":
                const { x, y } = getCursorPosition(this.container, event);
                console.log('clicked at ', x, y);
                break;
            }
        }

        // updates the current state if set.
        const curr = this.currentState;
        if (curr) {
            curr.update();
        }
    }

    render(ctx) {
        // fill a white square behind all of the
        // rendering.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 800, 600);

        // renders the current state if set.
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

            // this is a good font for now?
            ctx.font = "16px Verdana";

            this.update();
            this.render(ctx);
        }, 1000 / targetFPS);
    }
}

new Game().start();