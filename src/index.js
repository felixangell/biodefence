import { GameState } from './state';

class Game {
    constructor() {
        this.container = document.querySelector('#game-container');
        this.ctx = this.container.getContext('2d');
        this.events = [];

        // initial game state...
        this.currentState = new GameState();

        // all events are passed into the current
        // state with the type, event instance, as
        // well as the container the event was made from
        this.container.addEventListener('keypress', (event) => {
            if (this.currentState) {
                this.currentState.events.push({
                    type: 'keypress',
                    event: event,
                    container: this.container,
                });
            }
        });

        this.container.addEventListener('mousemove', (event) => {
            if (this.currentState) {
                this.currentState.events.push({
                    type: 'mousemove',
                    event: event,
                    container: this.container,
                });
            }
        })

        this.container.addEventListener('click', (event) => {
            if (this.currentState) {
                this.currentState.events.push({
                    type: 'click',
                    event: event,
                    container: this.container,
                });
            }
        });
    }

    update() {
        // updates the current state if set.
        const curr = this.currentState;
        if (curr) {
            curr.update();
        }
    }

    render(ctx) {
        // fill a white square behind all of the
        // rendering.
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(0, 0, this.container.width, this.container.height);

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