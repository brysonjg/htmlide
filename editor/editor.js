class epEditorRenderer {
    constructor(element) {
        if (!(element instanceof HTMLDivElement)) {
            throw new Error("Input to epEditorRenderer class must be of type HTMLDivElement.");
        }

        this.parent = element;
        element.innerHTML = `<canvas></canvas>`;

        this.canvas = element.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

        const self = this;

        this.json = {
            content: '',
            language: "plaintext",
            theming: {
                background: "#1e1e1e",
                foreground: "#fff",
                fontSize: 16,
                fontFace: "monospace",
                highlighting: {
                    comment: "#969896",
                    punctuation: "#c5c8c6",
                    operator: "#c5c8c6",
                    keyword: "#b294bb",
                    string: "#b5bd68",
                    char: "#b5bd68",
                    number: "#de935f",
                    boolean: "#de935f",
                    function: "#81a2be",
                    method: "#81a2be",
                    property: "#8abeb7",
                    variable: "#c5c8c6",
                    class: "#f0c674",
                    constant: "#de935f",
                    tag: "#cc6666",
                    attr_name: "#8abeb7",
                    attr_value: "#b5bd68",
                    regex: "#cc6666",
                    plain: "#c5c8c6",
                    none: "#c5c8c6",
                },
                padding: {
                    beforeText: 2,
                    betweenLines: 2,
                    lineNumberHorizontal: 2,
                },
                scroll: {
                    scrollbarColor: "#303030",
                    scrollbarWidth: 16,
                    showScrollbar: true,
                },
                lineNumbers: {
                    showLineNumbers: true,
                    lineNumberBackgroundColor: "#303030",
                    lineNumberBorderColor: "#444444",
                    lineNumberTextColor: "#777777",
                },
                selection: {
                    selectColor: "#264f78",
                },
            },
            scroll: {
                set scrollLine(value) {
                    this.scrollPixel = value * self.getLineStep();
                },
                get scrollLine() {
                    return Math.floor(this.scrollPixel / self.getLineStep());
                },
                scrollPixel: 0,
            },
            cursor: {
                position: 0,

                get x() {
                    return self.positionToX(this.position);
                },

                set x(value) {
                    this.position = self.xyToPosition(value, this.y);
                },

                get y() {
                    return self.positionToY(this.position);
                },

                set y(value) {
                    this.position = self.xyToPosition(this.x, value);
                },

                cursorVisible: true,
            },
            selection: {
                selectionActive: false,
                startSelect: 0,
                endSelect: 0,
            }
        };

        this.resizeObserver = new ResizeObserver(() => {
            this.correctCanvasSize();
        });

        this.syntaxValidator = 0;
        this.syntaxCache = [];

        this.lineNumbersWidthValidator = 0;
        this.lineNumbersWidthCache = 0;

        this.resizeObserver.observe(this.canvas);

        this.correctCanvasSize();
    }

    positionToX(pos) {
        const textBeforeCursor = this.json.content.slice(0, pos);
        const lastNewline = textBeforeCursor.lastIndexOf("\n");
        return lastNewline === -1 ? pos : pos - lastNewline - 1;
    }

    positionToY(pos) {
        return this.json.content.slice(0, pos).split("\n").length - 1;
    }

    xyToPosition(x, y) {
        const col = x;
        const lines = this.json.content.split("\n");
        let pos = 0;
        for (let i = 0; i < y && i < lines.length; i++) {
            pos += lines[i].length + 1;
        }
        return pos + Math.min(col, lines[y]?.length ?? 0);
    }

    getLineStep() {
        const p = this.json.theming.padding || {};
        return this.json.theming.fontSize + (p.betweenLines ?? 0);
    }

    getBeforeText() {
        const p = this.json.theming.padding || {};
        return p.beforeText ?? 0;
    }

    correctCanvasSize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = (window.devicePixelRatio || 1) * 2;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    lineNumberIsFontMonospace(numbs) {
        const values = Object.values(numbs);
        return values.every(width => width === values[0]);
    }

    calculateLineNumberWidth(lines) {
        let biggestWidth = 0;
        let numberWidthsCache = {};

        for (let numb = 0; numb <= 9; numb++) {
            const number = String(numb);
            numberWidthsCache[number] = this.ctx.measureText(number).width;
        }

        if (this.lineNumberIsFontMonospace(numberWidthsCache)) {
            return String(lines).length * numberWidthsCache["0"];
        }

        for (let line = 1; line <= lines; line++) {
            const number = String(line);
            let width = 0;

            for (let digit of number) {
                width += numberWidthsCache[digit];
            }

            if (width > biggestWidth) {
                biggestWidth = width;
            }
        }

        return biggestWidth;
    }

    normalizePrismTokens(tokens) {
        const out = [];

        function pushString(str, type = "none") {
            if (!str) return;

            let start = 0;

            for (let i = 0; i < str.length; i++) {
                if (str[i] === "\n") {
                    if (i > start) {
                        out.push({
                            type,
                            content: str.slice(start, i)
                        });
                    }

                    // newline is ALWAYS its own token
                    out.push({
                        type: "none",
                        content: "\n"
                    });

                    start = i + 1;
                }
            }

            if (start < str.length) {
                out.push({
                    type,
                    content: str.slice(start)
                });
            }
        }

        function walk(tokenList, currentType = "none") {
            for (const token of tokenList) {

                if (typeof token === "string") {
                    pushString(token, currentType);
                    continue;
                }

                const type = token.type || currentType;

                if (Array.isArray(token.content)) {
                    walk(token.content, type);
                } else if (typeof token.content === "string") {
                    pushString(token.content, type);
                } else {
                    // fallback safety
                    out.push({
                        type,
                        content: token.content ?? ""
                    });
                }
            }
        }

        walk(tokens);

        return out;
    }

    hash32(str) {
        let h = str.length;

        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        }

        return h >>> 0;
    }

    update() {
        // clear screen
        this.ctx.fillStyle = this.json.theming.background;
        const windowZoom = 1/window.devicePixelRatio;
        this.ctx.fillRect(0, 0, this.canvas.width * windowZoom, this.canvas.height * windowZoom);

        this.ctx.fillStyle = this.json.theming.foreground;
        this.ctx.font = `${this.json.theming.fontSize}px ${this.json.theming.fontFace}`;

        const paddingBeforeText = this.getBeforeText();
        const lineStep = this.getLineStep();
        const canvasCssHeight = this.canvas.height / window.devicePixelRatio;

        const splitContent = this.json.content.split("\n");
        const lineCount = splitContent.length;

        this.ctx.textBaseline = "bottom";

        // pre-calculated for cache verification
        const syntaxHashDigest = this.hash32(this.json.content + "\uF501" + this.json.language);
        const lineNumberHashDigest = this.hash32(lineCount + "\uF501" + this.json.theming.fontSize + "\uF501" + this.json.theming.padding.lineNumberHorizontal + "\uF501" + this.json.theming.fontFace);

        // render line numbers
        let widthOfLineNumbers = 0;

        if (this.json.theming.lineNumbers.showLineNumbers) {
            widthOfLineNumbers = this.lineNumbersWidthCache;
            const firstLineNumber = this.json.scroll.scrollLine;

            const visibleLines = Math.ceil(
                this.canvas.height / lineStep / window.devicePixelRatio
            )/2 + 1;

            if (this.lineNumbersWidthValidator !== lineNumberHashDigest) {
                widthOfLineNumbers = this.calculateLineNumberWidth(lineCount);
                this.lineNumbersWidthCache = widthOfLineNumbers;
                this.lineNumbersWidthValidator = lineNumberHashDigest;
            }

            widthOfLineNumbers += 2 * this.json.theming.padding.lineNumberHorizontal; // eather side
            widthOfLineNumbers += 1;

            const canvasHeight = canvasCssHeight;

            this.ctx.fillStyle = this.json.theming.lineNumbers.lineNumberBackgroundColor;
            this.ctx.fillRect(0, 0, widthOfLineNumbers, canvasHeight);

            this.ctx.fillStyle = this.json.theming.lineNumbers.lineNumberBorderColor;
            this.ctx.fillRect(widthOfLineNumbers, 0, 1, canvasHeight);
            widthOfLineNumbers++;

            this.ctx.fillStyle = this.json.theming.lineNumbers.lineNumberTextColor;
            for (let i = firstLineNumber + 1; i < firstLineNumber + visibleLines; i++) {
                if (i > lineCount) break;

                this.ctx.fillText(
                    String(i),
                    widthOfLineNumbers - this.ctx.measureText(String(i)).width - 1.5 - this.json.theming.padding.lineNumberHorizontal,
                    lineStep * (i - firstLineNumber) + paddingBeforeText
                );
            }
        }

        // render user text-selection
        if (this.json.selection.selectionActive) {
            const start = Math.min(
                this.json.selection.startSelect,
                this.json.selection.endSelect
            );

            const end = Math.max(
                this.json.selection.startSelect,
                this.json.selection.endSelect
            );

            const lines = splitContent.map((item) => `${item}\n`);
            const scrollLine = this.json.scroll.scrollLine;

            const firstVisibleLine = Math.max(0, scrollLine - 1);
            const lastVisibleLine = Math.min(
                lines.length,
                scrollLine + Math.ceil(this.canvas.height / lineStep) + 2
            );

            this.ctx.fillStyle = this.json.theming.selection.selectColor;

            let globalPos = 0;

            for (let lineIndex = 0; lineIndex < firstVisibleLine; lineIndex++) {
                globalPos += lines[lineIndex].length;
            }

            const mesureText_ = (str) => {
                if (str === "") return 0;

                return this.ctx.measureText(str).width;
            };

            for (let lineIndex = firstVisibleLine; lineIndex < lastVisibleLine; lineIndex++) {
                const line = lines[lineIndex];

                const lineStart = globalPos;
                const lineEnd = globalPos + line.length;

                const selectionStart = Math.max(start, lineStart);
                const selectionEnd = Math.min(end, lineEnd + 1);

                if (selectionStart < selectionEnd) {
                    const startColumn = selectionStart - lineStart;
                    const endColumn = Math.min(selectionEnd - lineStart, line.length);

                    const textBeforeSelection = line.slice(0, startColumn);
                    const selectedText = line.slice(startColumn, endColumn);

                    const x =
                        widthOfLineNumbers +
                        mesureText_(textBeforeSelection);

                    const w = mesureText_(selectedText);

                    const y = (lineIndex - scrollLine) * lineStep + paddingBeforeText;

                    this.ctx.fillRect(x, y, w, lineStep);
                }

                globalPos += line.length;
            }
        }

        // render all the text
        let tokens;

        if (this.syntaxValidator === syntaxHashDigest) {
            tokens = this.syntaxCache;
        }
        else {
            tokens = this.normalizePrismTokens(Prism.tokenize(this.json.content, Prism.languages[this.json.language]));
        }

        this.syntaxCache = tokens;
        this.syntaxValidator = syntaxHashDigest;

        const scrollLine = this.json.scroll.scrollLine;

        let detectLine = 0;
        let renderLine = 0;
        let column = widthOfLineNumbers;

        const maxLines = Math.floor(Math.max(0, canvasCssHeight - paddingBeforeText) / lineStep);


        for (const token of tokens) {
            this.ctx.fillStyle = this.json.theming.highlighting[token.type];

            if (token.content === "\n") {
                detectLine++;
                if (detectLine > scrollLine) renderLine++;
                column = widthOfLineNumbers;
                continue;
            }

            if (detectLine < scrollLine) continue;
            if (renderLine >= maxLines) continue;

            this.ctx.fillText(token.content, column, paddingBeforeText + (renderLine + 1) * lineStep);
            column += this.ctx.measureText(token.content).width;
        }

        // render cursor
        if (this.json.cursor.cursorVisible) {
            const cursorsYCoordinate = this.json.cursor.y;

            const widthOfAllTheCharsBeforCursor = Math.ceil((
                this.ctx.measureText(
                    splitContent[this.json.cursor.y].slice(0, this.json.cursor.x)
                )
            ).width + widthOfLineNumbers);

            this.ctx.save();
            this.ctx.globalCompositeOperation = 'difference';

            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(
                widthOfAllTheCharsBeforCursor,
                paddingBeforeText + (cursorsYCoordinate - this.json.scroll.scrollLine) * lineStep,
                2/window.devicePixelRatio,
                lineStep
            );

            this.ctx.restore();
        }

        // render scrollbar
        if (this.json.theming.scroll.showScrollbar) {
            const scrollbarWidth = this.json.theming.scroll.scrollbarWidth;

            const rect = this.canvas.getBoundingClientRect();
            const visibleHight = rect.height / lineStep;
            const fileHeight = lineCount;
            const scrollThumbHeight = (visibleHight / fileHeight) * rect.height;

            const scroll = this.json.scroll.scrollLine;
            const heightBefore = (scroll / fileHeight) * rect.height;

            this.ctx.fillStyle = this.json.theming.background;
            this.ctx.fillRect(rect.width - scrollbarWidth, 0, scrollbarWidth, rect.height);

            this.ctx.fillStyle = this.json.theming.scroll.scrollbarColor;
            this.ctx.fillRect(rect.width - scrollbarWidth, heightBefore, scrollbarWidth, scrollThumbHeight);

            this.ctx.fillRect(rect.width - scrollbarWidth, 0, 1, rect.height);
        }
    }
}
