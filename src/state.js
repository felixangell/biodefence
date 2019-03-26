import { GameMap } from './game_map';
import { HUD } from './HUD';

// this calculates the x and y position of
// the mouse click relevant to the canvas.
function getCursorPosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x:x, y:y};
}

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

export class GameState {
    constructor() {
        this.events = [];
        this.hud = new HUD();
        this.map = new GameMap();
        this.lastMouseBounds = {
            x: 0, y: 0, r: 0,
        };
    }

    handleKeys(event) {
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
        this.lastMouseBounds = {
            x: x, y: y, r: 15,
        };
    }

    pollEvents() {
        // the events from the event listeners
        // are added to this queue and polled
        // from first to last added.
        while (this.events.length > 0) {
            const { type, event, container } = this.events.shift();
            
            switch (type) {
                case 'mousemove': {
                    const { x, y } = getCursorPosition(container, event);
                    this.handleMouseMove(event, x, y);
                    break;
                }

                case 'keypress': {
                    this.handleKeys(event);
                    break;
                }

                case 'click': {
                    const { x, y } = getCursorPosition(container, event);
                    console.log('clicked at ', x, y);
                    break;
                }

            }
        }
    }

    update() {
        this.pollEvents();
        
        // check for camera bounds intersection
        // FIXME interpolation can be done to make
        // this smoother.
        {
            const moveSpeed = 2;
            const boundsSize = 50;

            // TODO get the width and heights from the
            // container size.

            const topViewBounds = {
                x: 0, y: 0,
                w: 800, h: boundsSize,
            };
            if (circleIntersectsRect(this.lastMouseBounds, topViewBounds)) {
                this.map.cam.pos.y -= moveSpeed;
            }
    
            const rightViewBounds = {
                x: 800 - boundsSize, y: 0,
                w: boundsSize, h: 600,
            };
            if (circleIntersectsRect(this.lastMouseBounds, rightViewBounds)) {
                this.map.cam.pos.x += moveSpeed;
            }
            
            const leftViewBounds = {
                x: 0, y: 0,
                w: boundsSize, h: 600,
            };
            if (circleIntersectsRect(this.lastMouseBounds, leftViewBounds)) {
                this.map.cam.pos.x -= moveSpeed;
            }
    
            const bottomViewBounds = {
                x: 0, y: 600 - boundsSize,
                w: 800, h: boundsSize,
            };
            if (circleIntersectsRect(this.lastMouseBounds, bottomViewBounds)) {
                this.map.cam.pos.y += moveSpeed;
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
