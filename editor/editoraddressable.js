class EditorAddressableSD {
    constructor(editor) {
        this._assertValidEditor(editor);

        const self = this;

        const state = {
            value: {
                get content() {
                    return editor.json.content;
                },

                set content(value) {
                    self._assertType(value, 'string', "content", "value.content");

                    editor.json.content = value;
                },


                get language() {
                    return editor.json.language;
                },

                set language(value) {
                    self._assertType(value, 'string', "language", "value.language");

                    if (!Prism.languages[value]) {
                        throw new Error("Editor language (editorObject.value.language) cannot be set to a value that dose not corespond with a defined Grammer in the included distribution of the Prism syntax highlighting libray");
                    }

                    editor.json.language = value;
                }
            },
            scroll: {
                get line() {
                    return editor.json.scroll.scrollLine;
                },

                set line(value) {
                    self._assertType(value, 'number', "scroll line", "scroll.line");
                    self._assertPositiveFinite(value, "scroll line", "scroll.line");

                    editor.json.scroll.scrollLine = value;
                }
            },
            cursor: {
                get position() {
                    return editor.json.cursor.position;
                },

                set position(value) {
                    self._assertType(value, 'number', "cursor position", "cursor.position");
                    self._assertPositiveFinite(value, "cursor position", "cursor.position");

                    editor.json.cursor.position = value;
                },


                get x() {
                    return editor.json.cursor.x;
                },

                set x(value) {
                    self._assertType(value, 'number', "cursor x position", "cursor.x");
                    self._assertPositiveFinite(value, "cursor x position", "cursor.x");

                    editor.json.cursor.x = value;
                },


                get y() {
                    return editor.json.cursor.y;
                },

                set y(value) {
                    self._assertType(value, 'number', "cursor y position", "cursor.y");
                    self._assertPositiveFinite(value, "cursor y position", "cursor.y");

                    editor.json.cursor.y = value;
                },
            },
            layout: {
                get beforeText() {
                    return editor.json.theming.padding.beforeText;
                },

                set beforeText(value) {
                    self._assertType(value, 'number', "\'beforeText\' padding", "layout.beforeText");

                    editor.json.theming.padding.beforeText = value;
                },


                get betweenLines() {
                    return editor.json.theming.padding.betweenLines;
                },

                set betweenLines(value) {
                    self._assertType(value, 'number', "\'betweenLines\' padding", "layout.betweenLines");

                    editor.json.theming.padding.betweenLines = value;
                },


                get lineNumberHorizontal() {
                    return editor.json.theming.padding.lineNumberHorizontal;
                },

                set lineNumberHorizontal(value) {
                    self._assertType(value, 'number', "\'lineNumberHorizontal\' padding", "layout.lineNumberHorizontal");

                    editor.json.theming.padding.lineNumberHorizontal = value;
                },


                get fontSize() {
                    return editor.json.theming.fontSize;
                },

                set fontSize(value) {
                    self._assertType(value, 'number', "font size", "layout.fontSize");
                    self._assertPositiveFinite(value, "font size", "layout.fontSize");

                    editor.json.theming.fontSize = value;
                },
            },
            selection: {
                get active() {
                    return editor.json.selection.selectionActive;
                },

                set active(value) {
                    self._assertType(value, 'boolean', "selection active", "selection.active");

                    editor.json.selection.selectionActive = value;
                },


                get start() {
                    return editor.json.selection.startSelect;
                },

                set start(value) {
                    self._assertType(value, 'number', "selection start", "selection.start");
                    self._assertPositiveFinite(value, "selection start", "selection.start");

                    editor.json.selection.startSelect = value;
                },


                get end() {
                    return editor.json.selection.endSelect;
                },

                set end(value) {
                    self._assertType(value, 'number', "selection end", "selection.end");
                    self._assertPositiveFinite(value, "selection end", "selection.end");

                    editor.json.selection.endSelect = value;
                },
            },
        };

        return state;
    }

    _assertType(value, type, name, adress) {
        if (typeof value !== type) {
            throw new Error(`Editor ${name} (editorObject.${adress}) cannot be set to a value of any type other than "${type}"`);
        }
    }
    _assertPositiveFinite(value, name, adress) {
        if (value < 0) {
            throw new Error(`Editor ${name} (editorObject.${adress}) cannot be set to a numaric value less than 0`);
        }

        if (isNaN(value)) {
            throw new Error(`Editor ${name} (editorObject.${adress}) cannot be set to a value of NaN`);
        }

        if (value === Infinity) {
            throw new Error(`Editor ${name} (editorObject.${adress}) must be finite`);
        }
    }

    _assertValidEditor(editor) {
        if (!(editor instanceof epEditorRenderer)) {
            throw new Error(`EditorAddresableSD.constructor requires its first argument to be an instance of \'epEditorRenderer\'. The supplied argument was either missing or of an incompatible type.`);
        }
    }
}
