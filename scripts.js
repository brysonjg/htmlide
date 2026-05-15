const editorDiv = document.getElementById("editor");
var editor = new InteractiveEditor(editorDiv);

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        editor.value.content = "the\nthe";

        editor.update();
    });
});


