import { ShieldPowerup, ReviveCISPowerup } from "./powerup";

const DEBUG = true;

// how long a second in the game is.
const SECOND = DEBUG ? 100 : 1000;

// the HUD contains all of the heads up display
// components, including the players
// age, lipid count (currency),
// hydration, nutrition, etc.
//
// in addition to this, it contains the 'information'
// cards which pop up on the screen to explain something to the player.

function lookupAgeInterval(age) {
    if (age > 40) {
        return 10 * SECOND;
    }
    else if (age > 20) {
        return 15 * SECOND;
    }
    else if (age > 10) {
        return 20 * SECOND;
    }
    else if (age > 5) {
        return 30 * SECOND;
    }

    // ages 1 - 5.
    return 45 * SECOND;
}

class InfoCard {
    constructor(data) {
        this.data = data;

        const { width, height } = document.querySelector('#game-container');
        this.width = width / 4;
        this.height = height / 12; // NOTE: this will be set properly during render.
        this.titleBarHeight = this.height;
    }

    render(ctx, x, y) {
        const { title, desc } = this.data;

        const pad = 20;
        const maxCharsWidth = 33;
        
        let lines = [];
        for (let i = 0; i < desc.length; i += maxCharsWidth) {
            lines.push(desc.substring(i, i + maxCharsWidth));
        }

        const lineSpacing = 1.55;
        const lineHeight = 15 * lineSpacing;

        const cardDescHeight = (lines.length * lineHeight);

        this.height = this.titleBarHeight + cardDescHeight + pad;

        ctx.fillStyle = "#333";
        ctx.fillRect(x, y, this.width, this.height);

        ctx.fillStyle = "#000";
        ctx.fillRect(x, y, this.width, this.titleBarHeight);

        ctx.fillStyle = "#fff";
        ctx.fillText(title.toUpperCase(), x+(pad/2), y+(pad*1.9));

        for (const [i, line] of lines.entries()) {
            const xPos = x + (pad / 2);
            const yPos = y + (this.titleBarHeight*1.5) + ((lineHeight) * i);
            ctx.fillText(line.trim(), xPos, yPos);
        }
    }
}

function randInRange(min, max) {
    return Math.random() * (max - min) + min;
}

class HUD {
    constructor(gameMap) {
        // age starts at 0
        this.age = 0;

        this.map = gameMap;
     
        // we have zero lipids to start with?
        this.lipids = 0;

        // we start at 25.
        this.hydration = 25;
        this.nutrition = 25;

        this.ageTimer = new Date().getTime();
        this.lipidTimer = new Date().getTime();
        this.infoCardTimer = new Date().getTime();

        this.timerIntervals = {
            // how long a card shows for
            cardDefaultDuration: 9 * SECOND,
        };

        // a list of info cards to render
        // these are stored in a list,
        // dequeued by insertion order (i.e. queue)
        this.infoCards = [];
        this.currentCard = null;
        this.seenCards = new Map();
        this.cardLimiter = new Map();
    }

    queueInfoCard(card) {
        const { data } = card;

        // this is for rate limiting the cards just incase
        // we spam the queue.
        // we store the card id into the map with the time
        // in which it was added
        // then on each call the card is in this map
        // we see if it was added < 30 seconds ago, if it was
        // we dont add the card to the queue, otherwise we do
        // and we delete the entry so it can be replaced later.
        if (this.cardLimiter.has(data.id)) {
            const addedTime = this.cardLimiter.get(data.id);
            if ((new Date().getTime() - addedTime) < 30 * SECOND) {
                return;
            }
            this.cardLimiter.delete(data.id);
        }

        // card is only supposed to be shown once
        // and has already been seen...
        if (data.showOnce && this.seenCards.has(data.id)) {
            // let's get outta here!
            return;
        }

        this.infoCards.push(card);
        // register card as seen ONLY if it's shown once
        // so we dont keep track of useless cards
        if (data.showOnce) {
            this.seenCards.set(data.id, true);
        }

        // force clear the queue
        this.currentCard = this.infoCards.shift();

        // set the timer to start!
        this.infoCardTimer = new Date().getTime();

        this.cardLimiter.set(data.id, new Date().getTime());

        console.log('enqueued card', data.title);
    }

    spawnPowerup(powerup) {
        if (this.map.addPowerup(powerup)) {
            console.log('spawned a powerup', powerup.constructor.name);
            this.queueInfoCard(new InfoCard({
                id: 6969,
                title: 'Shield powerup!',
                desc: '',
            }));
        }
    }

    // this is invoked everytime we age.
    // on age, we spawn more enemies, etc.
    initNewLevel() {
        this.map.tickSpawners();    
    }

    agePlayer() {
        // get the interval for the current age.
        const ageInterval = lookupAgeInterval(this.age);

        // TODO/DOCS spawn this at random times
        // and then pick a random duration for the shield
        // between how long?
        // this.spawnPowerup(new ShieldPowerup(2.5));
        
        // An average game based off of these values should 
        // take around 21 minutes if the user reaches age 80.

        // Every n seconds we ages.
        if ((new Date().getTime() - this.ageTimer) > (ageInterval)) {
            this.initNewLevel();
            
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
        this.hydration -= Math.random();
        this.nutrition -= Math.random() * 0.01;

        // clamp the values so they can't go below zero.
        this.hydration = Math.max(0, this.hydration);
        this.nutrition = Math.max(0, this.nutrition);
    }

    infoCardTriggers() {
        // if the hydration drops below 25, show an info card for it!
        if (this.hydration <= 80) {
            this.queueInfoCard(new InfoCard({
                id: 0,
                title: 'Drink more water',
                desc: 'Hydration is very important!! Hydration is very important!! Hydration is very important!! Hydration is very important!! Hydration is very important!! Hydration is very important!! Hydration is very important!!',
                showOnce: true,
            }));
        }
        if (this.hydration <= 0) {
            this.queueInfoCard(new InfoCard({
                id: 1,
                title: 'Thirsty',
                desc: 'Your hydration levels are at zero!!',
                showOnce: true,
            }));
        }

        // delete the card after {cardDefaultDuration} seconds.
        const { cardDefaultDuration } = this.timerIntervals;
        if ((new Date().getTime() - this.infoCardTimer) > cardDefaultDuration) {
            this.currentCard = null;
        }
    }

    update() {
        this.agePlayer();
        this.generateLipids();
        this.live();
        this.infoCardTriggers();
    }

    renderStats(ctx) {
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

    render(ctx) {
        const { width, height } = document.querySelector('#game-container');

        this.renderStats(ctx);

        const card = this.currentCard;
        if (card != null) {
            const pad = 50;
            card.render(ctx, width - card.width - pad, height - card.height - pad);
        }
    }
}

export default HUD;