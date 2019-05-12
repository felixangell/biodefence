import Entity from "./entity";
import getResource from "./image_loader";

let unidentifiedIcon = getResource('./unidentified_icon.png');

function breakText(ctx, text, x, y) {
    const lines = text.split('\n');

    const lineHeight = 30;
    let i = 0;
    for (const line of lines) {
        ctx.fillText(line, x, y + (lineHeight * (i++)));
    }
}

class EntityPreview {
    constructor(entity) {
        this.entity = entity;
        this.image = entity.iconImage;
    }

    update() {
        
    }

    /*
        this code is very messy and is full of crazy
        trial error positioning maths.
    */
    render(ctx) {
        const { width, height } = document.getElementById('game-container');

        const cardWidth = width / 3;
        const cardHeight = cardWidth / 3.1;

        const margin = 30;
        const xPos = width - cardWidth - margin;
        const yPos = margin * 3;

        const pad = 10;

        ctx.fillStyle = "#222";
        ctx.fillRect(xPos, yPos, cardWidth, cardHeight);

        const imageSize = (cardHeight / 1.5) - (pad);

        const image = this.entity.identified ? this.image : unidentifiedIcon;

        // render health bar above icon
        const barHeight = cardHeight / 6;
        const healthBarMax = imageSize + (pad * 2);
        {
            // render details.
            const healthBarX = xPos + pad;
            const healthBarY = yPos + pad;
    
            // backfill
            ctx.fillStyle = "#888";
            ctx.fillRect(healthBarX, healthBarY, healthBarMax, barHeight);
    
            // outline
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(healthBarX, healthBarY, healthBarMax, barHeight);
            ctx.stroke();

            // fill the health bar
            ctx.fillStyle = "#ff0000";
            const fillWidth = (this.entity.health / 100) * healthBarMax;
            ctx.fillRect(healthBarX, healthBarY, fillWidth, barHeight);
        }

        const imageX = xPos + pad + pad;
        const imageY = yPos + pad + barHeight + pad;
        // render the icon
        {
            // render the icon on the left
            ctx.drawImage(image, imageX, imageY, imageSize, imageSize);
        }

        // render the text on the right with information about the entity
        {
            const infoX = imageX + imageSize + (pad * 4);
            const infoY = imageY;
            ctx.fillStyle = "#fff";

            let desc = "This entity has not been\nidentified yet!";
            if (this.entity.identified) {
                desc = this.entity.desc;
            }
            breakText(ctx, desc, infoX - pad, infoY);
        }
    }
}

export default EntityPreview;