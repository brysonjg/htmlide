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
    }

    update() {
        this.editor.update();
    }
}
