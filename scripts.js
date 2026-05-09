const editorDiv = document.getElementById("editor");
const editor = new epEditorRenderer(editorDiv);

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        editor.json.language = "js";
        // test code
        editor.json.content = `// Constants
const DEFAULT_FONT_SIZE = 16;
const DEBOUNCE_DLAY = 500;
const INIT_CONTENTS = \`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Document</title>
    <link rel="icon" type="image/png" href="example_image.png">
    <style>

      /* Style Sheets goes here */

    </style>
  </head>
  <body>

    <!-- body -->

    <script>

      // JS goes here

    </script>
  </body>
</html>\`;

// things in the about
DATE_MODIFIED = "8 / 27 / 2025 at 8:06 PM MDT";
VERSION = "0 . 4 . 6 &nbsp;&nbsp; patch 3.1";
// Supported browsers include Chromium-based browsers, Firefox, and Safari.
BROWSERS = "Chrome,  Safari,  Edge,  FireFox, Opera, And More.";

const FILE_TYPES = {
  html: { mime: 'text/html', ext: '.html' },
  css: { mime: 'text/css', ext: '.css' },
  js: { mime: 'text/javascript', ext: '.js' },
  json: { mime: 'application/json', ext: '.json' },
  txt: { mime: 'text/plain', ext: '.txt' },
  md: { mime: 'text/markdown', ext: '.md' },
  py: { mime: 'text/x-python', ext: '.py' },
  java: { mime: 'text/x-java', ext: '.java' },
  jav: { mime: 'text/x-java', ext: '.jav' },
  c: { mime: 'text/x-c', ext: '.c' },
  cs: { mime: 'text/x-c#', ext: '.cs' },
  rs: { mime: 'text/x-rust', ext: '.rs' },
  svg: { mime: 'image/svg+xml', ext: '.svg' }
};

// Iframe embedding conditions API
const IFRAME_DEFAULTS = {
  allowScripts: false,
  allowForms: false,
  allowPopups: false,
  allowModals: false,
  allowFullscreen: false,
  allowDownloads: false,
  allowNavigation: false,
  allowSameOrigin: true,
  allowPointerLock: false,
  allowPresentation: false
};

// Image preview specific iframe settings
const IMAGE_PREVIEW_SETTINGS = {
  allowScripts: true,
  allowPointerLock: true,
  allowSameOrigin: true,
  allowFullscreen: true,
  imgPrevPath: 'extence_function/imgpv.html'
};

// Image preview specific iframe settings
const PYTHON_EXECUTION_SETTINGS = {
  allowScripts: true,
  allowPointerLock: true,
  allowSameOrigin: true,
  allowFullscreen: true,
  pythonPath: 'extence_function/python/ipython.html'
};

const languageMap = {
  html: 'html',
  htm: 'html',
  css: 'css',
  js: 'javascript',
  json: 'json',
  txt: 'plaintext',
  md: 'markdown',
  c: 'c',
  cpp: 'cpp',
  cs: 'csharp',
  py: 'python',
  java: 'java',
  jav: 'java',
  rs: 'rust',
  jsx: 'jsx',
  ts: 'typescript',
  svg: 'xml',
};

function getIframeSandboxPermissions(settings = {}) {
  const config = { ...IFRAME_DEFAULTS, ...settings };
  const permissions = [];

  if (config.allowScripts) permissions.push('allow-scripts');
  if (config.allowForms) permissions.push('allow-forms');
  if (config.allowPopups) permissions.push('allow-popups');
  if (config.allowModals) permissions.push('allow-modals');
  if (config.allowFullscreen) permissions.push('allow-fullscreen');
  if (config.allowDownloads) permissions.push('allow-downloads');
  if (config.allowNavigation) permissions.push('allow-top-navigation');
  if (config.allowSameOrigin) permissions.push('allow-same-origin');
  if (config.allowPointerLock) permissions.push('allow-pointer-lock');
  if (config.allowPresentation) permissions.push('allow-presentation');

  return permissions.join(' ');
}

// State management
const state = {
  unsavedChanges: false,
  tabs: JSON.parse(localStorage.getItem('editorTabs')) || [{
    id: 'tab1',
    name: 'untitled.html',
    type: 'html',
    content: INIT_CONTENTS,
    handle: null,
    active: true,
    tabSize: 2  // Add default tab size
  }],
  currentTabId: 'tab1',
  fileExplorerOpen: localStorage.getItem('fileExplorerOpen') === 'true',
  fileExplorerPath: '', // Current path in file explorer
  files: JSON.parse(localStorage.getItem('projectFiles')) || [
    { name: 'index.html', type: 'file' },
    { name: 'styles.css', type: 'file' },
    { name: 'scripts.js', type: 'file' },
    { name: 'assets', type: 'folder', children: [] }
  ],
  autosaveEnabled: localStorage.getItem('autosaveEnabled') === 'true',
  fileChangeNotificationsEnabled: localStorage.getItem('fileChangeNotificationsEnabled') === 'true',
  feIsCommunicating: false, // Add this flag
  iframeSettings: JSON.parse(localStorage.getItem('iframeSettings')) || IFRAME_DEFAULTS,
};

// Configure Monaco Editor loader with language support paths
require.config({
  paths: {
    'vs': './monaco-editor/min/vs',
    // Language-specific paths
    'vs/language/html/html': './monaco-editor/min/vs/language/html/html',
    'vs/language/css/css': './monaco-editor/min/vs/language/css/css',
    'vs/language/typescript/tsMode': './monaco-editor/min/vs/language/typescript/tsMode',
    'vs/language/json/jsonMode': './monaco-editor/min/vs/language/json/jsonMode',
    'vs/language/plaintext/plaintextMode': './monaco-editor/min/vs/language/plaintext/plaintextMode',
    'vs/language/markdown/markdownMode': './monaco-editor/min/vs/language/markdown/markdownMode',
    'vs/language/python/python': './monaco-editor/min/vs/language/python/python',
    'vs/language/java/java': './monaco-editor/min/vs/language/java/java',
    'vs/language/rust/rust': './monaco-editor/min/vs/language/rust/rust',
    'vs/language/csharp/csharp': './monaco-editor/min/vs/language/csharp/csharp',
    'vs/language/cpp/cpp': './monaco-editor/min/vs/language/cpp/cpp',
  }
});

// Initialize Monaco Editor with language
require(['vs/editor/editor.main'], function () {

  // Register all supported languages
  monaco.languages.register({ id: 'html' });
  monaco.languages.register({ id: 'css' });
  monaco.languages.register({ id: 'javascript' });
  monaco.languages.register({ id: 'json' });
  monaco.languages.register({ id: 'plaintext' });
  monaco.languages.register({ id: 'markdown' });
  monaco.languages.register({ id: 'c' });
  monaco.languages.register({ id: 'cpp' });
  monaco.languages.register({ id: 'csharp' });
  monaco.languages.register({ id: 'python' });
  monaco.languages.register({ id: 'java' });
  monaco.languages.register({ id: 'rust' });
  monaco.languages.register({ id: 'jsx' });
  monaco.languages.register({ id: 'typescript' });

  // Create editor instance

  if (!window.monacoEditorInstance) {
    window.monacoEditorInstance = monaco.editor.create(document.getElementById('editor'), {
      value: getCurrentTab().content, // !!
      language: 'html',
      theme: localStorage.getItem('editorTheme') === 'light' ? 'vs' : 'vs-dark',
      fontSize: parseInt(localStorage.getItem('editorFontSize')) || DEFAULT_FONT_SIZE,
      fontFamily: localStorage.getItem('editorFontFamily') || 'monospace',
      lineNumbers: localStorage.getItem('editorLineNumbers') !== 'off' ? 'on' : 'off',
      minimap: { enabled: true },
      automaticLayout: true,
      tabSize: 2, // !!
      autoClosingBrackets: 'always',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true
    });
  }
  const editor = window.monacoEditorInstance;

  // Editor functionality
  const statusMessage = document.getElementById('statusMessage');
  const lineInfo = document.getElementById('lineInfo');
  const fileList = document.getElementById('file-list');
  const tabsContainer = document.getElementById('tabsContainer');
  const preview = document.getElementById('preview');

  function showAlert(message, type = 'ERR', title = 'Error Alert', icon = 'ERR') {
    const VALID_TYPES = ['ERR', 'INFO', 'QUERY', 'REQUEST', 'SUCCESS', 'WARNING', 'CONFIRM'];

    return new Promise((resolve) => {
      // Validate and sanitize parameters
      type = VALID_TYPES.includes(type.toUpperCase()) ? type.toUpperCase() : 'ERR';
      icon = VALID_TYPES.includes(icon.toUpperCase()) ? icon.toUpperCase() : type;

      // Remove any existing alerts
      const existingAlerts = document.querySelectorAll('.alert-view');
      existingAlerts.forEach( (alert) => alert.remove());

      // Create alert container
      const alertView = document.createElement('div');
      alertView.className = \`alert-view alert-\${type.toLowerCase()}\`;
      alertView.setAttribute('role', 'alertdialog');
      alertView.setAttribute('aria-modal', 'true');
      alertView.setAttribute('aria-labelledby', 'alertTitle');
      alertView.setAttribute('aria-describedby', 'alertMessage');

      // Create header with icon and title
      const header = document.createElement('div');
      header.className = 'alert-header';

      const iconElement = document.createElement('img');
      iconElement.src = \`icons\\notification\\\${icon.toLowerCase()}_icon.svg\`;
      iconElement.className = 'alert-icon';
      iconElement.alt = \`\${type} icon\`;

      const titleElement = document.createElement('div');
      titleElement.className = 'alert-title';
      titleElement.id = 'alertTitle';
      titleElement.textContent = title;

      header.appendChild(iconElement);
      header.appendChild(titleElement);
      alertView.appendChild(header);

      // Create message and input if QUERY type
      if (type === 'QUERY') {
        const messageText = document.createElement('div');
        messageText.className = 'alert-message';
        messageText.id = 'alertMessage';
        messageText.textContent = message;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'alert-input';
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginTop = '10px';
        input.style.marginBottom = '20px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid var(--outline-dark)';
        input.style.background = 'var(--menu-bg-dark)';
        input.style.color = 'var(--text-dark)';

        alertView.appendChild(messageText);
        alertView.appendChild(input);

        // Focus input after a short delay
        setTimeout(() => input.focus(), 50);

        // Handle enter key
        input.addEventListener('keyup', (e) => {
          if (e.key === 'Enter') {
            resolve(input.value);
            alertView.remove();
          }
        });
      } else {
        const messageText = document.createElement('div');
        messageText.className = 'alert-message';
        messageText.id = 'alertMessage';
        messageText.innerHTML = message.replace(/\\n/g, '<br>');
        alertView.appendChild(messageText);
      }

      // Create buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      buttonContainer.style.justifyContent = 'flex-end';

      if (type === 'QUERY') {
        const okButton = document.createElement('button');
        okButton.className = 'alert-button';
        okButton.textContent = 'OK';
        okButton.onclick = () => {
          resolve(alertView.querySelector('input').value);
          alertView.remove();
        };

        const cancelButton = document.createElement('button');
        cancelButton.className = 'alert-button alert-button-secondary';
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => {
          resolve(null);
          alertView.remove();
        };

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(okButton);
      } else {
        const okButton = document.createElement('button');
        okButton.className = 'alert-button';
        okButton.textContent = 'OK';
        okButton.onclick = () => {
          resolve();
          alertView.remove();
        };
        buttonContainer.appendChild(okButton);
      }

      alertView.appendChild(buttonContainer);

      // Add to document
      document.body.appendChild(alertView);

      // Handle escape key
      const escapeHandler = (e) => {
        if (e.key === 'Escape') {
          resolve(null);
          alertView.remove();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    });
  }

  function idk() {
    if ("a" == "b") {
      if (true) {
        // <img> tags
        const images = value.match(imgRegex);
        if (images) {
          for (const img of images) {
            const src = img.match(/src=["']([^"']+)["']/)[1];
            if (src.startsWith('data:')) continue;
            const cleanPath = src.replace(/^\.\//, '');
            const fileEntry = findFileEntry(cleanPath, state.files);
            if (fileEntry && fileEntry.content) {
              const ext = cleanPath.split('.').pop().toLowerCase();
              const mimeType = {
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'svg': 'image/svg+xml'
              }[ext] || 'image/png';

              if (ext === 'svg') {
                const dataUrl = \`data:\${mimeType};charset=utf-8,\${encodeURIComponent(fileEntry.content)}\`;
                finalContent = finalContent.replace(src, dataUrl);
              } else if (fileEntry.content.startsWith('data:')) {
                finalContent = finalContent.replace(src, fileEntry.content);
              }
            }
          }
        }
        // --- Import logic end ---

        if (!/^<!DOCTYPE html>/i.test(finalContent)) {
          finalContent = \`<!DOCTYPE html><html><head></head><body>\${finalContent}</body></html>\`;
        }

        iframe.contentDocument.open();
        iframe.contentDocument.write(finalContent);
        iframe.contentDocument.close();
        updateStatus("Preview updated");
        return;
      }

      const isJsFile = currentTab.name.endsWith('.js');
      const isPythonFile = currentTab.name.endsWith('.py');
      const isOtherFormat = !isJsFile && !isPythonFile && !currentTab.name.endsWith('.html');
        // Listen for messages from iframe
        window.addEventListener('message', messageHandler);
        // Replace the existing isPythonFile section in updatePreview()
      } else if (isPythonFile) {
        // Check if we already have a Python preview iframe
        let iframe = preview.querySelector('iframe.python-preview');
        if (!iframe) {
          // Only create new iframe if it doesn't exist
          iframe = createPythonPreviewIframe();
          iframe.classList.add('python-preview');
          preview.appendChild(iframe);
          updateStatus("Python terminal ready. Press F5 to run.");
        }
        // Never update Python preview on content changes
        return;
      } else if (isOtherFormat) {
        // Handle other file formats
        const otherOutputContainer = document.createElement('div');
        otherOutputContainer.id = 'other-output';
        otherOutputContainer.style.padding = '1rem';
        otherOutputContainer.style.fontFamily = 'monospace';
        otherOutputContainer.style.whiteSpace = 'pre';
        otherOutputContainer.style.overflow = 'auto';
        otherOutputContainer.style.height = '100%';

        preview.appendChild(otherOutputContainer);
        otherOutputContainer.textContent = 'Preview not available for this file type.\\nPlease go to view > layout > editor only to not view this error message';
      } else {
        // Original HTML preview code
        const iframe = document.createElement('iframe');
        iframe.sandbox = 'allow-same-origin';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        preview.appendChild(iframe);

        const content = \`
      <!DOCTYPE html>
      <html>
      <head>
        <script>
          window.onerror = function(e) {
            parent.postMessage({
              type: 'preview-error',
              error: e.toString()
            }, '*');
          };
        <\/script>
        <style>
          body { margin: 0; padding: 0; }
          .error { color: red; }
        </style>
      </head>
      <body>\${editor.getValue()}</body>
      </html>\`;

        iframe.contentDocument.open();
        iframe.contentDocument.write(content);
        iframe.contentDocument.close();

        updateStatus("Preview updated");
      }
    } catch (error) {
      showError(\`Preview error: \${error.message}\`);
      showAlert(\`Failed to update preview:\\n\${error.message}\`, 'ERR', 'Preview Error', 'ERR');
    }
  }

  // Add these event listeners
  fileList.addEventListener('contextmenu', (e) => {
    const fileItem = e.target.closest('.file-item');
    if (fileItem) {
      e.preventDefault();
      const contextMenu = fileList.querySelector('.context-menu');
      contextMenu.style.display = 'block';
      contextMenu.style.left = \`\${e.pageX}px\`;
      contextMenu.style.top = \`\${e.pageY}px\`;

      // Store selected file path
      contextMenu.dataset.path = fileItem.dataset.path;
    }
  });

  document.addEventListener('click', () => {
    const contextMenu = fileList.querySelector('.context-menu');
    contextMenu.style.display = 'none';
  });

  // Add drag and drop functionality
  let draggedItem = null;

  fileList.addEventListener('dragstart', (e) => {
    draggedItem = e.target.closest('.file-item');
    e.dataTransfer.effectAllowed = 'move';
  });

  fileList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target.closest('.file-item');
    if (target && target !== draggedItem) {
      target.classList.add('drag-over');
    }
  });

  fileList.addEventListener('dragleave', (e) => {
    e.target.closest('.file-item')?.classList.remove('drag-over');
  });

  fileList.addEventListener('drop', async (e) => {
    e.preventDefault();
    const target = e.target.closest('.file-item');
    target?.classList.remove('drag-over');

    if (draggedItem && target) {
      // Handle file/folder move logic
      const sourcePath = draggedItem.dataset.path;
      const targetPath = target.dataset.path;
    }
  });

  function runPythonFile() {
    const currentTab = getCurrentTab();
    if (!currentTab.name.endsWith('.py')) return;

    const pythonCode = editor.getValue();
    const iframe = document.querySelector('#preview iframe.python-preview');

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'runFile',
        code: pythonCode
      }, '*');
      updateStatus("Running Python file...");
    }
  }

  // Shortcuts manager
  const shortcuts = {
    'Ctrl+S': async (e) => { e.preventDefault(); await saveFile(); },
    'Ctrl+Shift+S': async (e) => { e.preventDefault(); await saveFileAs(); },
    'Ctrl+O': async (e) => { e.preventDefault(); await openFile(); },
    'Ctrl+N': (e) => { e.preventDefault(); newFile(); },
    'Ctrl+W': (e) => { e.preventDefault(); closeTab(); },
    'Ctrl+B': (e) => { e.preventDefault(); toggleFileExplorer(); },
    'Ctrl+Z': (e) => { e.preventDefault(); editor.trigger('', 'undo'); },
    'Ctrl+Y': (e) => { e.preventDefault(); editor.trigger('', 'redo'); },
    'Ctrl+F': (e) => { e.preventDefault(); editor.getAction('actions.find').run(); },
    'Ctrl+Shift+F': (e) => { e.preventDefault(); /* Implement find in files */ },
    'Ctrl+P': (e) => { e.preventDefault(); /* Implement command palette */ },
    'Ctrl+K': (e) => { e.preventDefault(); /* Implement keyboard shortcuts reference */ },
    'Ctrl+Shift+E': (e) => { e.preventDefault(); toggleFileExplorer(); },
    // Modify the F5 shortcut handler
    'F5': (e) => {
      e.preventDefault();
      const currentTab = getCurrentTab();

      if (currentTab.name.endsWith('.py')) {
        runPythonFile();
      } else {
        updatePreview();
      }
    },
    'Ctrl+R': (e) => { e.preventDefault(); location.reload(); },
    'Ctrl+D': (e) => { e.preventDefault(); /* Implement duplicate file */ },
    'Ctrl+Shift+D': (e) => { e.preventDefault(); /* Implement duplicate folder */ },
    'Delete': (e) => { e.preventDefault(); closeTab(); },
    'Ctrl+W': (e) => { e.preventDefault(); closeTab(); },
    'Ctrl+N': (e) => { e.preventDefault(); newFile(); },
  };

  document.addEventListener('keydown', (e) => {
    let keyCombo = '';
    if (e.ctrlKey) keyCombo += 'Ctrl+';
    if (e.shiftKey) keyCombo += 'Shift+';
    if (e.altKey) keyCombo += 'Alt+';
    // Use e.code for non-character keys, e.key for character keys
    let key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    keyCombo += key;
    if (shortcuts[keyCombo]) {
      shortcuts[keyCombo](e);
    }
  });

  function newFile() {

    // Create a new tab instead of replacing current one
    const tabId = generateTabId();
    const newTab = {
      id: tabId,
      name: 'untitled.html',
      type: 'html',
      content: INIT_CONTENTS,
      handle: null,
      active: true,
      tabSize: 2  // Add default tab size
    };

    // Deactivate current tab
    const currentTab = getCurrentTab();
    if (currentTab) {
      currentTab.active = false;
    }

    state.tabs.push(newTab);
    state.currentTabId = tabId;

    editor.setValue(newTab.content);
    state.unsavedChanges = false;
    renderTabs();
    updateStatus("Created new file");
    detectLanguage();
    saveTabsToStorage();
    refreshExploreFileList();

    setTimeout(() => {
      let fe = document.getElementById("FEIframe");
      if (fe) {
        fe.src = fe.src;
      }
    }, 50); // Small delay to ensure message is processed first
  }

  async function nameFile() {
    const currentTab = getCurrentTab();
    const name = await showAlert('Enter new file name (without extension):', 'QUERY', 'Rename File', 'QUERY');
    if (name) {
      currentTab.name = \`\${name}\${FILE_TYPES[currentTab.type].ext}\`;
      renderTabs();
      updateStatus(\`Renamed to \${currentTab.name}\`);
      saveTabsToStorage();
      refreshExploreFileList();
    }
  }

  function clearFile() {
    if (state.unsavedChanges && !confirm('You have unsaved changes. Clear editor anyway?')) {
      return;
    }
    editor.setValue('');
    state.unsavedChanges = true;
    updateStatus("Editor cleared");
  }

  async function detectLanguage() {
    const currentTab = getCurrentTab();
    const fileType = currentTab.name.split('.').pop().toLowerCase();

    if (languageMap[fileType]) {
      try {
        switch (fileType) {
          case 'htm':
          case 'html':
            await new Promise((resolve) => {
              require(['vs/language/html/html'], resolve);
            });
            break;
          case 'css':
            await new Promise((resolve) => {
              require(['vs/language/css/css'], resolve);
            });
            break;
          case 'js':
          case 'jsx':
          case 'tsx':
          case 'ts':
            await new Promise((resolve) => {
              require(['vs/language/typescript/tsMode'], resolve);
            });
            break;
          case 'json':
            await new Promise((resolve) => {
              require(['vs/language/json/jsonMode'], resolve);
            });
            break;
          case 'txt':
            await new Promise((resolve) => {
              require(['vs/language/plaintext/plaintextMode'], resolve);
            });
            break;
          case 'md':
            await new Promise((resolve) => {
              require(['vs/language/markdown/markdownMode'], resolve);
            });
            break;
          case 'pyx':
          case 'py':
            await new Promise((resolve) => {
              require(['vs/language/python/python'], resolve);
            });
            break;
          case 'jav':
          case 'java':
            await new Promise((resolve) => {
              require(['vs/language/java/java'], resolve);
            });
            break;
          case 'rs':
            await new Promise((resolve) => {
              require(['vs/language/rust/rust'], resolve);
            });
            break;
          case 'cpp':
            await new Promise((resolve) => {
              require(['vs/language/cpp/cpp'], resolve);
            });
            break;
          case 'csharp':
            await new Promise((resolve) => {
              require(['vs/language/csharp/csharp'], resolve);
            });
            break;
        }

        monaco.editor.setModelLanguage(editor.getModel(), languageMap[fileType]);
        updateStatus(\`Language mode set to \${languageMap[fileType]}\`);
      } catch (error) {
        console.error('Error loading language features:', error);
        monaco.editor.setModelLanguage(editor.getModel(), languageMap[fileType] || 'plaintext');
      }
    }
  }

  async function setFormatCustom() {
    const currentTab = getCurrentTab();
    const type = await showAlert('Enter the format you want to use:', 'QUERY', 'Reformat', 'QUERY');
    if (type) {
      const fileName = currentTab.name;
      const dotIndex = fileName.lastIndexOf('.');
      const name = dotIndex === -1 ? fileName : fileName.substring(0, dotIndex);
      currentTab.name = \`${name}.\${type}\`;
      currentTab.type = type.toLowerCase();
      renderTabs();
      updateStatus(\`Reformatted to \${type}\`);
      saveTabsToStorage();
      refreshExploreFileList();

      // Register the custom language if not already registered
      if (!monaco.languages.getLanguages().find(lang => lang.id === type.toLowerCase())) {
        monaco.languages.register({ id: type.toLowerCase() });
      }

      // Set editor language mode
      monaco.editor.setModelLanguage(editor.getModel(), type.toLowerCase());
    }
  }

  // Menu actions
  async function handleMenuAction(action, data) {
    try {
      switch (action) {
        case 'new': newFile(); break;
        case 'close-tab': closeTab(data.tabId); break;
        case 'open': await openFile(); break;
        case 'open-folder': await openFolder(); break;
        case 'close-folder': await closeFolder(); break;
        case 'exit-prosses': window.close(); break;
        case 'save': await saveFile(); break;
        case 'save-as': await saveFileAs(getCurrentTab().type); break;
        case 'rename': await nameFile(); break;
        case 'clear': clearFile(); break;
        case 'undo': editor.trigger('', 'undo'); break;
        case 'redo': editor.trigger('', 'redo'); break;
        case 'cut':
          const selection = editor.getSelection();
          const text = editor.getModel().getValueInRange(selection);
          navigator.clipboard.writeText(text).then(() => {
            editor.executeEdits("cut", [{ range: selection, text: "" }]);
          }).catch(err => {
            showError("Clipboard access denied");
            showAlert(\`Failed to cut text:\\n\${err.message}\`, 'ERR', 'Clipboard Access Denied Error', 'ERR');
          });
          break;
        case 'copy':
          navigator.clipboard.writeText(
            editor.getModel().getValueInRange(editor.getSelection())
          ).catch(err => {
            showError("Clipboard access denied");
            showAlert(\`Failed to copy text:\\n$\{err.message}\`, 'ERR', 'Clipboard Access Denied Error', 'ERR');
          });
          break;
        case 'paste':
          navigator.clipboard.readText().then(text => {
            editor.executeEdits("paste", [{
              range: editor.getSelection(),
              text: text
            }]);
          }).catch(err => {
            showError("Clipboard access denied");
            showAlert(\`Failed to paste text:\\n\${err.message}\`, 'ERR', 'Clipboard Access Denied Error', 'ERR');
          });
          break;
        case 'select-all': editor.setSelection(editor.getModel().getFullModelRange()); break;
        case 'find': editor.getAction('actions.find').run(); break;
        case 'layout-horizontal': setLayout('horizontal'); break;
        case 'layout-vertical': setLayout('vertical'); break;
        case 'layout-editor-only': setLayout('editor-only'); break;
        case 'layout-output-only': setLayout('output-only'); break;
        case 'theme-dark': setTheme('dark'); break;
        case 'theme-light': setTheme('light'); break;
        case 'theme-auto': setTheme('automatic'); break;
        case 'theme-contrast-dark': setTheme('contrast-dark'); break;
        case 'theme-contrast-light': setTheme('contrast-light'); break;
        case 'toggle-explorer': toggleFileExplorer(); break;
        case 'open-file': openFileFromExplorer(data.path); break;
        case 'number-lines':
          const currentLineNumbers = editor.getRawOptions().lineNumbers;
          const newLineNumbers = currentLineNumbers === 'on' ? 'off' : 'on';
          editor.updateOptions({ lineNumbers: newLineNumbers });
          localStorage.setItem('editorLineNumbers', newLineNumbers);
          updateStatus(\`Line numbers \${newLineNumbers === 'on' ? 'enabled' : 'disabled'}\`);
          break;
        case 'font-family-monospace':
          editor.updateOptions({ fontFamily: 'monospace' });
          localStorage.setItem('editorFontFamily', 'monospace');
          updateStatus("Font set to monospace");
          break;
        case 'font-family-arial':
          editor.updateOptions({ fontFamily: 'Arial, sans-serif' });
          localStorage.setItem('editorFontFamily', 'Arial, sans-serif');
          updateStatus("Font set to Arial");
          break;
        case 'font-family-courier':
          editor.updateOptions({ fontFamily: 'Courier New, monospace' });
          localStorage.setItem('editorFontFamily', 'Courier New, monospace');
          updateStatus("Font set to Courier New");
          break;
        case 'font-size-small':
          editor.updateOptions({ fontSize: 12 });
          localStorage.setItem('editorFontSize', 12);
          updateStatus("Font size set to small (12px)");
          break;
        case 'font-size-medium':
          editor.updateOptions({ fontSize: 16 });
          localStorage.setItem('editorFontSize', 16);
          updateStatus("Font size set to medium (16px)");
          break;
        case 'font-size-large':
          editor.updateOptions({ fontSize: 20 });
          localStorage.setItem('editorFontSize', 20);
          updateStatus("Font size set to large (20px)");
          break;
        case 'run-in-tab': runCode(false); break;
        case 'run-new-tab': runCode(true); break;
        case 'refresh-output': updatePreview(); break;
        case 'zoom-in': adjustFontSize(2); break;
        case 'zoom-out': adjustFontSize(-2); break;
        case 'reset-zoom': resetFontSize(); break;
        case 'documentation':
          const docUrl = new URL('documentation/IDE_documentation.html', window.location.href).href;
          window.open(docUrl, '_blank');
          updateStatus("Opening IDE documentation");
          break;
        case 'get-desktop':
          const docUrlB = new URL('desktop/install_ide_desktop.html', window.location.href).href;
          window.open(docUrlB, '_blank');
          updateStatus("Opening Documentation for getting Desktop App");
          break;
        case 'shortcuts-win':
          window.open('shortcuts/windows.html', '_blank');
          updateStatus("Opening Windows shortcuts");
          break;
        case 'shortcuts-mac':
          window.open('shortcuts/macos.html', '_blank');
          updateStatus("Opening Mac shortcuts");
          break;
        case 'shortcuts-lux':
          window.open('shortcuts/linux.html', '_blank');
          updateStatus("Opening Linux shortcuts");
          break;
        case 'docs-html':
          window.open('https://devdocs.io/html', '_blank');
          updateStatus("Opening documentation for HTML");
          break;
        case 'docs-css':
          window.open('https://devdocs.io/css', '_blank');
          updateStatus("Opening documentation for CSS");
          break;
        case 'docs-js':
          window.open('https://devdocs.io/javascript/', '_blank');
          updateStatus("Opening documentation for JavaScript");
          break;
        case 'reformat': setFormatCustom(); detectLanguage(); break;
        case 'about':
          showAlert(
            \`html IDE<br><br>Version:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\${VERSION}<br>Date of Publish:&nbsp;&nbsp;\${DATE_MODIFIED}<br>Browsers:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\${BROWSERS}<br><br>A feature-rich IDE for web development<br><br>Developed by Bryson J G.\`,
            'INFO',
            'About html IDE',
            'INFO'
          );
          updateStatus("About dialog shown");
          break;
        case 'toggle-autosave':
          state.autosaveEnabled = !state.autosaveEnabled;
          localStorage.setItem('autosaveEnabled', state.autosaveEnabled);
          setupAutosave(state.autosaveEnabled);
          updateStatus(\`Autosave \${state.autosaveEnabled ? 'enabled' : 'disabled'}\`);
          break;
        case 'toggle-ai-sidebar':
          toggleAIIframe();
          break;
        case 'toggler-command-palette':
          editor.focus();
          editor.trigger('', 'editor.action.quickCommand');
          break;
        case 'toggle-terminal-sidebar':
          let terminalContainer = document.getElementById("terminal");
          if (!terminalContainer) break; // safety check

          // store state on the element itself
          if (terminalContainer.dataset.isBig === "true") {
            terminalContainer.style.width = "0vw";
            terminalContainer.dataset.isBig = "false";
          } else {
            terminalContainer.style.width = ""; // reset to default
            terminalContainer.dataset.isBig = "true";
          }
          break;
      }
    } catch (error) {
      showError(\`Action failed: \${error.message}\`);
      showAlert(\`Failed to perform action "\${action}":\\n\${error.message}\`, 'ERR', 'Action Error', 'ERR');
    }
  }

  async function openFileFromExplorer(filePath) {
    try {
      const fileEntry = findFileEntry(filePath, state.files);

      if (!fileEntry || fileEntry.type !== 'file') {
        throw new Error(\`File not found: \${filePath}\`);
      }

      // Check if tab already open
      if (state.tabs.some(tab => tab.name === fileEntry.name)) {
        switchToTab(state.tabs.find(tab => tab.name === fileEntry.name).id);
        return;
      }

      // Create a new tab for the opened file
      const tabId = generateTabId();
      const newTab = {
        id: tabId,
        name: fileEntry.name,
        type: fileEntry.name.split('.').pop().toLowerCase(),
        content: fileEntry.content || '',
        handle: null,
        active: true
      };

      // Deactivate current tab
      const currentTab = getCurrentTab();
      if (currentTab) {
        currentTab.active = false;
      }

      state.tabs.push(newTab);
      state.currentTabId = tabId;

      editor.setValue(newTab.content);
      renderTabs();
      updateStatus(\`Opened \${fileEntry.name}\`);
      await detectLanguage();
      saveTabsToStorage();
      refreshExploreFileList();

    } catch (error) {
      showError(\`Open failed: \${error.message}\`);
      showAlert(\`Failed to open file "\${filePath}":\\n\${error.message}\`, 'ERR', 'Open File Error', 'ERR');
    }
  };

  // Returns the icon path for a given file or folder
  function getIcon(fileName, isFolder, isOpen = false, theme = 'dark') {
      // Handle folder icons first
      if (isFolder) {
          const folderType = isOpen ? 'open' : 'closed';
          if (theme === 'light') {
              return \`icons/folder/\${folderType}_folder_icon_light.svg\`;
          } else {
              return \`icons/folder/\${folderType}_folder_icon_dark.svg\`;
          }
      }

      // Handle special file names
      const lowerName = fileName.toLowerCase();
      if (lowerName.includes("license")) return "icons/LICENSE_icon.svg";
      if (lowerName === ".gitignore") return "icons/gitignore_icon.svg";
      if (lowerName === "package.json" || lowerName === "package-lock.json") return "icons/npm_icon.svg";

      // Handle files without extensions
      if (!fileName.includes('.')) return 'icons/defult_file.svg';

      // Handle files by extension
      const ext = fileName.split('.').pop().toLowerCase();
      switch (ext) {
          case 'html': return 'icons/html_icon.svg';
          case 'css': return 'icons/CSS_icon.svg';
          case 'js': return 'icons/JavaScripts_icon.svg';
          case 'ts': return 'icons/TypeScripts_icon.svg';
          case 'json': return 'icons/json_icon.png';
          case 'md': return 'icons/README_icon.svg';
          case 'txt': return 'icons/text_icon.svg';
          case 'png': return 'icons/png_img_icon.svg';
          case 'jpg': case 'jpeg': return 'icons/jpeg_img_icon.svg';
          case 'gif': return 'icons/gif_video_icon.svg';
          case 'go': return 'icons/go_icon.svg';
          case 'svg': return 'icons/svg_img_icon.svg';
          case 'c': return 'icons/Clang_icon.svg';
          case 'cpp': return 'icons/Cpp_icon.svg';
          case 'cs': return 'icons/Csharp_icon.svg';
          case 'py': case 'ipy': case 'pyx': return 'icons/python_icon.svg';
          case 'java': case 'jav': return 'icons/java_icon.svg';
          case 'r': return 'icons/file_type_r.svg';
          case 'rb': return 'icons/file_type_ruby.svg';
          case 'rs': return 'icons/rust_icon.svg';
          case 'jsx': case 'tsx': return 'icons/react_icon.svg';
          case 'mp3': return 'icons/mp3_audio_icon.png';
          case 'bin': return 'icons/binary_icon.svg';
          case 'sql': return 'icons/sql_icon.svg';
          case 'db': return 'icons/database_icon.svg';
          case 'php': return 'icons/php_icon.svg';
          case 'brl': return 'icons/BRL_icon.png';
          case 'log': return 'icons/logg_icon.svg';
          case 'qs': return 'icons/qsharp_icon.svg';
          case 'sqlite': return 'icons/sqlite_icon.svg';
          default: return 'icons/defult_file.svg';
      }
  }`;
        editor.update()
    });
});

editorDiv.addEventListener("wheel", (event) => {
    event.preventDefault();

    let deltaScrollAmount = 0;
    switch (event.deltaMode) {
        case (0):
            deltaScrollAmount = event.deltaY;
            break;
        case (1):
            deltaScrollAmount = event.deltaY * editor.getLineStep();
            break;
        case (2):
            let screenHeight = editor.canvas.height;
            deltaScrollAmount = event.deltaY * screenHeight;
            break;
    }

    editor.json.scroll.scrollPixel += deltaScrollAmount/2.5;

    const rect = editor.canvas.getBoundingClientRect();
    const inset = editor.getBeforeText();
    const lineStep = editor.getLineStep();
    const visibleH = Math.max(0, rect.height - inset);
    const visibleLines = Math.max(1, Math.floor(visibleH / lineStep));
    const amount = Math.max(0, editor.json.content.split("\n").length - visibleLines);
    if (editor.json.scroll.scrollLine > amount) editor.json.scroll.scrollLine = amount;
    if (editor.json.scroll.scrollLine < 0) editor.json.scroll.scrollLine = 0;

    editor.update();
});

let startScroll = 0;
let isDraggingScrollbar = false;
let grabOffsetY = 0;

editorDiv.addEventListener("mousedown", (event) => {
    const rect = editorDiv.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const width = rect.width;
    const scrollbarWidth = editor.json.scroll.scrollbarWidth;

    if (x < width - scrollbarWidth) return;

    const canvasHeight = rect.height;

    const lines = editor.json.content.split("\n").length;
    const lineStep = editor.getLineStep();
    const visibleLines = Math.max(1, Math.floor(Math.max(0, canvasHeight) / lineStep));
    const maxScroll = Math.max(0, lines - visibleLines);

    const thumbHeight = Math.max(
        lines > 0 ? (visibleLines / lines) * canvasHeight : canvasHeight,
        20
    );

    const trackHeight = Math.max(0, canvasHeight - thumbHeight);

    const scrollRatio = maxScroll === 0 ? 0 : editor.json.scroll.scrollLine / maxScroll;
    const thumbY = scrollRatio * trackHeight;

    const clickedOnThumb =
        y >= thumbY &&
        y <= thumbY + thumbHeight;

    if (!clickedOnThumb) {
        const clickRatio = Math.min(
            Math.max(trackHeight === 0 ? 0 : (y - thumbHeight / 2) / trackHeight, 0),
            1
        );

        editor.json.scroll.scrollLine = Math.ceil(clickRatio * maxScroll);
        editor.update();

        isDraggingScrollbar = true;
        grabOffsetY = thumbHeight / 2;

        return;
    }

    isDraggingScrollbar = true;
    grabOffsetY = y - thumbY;

    event.preventDefault();
});

editorDiv.addEventListener("mousedown", (event) => {
    const rect = editorDiv.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const width = rect.width;
    const scrollbarWidth = editor.json.scroll.scrollbarWidth;
    const lineNumberWidth = editor.lineNumbersWidthCache + 1;
    const inset = editor.getBeforeText();
    const lineStep = editor.getLineStep();

    if (x >= width - scrollbarWidth) return;
    if (x < lineNumberWidth + inset) return;
    if (y < inset) return;

    const line = Math.floor((y - inset) / lineStep + editor.json.scroll.scrollLine);

    const lines = editor.json.content.split("\n");
    if (line < 0 || line >= lines.length) return;

    const text = lines[line];

    editor.json.cursor.y = line;

    let currentX = lineNumberWidth + inset;
    let charIndex = text.length;

    for (let i = 0; i < text.length; i++) {
        const charWidth = editor.ctx.measureText(text[i]).width;

        const left = currentX;
        const right = currentX + charWidth;

        if (x >= left && x < right) {
            const mid = (left + right) / 2;

            if (x < mid) {
                charIndex = i - 1;
            } else {
                charIndex = i;
            }

            break;
        }

        currentX += charWidth;
    }

    editor.json.cursor.x = charIndex + 1;
});

window.addEventListener("mousemove", (event) => {
    if (!isDraggingScrollbar) return;

    const rect = editorDiv.getBoundingClientRect();
    const canvasHeight = rect.height;

    const lines = editor.json.content.split("\n").length;
    const inset = editor.getBeforeText();
    const lineStep = editor.getLineStep();

    const visibleLines = Math.max(1, Math.floor(Math.max(0, canvasHeight - inset) / lineStep));
    const maxScroll = Math.max(0, lines - visibleLines);

    const thumbHeight = Math.max(
        lines > 0 ? (visibleLines / lines) * canvasHeight : canvasHeight,
        20
    );

    const trackHeight = Math.max(0, canvasHeight - thumbHeight);

    let thumbY = (event.clientY - rect.top) - grabOffsetY;

    thumbY = Math.max(0, Math.min(trackHeight, thumbY));

    const scrollRatio = trackHeight === 0 ? 0 : thumbY / trackHeight;

    editor.json.scroll.scrollLine = Math.ceil(scrollRatio * maxScroll);

    editor.update();
});

window.addEventListener("mouseup", () => {
    isDraggingScrollbar = false;
});

let cursorVisible = true;
let blinkLocked = false;

const updateCursor = () => {
    editor.json.cursor.cursorVisible = cursorVisible;
    requestAnimationFrame(() => {
        editor.update();
    });
};

window.addEventListener("keydown", (event) => {
    event.preventDefault();

    let cursorPosit = editor.json.cursor.position;

    if (event.key === "Backspace") {
        if (cursorPosit === 0) return;

        editor.json.content = editor.json.content.slice(0, cursorPosit-1) + editor.json.content.slice(cursorPosit);
        editor.json.cursor.position--;
    }
    else if (event.key === "Enter") {
        editor.json.content = editor.json.content.slice(0, cursorPosit) + "\n" + editor.json.content.slice(cursorPosit);
        editor.json.cursor.position++;
    }
    else if (event.key === "Tab") {
        editor.json.content = editor.json.content.slice(0, cursorPosit) + "    " + editor.json.content.slice(cursorPosit);
        editor.json.cursor.position += 4;
    }
    else if (event.key === "ArrowRight") {
        editor.json.cursor.position++;

        const flength = editor.json.content.split("\n").length;
        if (editor.json.cursor.y > flength) editor.json.cursor.y = flength;
    }
    else if (event.key === "ArrowLeft") {
        editor.json.cursor.position--;
        if (editor.json.cursor.position < 0) editor.json.cursor.position = 0;
    }
    else if (event.key === "ArrowDown") {
        editor.json.cursor.y++;

        const flength = editor.json.content.split("\n").length;
        if (editor.json.cursor.y > flength) editor.json.cursor.y = flength;
    }
    else if (event.key === "ArrowUp") {
        editor.json.cursor.y--;
        if (editor.json.cursor.y < 0) editor.json.cursor.y = 0;
    }
    else if (event.key.length === 1) {
        // Only add printable characters
        editor.json.content = editor.json.content.slice(0, editor.json.cursor.position) + event.key + editor.json.content.slice(editor.json.cursor.position);
        editor.json.cursor.position++;
    }

    const kRect = editor.canvas.getBoundingClientRect();
    const kInset = editor.getBeforeText();
    const kLineStep = editor.getLineStep();
    const kVisibleH = Math.max(0, kRect.height - kInset);
    const kVisibleLines = Math.max(1, Math.floor(kVisibleH / kLineStep));
    const maxScrollLine = Math.max(0, editor.json.content.split("\n").length - kVisibleLines);
    if (editor.json.scroll.scrollLine > maxScrollLine) editor.json.scroll.scrollLine = maxScrollLine;
    if (editor.json.scroll.scrollLine < 0) editor.json.scroll.scrollLine = 0;

    blinkLocked = true;
    cursorVisible = true;
    updateCursor();

    clearTimeout(window.__blinkUnlockTimeout);
    window.__blinkUnlockTimeout = setTimeout(() => {
        blinkLocked = false;
    }, 500);

    editor.update();
});

setInterval(() => {
    if (blinkLocked) {
        return;
    }

    cursorVisible = !cursorVisible;
    updateCursor();
}, 500);


setInterval(async () => {
    await new Promise((resolve) => {
        requestAnimationFrame(() => {
            editor.update();
        })
    });
}, 0);

