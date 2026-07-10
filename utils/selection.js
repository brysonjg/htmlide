class SelectionActions {
    static _assertEditor(editor, functionName) {
        if (!(editor instanceof InteractiveEditor)) {
            throw new Error(`SelectionActions.${functionName} requires its first argument to be an instance of \'InteractiveEditor\'. The supplied argument was either missing or of an incompatible type.`);
        }
    }

    static selectAll(editor) {
        _assertEditor(editor, "selectAll");

        editor.selection.active = true;
        editor.selection.start = 0;
        editor.selection.end = editor.value.content.length;

        editor.cursor.position = editor.selection.end;
    }

    static deselect(editor) {
        _assertEditor(editor, "deselectAll");

        editor.selection.active = false;
        editor.selection.start = 0;
        editor.selection.end = 0;
    }
}
