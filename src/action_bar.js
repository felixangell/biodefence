import {Engine} from "./engine";

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

const ACTION_ICON_SIZE = 64;

class Action {
    constructor(cost, name, eventTrigger) {
        this.cost = cost;
        this.name = name;
        this.eventTrigger = eventTrigger;
        this.selected = false;
        
        this.handleClick = this.handleClick.bind(this);
        window.addEventListener('click', this.handleClick);
    }

    handleClick() {
        if (circleIntersectsRect(this.mouseBounds, this.actionButtonBounds)) {
            this.handleInvocation();
        }
    }

    handleInvocation() {
        // this is a bit messy, but we invoke the trigger
        // which will deploy the thing and decrease the lipid count
        // if there arent enough lipids it will not perform the action
        Engine.emit(this.eventTrigger, this.cost);
    }

    update(mouseBounds) {
        this.mouseBounds = mouseBounds;
        this.actionButtonBounds = {
            x: this.x, y: this.y,
            w: ACTION_ICON_SIZE, h: ACTION_ICON_SIZE,
        };

        this.selected = circleIntersectsRect(this.mouseBounds, this.actionButtonBounds);
        if (this.selected) {

        }
    }

    render(ctx, x, y) {
        this.x = x;
        this.y = y;

        ctx.fillStyle = "#333";
        if (this.selected) {
            ctx.fillStyle = "#ff00ff";
        }
        ctx.fillRect(x, y, ACTION_ICON_SIZE, ACTION_ICON_SIZE);

        ctx.fillStyle = "#fff";
        ctx.fillText(this.cost, x, y);
    }
}

class ActionBar {
    constructor() {
        this.mouseBounds = {
            x: -150, y: -150, r: 1,
        };

        this.actions = [];
    }
    
    registerAction(cost, name, eventTrigger) {
        const action = new Action(cost, name, eventTrigger);
        this.actions.push(action);
    };
    
    handleMouseMove(evt, x, y) {
        this.mouseBounds = {
            x: x, y: y, r: 15,
        };
    }

    update() {
        for (const action of this.actions) {
            action.update(this.mouseBounds);
        }
    }

    render(ctx) {
        if (this.actions.length === 0) {
            return;
        }

        const { width, height } = document.querySelector('#game-container');
        const margin = 20;
        const pad = 20;

        const barHeight = 96;
        const barWidth = pad + (this.actions.length * (pad + ACTION_ICON_SIZE));

        const xPos = margin;
        const yPos = height - barHeight - margin;

        ctx.fillStyle = "#999";
        ctx.fillRect(xPos, yPos, barWidth, barHeight);

        let i = 0;
        for (const action of this.actions) {
            const xOff = ((ACTION_ICON_SIZE + pad) * i++); 
            action.render(ctx, xPos + xOff + pad, yPos + pad);
        }
    }
}

export default ActionBar;