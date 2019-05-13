import ActionBar from './action_bar';
import {Engine} from './engine';

// card duration in seconds
// how long it will be in the notif bar for.
const DEFAULT_CARD_DURATION = 4;

// the HUD contains all of the heads up display
// components, including the players
// age, lipid count (currency),
// hydration, nutrition, etc.
//
// in addition to this, it contains the 'information'
// cards which pop up on the screen to explain something to the player.

function lookupAgeInterval(age) {
    const SECOND = 500;
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

function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

class HUD {
    constructor(gameMap) {
        this.map = gameMap;

        this.entityAdded = this.entityAdded.bind(this);
        Engine.listenFor('entityAdd', this.entityAdded);

        this.gainedPowerup = this.gainedPowerup.bind(this);
        Engine.listenFor('powerupGained', this.gainedPowerup);

        this.ageTimer = new Date().getTime();
        this.lipidTimer = new Date().getTime();
        this.infoCardTimer = new Date().getTime();

        // a list of info cards to render
        // these are stored in a list,
        // dequeued by insertion order (i.e. queue)
        this.infoCards = [];
        
        this.currentCard = new Map();

        this.seenCards = new Map();
        this.cardLimiter = new Map();

        this.preview = null;
        this.actionBar = new ActionBar();

        this.actionBar.registerAction(25, 'Antibody', 'deployAntibody', 'q', 'antibody.png');
        this.actionBar.registerAction(100, 'Phagocyte', 'deployPhagocyte', 'w', 'phagocyte.png');
        this.actionBar.registerAction(75, 'Killer T', 'deployKillerT', 'e', 'defence_turret.png');
        this.actionBar.registerAction(100, 'Mucous Membranes', 'deployMucousMembranes', 'r', 'cis_shielded.png');
        // this.actionBar.registerAction(25, 'Neutrophils', 'deployNeutrophils', 't', 'neutro');

        this.queueInfoCard = this.queueInfoCard.bind(this);
        Engine.listenFor('queueInfoCard', this.queueInfoCard);

        this.initNewLevel();
    }

    handleMouseMove(evt, x, y) {
        this.actionBar.handleMouseMove(evt, x, y);
    }

    entityAdded(event) {
        // console.log('FIRED!', event.detail);
    }

    gainedPowerup(powerup) {
        // queue info card
    }

    queueInfoCard(event) {
        const key = event.detail;

        const cardInfo = Engine.getInfoCard(key);
        if (!cardInfo) {
            throw new Error('no such info card', key);
        }

        const { data } = cardInfo;

        const SECOND = 1000;

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
            // console.log('card', card.data.id, ' has already been shown');
            return;
        }

        this.infoCards.push(cardInfo);
        // register card as seen ONLY if it's shown once
        // so we dont keep track of useless cards
        if (data.showOnce) {
            this.seenCards.set(data.id, true);
        }


        // set the timer to start!
        this.infoCardTimer = new Date().getTime();

        this.cardLimiter.set(data.id, new Date().getTime());

        // console.log('enqueued card', data.title);
    }

    // this is invoked everytime we age.
    // on age, we spawn more enemies, etc.
    initNewLevel() {
        this.map.onAgeIncrease(this.map.age);
        this.map.tickSpawners();    
    }

    agePlayer() {
        // get the interval for the current age.
        const ageInterval = lookupAgeInterval(this.map.age);

        // TODO/DOCS spawn this at random times
        // and then pick a random duration for the shield
        // between how long?
        // this.spawnPowerup(new ShieldPowerup(2.5));
        
        // An average game based off of these values should 
        // take around 21 minutes if the user reaches age 80.

        // Every n seconds we ages.
        if ((new Date().getTime() - this.ageTimer) > (ageInterval)) {
            this.initNewLevel();
            
            this.map.age++;
            this.ageTimer = new Date().getTime();
        }
    }

    // gets how many lipids to generate
    // based off the nutrition level.
    getLipidGenerationCount() {
        if (this.map.nutrition >= 75) {
            return 20;
        } else if (this.map.nutrition >= 50) {
            return 15;
        } else if (this.map.nutrition >= 25) {
            return 10;
        }
        // 0 - 24.
        return 5;
    }

    // gets the generation rate of the lipds
    // in seconds.
    getLipidGenRate() {
        if (this.map.hydration >= 75) {
            return 2;
        } else if (this.map.hydration >= 50) {
            return 4;
        } else if (this.map.hydration >= 25) {
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

        const SECOND = parseInt(window.sessionStorage.getItem('secondDuration'));
        if ((new Date().getTime() - this.lipidTimer) > lipidGenerationRate * SECOND) {
            this.map.lipids += lipidAmount;
            
            if (this.map.lipids > 150) {
                Engine.emit('queueInfoCard', 'lip2');
            }

            this.lipidTimer = new Date().getTime();
        }
    }

    // live as in to be alive, to live!
    // this function deteriorates the nutrition
    // and the hydration of the player.
    live() {
        // for now we just deteriorate by a random ish 
        // small value.
        this.map.decreaseHydration(Math.random() * 0.005);
        this.map.decreaseNutrition(Math.random() * 0.005);

        // clamp the values so they can't go below zero.
        this.map.hydration = Math.max(0, this.map.hydration);
        this.map.nutrition = Math.max(0, this.map.nutrition);
    }

    infoCardTriggers() {
        const SECOND = 1000;
        // delete the card after {cardDefaultDuration} seconds.
        for (const [key, card] of this.currentCard) {
            if ((new Date().getTime() - card.timer) > (card.duration * SECOND)) {
                this.currentCard.delete(card.uid);
            }
        }
    }

    update() {
        if ((this.infoCards.length > 0 && this.currentCard.size == 0) || this.infoCards.length >= 1 && this.currentCard.size < 2) {
            // force clear the queue
            const newCard = this.infoCards.shift();
            // timestamp when this card was initialized.
            // this is used for clearing the notification queue
            newCard.timer = new Date().getTime();
            this.currentCard.set(newCard.uid, newCard);
        }
        
        this.agePlayer();
        this.generateLipids();
        this.live();
        this.infoCardTriggers();
        this.actionBar.update();
        if (this.preview) {
            this.preview.update();
        }
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
            'age': this.map.age,
            'hydration': this.map.hydration.toFixed(2),
            'nutrition': this.map.nutrition.toFixed(2),
            'lipids': this.map.lipids,
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

        const pad = 50;
        let accumHeight = 0;
        for (const [uid, card] of this.currentCard) {
            accumHeight += card.height + pad;

            const xPos = width - card.width - pad;
            const yPos = height - accumHeight;
            card.render(ctx, xPos, yPos);
        }

        this.actionBar.render(ctx);

        if (this.preview) {
            this.preview.render(ctx);
        }
    }
}

export default HUD;