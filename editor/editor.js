class epEditorRenderer {
    constructor(element) {
        if (!(element instanceof HTMLDivElement)) {
            throw new Error("Input to epEditorRenderer class must be of type HTMLDivElement.");
        }

        this.parent = element;
        element.innerHTML = `<canvas></canvas>`;

        this.canvas = element.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

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
            },
            scroll: {
                scrollLine: 0,
                showScrollbars: true,
                scrollbarWidth: 16,
                scrollbarColor: "#303030",
            },
        };

        this.resizeObserver = new ResizeObserver(() => {
            this.correctCanvasSize();
        });

        this.contentVerification = this.hash32("\uF501plaintext");
        this.syntaxCache = [];

        this.resizeObserver.observe(this.canvas);

        this.correctCanvasSize();
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

        // render all the text
        const hashDigest = this.hash32(this.json.content + "\uF501" + this.json.language);

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
        let column = 0;

        const lineHeight = this.json.theming.fontSize;
        const maxLines = Math.floor((this.canvas.height / lineHeight) / window.devicePixelRatio);

        let tokenWidthCache = new Map();

        for (const token of tokens) {
            this.ctx.fillStyle = this.json.theming.highlighting[token.type];

            if (token.content === "\n") {
                detectLine++;
                if (detectLine > scrollLine) renderLine++;
                column = 0;
                continue;
            }

            if (detectLine < scrollLine) continue;
            if (renderLine >= maxLines) continue;

            this.ctx.fillText(token.content, column, (renderLine + 1) * lineHeight);

            column += this.ctx.measureText(token.content).width;
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
            const scrollEnd = ((canvasHeight / this.json.theming.fontSize)/(detectLine-1))*canvasHeight;
            this.ctx.fillRect(canvasWidth-scrollbarWidth, scrollStart, scrollbarWidth, scrollEnd);
        }
    }
}
