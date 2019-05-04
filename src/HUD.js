export class HUD {
    constructor() {
        // age starts at 0
        this.age = 0;
     
        // we have zero lipids to start with?
        this.lipids = 0;

        // TODO what range is hydration?
        this.hydration = 100;
        this.nutrition = 100;

        this.ageTimer = new Date();
        this.lipidTimer = new Date();
    }

    agePlayer() {
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
        if ((new Date().getTime() - this.ageTimer) > (ageInterval)) {
            this.age++;
            this.ageTimer = new Date().getTime();
        }
    }

    // gets how many lipids to generate
    // based off the nutrition level.
    getLipidGenerationCount() {
        if (this.nutrition >= 75) {
            return 20;
        } else if (this.nutrition >= 50) {
            return 15;
        } else if (this.nutrition >= 25) {
            return 10;
        }
        // 0 - 24.
        return 5;
    }

    // gets the generation rate of the lipds
    // in seconds.
    getLipidGenRate() {
        if (this.hydration >= 75) {
            return 2;
        } else if (this.hydration >= 50) {
            return 4;
        } else if (this.hydration >= 25) {
            return 6;
        }
        // 0 - 24.
        return 8;
    }

    generateLipids() {
        // there is a table in the documentation which
        // details the rates
        let lipidAmount = this.getLipidGenerationCount();
        let lipidGenerationRate = this.getLipidGenRate();

        const SECOND = 1000;
        if ((new Date().getTime() - this.lipidTimer) > lipidGenerationRate * SECOND) {
            this.lipids += lipidAmount;
            this.lipidTimer = new Date().getTime();
        }
    }

    // live as in to be alive, to live!
    // this function deteriorates the nutrition
    // and the hydration of the player.
    live() {
        // for now we just deteriorate by a random ish 
        // small value.
        this.hydration -= Math.random() * 0.01;
        this.nutrition -= Math.random() * 0.01;
    }

    update() {
        this.agePlayer();
        this.generateLipids();
        this.live();
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
            'hydration': this.hydration.toFixed(2),
            'nutrition': this.nutrition.toFixed(2),
            'lipids': this.lipids,
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
