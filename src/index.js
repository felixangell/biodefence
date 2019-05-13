import MenuState from './menu_state';
import { StateManager, State } from './state';
import GameState from './game_state';
import { Engine } from './engine';
import { loadResource } from './image_loader';

const debug = true;

class Game {
    constructor() {
        this.container = document.querySelector('#game-container');
        this.ctx = this.container.getContext('2d');

        // initial game state...
        this.stateManager = new StateManager();

        this.gameLoop = this.gameLoop.bind(this);
        this.lastFrameTimeMs = 0;
        this.maxFPS = 60;
        this.timestep = 1000 / 60;

        if (!debug) {
            this.stateManager.forceState(new MenuState());
        } else {
            this.stateManager.forceState(new GameState());
        }

        const { currState } = this.stateManager;

        // all events are passed into the current
        // state with the type, event instance, as
        // well as the container the event was made from
        this.container.addEventListener('keydown', (event) => {
            if (currState) {
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

    gameLoop(timestamp) {
        const ctx = this.ctx;

        // this is a good font for now?
        ctx.font = "18px Verdana";

        // check if there are any pending
        // state changes to process.
        if (this.stateManager) {
            this.stateManager.update();
        }

        this.update();
        this.render(ctx);
        requestAnimationFrame(this.gameLoop);
    }

    start() {
        requestAnimationFrame(this.gameLoop);
    }
}

window.onload = async () => {
    const resources = [
        'cis.png', 'cis_shielded.png', 'ground_tile.jpg',
        'bacteria.png', 'bacteria_s.png',
        'chickenpox.png', 'chickenpox_s.png',
        'defence_turret.png', 'antibody.png', 'antibody_deploy.png',
        'common_cold.png', 'common_cold_s.png',
        'default_icon.png', 'unidentified_icon.png',
        'phagocyte.png',
        'salmonella.png', 'salmonella_s.png',
        'tuberculosis.png', 'tuberculosis_s.png', 'water.png',
        'food.png'
    ];

    await Engine.loadCards();

    return Promise.all(
        resources.map((res) => loadResource(res)),
    ).then(() => {
        let game = new Game();
        game.start();
    }, (fail) => {
        console.log(fail);
    });
};