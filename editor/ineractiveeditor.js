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
                        throw new Error("Editor language (editorObject.value.language) cannot be set to a value that dose not corespond with a defined Grammer in the distrobution of the Prism syntax highlighting library");
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
                        throw new Error("Editor cursor position (editorObject.cursor.position) cannot be set to a numaric value that is less then 0");
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
                        throw new Error("Editor cursor x position (editorObject.cursor.x) cannot be set to a numaric value that is less then 0");
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
                        throw new Error("Editor cursor y position (editorObject.cursor.y) cannot be set to a numaric value that is less then 0");
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
            }
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
                    throw new Error("Editor signaling event that does not exits")
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
    }

    update() {
        this.editor.update();
    }
}
