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
                showScrollbars: true,
                scrollbarWidth: 16,
                scrollbarColor: "#303030",
            },
            lineNumbers: {
                showLineNumbers: true,
                lineNumberBackgroundColor: "#303030",
                lineNumberBorderColor: "#444444",
                lineNumberTextColor: "#777777",
            },
            cursor: {
                position: 0,

                get y() {
                    return self.positionToY(this.position);
                },
                set y(value) {
                    this.position = self.xyToPosition(this.x, value);
                },
                get x() {
                    return self.positionToX(this.position);
                },
                set x(value) {
                    this.position = self.xyToPosition(value, this.y);
                },

                cursorVisible: true,
            },
        };

        this.resizeObserver = new ResizeObserver(() => {
            this.correctCanvasSize();
        });

        this.contentVerification = this.hash32("\uF501plaintext");
        this.syntaxCache = [];
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
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    update() {
        // clear screen
        this.ctx.fillStyle = this.json.theming.background;
        const windowZoom = 1/window.devicePixelRatio;
        this.ctx.fillRect(0, 0, this.canvas.width*windowZoom, this.canvas.height*windowZoom);

        this.ctx.fillStyle = this.json.theming.foreground;
        this.ctx.font = `${this.json.theming.fontSize}px ${this.json.theming.fontFace}`;

        const inset = this.getBeforeText();
        const lineStep = this.getLineStep();
        const canvasCssHeight = this.canvas.height / window.devicePixelRatio;

        // pre-calculated for cache verification
        const hashDigest = this.hash32(this.json.content + "\uF501" + this.json.language);

        // render line numbers
        let widthOfLineNumbers = 0;

        if (this.json.lineNumbers.showLineNumbers) {
            widthOfLineNumbers = this.lineNumbersWidthCache;

            const firstLineNumber = this.json.scroll.scrollLine;
            const totalLines = this.json.content.split("\n").length;

            const visibleLines = Math.ceil(
                this.canvas.height / lineStep / window.devicePixelRatio
            )/2 + 1;

            if (this.contentVerification !== hashDigest) {
                widthOfLineNumbers = 0;

                const cache = new Map();

                for (let i = 1; i <= totalLines; i++) {
                    const str = String(i);
                    const digitLength = str.length;

                    let w = cache.get(digitLength);

                    if (w === undefined) {
                        w = this.ctx.measureText(str).width;
                        cache.set(digitLength, w);
                    } else {
                        const measured = this.ctx.measureText(str).width;
                        if (measured > w) {
                            w = measured;
                            cache.set(digitLength, w);
                        }
                    }

                    if (w > widthOfLineNumbers) {
                        widthOfLineNumbers = w;
                    }
                }

                this.lineNumbersWidthCache = widthOfLineNumbers;
            }

            widthOfLineNumbers += 1;

            const canvasHeight = canvasCssHeight;

            this.ctx.fillStyle = this.json.lineNumbers.lineNumberBackgroundColor;
            this.ctx.fillRect(0, 0, widthOfLineNumbers, canvasHeight);

            this.ctx.fillStyle = this.json.lineNumbers.lineNumberBorderColor;
            this.ctx.fillRect(0 + widthOfLineNumbers, 0, 1, canvasHeight);
            widthOfLineNumbers++;

            this.ctx.fillStyle = this.json.lineNumbers.lineNumberTextColor;
            for (let i = firstLineNumber+1; i < firstLineNumber + visibleLines; i++) {
                if (i > totalLines) break;
                this.ctx.fillText(String(i), 0, inset + lineStep * (i - firstLineNumber));
            }
        }

        // render all the text
        let tokens;

        if (this.contentVerification === hashDigest) {
            tokens = this.syntaxCache;
        }
        else {
            tokens = this.normalizePrismTokens(Prism.tokenize(this.json.content, Prism.languages[this.json.language]));
        }

        this.syntaxCache = tokens;
        this.contentVerification = hashDigest;

        const scrollLine = this.json.scroll.scrollLine;

        let detectLine = 0;
        let renderLine = 0;
        let column = widthOfLineNumbers;

        const maxLines = Math.floor(Math.max(0, canvasCssHeight - inset) / lineStep);

        this.ctx.textBaseline = "bottom";

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

            this.ctx.fillText(token.content, column, inset + (renderLine + 1) * lineStep);

            column += this.ctx.measureText(token.content).width;
        }

        // render cursor
        if (this.json.cursor.cursorVisible) {
            const cursorsYCoordinate = this.json.cursor.y;

            const widthOfAllTheCharsBeforCursor = Math.ceil((
                this.ctx.measureText(
                    this.json.content.split("\n")[this.json.cursor.y].slice(0, this.json.cursor.x)
                )
            ).width + widthOfLineNumbers);

            this.ctx.save();
            this.ctx.globalCompositeOperation = 'difference';

            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(
                widthOfAllTheCharsBeforCursor,
                inset + (cursorsYCoordinate - this.json.scroll.scrollLine) * lineStep,
                2/window.devicePixelRatio,
                lineStep - 2
            );

            this.ctx.restore();
        }

        // render scrollbar
        if (this.json.scroll.showScrollbars) {
            const scrollbarWidth = this.json.scroll.scrollbarWidth;
            const rect = this.canvas.getBoundingClientRect();
            const canvasWidth = rect.width;
            const canvasHeight = rect.height;

            this.ctx.fillStyle = this.json.scroll.scrollbarColor;
            this.ctx.fillRect(canvasWidth-scrollbarWidth, 0, scrollbarWidth, canvasHeight);

            this.ctx.fillStyle = this.json.theming.background;
            this.ctx.fillRect(canvasWidth-scrollbarWidth, 0, scrollbarWidth, canvasHeight);

            this.ctx.fillStyle = this.json.scroll.scrollbarColor;
            this.ctx.fillRect(canvasWidth-scrollbarWidth, 0, 1, canvasHeight);

            const scrollStart = ((detectLine - renderLine) / (detectLine - 1)) * canvasHeight;
            const scrollEnd = detectLine > 1
                ? ((canvasHeight / lineStep) / (detectLine - 1)) * canvasHeight
                : canvasHeight;
            this.ctx.fillRect(canvasWidth-scrollbarWidth, scrollStart, scrollbarWidth, scrollEnd);
        }
    }
}
