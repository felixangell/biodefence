import { State } from './state';

class MenuState extends State {
    constructor(stateManager) {
        super(stateManager);
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
        ctx.fillStyle = "#adbeef";
        ctx.fillRect(0, 0, width, height);

        const menuOptions = [
            "Play",
            "Options",
        ];

        ctx.fillStyle = "#000";

        let itemIndex = 0;
        let yOff = 100;
        for (const option of menuOptions) {
            let xPos = 50;
            let yPos = (50 * itemIndex) + yOff;

            let isSelected = this.selectedIndex == itemIndex;
            ctx.fillText(`${isSelected?'>':''}${option}`, xPos, yPos);
            itemIndex++;
        }
    }
}

export default MenuState;