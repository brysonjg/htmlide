const editorDiv = document.getElementById("editor");
var editor = new InteractiveEditor(editorDiv);

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        init();
    });
});



let currentFileHandle = null;

async function fileOpen() {
    if (!window.showOpenFilePicker) return;

    try {
        const [handle] = await showOpenFilePicker();

        const file = await handle.getFile();
        editor.value.content = await file.text();
        editor.update();

        currentFileHandle = handle;
    }
    catch {
        return;
    }
}

async function saveFile() {
    if (!window.showOpenFilePicker) return;

    if (!currentFileHandle) {
        await saveFileAs();
        return;
    }

    const writable = await currentFileHandle.createWritable();
    await writable.write(editor.value.content);
    await writable.close();
}

async function saveFileAs() {
    try {
        const handle = await window.showSaveFilePicker();

        const writable = await handle.createWritable();
        await writable.write(editor.value.content);
        await writable.close();

        currentFileHandle = handle;
    }
    catch {
        return;
    }
}


function init() {
    editor.value.language = "js";
    editor.value.content = " ";
    editor.update();
    editor.value.content = "";
    editor.update();

    document.querySelectorAll("div.menu").forEach((element) => {
        element.addEventListener("click", (event) => {
            if (!document.body.classList.contains("isMenuOpenable")) {
                event.stopPropagation();
                document.body.classList.add("isMenuOpenable");
            }
        });
    });

    document.querySelectorAll("div.menu").forEach((element) => {
        element.addEventListener("mouseenter", () => {
            document.querySelectorAll("div.menu").forEach((el) => {
                el.classList.remove("active");
            });
            element.classList.add("active");
        });
    });

    document.querySelectorAll("div.action").forEach((element) => {
        element.addEventListener("click", async () => {
            const action = element.getAttribute("action").toLowerCase();

            switch (action) {
                case "fopen":
                    fileOpen();
                    break;
                case "close":
                    editor.value.content = "";
                    currentFileHandle = null;
                    editor.update();
                    break;
                case "save":
                    saveFile();
                    break;
                case "save-as":
                    saveFileAs();
                    break;

                case "edit-cut":
                    if (editor.selection.active) {
                        const start = Math.min(editor.selection.start, editor.selection.end);
                        const end = Math.max(editor.selection.start, editor.selection.end);
                        const content = editor.value.content;

                        await navigator.clipboard.writeText(content.slice(start, end));

                        editor.value.content = content.slice(0, start) + content.slice(end);

                        editor.selection.start = 0;
                        editor.selection.end = 0;
                        editor.selection.active = false;

                        editor.cursor.position = start;

                        editor.update();
                    } else {
                        // cut line
                        const content = editor.value.content;
                        const pos = editor.cursor.position;

                        let start = content.lastIndexOf("\n", Math.max(0, pos - 1));
                        start = start === -1 ? 0 : start + 1;

                        let end = content.indexOf("\n", pos);
                        end = end === -1 ? content.length : end + 1;

                        await navigator.clipboard.writeText(content.slice(start, end));

                        editor.value.content = content.slice(0, start) + content.slice(end);
                        editor.cursor.position = start;

                        editor.update();
                    }
                    break;
                case "edit-copy":
                    if (editor.selection.active) {
                        const start = Math.min(editor.selection.start, editor.selection.end);
                        const end = Math.max(editor.selection.start, editor.selection.end);

                        await navigator.clipboard.writeText(
                            editor.value.content.slice(start, end)
                        );
                    } else {
                        // copy line
                        const content = editor.value.content;
                        const pos = editor.cursor.position;

                        let start = content.lastIndexOf("\n", Math.max(0, pos - 1));
                        start = start === -1 ? 0 : start + 1;

                        let end = content.indexOf("\n", pos);
                        end = end === -1 ? content.length : end + 1;

                        await navigator.clipboard.writeText(
                            content.slice(start, end)
                        );
                    }
                    break;
                case "edit-past":
                    const text = await navigator.clipboard.readText();

                    if (editor.selection.active) {
                        // replace
                        const start = Math.min(editor.selection.start, editor.selection.end);
                        const end = Math.max(editor.selection.start, editor.selection.end);

                        editor.value.content =
                        editor.value.content.slice(0, start) +
                        text +
                        editor.value.content.slice(end);

                        editor.cursor.position = start + text.length;

                        editor.selection.active = false;
                        editor.selection.start = 0;
                        editor.selection.end = 0;
                    } else {
                        // insert
                        const pos = editor.cursor.position;

                        editor.value.content =
                        editor.value.content.slice(0, pos) +
                        text +
                        editor.value.content.slice(pos);

                        editor.cursor.position = pos + text.length;
                    }

                    editor.update();
                    break;

                case "select-all":
                    editor.selection.start = 0;
                    editor.selection.end = editor.value.content.length;
                    editor.cursor.position = editor.value.content.length;
                    editor.selection.active = true;
                    editor.update();
                    break;
                case "deselect":
                    editor.selection.start = 0;
                    editor.selection.end = 0;
                    editor.selection.active = false;
                    editor.update();
                    break;
            }
        });
    });

    document.addEventListener("click", () => {
        if (document.body.classList.contains("isMenuOpenable")) {
            document.body.classList.remove("isMenuOpenable");
        }
    });

    window.addEventListener("blur", () => {
        if (document.body.classList.contains("isMenuOpenable")) {
            document.body.classList.remove("isMenuOpenable");
        }
    });
}
