import { State } from './state';
import { GameMap } from './game_map';
import HUD from './hud';

// return true if the rectangle and circle are colliding
// this is used for the camera movement
function circleIntersectsRect(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

const camSettings = {
    moveSpeed: 6,
    boundsSize: 50,
};

class GameState extends State {
    constructor() {
        super();
    }

    init() {
        this.bgMusic = new Howl({src:'./res/sfx/soundtrack.mp3'});
        this.bgMusic.play();
        this.bgMusic.loop();
        Howler.volume(0.6);
        
        this.map = new GameMap(this.stateManager);
        this.hud = new HUD(this.map);
    }

    handleKeyPressed(event) {
        if (event.key == ' ') {
            this.map.focusOnCIS();
        }
    }

    handleKeys() {
        const keyState = this.keysDown;

        if (keyState.has('w')) {
            this.map.cam.move(0, -camSettings.moveSpeed);
        }
        else if (keyState.has('a')) {
            this.map.cam.move(-camSettings.moveSpeed, 0);
        }
        else if (keyState.has('s')) {
            this.map.cam.move(0, camSettings.moveSpeed);
        }
        else if (keyState.has('d')) {
            this.map.cam.move(camSettings.moveSpeed, 0);
        }
    }

    handleMouseMove(event, x, y) {
        super.handleMouseMove(event, x, y);
    }

    handleCameraPan() {
        const container = document.querySelector('#game-container');
        const { width, height } = container;

        const topViewBounds = {
            x: 0, y: 0,
            w: width, h: camSettings.boundsSize,
        };
        if (circleIntersectsRect(this.lastMouseBounds, topViewBounds)) {
            this.map.cam.move(0, -camSettings.moveSpeed);
        }

        const rightViewBounds = {
            x: width - camSettings.boundsSize, y: 0,
            w: camSettings.boundsSize, h: height,
        };
        if (circleIntersectsRect(this.lastMouseBounds, rightViewBounds)) {
            this.map.cam.move(camSettings.moveSpeed, 0);
        }
        
        const leftViewBounds = {
            x: 0, y: 0,
            w: camSettings.boundsSize, h: height,
        };
        if (circleIntersectsRect(this.lastMouseBounds, leftViewBounds)) {
            this.map.cam.move(-camSettings.moveSpeed, 0);
        }

        const bottomViewBounds = {
            x: 0, y: height - camSettings.boundsSize,
            w: width, h: camSettings.boundsSize,
        };
        if (circleIntersectsRect(this.lastMouseBounds, bottomViewBounds)) {
            this.map.cam.move(0, camSettings.moveSpeed);
        }
    }

    update() {
        super.pollEvents();
        this.handleCameraPan();
        this.hud.update();
        this.map.update();
    }

    render(ctx) {
        this.map.render(ctx);

        // hud renders over everything.
        this.hud.render(ctx);
    }
}

export default GameState;