class Engine {
    static emit(name, detail) {
        const evt = new CustomEvent(name, {
            detail: detail,
        });
        window.dispatchEvent(evt);
    }

    static listenFor(name, proc) {
        window.addEventListener(name, proc);
    }
};

let discovered = new Map();
let diseases = new Map();

// the center x, y coords of the map
let cx, cy;

// global state is bad
class GameInfo {
    static setCenterMap(x, y) {
        cx = x;
        cy = y;
    }

    static getCenterMap() {
        return {
            x: cx,
            y: cy,
        };
    }

    static hasContractedDisease(val) {
        return diseases.has(val);
    }
    static contractDisease(disease) {
        return diseases.set(disease, true);
    }

    static isDiseaseIdentified(val) {
        if (window.sessionStorage.getItem('debug') === 'true') {
            return true;
        }
        return discovered.has(val);
    }

    static discoverDisease(val) {
        // TODO enqueue an info card.
        discovered.set(val, true);
    }
}

export {
    Engine,
    GameInfo,
}