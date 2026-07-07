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
                case "open":
                    await fileOpen();
                    break;
                case "close":
                    editor.value.content = "";
                    currentFileHandle = null;
                    editor.update();
                    break;
                case "save":
                    await saveFile();
                    break;
                case "save-as":
                    await saveFileAs();
                    break;

                case "edit-cut":
                    await CCPTextActions.cut(editor);
                    editor.update();
                    break;
                case "edit-copy":
                    await CCPTextActions.copy(editor);
                    break;
                case "edit-paste":
                    await CCPTextActions.paste(editor);
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
