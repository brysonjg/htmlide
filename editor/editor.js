class peelib {
    constructor(element) {
        if (!(element instanceof HTMLDivElement)) {
            throw new Error("Input to peelib editor class must be of type HTMLDivElement.");
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
                fontSize: "16",
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

        this.resizeObserver.observe(this.canvas);

        this.correctCanvasSize();
    }

    correctCanvasSize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = (window.devicePixelRatio || 1)*2;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    normalizePrismTokens(tokens) {
        const out = [];

        function pushToken(type, content) {
            // split only for "none" (whitespace / raw text)
            if (type === "none" && typeof content === "string" && content.includes("\n")) {
                const parts = content.split(/(\n)/); // keep \n as separate items
                for (const part of parts) {
                    if (part === "") continue;
                    out.push({ type, content: part });
                }
            } else {
                out.push({ type, content });
            }
        }

        function walk(tokenList) {
            for (const token of tokenList) {
                if (typeof token === "string") {
                    pushToken("none", token);
                    continue;
                }

                if (Array.isArray(token.content)) {
                    walk(token.content);
                } else {
                    pushToken(token.type || "none", token.content);
                }
            }
        }

        walk(tokens);
        return out;
    }

    update() {
        // clear screen
        this.ctx.fillStyle = this.json.theming.background;
        const windowZoom = 1/window.devicePixelRatio;
        this.ctx.fillRect(0, 0, this.canvas.width*windowZoom, this.canvas.height*windowZoom);

        let detectLine = 1;
        let renderLine = 1;
        let column = 0;

        this.ctx.fillStyle = this.json.theming.foreground;
        this.ctx.font = `${this.json.theming.fontSize}px ${this.json.theming.fontFace}`;

        const tokens = this.normalizePrismTokens(
            Prism.tokenize(this.json.content, Prism.languages[this.json.language])
        );

        const scrollLine = this.json.scroll.scrollLine;

        for (const token of tokens) {
            this.ctx.fillStyle = this.json.theming.highlighting[token.type];

            if (token.content === "\n" && token.type === "none") {
                    detectLine++;
                    if (detectLine - 1 > scrollLine) renderLine++;
                column = 0;
                continue;
            }

            if (detectLine - 1 < scrollLine) continue;
            if (renderLine > Math.ceil(this.canvas.height / this.json.theming.fontSize)) continue;

            this.ctx.fillText(token.content, column, renderLine*this.json.theming.fontSize);

            column += this.ctx.measureText(token.content).width;
        }

        if (this.json.scroll.showScrollbars === true) {
            this.ctx.fillStyle = this.json.scroll.scrollbarColor;

            const scrollbarWidth = this.json.scroll.scrollbarWidth;
            const canvasWidth = this.canvas.getBoundingClientRect().width;
            const canvasHeight = this.canvas.getBoundingClientRect().height;

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
