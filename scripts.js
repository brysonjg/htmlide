const editorDiv = document.getElementById("editor");
var editor = new InteractiveEditor(editorDiv);

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        editor.value.content = "the\nthe the\nthe the the\nthe the\nthe the the the\nthe the\nthe the the\nthe the\nthe the the the the\nthe the\nthe the the\nthe the\nthe the the the\nthe the\nthe the the\nthe the\nthe the the the the the\nthe the\nthe the the\nthe the\nthe the the the\nthe the\nthe the the\nthe the\nthe the the the the\nthe the\nthe the the\nthe the\nthe the the the\nthe the\nthe the the\nthe the\nthe the the the the the the\nthe the\nthe the the\nthe the\nthe the the the\nthe the\nthe the the\nthe the\nthe the the the the\nthe the\nthe the the\nthe the\nthe the the the\nthe the\nthe the the\nthe the\nthe the the the the the\nthe the\nthe the the\nthe the\nthe the the the\nthe the\nthe the the\nthe the\nthe the the the the\nthe the\nthe the the\nthe the\nthe the the the\nthe the\nthe the the\nthe the\nthe the the the the the the \n";

        //

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                editor.update();
            });
        });
    });
});


