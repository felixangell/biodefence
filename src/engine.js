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


// global state is bad
class GameInfo {
    static isDiseaseIdentified(val) {
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