import { State } from './state';

class GameOverState extends State {
    constructor() {
        super();
        this.selectedIndex = 0;
    }

    handleKeys(events) {
        console.log(events);
    }

    update() {
        super.pollEvents();
    }

    render(ctx) {
        const { width, height } = document.querySelector('#game-container')
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#fff";
        ctx.fillText("GAME OVER!", width / 2, height / 2);
    }
}

export default GameOverState;