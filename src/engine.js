class Engine {
    static emit(name, detail) {
        const evt = new CustomEvent(name, {
            detail: detail,
        });
        console.log('yo', name);
        window.dispatchEvent(evt);
    }

    static listenFor(name, proc) {
        window.addEventListener(name, proc);
    }
};

export default Engine;