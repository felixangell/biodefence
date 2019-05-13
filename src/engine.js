import InfoCard from "./info_card";

// card id => InfoCard
let cardSet = new Map();

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

    static getInfoCard(key) {
        if (!cardSet.has(key)) {
            alert(`no such card '${key}'`);
            return null;
        }
        return cardSet.get(key);
    }

    static async loadCards() {
        const resp = await fetch('./dataCards/dataCards.json', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
        });
        const cards = await resp.json();
        for (const card of cards) {
            cardSet.set(card.id, new InfoCard(card));
        }
    }
}

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
        switch (val) {
        case 'chickenpox': break;
        case 'salmonella': 
            Engine.emit('queueInfoCard', 'slm1');
            break;
        case 'germ': break;
        case 'tuberculosis':
            Engine.emit('queueInfoCard', 'tbc1');
            break;
        case 'common_cold': 
            Engine.emit('queueInfoCard', 'cmc1');
            break;
        case 'neutrophils': break;
        }
        discovered.set(val, true);
    }
}

export {
    Engine,
    GameInfo,
}