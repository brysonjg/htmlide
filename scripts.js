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
        editor.value.language = getLanguageOfFileName(file.name);
        editor.value.content = await file.text();
        SelectionActions.deselect(editor);
        editor.scroll.line = 0;
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
                    editor.value.language = "plain";
                    editor.value.content = "";
                    SelectionActions.deselect(editor);
                    editor.scroll.line = 0;
                    currentFileHandle = null;
                    break;
                case "save":
                    await saveFile();
                    break;
                case "save-as":
                    await saveFileAs();
                    break;

                case "edit-cut":
                    await CCPTextActions.cut(editor);
                    break;
                case "edit-copy":
                    await CCPTextActions.copy(editor);
                    break;
                case "edit-paste":
                    await CCPTextActions.paste(editor);
                    break;

                case "select-all":
                    SelectionActions.selectAll(editor);
                    break;
                case "deselect":
                    SelectionActions.deselect(editor);
                    break;

                case "set-syntax":
                    editor.value.language = element.dataset.lang;
                    break;
            }

            editor.update();
        });
    });

    document.addEventListener("click", (event) => {
        if (document.body.classList.contains("isMenuOpenable")) {
            if (event.target.classList.contains('sub-menu')) return;

            document.body.classList.remove("isMenuOpenable");
        }
    });

    window.addEventListener("blur", () => {
        if (document.body.classList.contains("isMenuOpenable")) {
            document.body.classList.remove("isMenuOpenable");
        }
    });
}
