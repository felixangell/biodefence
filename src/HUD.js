export class HUD {
    constructor() {
        // age starts at 1?
        this.age = 1;
        this.last = new Date();
    }

    update() {
        const SECOND = 1000;

        // n seconds in a year.
        const ageInterval
        
        if (age <= 5){ // Ages 1-5 take 45 seconds each for a total of 225 seconds or 3.75 minutes.
            ageInterval = 45 * SECOND;
        } else if (age > 5 && age <= 10){ // Ages 5-10 take 30 seconds each for a total of 150 seconds or 2.50 minutes.
            ageInterval = 30 * SECOND;
        } else if (age > 10 && age <= 20){ // Ages 10-20 take 20 seconds each for a total of 200 seconds or 3.33 minutes.
            ageInterval = 20 * SECOND;       
        } else if (age > 20 && age <= 40){// Ages 20-40 take 15 seconds each for a total of 300 seconds or 5 minutes.
            ageInterval = 15 * SECOND;
        } else if (age > 40 && age <= 80){// Ages 40-80 take 10 seconds each for a total of 400 seconds or 6.66 minutes.
            ageInterval = 10 * SECOND;
        }
        
        //An average game based off of these values should take around 21 minutes if the user reaches age 80.

        // Every n seconds we ages.
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
