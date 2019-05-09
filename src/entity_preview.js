import Entity from "./entity";
import getResource from "./image_loader";

let unidentifiedIcon = getResource('./unidentified_icon.png');

class EntityPreview {
    constructor(entity) {
        this.entity = entity;
        this.image = entity.iconImage;
    }

    update() {
        
    }

    /*
        this code is very messy and is full of crazy maths
        will clean up some point especially since the layout of this
        is currently temporary.
        in the future, I think the healthbar should be smaller and go
        above the icon
        then in the card itself will be information about the entity.
    */
    render(ctx) {
        const { width, height } = document.getElementById('game-container');

        const cardWidth = width / 3;
        const cardHeight = cardWidth / 3.1;

        const margin = 30;
        const xPos = margin;
        const yPos = height - cardHeight - margin;

        const pad = 10;

        ctx.fillStyle = "#222";
        ctx.fillRect(xPos, yPos, cardWidth, cardHeight);

        const imageSize = cardHeight - (pad * 2);

        const image = this.entity.identified ? this.image : unidentifiedIcon;

        const imageX = xPos + pad;
        const imageY = yPos + pad;

        // render the icon on the left
        ctx.drawImage(image, imageX, imageY, imageSize, imageSize);

        const barHeight = cardHeight / 5;
        const healthBarMax = cardWidth - imageSize - (pad * 3);

        // render details.
        const healthBarX = imageX + imageSize + pad;
        const healthBarY = imageY + (cardHeight / 2) - (barHeight / 2) - pad;

        // backfill
        ctx.fillStyle = "#888";
        ctx.fillRect(healthBarX, healthBarY, healthBarMax, barHeight);

        // outline
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(healthBarX, healthBarY, healthBarMax, barHeight);
        ctx.stroke();

        const fillWidth = (this.entity.health / 100) * healthBarMax;

        ctx.fillStyle = "#ff0000";
        ctx.fillRect(healthBarX, healthBarY, fillWidth, barHeight);
    }
}

export default EntityPreview;