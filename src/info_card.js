const SECOND = 1000;

let cardCount = 0;

class InfoCard {
    constructor(data) {
        this.uid = cardCount++;
        this.data = data;

        // timestamp when this card was initialized.
        // this is used for clearing the notification queue
        this.timer = new Date().getTime();

        const { width, height } = document.querySelector('#game-container');
        this.width = width / 4;
        this.height = height / 12; // NOTE: this will be set properly during render.
        this.titleBarHeight = this.height;
    }

    render(ctx, x, y) {
        const { title, desc } = this.data;

        const pad = 20;
        const maxCharsWidth = 33;
        
        let lines = [];
        for (let i = 0; i < desc.length; i += maxCharsWidth) {
            lines.push(desc.substring(i, i + maxCharsWidth));
        }

        const lineSpacing = 1.55;
        const lineHeight = 15 * lineSpacing;

        const cardDescHeight = (lines.length * lineHeight);

        this.height = this.titleBarHeight + cardDescHeight + pad;

        ctx.fillStyle = "#333";
        ctx.fillRect(x, y, this.width, this.height);

        ctx.fillStyle = "#000";
        ctx.fillRect(x, y, this.width, this.titleBarHeight);

        ctx.fillStyle = "#fff";
        ctx.fillText(title.toUpperCase(), x+(pad/2), y+(pad*1.9));

        for (const [i, line] of lines.entries()) {
            const xPos = x + (pad / 2);
            const yPos = y + (this.titleBarHeight*1.5) + ((lineHeight) * i);
            ctx.fillText(line.trim(), xPos, yPos);
        }
    }
}

export default InfoCard;