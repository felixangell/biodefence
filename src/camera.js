export default class Camera {
    constructor(viewport) {
        // viewport is the size of the entire
        // game map in pixels.
        this.viewport = viewport;

        this.pos = {
            x: 0,
            y: 0,
        };

        // destination point.
        this.dest = {
            x: 0,
            y: 0,
        };
    }

    move(x, y) {
        // bounds check so that the camera cant go off screen
        if (this.pos.x + x < 0) {
            return;
        } 
        if (this.pos.y + y < 0) {
            return;
        }
        if (this.pos.x + x > this.viewport.width) {
            return;
        }
        if (this.pos.y + y > this.viewport.height) {
            return;
        }

        this.pos.x += x;
        this.pos.y += y;
    }

    focusOnPoint(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
}