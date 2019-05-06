import { State } from './state';
import { GameMap } from './game_map';
import HUD from './hud';

// return true if the rectangle and circle are colliding
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

class GameState extends State {
    constructor() {
        super();
    }

    init() {
        this.bgMusic = new Howl({src:'./res/sfx/soundtrack.mp3'});
        this.bgMusic.play();
        this.bgMusic.loop();
        
        this.map = new GameMap(this.stateManager);
        this.hud = new HUD(this.map);
    }

    handleKeys(event) {
        super.handleKeys(event);

        switch (event.key) {
        case 'w':
            break;
        case 'a':
            break;
        case 's':
            break;
        case 'd':
            break;

        // space key pressed, return
        // camera back to CIS.
        case ' ':
            this.map.focusOnCIS();
            break;
        }
    }

    handleMouseMove(event, x, y) {
        super.handleMouseMove(event, x, y);
    }

    update() {
        super.pollEvents();
        
        // check for camera bounds intersection
        // FIXME interpolation can be done to make
        // this smoother.
        {
            const moveSpeed = 6;
            const boundsSize = 50;

            // TODO get the width and heights from the
            // container size.

            const container = document.querySelector('#game-container');
            const { width, height } = container;

            const topViewBounds = {
                x: 0, y: 0,
                w: width, h: boundsSize,
            };
            if (circleIntersectsRect(this.lastMouseBounds, topViewBounds)) {
                this.map.cam.move(0, -moveSpeed);
            }
    
            const rightViewBounds = {
                x: width - boundsSize, y: 0,
                w: boundsSize, h: height,
            };
            if (circleIntersectsRect(this.lastMouseBounds, rightViewBounds)) {
                this.map.cam.move(moveSpeed, 0);
            }
            
            const leftViewBounds = {
                x: 0, y: 0,
                w: boundsSize, h: height,
            };
            if (circleIntersectsRect(this.lastMouseBounds, leftViewBounds)) {
                this.map.cam.move(-moveSpeed, 0);
            }
    
            const bottomViewBounds = {
                x: 0, y: height - boundsSize,
                w: width, h: boundsSize,
            };
            if (circleIntersectsRect(this.lastMouseBounds, bottomViewBounds)) {
                this.map.cam.move(0, moveSpeed);
            }
        }
        
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