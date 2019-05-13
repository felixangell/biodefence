let cardCount = 0;

function wordwrap (str, intWidth, strBreak, cut) {
        //  discuss at: http://locutus.io/php/wordwrap/
        // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
        // improved by: Nick Callen
        // improved by: Kevin van Zonneveld (http://kvz.io)
        // improved by: Sakimori
        //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
        // bugfixed by: Michael Grier
        // bugfixed by: Feras ALHAEK
        // improved by: Rafał Kukawski (http://kukawski.net)
        //   example 1: wordwrap('Kevin van Zonneveld', 6, '|', true)
        //   returns 1: 'Kevin|van|Zonnev|eld'
        //   example 2: wordwrap('The quick brown fox jumped over the lazy dog.', 20, '<br />\n')
        //   returns 2: 'The quick brown fox<br />\njumped over the lazy<br />\ndog.'
        //   example 3: wordwrap('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        //   returns 3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat.'

        intWidth = arguments.length >= 2 ? +intWidth : 75
        strBreak = arguments.length >= 3 ? '' + strBreak : '\n'
        cut = arguments.length >= 4 ? !!cut : false

        var i, j, line

        str += ''

        if (intWidth < 1) {
        return str
        }

        var reLineBreaks = /\r\n|\n|\r/
        var reBeginningUntilFirstWhitespace = /^\S*/
        var reLastCharsWithOptionalTrailingWhitespace = /\S*(\s)?$/

        var lines = str.split(reLineBreaks)
        var l = lines.length
        var match

        // for each line of text
        for (i = 0; i < l; lines[i++] += line) {
        line = lines[i]
        lines[i] = ''

        while (line.length > intWidth) {
        // get slice of length one char above limit
        var slice = line.slice(0, intWidth + 1)

        // remove leading whitespace from rest of line to parse
        var ltrim = 0
        // remove trailing whitespace from new line content
        var rtrim = 0

        match = slice.match(reLastCharsWithOptionalTrailingWhitespace)

        // if the slice ends with whitespace
        if (match[1]) {
            // then perfect moment to cut the line
            j = intWidth
            ltrim = 1
        } else {
            // otherwise cut at previous whitespace
            j = slice.length - match[0].length

            if (j) {
            rtrim = 1
            }

            // but if there is no previous whitespace
            // and cut is forced
            // cut just at the defined limit
            if (!j && cut && intWidth) {
            j = intWidth
            }

            // if cut wasn't forced
            // cut at next possible whitespace after the limit
            if (!j) {
                var charsUntilNextWhitespace = (line.slice(intWidth).match(reBeginningUntilFirstWhitespace) || [''])[0]
                j = slice.length + charsUntilNextWhitespace.length
            }
        }

        lines[i] += line.slice(0, j - rtrim)
        line = line.slice(j + ltrim)
        lines[i] += line.length ? strBreak : ''
    }
}

return lines.join('\n')
}

function breakText(ctx, text, x, y) {
    const lines = text.split('\n');

    const lineHeight = 30;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        ctx.fillText(line, x, y + (lineHeight * i));
    }
}

class InfoCard {
    constructor(data) {
        this.uid = cardCount++;
        this.data = data;

        this.prettyDesc = wordwrap(this.data.desc, 45);

        // 8 sentences average? 6 words per sentence?
        // 3 is words per second
        this.duration = (((data.desc.length / 8)) / 6) * 3;
        this.duration = Math.max(6, this.duration);

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

        let titleText = title.toUpperCase();
        if (window.sessionStorage.getItem('debug') === 'true') {
            titleText = `${title.toUpperCase()} ${this.duration}`;
        }

        ctx.fillStyle = "#fff";
        ctx.fillText(titleText, x+(pad/2), y+(pad*1.9));

        const xPos = x + (pad / 2);
        const yPos = y + (this.titleBarHeight) + (pad + 1);
        breakText(ctx, this.prettyDesc, xPos, yPos);
    }
}

export default InfoCard;