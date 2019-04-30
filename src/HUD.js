export class HUD {
    constructor() {
        // age starts at 0
        this.age = 0;
        
        // TODO what range is hydration?
        this.hydration = 100;

        this.last = new Date();
    }

    update() {
        const SECOND = 1000;

        // 45 seconds for each year 1-5.
        let ageInterval = 45 * SECOND;

        if (this.age > 5 && this.age <= 10) { 
            // Ages 5-10 take 30 seconds each for a 
            // total of 150 seconds or 2.50 minutes.
            ageInterval = 30 * SECOND;
        } else if (this.age > 10 && this.age <= 20) { 
            // Ages 10-20 take 20 seconds each for a 
            // total of 200 seconds or 3.33 minutes.
            ageInterval = 20 * SECOND;       
        } else if (this.age > 20 && this.age <= 40) {
            // Ages 20-40 take 15 seconds each for a 
            // total of 300 seconds or 5 minutes.
            ageInterval = 15 * SECOND;
        } else if (this.age > 40 && this.age <= 80) {
            // Ages 40-80 take 10 seconds each for 
            // a total of 400 seconds or 6.66 minutes.
            ageInterval = 10 * SECOND;
        }
        
        // An average game based off of these values should 
        // take around 21 minutes if the user reaches age 80.

        // Every n seconds we ages.
        if ((new Date().getTime() - this.last) > (ageInterval)) {
            this.age++;
            this.last = new Date().getTime();
        }
    }

    render(ctx) {
        const { width, height } = document.querySelector('#game-container');

        const panelHeight = height / 14;

        // how many pixels are between each item.
        const itemPad = 30;

        // xOff is where the hud starts rendering on the x axis
        let xOff = panelHeight;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, panelHeight);

        let properties = {
            'age': this.age,
            'hydration': this.hydration,
        };

        let accumWidth = 0;
        for (const [name, val] of Object.entries(properties)) {
            const hudString = `${name} ${val}`;

            const { width, height } = ctx.measureText(hudString);

            ctx.fillStyle = "#ffffff";
            ctx.fillText(hudString, xOff + accumWidth, 30);

            accumWidth += width + itemPad;
        }
    }
}
