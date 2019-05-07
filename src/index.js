import MenuState from './menu_state';
import { StateManager, State } from './state';
import GameState from './game_state';

const debug = true;

class Game {
    constructor() {
        this.container = document.querySelector('#game-container');
        this.ctx = this.container.getContext('2d');

        // initial game state...
        this.stateManager = new StateManager();

        if (!debug) {
            this.stateManager.forceState(new MenuState());
        } else {
            this.stateManager.forceState(new GameState());
        }

        const { currState } = this.stateManager;

        console.log('currState is', currState);

        // all events are passed into the current
        // state with the type, event instance, as
        // well as the container the event was made from
        this.container.addEventListener('keydown', (event) => {
            if (currState) {
                console.log('key down', event.key);
                currState.keysDown.set(event.key, {
                    event: event,
                    container: this.container,
                });
            }
        });

        this.container.addEventListener('keyup', (event) => {
            if (currState) {
                currState.keysDown.delete(event.key);
            }
        });

        this.container.addEventListener('keypress', (event) => {
            if (currState) {
                currState.events.push({
                    type: 'keypressed',
                    event: event,
                    container: this.container,
                });
            }
        });

        this.container.addEventListener('mousemove', (event) => {
            if (currState) {
                currState.events.push({
                    type: 'mousemove',
                    event: event,
                    container: this.container,
                });
            }
        })

        this.container.addEventListener('click', (event) => {
            if (currState) {
                currState.events.push({
                    type: 'click',
                    event: event,
                    container: this.container,
                });
            }
        });
    }

    update() {
        if (this.stateManager) {
            const { currState } = this.stateManager;
            if (currState) {
                currState.update();
            }
        }
    }

    render(ctx) {
        // fill a white square behind all of the
        // rendering.
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(0, 0, this.container.width, this.container.height);

        // renders the current state if set.
        if (this.stateManager) {
            const { currState } = this.stateManager;
            if (currState) {
                currState.render(ctx);
            }
        }
    }

    start() {
        // TODO: fix this timestep.

        const targetFPS = 60.0;
        setInterval(() => {
            const ctx = this.ctx;

            // this is a good font for now?
            ctx.font = "16px Verdana";

            // check if there are any pending
            // state changes to process.
            if (this.stateManager) {
                this.stateManager.update();
            }

            this.update();
            this.render(ctx);
        }, 1000 / targetFPS);
    }
}

window.onload = () => {
    let context = new AudioContext();
    const gameContainer = document.getElementById('game-container');

    Promise.resolve(() => {
        getResource('ground_tile.jpg');
        getResource('bacteria.png');
        getResource('bacteria_s.png');
    });

    let game = new Game();
    game.start();

    gameContainer.addEventListener('click', () => {
        if (game != null) {
            console.log('done already!');
            return;
        }

        console.log('starting game!');
        context.resume();
    });
};