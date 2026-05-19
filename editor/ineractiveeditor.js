class InteractiveEditor {
    constructor(element) {
        this.element = element;
        this.editor = new epEditorRenderer(element);
        this.canvas = this.editor.canvas;

        const self = this;

        this.state = {
            value: {
                get content() {
                    return self.editor.json.content;
                },

                set content(value) {
                    if (typeof value !== 'string') {
                        throw new Error("Editor content (editorObject.value.content) cannot be set to a value of any type other than \'string\'");
                    }

                    self.editor.json.content = value;
                },


                get language() {
                    return self.editor.json.language;
                },

                set language(value) {
                    if (typeof value !== 'string') {
                        throw new Error("Editor language (editorObject.value.language) cannot be set to a value of any type other than \'string\'");
                    }

                    if (!Prism.languages[value]) {
                        throw new Error("Editor language (editorObject.value.language) cannot be set to a value that dosee= not corespond with a defined Grammer in the distribution of the Prism syntax highlighting library");
                    }

                    self.editor.json.language = value;
                }
            },
            scroll: {
                get line() {
                    return self.editor.json.scroll.scrollLine;
                },

                set line(value) {
                    if (typeof value !== 'number') {
                        throw new Error("Editor scroll line (editorObject.scroll.line) cannot be set to a value of any type other than \'number\'");
                    }

                    self.editor.json.scroll.scrollLine = value;
                }
            },
            cursor: {
                get position() {
                    return self.editor.json.cursor.position;
                },

                set position(value) {
                    if (typeof value !== 'number') {
                        throw new Error("Editor cursor position (editorObject.cursor.position) cannot be set to a value of any type other than \'number\'");
                    }

                    if (isNaN(value)) {
                        throw new Error("Editor cursor position (editorObject.cursor.position) cannot be set to the value NaN");
                    }

                    if (value < 0) {
                        throw new Error("Editor cursor position (editorObject.cursor.position) cannot be set to a numeric value that is less than 0");
                    }

                    self.editor.json.cursor.position = value;
                },


                get x() {
                    return self.editor.json.cursor.x;
                },

                set x(value) {
                    if (typeof value !== 'number') {
                        throw new Error("Editor cursor x position (editorObject.cursor.x) cannot be set to a value of any type other than \'number\'");
                    }

                    if (isNaN(value)) {
                        throw new Error("Editor cursor x position (editorObject.cursor.x) cannot be set to the value NaN");
                    }

                    if (value < 0) {
                        throw new Error("Editor cursor x position (editorObject.cursor.x) cannot be set to a numeric value that is less than 0");
                    }

                    self.editor.json.cursor.x = value;
                },


                get y() {
                    return self.editor.json.cursor.y;
                },

                set y(value) {
                    if (typeof value !== 'number') {
                        throw new Error("Editor cursor y position (editorObject.cursor.y) cannot be set to a value of any type other than \'number\'");
                    }

                    if (isNaN(value)) {
                        throw new Error("Editor cursor y position (editorObject.cursor.y) cannot be set to the value NaN");
                    }

                    if (value < 0) {
                        throw new Error("Editor cursor y position (editorObject.cursor.y) cannot be set to a numeric value that is less than 0");
                    }

                    self.editor.json.cursor.y = value;
                },
            },
            padding: {
                get beforeText() {
                    return self.editor.json.theming.padding.beforeText;
                },

                set beforeText(value) {
                    if (typeof value !== 'number') {
                        throw new Error("Editor \'beforeText\' padding (editorObject.padding.beforeText) cannot be set to a value of any type other than \'number\'");
                    }

                    self.editor.json.theming.padding.beforeText = value;
                },


                get betweenLines() {
                    return self.editor.json.theming.padding.betweenLines;
                },

                set betweenLines(value) {
                    if (typeof value !== 'number') {
                        throw new Error("Editor \'betweenLines\' padding (editorObject.padding.betweenLines) cannot be set to a value of any type other than \'number\'");
                    }

                    self.editor.json.theming.padding.betweenLines = value;
                },
            },
        };

        Object.assign(this, this.state); // proxy them to the top level for ease of use

        this.event = {
            events: {},
            _lookupIDEvent: new Map(),
            _idCounter: 0,

            listen(eventType, callback) {
                // type checks
                if (typeof callback !== 'function') {
                    throw new Error("Editor event construct (editorObject.event.listen) (s) second input (callback) must be of type \'function\'");
                }

                // real code
                if (!this.events[eventType]) this.events[eventType] = {};
                this.events[eventType][this._idCounter] = callback;

                this._lookupIDEvent.set(this._idCounter, eventType);
                return this._idCounter++; // returns the right id but also increments it after
            },

            lookup(eventID) {
                eventID = Number(eventID);

                const eventTypeName = this._lookupIDEvent.get(eventID);
                if (eventTypeName === undefined) return null;

                const eventType = this.events[eventTypeName];
                if (eventType === undefined) return null;

                const callback = eventType[eventID];
                if (callback === undefined) return null;

                return callback;
            },

            remove(eventID) {
                eventID = Number(eventID);

                const eventTypeName = this._lookupIDEvent.get(eventID);

                if (eventTypeName === undefined) {
                    throw new Error("event.remove: no event found matching the given ID");
                }

                const eventType = this.events[eventTypeName];
                if (!eventType) {
                    throw new Error("event.remove: event type entry missing for the given ID");
                }

                delete eventType[eventID];
                this._lookupIDEvent.delete(eventID);
            },

            create(eventType) {
                if (!this.events[eventType]) this.events[eventType] = {};
            },

            signal(eventType, eventData) {
                // type checks
                if (Object.getPrototypeOf(eventData) !== Object.prototype) {
                    throw new Error("Editor event call (editorObject.event.signal) (s) second input (eventData) must be a primitive object");
                }

                if (!this.events[eventType]) {
                    throw new Error("Editor signaling event that does not exist")
                }

                // real code
                let identifications = Object.keys(this.events[eventType]);
                identifications = identifications.sort((a, b) => b - a);

                let _preventPropagationSwitch = false;

                const event = {
                    ...eventData,
                    preventPropagation() {
                        _preventPropagationSwitch = true;
                    }
                };

                for (let callbackID of identifications) {
                    const callback = this.lookup(callbackID);
                    if (callback === null) continue;

                    callback(event);

                    if (_preventPropagationSwitch) {
                        break;
                    }
                }
            },
        };

        this.registorDefaultEvents();
    }

    registorDefaultEvents() {
        this.event.create("onresize");
        this.event.create("wheel");
        this.event.create("mousedown");
        this.event.create("mousemove");
        this.event.create("mouseup");
        this.event.create("keydown");

        this.event.listen("onresize", (event) => {
            this.update();
        });

        const resizeObserver = new ResizeObserver(() => {
            this.event.signal("onresize", {});
        });

        resizeObserver.observe(this.element);


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

        this.element.addEventListener("wheel", (event) => {
            event.preventDefault();

            this.event.signal("wheel", {
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                deltaMode: event.deltaMode,
            });
        });


        this.event.listen("mousedown", (event) => {
            const rect = this.element.getBoundingClientRect();

            const width = rect.width;
            const scrollbarWidth = this.editor.json.scroll.scrollbarWidth;
            const lineNumberWidth = this.editor.lineNumbersWidthCache + 1;
            const inset = this.editor.getBeforeText();
            const lineStep = this.editor.getLineStep();

            if (event.x >= width - scrollbarWidth) return;
            if (event.x < lineNumberWidth + inset) return;

            const line = Math.floor((event.y - inset) / lineStep + this.editor.json.scroll.scrollLine);

            this.cursor.y = line;

            const lines = this.value.content.split("\n");
            if (line < 0 || line >= lines.length) return;

            const text = lines[line];

            let currentX = lineNumberWidth + inset;
            let charIndex = text.length;

            for (let i = 0; i < text.length; i++) {
                const charWidth = this.editor.ctx.measureText(text[i]).width;

                const left = currentX;
                const right = currentX + charWidth;

                if (event.x >= left && event.x < right) {
                    const mid = (left + right) / 2;

                    if (event.x < mid) {
                        charIndex = i - 1;
                    } else {
                        charIndex = i;
                    }

                    break;
                }

                currentX += charWidth;
            }

            this.cursor.x = charIndex + 1;

            this.update();
        });

        let startScroll = 0;
        let isDraggingScrollbar = false;
        let grabOffsetY = 0;

        this.event.listen("mousedown", (event) => {
            const rect = this.canvas.getBoundingClientRect();

            const x = event.x - rect.left;
            const y = event.y - rect.top;

            const width = rect.width;
            const scrollbarWidth = this.editor.json.scroll.scrollbarWidth;

            if (x < width - scrollbarWidth) return;

            const canvasHeight = rect.height;

            const lines = this.value.content.split("\n").length;
            const lineHight =  Number(this.editor.json.theming.fontSize + this.editor.json.theming.padding.betweenLines);

            const visibleLines = Math.ceil(canvasHeight / lineHight);
            const maxScroll = Math.max(0, lines - visibleLines);

            const thumbHeight = Math.max(
                (visibleLines / lines) * canvasHeight,
                                         20
            );

            const trackHeight = canvasHeight - thumbHeight;

            const scrollRatio = maxScroll === 0 ? 0 : this.scroll.line / maxScroll;
            const thumbY = scrollRatio * trackHeight;

            const clickedOnThumb =
            y >= thumbY &&
            y <= thumbY + thumbHeight;

            if (!clickedOnThumb) {
                const clickRatio = Math.min(
                    Math.max((y - thumbHeight / 2) / trackHeight, 0),
                                            1
                );

                this.scroll.line = Math.ceil(clickRatio * maxScroll);
                this.update();

                isDraggingScrollbar = true;
                grabOffsetY = thumbHeight / 2;

                return;
            }

            isDraggingScrollbar = true;
            grabOffsetY = y - thumbY;
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



        this.event.listen("mousemove", (event) => {
            if (!isDraggingScrollbar) return;

            const rect = this.element.getBoundingClientRect();
            const canvasHeight = rect.height;

            const lines = this.value.content.split("\n").length;
            const lineHight = Number(this.editor.json.theming.fontSize + this.editor.json.theming.padding.betweenLines);

            const visibleLines = Math.floor(canvasHeight / lineHight);
            const maxScroll = Math.max(0, lines - visibleLines);

            const thumbHeight = Math.max(
                (visibleLines / lines) * canvasHeight,
                                         20
            );

            const trackHeight = canvasHeight - thumbHeight;

            let thumbY = (event.y - rect.top) - grabOffsetY;

            thumbY = Math.max(0, Math.min(trackHeight, thumbY));

            const scrollRatio = trackHeight === 0 ? 0 : thumbY / trackHeight;
            this.scroll.line = Math.ceil(scrollRatio * maxScroll);

            this.update();
        });

        this.element.addEventListener("mousemove", (event) => {
            event.preventDefault();

            const rect = this.element.getBoundingClientRect();

            this.event.signal("mousemove", {
                x: event.clientX - rect.x,
                y: event.clientY - rect.y,
            });
        });


        this.event.listen("mouseup", (event) => {
            isDraggingScrollbar = false;
        });

        this.element.addEventListener("mouseup", (event) => {
            event.preventDefault();

            const rect = this.element.getBoundingClientRect();

            this.event.signal("mouseup", {
                x: event.clientX - rect.x,
                y: event.clientY - rect.y,
            });
        });


        this.event.listen("keydown", (event) => {
            if (event.key === "Backspace") {
                if (this.cursor.position === 0) return;

                this.value.content = this.value.content.slice(0, this.cursor.position-1) + this.value.content.slice(this.cursor.position);
                this.cursor.position--;
            }
            else if (event.key === "Enter") {
                this.value.content = this.value.content.slice(0, this.cursor.position) + "\n" + this.value.content.slice(this.cursor.position);
                this.cursor.position++;
            }
            else if (event.key === "Tab") {
                this.value.content = this.value.content.slice(0, this.cursor.position) + "    " + this.value.content.slice(this.cursor.position);
                this.cursor.position += 4;
            }
            else if (event.key === "ArrowRight") {
                this.cursor.position++;

                const flength = this.value.content.split("\n").length;
                if (this.cursor.y > flength) this.cursor.y = flength;
            }
            else if (event.key === "ArrowLeft") {
                this.cursor.position--;
                if (this.cursor.position < 0) this.cursor.position = 0;
            }
            else if (event.key === "ArrowDown") {
                this.cursor.y++;

                const flength = this.value.content.split("\n").length;
                if (this.cursor.y > flength) this.cursor.y = flength;
            }
            else if (event.key === "ArrowUp") {
                this.cursor.y--;
                if (this.cursor.y < 0) this.cursor.y = 0;
            }
            else if (event.key.length === 1) {
                // Only add printable characters
                this.value.content = this.value.content.slice(0, this.cursor.position) + event.key + this.value.content.slice(this.cursor.position);
                this.cursor.position++;
            }

            const amount = Math.ceil(this.value.content.split('\n').length - this.canvas.getBoundingClientRect().height / this.editor.json.theming.fontSize);
            if (this.scroll.line > amount) this.scroll.line = amount;
            if (this.scroll.line < 0) this.scroll.line = 0;

            this.update();
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

    update() {
        this.editor.update();
    }
}
