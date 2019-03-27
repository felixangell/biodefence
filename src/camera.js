export default class Camera {
    constructor() {
        this.pos = {
            x: 0,
            y: 0,
        };
    }

    focusOnPoint(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
}