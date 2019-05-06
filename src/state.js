// this calculates the x and y position of
// the mouse click relevant to the canvas.
function getCursorPosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x:x, y:y};
}

class StateManager {
    constructor() {
        this.currState = null;
        this.prevState = null;
        this.pendingState = null;
    }

    forceState(state) {
        this.currState = state;
        this.currState.setStateManager(this);
        this.currState.init();
    }

    // requests to change state to the given 
    // state
    requestState(state) {
        this.pendingState = state;
        this.pendingState.setStateManager(this);
        this.pendingState.init();
    }

    update() {
        if (this.pendingState != null) {
            this.currState = this.pendingState;
            this.pendingState = null;
        }
    }
}

class State {
    constructor() {
        this.lastMouseBounds = {
            x: 0, y: 0, r: 0,
        };
        this.events = [];
    }

    init() {}

    setStateManager(stateManager) {
        this.stateManager = stateManager;
    }

    handleKeys(event) { }

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

    update() {}
    render(ctx) {}
}

export { StateManager, State };