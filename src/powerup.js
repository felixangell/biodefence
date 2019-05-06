class Powerup {
    constructor(title) {
        this.powerupSound = new Howl({src:'./res/sfx/powerup.wav'});

        // the duration of the powerup in seconds.
        // if this is 0, then the powerup lasts forever.
        this.duration = 10;

        // this is the title of the powerup
        this.title = title;

        // how many of this powerup
        // we can have active at once.
        // by default, just one.
        this.activeLimit = 1;
    }

    onInvoke(gameMap) { }
}

class ShieldPowerup extends Powerup {
    constructor(duration) {
        super('Shield');
        this.duration = duration;
    }

    // TODO this system is kind of weak
    // but it works for now though requirements
    // may change in the future :-s
    onInvoke(gameMap) {
        const { cis } = gameMap;
        cis.shieldFor(this.duration);
    }
}

class ReviveCISPowerup extends Powerup {
    constructor() {
        super('Revive');
        this.duration = 10;
    }
}

export { 
    Powerup,
    ShieldPowerup,
    ReviveCISPowerup,
};