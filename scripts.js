const editorDiv = document.getElementById("editor");
var editor = new InteractiveEditor(editorDiv);

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        init();
    });
});



async function fileOpen() {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");

        input.type = "file";
        input.multiple = false;

        // hidden inline styles
        input.style.position = "fixed";
        input.style.left = "-9999px";
        input.style.top = "-9999px";
        input.style.opacity = "0";
        input.style.pointerEvents = "none";

        const cleanup = () => {
            input.remove();
        };

        input.addEventListener("change", async () => {
            try {
                const file = input.files?.[0];

                if (!file) {
                    cleanup();
                    reject();
                    return;
                }

                cleanup();

                editor.value.content = await file.text();
                editor.update();

                resolve();

            } catch (err) {
                cleanup();
                reject();
            }
        });

        document.body.appendChild(input);

        input.click();
    });
}

function init() {
    editor.value.language = "js";
    editor.value.content = "";

    editor.update();

    document.querySelectorAll("div.menu").forEach((element) => {
        element.addEventListener("click", () => {
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
        element.addEventListener("click", () => {
            const action = element.getAttribute("action").toLowerCase();

            switch (action) {
                case "fopen":
                    fileOpen();
                    break;
                case "clear":
                    editor.value.content = "";
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
