const editorDiv = document.getElementById("editor");
var editor = new InteractiveEditor(editorDiv);

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        init();
    });
});

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
                    console.log("fopend");
                    break;
            }
        });
    });

    document.addEventListener("click", () => {
        if (document.body.classList.contains("isMenuOpenable")) {
            document.body.classList.remove("isMenuOpenable");
        }
    });
}

