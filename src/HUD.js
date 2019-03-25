export class HUD {
    constructor() {
        // age starts at 1?
        this.age = 1;
        this.last = new Date();
    }

    update() {
        const SECOND = 1000;

        // 5 seconds in a year.
        const ageInterval = 5 * SECOND;

        // every 500ms, we age.
        if ((new Date() - this.last) > (ageInterval)) {
            this.age++;
            this.last = new Date();
        }
    }

    render(ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 800, 48);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(`age ${this.age}`, 32, 32);
    }
}
