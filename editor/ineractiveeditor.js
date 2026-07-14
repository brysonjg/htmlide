class InteractiveEditor {
    constructor(element) {
        this.element = element;
        this.editor = new epEditorRenderer(element);
        this.canvas = this.editor.canvas;

        const self = this;

        this.state = new EditorAddresableSD(this.editor);

        Object.assign(this, this.state); // proxy them to the top level for ease of use

        this.event = new EditorEventSystem();

        this.selectionAnchor = 0;
        this.isMouseSelecting = false;

        this.registerDefaultEvents();
        this.listenForDefaultEvents();
    }

    standardToCharacterCoordinates(xcor, ycor) {
        const lineNumberWidth = this.editor.lineNumbersWidthCache + this.padding.lineNumberHorizontal;
        const inset = this.editor.getBeforeText();
        const lineStep = this.editor.getLineStep();
        const lines = this.value.content.split("\n");

        let line = Math.floor((ycor - inset) / lineStep + this.scroll.line);

        if (line < 0) {
            return { line: 0, charIndex: 0 };
        }

        if (line >= lines.length) {
            const lastLine = Math.max(0, lines.length - 1);
            return { line: lastLine, charIndex: lines[lastLine].length };
        }

        const text = lines[line];

        let currentX = lineNumberWidth;
        let charIndex = text.length;

        for (let i = 0; i < text.length; i++) {
            currentX += this.editor.ctx.measureText(text[i]).width;

            if (xcor < currentX) {
                charIndex = i;
                break;
            }
        }

        return { line, charIndex };
    }

    coordsToPosition(x, y) {
        const coordinates = this.standardToCharacterCoordinates(x, y);
        return this.editor.xyToPosition(coordinates.charIndex, coordinates.line);
    }

    getSelectionRange() {
        if (!this.selection.active) return null;

        const start = Math.min(this.selection.start, this.selection.end);
        const end = Math.max(this.selection.start, this.selection.end);

        if (start === end) return null;

        return { start, end };
    }

    clearSelection() {
        this.selection.active = false;
        this.selection.start = this.cursor.position;
        this.selection.end = this.cursor.position;
    }

    setSelection(anchor, head) {
        this.selectionAnchor = anchor;
        this.cursor.position = head;

        if (anchor === head) {
            this.clearSelection();
        } else {
            this.selection.active = true;
            this.selection.start = anchor;
            this.selection.end = head;
        }
    }

    deleteSelection() {
        const range = this.getSelectionRange();
        if (!range) return false;

        this.value.content = this.value.content.slice(0, range.start) + this.value.content.slice(range.end);
        this.cursor.position = range.start;
        this.selectionAnchor = range.start;
        this.clearSelection();

        return true;
    }

    isInTextArea(x) {
        const rect = this.element.getBoundingClientRect();
        const scrollbarWidth = this.editor.json.scroll.scrollbarWidth;
        const lineNumberWidth = this.editor.lineNumbersWidthCache + this.padding.lineNumberHorizontal * 2 + 1;

        return x >= lineNumberWidth && x < rect.width - scrollbarWidth;
    }

    ensureCursorVisible() {
        const canvasHight = this.canvas.getBoundingClientRect().height;
        const deltaLine = this.editor.json.theming.fontSize + this.padding.betweenLines;
        const veiwpointHeight = Math.floor(canvasHight / deltaLine);
        const bottomOfVeiwpoint = this.scroll.line + veiwpointHeight;

        if (this.cursor.y < this.scroll.line && this.cursor.y >= 0) {
            this.scroll.line = this.cursor.y;
        }
        else if (this.cursor.y >= bottomOfVeiwpoint) {
            this.scroll.line -= bottomOfVeiwpoint - this.cursor.y - 1;
        }

        const fileHeight = this.value.content.split("\n").length;

        if (bottomOfVeiwpoint > fileHeight) {
            if (fileHeight - veiwpointHeight > 0) {
                this.scroll.line = fileHeight - veiwpointHeight;
            }
        }

        if (this.scroll.line !== 0 && veiwpointHeight >= fileHeight) {
            this.scroll.line = 0;
        }
    }

    registerDefaultEvents() {
        this.event.create("onresize");
        this.event.create("wheel");
        this.event.create("mousedown");
        this.event.create("mousemove");
        this.event.create("mouseup");
        this.event.create("keydown");


        const resizeObserver = new ResizeObserver(() => {
            this.event.signal("onresize", {});
        });

        resizeObserver.observe(this.element);


        this.element.addEventListener("wheel", (event) => {
            event.preventDefault();

            this.event.signal("wheel", {
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                deltaMode: event.deltaMode,
            });
        });


        this.element.addEventListener("mousedown", (event) => {
            event.preventDefault();

            const rect = this.element.getBoundingClientRect();

            if (event.button !== 0) return;

            this.event.signal("mousedown", {
                x: event.clientX - rect.x,
                y: event.clientY - rect.y,
                shift: event.shiftKey,
                ctrl: event.ctrlKey,
                alt: event.altKey,
                meta: event.metaKey,
            });
        });


        this.element.addEventListener("mousemove", (event) => {
            event.preventDefault();

            const rect = this.element.getBoundingClientRect();

            this.event.signal("mousemove", {
                x: event.clientX - rect.x,
                y: event.clientY - rect.y,
            });
        });


        this.element.addEventListener("mouseup", (event) => {
            event.preventDefault();

            const rect = this.element.getBoundingClientRect();

            this.event.signal("mouseup", {
                x: event.clientX - rect.x,
                y: event.clientY - rect.y,
            });
        });

        window.addEventListener("keydown", (event) => {
            event.preventDefault();

            this.event.signal("keydown", {
                shiftKey: event.shiftKey,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
                key: event.key,
                composing: event.isComposing,
                repeat: event.repeat,
            });
        });
    }

    listenForDefaultEvents() {
        this.event.listen("onresize", (event) => {
            this.update();
        });

        this.event.listen("wheel", (event) => {
            let deltaScrollAmount = 0;

            if (event.deltaMode === 0) {
                deltaScrollAmount = event.deltaY;
            }
            else if (event.deltaMode === 1) {
                deltaScrollAmount = event.deltaY * this.editor.getLineStep();
            }
            else if (event.deltaMode === 2) {
                let screenHeight = this.canvas.height;
                deltaScrollAmount = event.deltaY * screenHeight;
            }

            this.editor.json.scroll.scrollPixel += deltaScrollAmount/2.5;

            const canvasBounds = this.canvas.getBoundingClientRect();
            const beforeText = this.padding.beforeText;
            const lineStep = this.editor.getLineStep();
            const visibleTextHeight = Math.max(0, canvasBounds.height - beforeText);
            const maxVisibleLines = Math.max(1, Math.floor(visibleTextHeight / lineStep));
            const maxScrollLine = Math.max(0, this.value.content.split("\n").length - maxVisibleLines);
            if (this.scroll.line > maxScrollLine) this.scroll.line = maxScrollLine;
            if (this.scroll.line < 0) this.scroll.line = 0;

            this.update();
        });

        const finishMouseSelection = () => {
            this.isMouseSelecting = false;

            if (this.selection.start === this.selection.end) {
                this.clearSelection();
            }
        };

        const onWindowMouseMove = (nativeEvent) => {
            if (!this.isMouseSelecting) return;

            const rect = this.element.getBoundingClientRect();
            const x = nativeEvent.clientX - rect.left;
            const y = nativeEvent.clientY - rect.top;

            const pos = this.coordsToPosition(x, y);
            this.setSelection(this.selectionAnchor, pos);
            this.ensureCursorVisible();
            this.update();
        };

        const onWindowMouseUp = () => {
            if (!this.isMouseSelecting) return;

            finishMouseSelection();
            window.removeEventListener("mousemove", onWindowMouseMove);
            window.removeEventListener("mouseup", onWindowMouseUp);
            this.update();
        };

        this.event.listen("mousedown", (event) => {
            if (!this.isInTextArea(event.x)) return;

            const pos = this.coordsToPosition(event.x, event.y);

            if (event.shift) {
                if (!this.selection.active) {
                    this.selectionAnchor = this.cursor.position;
                }

                this.setSelection(this.selectionAnchor, pos);
            } else {
                this.setSelection(pos, pos);
            }

            this.isMouseSelecting = true;
            window.addEventListener("mousemove", onWindowMouseMove);
            window.addEventListener("mouseup", onWindowMouseUp);
            this.ensureCursorVisible();
            this.update();
        });

        let startScroll = 0;
        let isDraggingScrollbar = false;
        let grabOffsetY = 0;

        this.event.listen("mousedown", (event) => {
            const rect = this.canvas.getBoundingClientRect();

            const x = event.x;
            const y = event.y;

            const width = rect.width;
            const scrollbarWidth = this.editor.json.scroll.scrollbarWidth;

            if (x < width - scrollbarWidth) return;

            const canvasHeight = rect.height;

            const lines = this.value.content.split("\n").length;
            const lineHeight = Number(this.editor.json.theming.fontSize + this.padding.betweenLines);

            const visibleLines = canvasHeight / lineHeight;
            const maxScroll = Math.max(0, lines - Math.floor(visibleLines));

            const thumbHeight = (visibleLines / lines) * canvasHeight;
            const thumbY = (this.scroll.line / lines) * canvasHeight;

            const clickedOnThumb = y >= thumbY && y <= thumbY + thumbHeight;

            if (!clickedOnThumb) {
                const newThumbY = Math.max(0, Math.min(canvasHeight - thumbHeight, y - thumbHeight / 2));
                this.scroll.line = Math.min(maxScroll, Math.round(newThumbY * lines / canvasHeight));
                this.update();

                isDraggingScrollbar = true;
                grabOffsetY = thumbHeight / 2;

                return;
            }

            isDraggingScrollbar = true;
            grabOffsetY = y - thumbY;
        });

        this.event.listen("mousemove", (event) => {
            if (this.isMouseSelecting) return;

            if (!isDraggingScrollbar) return;

            const rect = this.element.getBoundingClientRect();
            const canvasHeight = rect.height;

            const lines = this.value.content.split("\n").length;
            const lineHeight = Number(this.editor.json.theming.fontSize + this.padding.betweenLines);

            const visibleLines = canvasHeight / lineHeight;
            const maxScroll = Math.max(0, lines - Math.floor(visibleLines));

            const thumbHeight = (visibleLines / lines) * canvasHeight;

            let thumbTop = (event.y) - grabOffsetY;
            thumbTop = Math.max(0, Math.min(canvasHeight - thumbHeight, thumbTop));

            this.scroll.line = Math.min(maxScroll, Math.round(thumbTop * lines / canvasHeight));

            this.update();
        });

        this.event.listen("mouseup", (event) => {
            isDraggingScrollbar = false;
        });

        this.event.listen("keydown", (event) => {
            const moveCursorHorizontal = (delta) => {
                const lines = this.value.content.split("\n");
                const maxPosition = this.value.content.length;
                const newPosition = Math.max(0, Math.min(this.cursor.position + delta, maxPosition));

                if (event.shiftKey) {
                    if (!this.selection.active) {
                        this.selectionAnchor = this.cursor.position;
                    }

                    this.setSelection(this.selectionAnchor, newPosition);
                } else {
                    this.setSelection(newPosition, newPosition);
                }
            };

            const moveCursorVertical = (delta) => {
                const lines = this.value.content.split("\n");
                const newY = Math.max(0, Math.min(this.cursor.y + delta, lines.length - 1));

                if (event.shiftKey) {
                    if (!this.selection.active) {
                        this.selectionAnchor = this.cursor.position;
                    }

                    this.cursor.y = newY;
                    this.setSelection(this.selectionAnchor, this.cursor.position);
                } else {
                    this.cursor.y = newY;
                    this.setSelection(this.cursor.position, this.cursor.position);
                }
            };

            if (event.key === "Backspace") {
                if (this.deleteSelection()) {
                    // selection removed
                }
                else if (this.cursor.position > 0) {
                    this.value.content = this.value.content.slice(0, this.cursor.position - 1) + this.value.content.slice(this.cursor.position);
                    this.cursor.position--;
                    this.selectionAnchor = this.cursor.position;
                }
            }
            else if (event.key === "Delete") {
                if (!this.deleteSelection() && this.cursor.position < this.value.content.length) {
                    this.value.content = this.value.content.slice(0, this.cursor.position) + this.value.content.slice(this.cursor.position + 1);
                }
            }
            else if (event.key === "Enter") {
                this.deleteSelection();
                this.value.content = this.value.content.slice(0, this.cursor.position) + "\n" + this.value.content.slice(this.cursor.position);
                this.cursor.position++;
                this.selectionAnchor = this.cursor.position;
            }
            else if (event.key === "Tab") {
                this.deleteSelection();
                this.value.content = this.value.content.slice(0, this.cursor.position) + "    " + this.value.content.slice(this.cursor.position);
                this.cursor.position += 4;
                this.selectionAnchor = this.cursor.position;
            }
            else if (event.key === "ArrowRight") {
                moveCursorHorizontal(1);
            }
            else if (event.key === "ArrowLeft") {
                moveCursorHorizontal(-1);
            }
            else if (event.key === "ArrowDown") {
                moveCursorVertical(1);
            }
            else if (event.key === "ArrowUp") {
                moveCursorVertical(-1);
            }
            else if (event.key.length === 1) {
                this.deleteSelection();
                this.value.content = this.value.content.slice(0, this.cursor.position) + event.key + this.value.content.slice(this.cursor.position);
                this.cursor.position++;
                this.selectionAnchor = this.cursor.position;
            }

            this.ensureCursorVisible();
            this.update();
        });
    }

    update() {
        this.editor.update();
    }
}
