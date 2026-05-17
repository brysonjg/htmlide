const editorDiv = document.getElementById("editor");
var editor = new InteractiveEditor(editorDiv);

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        editor.value.content = "the\nthe ";
        editor.value.content = editor.value.content + editor.value.content + "the ";
        editor.value.content = editor.value.content + editor.value.content + "the ";
        editor.value.content = editor.value.content + editor.value.content + "the ";
        editor.value.content = editor.value.content + editor.value.content + "the ";
        editor.value.content = editor.value.content + editor.value.content + "the ";
        editor.value.content = editor.value.content + editor.value.content + "the ";
        editor.value.content += "\n";

        //

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                editor.update();
            });
        });
    });
});


