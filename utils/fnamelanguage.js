function getLanguageOfFileName(fileName) {
    if (typeof fileName !== "string") {
        throw new Error("getLanguageOfFileName cannot execute if its first input (fileName) is not of type \"string\"")
    }

    const fileAsArray = fileName.split(".");
    if (fileAsArray.length <= 1) return "plaintext";

    const fileExtention = fileAsArray.pop();

    switch (fileExtention) {
        case "html":
            return "html";
        case "css":
            return "css";
        case "js":
            return "javascript";
        case "xml":
            return "xml";
        case "py":
            return "python";
        case "svg":
            return "svg";
        case "txt":
            return "plaintext";
    }

    return "plaintext";
}
