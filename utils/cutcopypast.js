class CCPTextActions { // cut copy past text actions
    static _assertEditor(editor, functionName) {
        if (!(editor instanceof InteractiveEditor)) {
            throw new Error(`CCPTextActions.${functionName} requires its first argument to be an instance of \'InteractiveEditor\'. The supplied argument was either missing or of an incompatible type.`);
        }
    }

    static _getSelectionRange(editor) {
        return {
            start: Math.min(editor.selection.start, editor.selection.end),
            end: Math.max(editor.selection.start, editor.selection.end)
        };
    }

    static _getActiveLineRange(editor) {
        const content = editor.value.content;
        const position = editor.cursor.position;

        const start = content.lastIndexOf("\n", position - 1) + 1;

        let end = content.indexOf("\n", position);
        if (end === -1) {
            end = content.length;
        }

        return {
            start: start,
            end: end
        };
    }

    static _getSelectionOrActiveLineRange(editor) {
        if (editor.selection.active) {
            return this._getSelectionRange(editor);
        }

        return this._getActiveLineRange(editor);
    }

    static _replaceText(editor, text, start, end) {
        editor.value.content =
            editor.value.content.slice(0, start) +
            text +
            editor.value.content.slice(end);

        editor.cursor.position = start + text.length;
    }

    static async cut(editor) {
        this._assertEditor(editor, "cut");

        const range = this._getSelectionOrActiveLineRange(editor);
        const text = editor.value.content.slice(range.start, range.end);

        await navigator.clipboard.writeText(text);

        this._replaceText(editor, "", range.start, range.end);
        SelectionActions.deselect(editor);
    }


    static async copy(editor) {
        this._assertEditor(editor, "copy");

        const range = this._getSelectionOrActiveLineRange(editor);
        const text = editor.value.content.slice(range.start, range.end);

        await navigator.clipboard.writeText(text);
    }

    static async paste(editor) {
        this._assertEditor(editor, "paste");

        const text = await navigator.clipboard.readText();

        let start;
        let end;

        if (editor.selection.active) {
            start = Math.min(editor.selection.start, editor.selection.end);
            end = Math.max(editor.selection.start, editor.selection.end);
        } else {
            start = editor.cursor.position;
            end = editor.cursor.position;
        }

        this._replaceText(editor, text, start, end);
        SelectionActions.deselect(editor);
    }
}
