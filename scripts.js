const editorDiv = document.getElementById("editor");

const editor = new peelib(editorDiv);

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        editor.json.language = "js";
        // test code
        editor.json.content = `// Constants
const DEFAULT_FONT_SIZE = 16;
const DEBOUNCE_DELAY = 500;
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

  // Tab management functions
  function generateTabId() {
    return \`tab_\${Date.now()}_\${Math.floor(Math.random() * 1e9)}\`;
  }

  function getCurrentTab() {
    // Always return a valid tab if possible
    if (state.tabs.length === 0) {
      // Add a default tab if none exist
      const tabId = generateTabId();
      const newTab = {
        id: tabId,
        name: 'untitled.html',
        type: 'html',
        content: INIT_CONTENTS,
        handle: null,
        active: true,
        unsaved: false,
        tabSize: 2 // Default tab size
      };
      state.tabs.push(newTab);
      state.currentTabId = tabId;
      // Defensive: update Monaco editor if available
      if (window.monacoEditorInstance) {
        window.monacoEditorInstance.setValue(newTab.content);
      }
      renderTabs();
      saveTabsToStorage();
      return newTab;
    }
    return state.tabs.find(tab => tab.id === state.currentTabId) || state.tabs[0];
  }

  function getTabById(tabId) {
    return state.tabs.find(tab => tab.id === tabId);
  }

  function renderTabs() {
    tabsContainer.innerHTML = '';

    state.tabs.forEach( (tab) => {
      const tabElement = document.createElement('div');
      tabElement.className = \`tab \${tab.active ? 'active' : ''}\`;
      tabElement.dataset.tabId = tab.id;

      // Add icon to tab
      const iconPath = getIcon(tab.name, false, false, localStorage.getItem('editorTheme') === 'light' ? 'light' : 'dark');

      tabElement.innerHTML = \`
        <img src="\${iconPath}" class="tab-icon" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;">
        \${tab.name}
        <div class="tab-close" title="Close tab">×</div>
      \`;

      // Add click handler for the entire tab
      tabElement.addEventListener('click', (e) => {
        // Don't switch tabs if clicking the close button
        if (!e.target.classList.contains('tab-close')) {
          switchToTab(tab.id);
        }
      });

      // Add specific handler for close button
      const closeButton = tabElement.querySelector('.tab-close');
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent tab switching
        closeTab(tab.id);
      });

      tabsContainer.appendChild(tabElement);
    });

    // Add/remove empty state class on editor-wrapper
    const editorWrapper = document.querySelector('.editor-wrapper');
    if (state.tabs.length === 0) {
      editorWrapper.classList.add('empty');
      // Always ensure at least one tab exists
      getCurrentTab();
    } else {
      editorWrapper.classList.remove('empty');
    }
    refreshExploreFileList(); // Ensure file list stays in sync
  }

  function switchToTab(tabId) {
    const currentTab = getCurrentTab();
    if (currentTab) {
      // Save current content before switching
      currentTab.content = editor.getValue();
      currentTab.active = false;
    }

    const newTab = getTabById(tabId);
    if (newTab) {
      state.currentTabId = tabId;
      newTab.active = true;
      editor.setValue(newTab.content);

      // Update editor tab size for the new tab
      editor.getModel().updateOptions({ tabSize: newTab.tabSize || 2 });
      const spaceInfo = document.getElementById('SpaceInfo');
      spaceInfo.textContent = \`Spaces: \${newTab.tabSize || 2}\`;

      // Update language mode
      const fileType = newTab.name.split('.').pop().toLowerCase();

      monaco.editor.setModelLanguage(editor.getModel(), languageMap[fileType] || 'plaintext');

      renderTabs();
      updatePreview();
      updateStatus(\`Switched to \${newTab.name}\`);
      saveTabsToStorage();
      refreshExploreFileList();
    }

    setTimeout(() => {
      let fe = document.getElementById("FEIframe");
      if (fe) {
        fe.src = fe.src;
      }
    }, 50); // Small delay to ensure message is processed first
  }

  function addNewTab() {
    const tabId = generateTabId();
    const newTab = {
      id: tabId,
      name: \`untitled-\${state.tabs.length + 1}.html\`,
      type: 'html',
      content: INIT_CONTENTS,
      handle: null,
      active: true,
      tabSize: 2  // Add default tab size
    };

    // Deactivate current tab
    const currentTab = getCurrentTab();
    if (currentTab) {
      currentTab.content = editor.getValue();
      currentTab.active = false;
    }

    state.tabs.push(newTab);
    state.currentTabId = tabId;

    renderTabs();
    editor.setValue(newTab.content);
    updateStatus(\`Created new tab: \${newTab.name}\`);
    saveTabsToStorage();
    refreshExploreFileList();

    // Remove empty state
    const editorWrapper = document.querySelector('.editor-wrapper');
    editorWrapper.classList.remove('empty');
  }

  function closeTab(tabId = null) {
    // If no tabId provided, try to close current tab
    if (!tabId) {
      const currentTab = getCurrentTab();
      if (!currentTab) {
        updateStatus("Error: No active tab to close", true);
        return;
      }
      tabId = currentTab.id;
    }

    // Validate tab exists
    const tabIndex = state.tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) {
      updateStatus(\`Error: Tab \${tabId} not found\`, true);

      // Auto-recovery: switch to first available tab or create new one
      if (state.tabs.length > 0) {
        switchToTab(state.tabs[0].id);
      } else {
        addNewTab();
      }
      return;
    }

    const tabToClose = state.tabs[tabIndex];
    const isActiveTab = tabToClose.active;

    // Save content BEFORE removal if it's the active tab
    if (isActiveTab) {
      tabToClose.content = editor.getValue();
    }

    // Check for unsaved changes
    const hasUnsavedChanges = isActiveTab &&
      editor.getValue() !== tabToClose.content;

    if (hasUnsavedChanges && !confirm('You have unsaved changes. Close tab anyway?')) {
      return;
    }

    // Close the tab
    state.tabs.splice(tabIndex, 1);

    // Handle tab switching after closure
    if (isActiveTab) {
      if (state.tabs.length > 0) {
        // Switch to nearest tab (next or previous)
        const newIndex = Math.min(tabIndex, state.tabs.length - 1);
        const newTab = state.tabs[newIndex];

        // Update state before switching
        state.currentTabId = newTab.id;
        newTab.active = true;

        // Set editor content directly without saving
        editor.setValue(newTab.content);

        // Update language mode
        const fileType = newTab.name.split('.').pop().toLowerCase();
        monaco.editor.setModelLanguage(editor.getModel(), languageMap[fileType] || 'plaintext');
      } else {
        // Always add a new default tab if none remain
        const newTab = getCurrentTab();
        editor.setValue(newTab.content);
      }
    }

    // Notify file explorer of tab changes
    const fileExplorer = document.querySelector('#file-explorer iframe');
    if (fileExplorer && fileExplorer.contentWindow) {
      fileExplorer.contentWindow.postMessage({
        type: 'updateFileExplorer',
        tabs: state.tabs
      }, '*');
    }

    // Update UI and state
    renderTabs();
    saveTabsToStorage();
    state.unsavedChanges = false;
    updateStatus(\`Closed tab: \${tabToClose.name}\`);
    refreshExploreFileList();

    // Ensure empty state if no tabs
    const editorWrapper = document.querySelector('.editor-wrapper');
    if (state.tabs.length === 0) {
      editorWrapper.classList.add('empty');
      // Always ensure at least one tab exists
      getCurrentTab();
    } else {
      editorWrapper.classList.remove('empty');
    }

    setTimeout(() => {
      let fe = document.getElementById("FEIframe");
      if (fe) {
        fe.src = fe.src;
      }
    }, 50); // Small delay to ensure message is processed first
  }

  // Helper for finding file entries
  function findFileEntry(path, files) {
    if (!path) return null;
    const parts = path.split('/').filter(Boolean);
    let current = files;
    let entry = null;
    for (const part of parts) {
      entry = current.find(item => item.name === part);
      if (!entry) return null;
      if (entry.type === 'folder') {
        current = entry.children;
      }
    }
    return entry;
  }

  function saveTabsToStorage() {
    const sanitizedTabs = state.tabs.map(tab => ({
      ...tab,
      handle: null // Exclude handle
    }));
    localStorage.setItem('editorTabs', JSON.stringify(sanitizedTabs));
    // Sync tab content to state.files if file exists
    state.tabs.forEach( (tab) => {
      const fileEntry = findFileEntry(tab.name, state.files);
      if (fileEntry && fileEntry.type === 'file') {
        fileEntry.content = tab.content;
      }
    });
    refreshExploreFileList();
  }

  function markTabUnsaved(tabId, unsaved) {
    const tab = getTabById(tabId);
    if (tab) {
      tab.unsaved = unsaved;
      renderTabs();
    }
  }

  function saveProjectFiles() {
    try {
      localStorage.setItem('projectFiles', JSON.stringify(state.files));
      updateStatus('Project files saved');
    } catch (error) {
      showError('Failed to save project files: ' + error.message);
      showAlert(\`Failed to save project files:\\n \${error.message}\`, 'ERR', 'Save Error', 'ERR');
    }
  }

  // File Explorer Functions
  function toggleFileExplorer() {
    try {
      state.fileExplorerOpen = !state.fileExplorerOpen;
      localStorage.setItem('fileExplorerOpen', state.fileExplorerOpen);

      const fileExplorer = document.getElementById('file-explorer');
      if (!fileExplorer) {
        throw new Error('File explorer element not found');
      }

      if (state.fileExplorerOpen) {
        fileExplorer.classList.add('open');
        document.body.classList.add('file-explorer-open');
      } else {
        fileExplorer.classList.remove('open');
        document.body.classList.remove('file-explorer-open');
      }

      const FEIframe = document.getElementById('FEIframe');
      FEIframe.src += '';

      updateStatus(\`File explorer \${state.fileExplorerOpen ? 'opened' : 'closed'}\`);
    } catch (error) {
      showError(\`Failed to toggle file explorer: \${error.message}\`);
      showAlert(\`Failed to toggle file explorer:\\n \${error.message}\`, 'ERR', 'Toggle Explorer Error', 'ERR');
    }
  }

  function refreshExploreFileList() {
    const fileExplorer = document.querySelector('#file-explorer iframe');
    if (fileExplorer && fileExplorer.contentWindow) {
      fileExplorer.contentWindow.postMessage({
        type: 'updateFileExplorer',
        files: state.files,
        tabs: state.tabs
      }, '*');
    }
  }

  // Add message handler
  window.addEventListener('message', (event) => {
    // Set FE communication flag
    if (event.origin && event.origin !== window.location.origin) {
      state.feIsCommunicating = true;
      setTimeout(() => { state.feIsCommunicating = false; }, 500); // Reset after short delay
    }

    if (event.data.type === 'switchTab') {
      const tabId = event.data.tabId;
      if (tabId) {
        switchToTab(tabId);
      }
    }
    else if (event.data.type === 'openFile') {
      const filePath = event.data.filePath;
      if (filePath) {
        openFileFromExplorer(filePath);
      }
    }
    else if (event.data.type === 'updateFiles') {
      state.files = event.data.files;
      localStorage.setItem('projectFiles', JSON.stringify(state.files));
      refreshExploreFileList();
    }
    else if (event.data.type === 'updateTabs') {
      state.tabs = event.data.tabs;
      localStorage.setItem('editorTabs', JSON.stringify(state.tabs));
      renderTabs();
    }
    else if (event.data.type === 'themeChange') {
      const { theme } = event.data;
      setTheme(theme);
    }
  });

  // Show open tabs in file explorer context menu
  document.addEventListener('click', function (e) {
    const contextMenu = fileList.querySelector('.context-menu');
    if (contextMenu && contextMenu.style.display === 'block') {
      if (e.target.dataset.action === 'tabs') {
        // Build a list of open tabs
        let tabsHtml = '<div style="padding:4px 8px;font-weight:bold;">Open Tabs:         \/</div>';
        if (state.tabs.length === 0) {
          tabsHtml += '<div style="padding:4px 8px;">No open tabs</div>';
        } else {
          state.tabs.forEach( (tab) => {
            tabsHtml += \`<div class="dropdown-item" data-action="switch-tab" data-tab-id="\${tab.id}">\${tab.name}\${tab.active ? ' <span style="color:var(--accent)">[active]</span>' : ''}</div>\`;
          });
        }
        contextMenu.innerHTML = tabsHtml +
          \`<div class="dropdown-item" data-action="close-tab-list">Close</div>\`;
      } else if (e.target.dataset.action === 'switch-tab') {
        const tabId = e.target.dataset.tabId;
        if (tabId) {
          switchToTab(tabId);
          contextMenu.style.display = 'none';
        }
      } else if (e.target.dataset.action === 'close-tab-list') {
        contextMenu.style.display = 'none';
      }
    }
  });

  function hideImagePreviewInPane() {
    document.querySelector('.editor-wrapper').style.display = '';
    const previewPane = document.querySelector('.preview-pane');
    previewPane.style.justifyContent = '';
    previewPane.style.alignItems = '';
    previewPane.style.background = '';
    updatePreview(); // Restore normal preview
  }

  function createPreviewIframe(content, settings = {}) {
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    const iframeSettings = { ...IFRAME_DEFAULTS, ...settings };
    iframe.sandbox = getIframeSandboxPermissions(iframeSettings);

    if (iframeSettings.allowFullscreen) {
      iframe.allowFullscreen = true;
    }

    return iframe;
  }

  function createImagePreviewIframe(imageData, fileType) {
    const iframe = createPreviewIframe(null, IMAGE_PREVIEW_SETTINGS);
    iframe.src = IMAGE_PREVIEW_SETTINGS.imgPrevPath;

    iframe.onload = () => {
      // Send image data to previewer
      iframe.contentWindow.postMessage({
        type: 'loadImage',
        content: imageData,
        format: fileType
      }, '*');

      // Sync theme
      iframe.contentWindow.postMessage({
        type: 'themeChange',
        theme: localStorage.getItem('editorTheme') || 'dark'
      }, '*');
    };

    return iframe;
  }

  function createPythonPreviewIframe(fileContent) {
    const iframe = createPreviewIframe(null, PYTHON_EXECUTION_SETTINGS);
    iframe.src = PYTHON_EXECUTION_SETTINGS.pythonPath;

    iframe.onload = () => {
      // Send image data to previewer
      iframe.contentWindow.postMessage({
        type: 'getFileContentForExecution',
        content: python
      }, '*');

      // Sync theme
      iframe.contentWindow.postMessage({
        type: 'themeChange',
        theme: localStorage.getItem('editorTheme') || 'dark'
      }, '*');
    };

    return iframe;
  }

  // Replace the updatePreview function
  function updatePreview() {
    try {
      preview.innerHTML = '';
      const currentTab = getCurrentTab();
      const value = editor.getValue();
      const fileName = currentTab.name.toLowerCase();

      // Image file handling
      if (fileName.endsWith('.png') || fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') || fileName.endsWith('.svg')) {

        setLayout('output-only');

        if (fileName.endsWith('.svg')) {
          const iframe = createImagePreviewIframe(value, 'svg');
          preview.appendChild(iframe);
        } else if (/^data:image\/(png|jpe?g);base64,/.test(value.trim())) {
          const iframe = createImagePreviewIframe(value, 'image');
          preview.appendChild(iframe);
        } else {
          const msg = document.createElement('div');
          msg.textContent = \`Image ( \${fileName.endsWith('png') ? ".png file" : "jpeg file"} ) preview not available. File must be opened as binary or contain a valid data URL.\`;
          msg.style.color = '#fff';
          msg.style.padding = '20px';
          msg.style.background = 'var(--background-color)';
          msg.style.width = '100%';
          preview.appendChild(msg);
        }

        updateStatus("Image preview");
        return;
      }

      // Regular HTML preview
      const isHtml = fileName.endsWith('.html');
      if (isHtml) {
        const iframe = createPreviewIframe(null, { allowSameOrigin: true });
        preview.appendChild(iframe);

        // --- Import logic start ---
        const importRegex = /<!-- @import\s+(.+)\s*-->/g;
        const linkRegex = /<link[^>]*href=["']([^"']+)["'][^>]*>/g;
        const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/g;
        const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/g;
        let finalContent = value;

        // @import comments
        const imports = value.match(importRegex);
        if (imports) {
          for (const imp of imports) {
            const path = imp.match(/<!-- @import\s+(.+)\s*-->/)[1];
            const fileEntry = findFileEntry(path, state.files);
            if (fileEntry && fileEntry.content) {
              finalContent = finalContent.replace(imp, fileEntry.content);
            }
          }
        }

        // <link> tags for CSS
        const links = value.match(linkRegex);
        if (links) {
          for (const link of links) {
            const href = link.match(/href=["']([^"']+)["']/)[1];
            const cleanPath = href.replace(/^\.\//, '');
            const fileEntry = findFileEntry(cleanPath, state.files);
            if (fileEntry && fileEntry.content) {
              const cssContent = \`<style>\\n\${fileEntry.content}\\n</style>\`;
              finalContent = finalContent.replace(link, cssContent);
            }
          }
        }

        // <script> tags
        const scripts = value.match(scriptRegex);
        if (scripts) {
          for (const script of scripts) {
            const src = script.match(/src=["']([^"']+)["']/)[1];
            const cleanPath = src.replace(/^\.\//, '');
            const fileEntry = findFileEntry(cleanPath, state.files);
            if (fileEntry && fileEntry.content) {
              const scriptContent = \`<script>\\n\${fileEntry.content}\\n</script>\`;
              finalContent = finalContent.replace(script, scriptContent);
            }
          }
        }

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

      if (isJsFile) {
        // Create container for JS output
        const jsOutputContainer = document.createElement('div');
        jsOutputContainer.id = 'js-output';
        jsOutputContainer.style.padding = '1rem';
        jsOutputContainer.style.fontFamily = 'monospace';
        jsOutputContainer.style.whiteSpace = 'pre';
        jsOutputContainer.style.overflow = 'auto';
        jsOutputContainer.style.height = '100%';

        // Create result display area
        const resultDiv = document.createElement('div');
        resultDiv.style.marginBottom = '1rem';

        // Create console output area
        const consoleDiv = document.createElement('div');
        consoleDiv.id = 'js-console';
        consoleDiv.style.backgroundColor = 'var(--bg-dark)';
        consoleDiv.style.padding = '0.5rem';
        consoleDiv.style.marginTop = '1rem';
        consoleDiv.style.borderRadius = '4px';
        consoleDiv.style.fontFamily = 'monospace';
        consoleDiv.style.whiteSpace = 'pre-wrap';

        // Build output structure
        jsOutputContainer.appendChild(resultDiv);
        jsOutputContainer.appendChild(consoleDiv);
        preview.appendChild(jsOutputContainer);

        // Store logs
        const logs = [];

        // Create secure sandboxed iframe
        const iframe = document.createElement('iframe');
        iframe.sandbox = 'allow-scripts'; // Only allow script execution
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Get user code
        const userCode = editor.getValue();

        // Create HTML content for iframe
        const blobContent = \`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <script>
        // Capture console.log
        const originalConsoleLog = console.log;
        console.log = function(...args) {
          // Send logs to parent window
          window.parent.postMessage({
            type: 'log',
            args: args.map(arg => {
              try {
                return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
              } catch {
                return String(arg);
              }
            })
          }, '*');
          originalConsoleLog.apply(console, args);
        };

        let terminated = false;
        const timeout = setTimeout(() => {
          terminated = true;
          window.parent.postMessage({ type: 'timeout' }, '*');
        }, 5000); // 5-second timeout

        try {
          // Create safe execution wrapper
          const runUserCode = () => {
            if (terminated) throw new Error('Execution terminated');
            return new Function(\${JSON.stringify(userCode)})();
          };

          // Execute user code
          const result = runUserCode();
          clearTimeout(timeout);

          // Send result to parent
          window.parent.postMessage({
            type: 'done',
            result: result !== undefined ? String(result) : undefined
          }, '*');
        } catch (error) {
          clearTimeout(timeout);
          window.parent.postMessage({
            type: 'error',
            error: error.message
          }, '*');
        }
      </script>
    </head>
    <body></body>
    </html>
  \`;

        // Create blob URL for iframe
        const blob = new Blob([blobContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        iframe.src = blobUrl;

        // Set up timeout fallback (in case iframe fails)
        const parentTimeout = setTimeout(() => {
          cleanup();
          resultDiv.textContent = 'Error: Execution timed out or failed to start';
          resultDiv.style.color = 'var(--error-red)';
        }, 6000); // 6-second fallback timeout

        // Handle cleanup
        const cleanup = () => {
          window.removeEventListener('message', messageHandler);
          clearTimeout(parentTimeout);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          URL.revokeObjectURL(blobUrl);
          updateStatus("JavaScript executed");
        };

        // Handle messages from iframe
        const messageHandler = (event) => {
          if (event.source !== iframe.contentWindow) return;

          const data = event.data;
          switch (data.type) {
            case 'log':
              logs.push(data.args.join(' '));
              consoleDiv.textContent = logs.join('\\n');
              consoleDiv.scrollTop = consoleDiv.scrollHeight;
              break;

            case 'done':
              resultDiv.textContent = data.result || 'Code executed (no return value)';
              cleanup();
              break;

            case 'error':
              resultDiv.textContent = \`Error: \${data.error}\`;
              resultDiv.style.color = 'var(--error-red)';
              cleanup();
              break;

            case 'timeout':
              resultDiv.textContent = 'Error: Execution timed out (possible infinite loop)';
              resultDiv.style.color = 'var(--error-red)';
              cleanup();
              break;
          }
        };

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

  // File operations with enhanced language support
  // Fixed saveFile function
  async function saveFile() {
    let currentTab;
    try {
      currentTab = getCurrentTab();
      if (!currentTab) {
        throw new Error('No active tab to save');
      }

      // Check if we're in Electron environment
      const isElectron = typeof window !== 'undefined' && window.process && window.process.type;

      // Handle Electron environment differently
      if (isElectron) {
        return await saveFileElectron(currentTab);
      }

      // Check if File System Access API is available
      if (!window.showSaveFilePicker) {
        return await saveFileLegacy(currentTab);
      }

      if (!currentTab.handle) {
        return await saveFileAs(currentTab.type || 'html');
      }

      const writable = await currentTab.handle.createWritable();
      await writable.write(editor.getValue());
      await writable.close();

      currentTab.content = editor.getValue();
      currentTab.unsaved = false;
      state.unsavedChanges = false;
      updateStatus(\`Saved \${currentTab.name}\`);
      saveTabsToStorage();

      return true;
    } catch (error) {
      const fileName = currentTab?.name || 'unknown file';

      // Handle specific error cases
      if (error.name === 'NotAllowedError') {
        showError('Permission denied. Please try saving with a different name or location.');
        showAlert(\`Permission denied for "\${fileName}".\\nPlease try saving with a different name or location.\`, 'ERR', 'Permission Error', 'ERR');
      } else if (error.name === 'AbortError') {
        // User canceled the operation, no need to show error
        return false;
      } else {
        showError(\`Save failed: \${error.message}\`);
        showAlert(\`Failed to save file "\${fileName}":\\n\${error.message}\`, 'ERR', 'Save Error', 'ERR');
      }
      return false;
    }
  }

  // Fixed saveFileAs function
  async function saveFileAs(type = 'html') {
    try {
      const currentTab = getCurrentTab();
      const fileType = FILE_TYPES[type] || FILE_TYPES.html;

      // Check if we're in Electron environment
      const isElectron = typeof window !== 'undefined' && window.process && window.process.type;

      // Handle Electron environment differently
      if (isElectron) {
        return await saveFileAsElectron(currentTab, fileType);
      }

      // Check if File System Access API is available
      if (!window.showSaveFilePicker) {
        return await saveFileAsLegacy(currentTab, fileType);
      }

      const handle = await window.showSaveFilePicker({
        suggestedName: currentTab.name.replace(/\..*$/, '') + fileType.ext,
        types: [{
          description: \`\${fileType.ext.toUpperCase()} Files\`,
          accept: { [fileType.mime]: [fileType.ext] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(editor.getValue());
      await writable.close();

      currentTab.name = handle.name;
      currentTab.handle = handle;
      currentTab.type = type;
      currentTab.content = editor.getValue();
      currentTab.unsaved = false;

      state.unsavedChanges = false;
      updateStatus(\`Saved as \${handle.name}\`);
      await detectLanguage();
      renderTabs();
      saveTabsToStorage();
      refreshExploreFileList();

      return true;
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        showError('Permission denied. Please try saving with a different name or location.');
        showAlert('Permission denied.\\nPlease try saving with a different name or location.', 'ERR', 'Permission Error', 'ERR');
      } else if (error.name !== 'AbortError') {
        showError(\`Save failed: \${error.message}\`);
        showAlert(\`Failed to save file:\\n\${error.message}\`, 'ERR', 'Save As Error', 'ERR');
      }
      return false;
    }
  }

  // Fallback for browsers without File System Access API
  async function saveFileLegacy(currentTab) {
    const fileType = FILE_TYPES[currentTab.type] || FILE_TYPES.html;
    const fileName = currentTab.name.replace(/\..*$/, '') + fileType.ext;
    const content = editor.getValue();

    const blob = new Blob([content], { type: fileType.mime });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    // Update tab info (even though we don't have a handle)
    currentTab.content = content;
    currentTab.unsaved = false;
    state.unsavedChanges = false;
    updateStatus(\`Downloaded \${fileName}\`);
    saveTabsToStorage();

    return true;
  }

  // Fallback for browsers without File System Access API
  async function saveFileAsLegacy(currentTab, fileType) {
    const fileName = currentTab.name.replace(/\..*$/, '') + fileType.ext;
    const content = editor.getValue();

    const blob = new Blob([content], { type: fileType.mime });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    // Update tab info (even though we don't have a handle)
    currentTab.name = fileName;
    currentTab.type = fileType;
    currentTab.content = content;
    currentTab.unsaved = false;
    currentTab.handle = null; // No handle in legacy mode

    state.unsavedChanges = false;
    updateStatus(\`Downloaded \${fileName}\`);
    await detectLanguage();
    renderTabs();
    saveTabsToStorage();
    refreshExploreFileList();

    return true;
  }

  // Electron-specific save implementation
  async function saveFileElectron(currentTab) {
    try {
      // Use Electron's dialog and fs modules
      const { dialog } = window.require('electron').remote;
      const fs = window.require('fs');

      let filePath = currentTab.handle;

      // If no existing file path, prompt for save location
      if (!filePath) {
        const result = await dialog.showSaveDialog({
          defaultPath: currentTab.name,
          filters: [
            { name: 'All Files', extensions: ['*'] },
            { name: 'HTML Files', extensions: ['html', 'htm'] },
            { name: 'CSS Files', extensions: ['css'] },
            { name: 'JavaScript Files', extensions: ['js'] }
          ]
        });

        if (result.canceled) return false;
        filePath = result.filePath;
      }

      // Write file
      fs.writeFileSync(filePath, editor.getValue(), 'utf8');

      // Update tab info
      currentTab.name = filePath.split(/[\\/]/).pop();
      currentTab.handle = filePath;
      currentTab.content = editor.getValue();
      currentTab.unsaved = false;

      state.unsavedChanges = false;
      updateStatus(\`Saved \${currentTab.name}\`);
      saveTabsToStorage();

      return true;
    } catch (error) {
      showError(\`Save failed: \${error.message}\`);
      showAlert(\`Failed to save file "\${currentTab.name}":\\n\${error.message}\`, 'ERR', 'Save Error', 'ERR');
      return false;
    }
  }

  // Electron-specific saveAs implementation
  async function saveFileAsElectron(currentTab, fileType) {
    try {
      const { dialog } = window.require('electron').remote;
      const fs = window.require('fs');

      const ext = fileType.ext;
      const result = await dialog.showSaveDialog({
        defaultPath: currentTab.name.replace(/\..*$/, '') + ext,
        filters: [
          { name: \`\${ext.toUpperCase()} Files\`, extensions: [ext.substring(1)] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled) return false;

      const filePath = result.filePath;

      // Write file
      fs.writeFileSync(filePath, editor.getValue(), 'utf8');

      // Update tab info
      currentTab.name = filePath.split(/[\\/]/).pop();
      currentTab.handle = filePath;
      currentTab.type = fileType;
      currentTab.content = editor.getValue();
      currentTab.unsaved = false;

      state.unsavedChanges = false;
      updateStatus(\`Saved as \${currentTab.name}\`);
      await detectLanguage();
      renderTabs();
      saveTabsToStorage();
      refreshExploreFileList();

      return true;
    } catch (error) {
      showError(\`Save failed: \${error.message}\`);
      showAlert(\`Failed to save file:\\n\${error.message}\`, 'ERR', 'Save As Error', 'ERR');
      return false;
    }
  }

  async function openFile() {
    try {
      // Show file picker with supported types
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'All Supported Formats',
            accept: Object.fromEntries(
              Object.values(FILE_TYPES).map(type => [type.mime, [type.ext]])
            )
          },
          {
            description: 'Web Dev Formats',
            accept: Object.fromEntries(
              Object.values({
                html: { mime: 'text/html', ext: '.html' },
                css: { mime: 'text/css', ext: '.css' },
                js: { mime: 'text/javascript', ext: '.js' },
                json: { mime: 'application/json', ext: '.json' },
                txt: { mime: 'text/plain', ext: '.txt' },
                md: { mime: 'text/markdown', ext: '.md' },
                svg: { mime: 'image/svg+xml', ext: '.svg' }
              }).map(type => [type.mime, [type.ext]])
            )
          },
          {
            description: 'not web Dev Formats',
            accept: Object.fromEntries(
              Object.values({
                py: { mime: 'text/x-python', ext: '.py' },
                java: { mime: 'text/x-java', ext: '.java' },
                c: { mime: 'text/x-c', ext: '.c' },
                rs: { mime: 'text/x-rust', ext: '.rs' }
              }).map(type => [type.mime, [type.ext]])
            )
          },
          {
            description: 'Text',
            accept: Object.fromEntries(
              Object.values({
                txt: { mime: 'text/plain', ext: '.txt' },
                md: { mime: 'text/markdown', ext: '.md' }
              }).map(type => [type.mime, [type.ext]])
            )
          },
          {
            description: 'SVG Images',
            accept: {
              'image/svg+xml': ['.svg']
            }
          }
        ],
        excludeAcceptAllOption: true
      });

      const file = await handle.getFile();

      const content = await file.text();
      const extension = handle.name.split('.').pop()?.toLowerCase() || '';

      // Determine file type with fallback
      const fileType = FILE_TYPES[extension] ? extension : 'html';

      // Prepare new tab data
      const tabId = generateTabId();
      const newTab = {
        id: tabId,
        name: handle.name,
        type: fileType,
        content,
        handle,
        active: true
      };

      // Update tabs state
      state.tabs.forEach( (tab) => tab.active = false);
      state.tabs.push(newTab);
      state.currentTabId = tabId;

      // Update UI and state
      editor.setValue(content);
      renderTabs();
      updateStatus(\`Opened \${handle.name}\`);
      saveTabsToStorage();
      refreshExploreFileList();

      // Non-blocking language detection
      detectLanguage().catch(e => console.error('Language detection failed', e));

    } catch (error) {
      if (error.name === 'AbortError') return; // User canceled
      if (error.name === 'NotFoundError') {
        showError('File not found or access denied');
        showAlert(\`Failed to open file:\\n\${error.message}\`, 'ERR', 'Open File Error', 'ERR');

      } else {
        showError(\`Open failed: \${error.message}\`);
        showAlert(\`Failed to open file:\\n\${error.message}\`, 'ERR', 'Open File Error', 'ERR');
      }
    }
  }

  async function openFolder() {
    try {
      const directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });

      state.files = [];
      state.tabs.forEach(tab => tab.active = false);

      async function readDirectory(directoryHandle, path = '') {
        const entries = [];
        for await (const [name, handle] of directoryHandle.entries()) {
          if (name === '.git') continue;
          const entryPath = path ? \`\${path}/\${name}\` : name;

          if (handle.kind === 'file') {
            if (name.toLowerCase().endsWith('.zip')) continue;
            const file = await handle.getFile();
            const content = await file.text();
            entries.push({
              name,
              type: 'file',
              content,
              handle,
              path: entryPath
            });
          }
          else if (handle.kind === 'directory') {
            entries.push({
              name,
              type: 'folder',
              children: await readDirectory(handle, entryPath),
              expanded: false,
              path: entryPath
            });
          }
        }
        return entries;
      }

      state.files = await readDirectory(directoryHandle);
      saveProjectFiles();

      if (!state.fileExplorerOpen) {
        toggleFileExplorer();
      }

      // Send the folder name to FE.js
      const fe = document.getElementById("FEIframe");
      if (fe && fe.contentWindow) {
        fe.contentWindow.postMessage({
          type: 'setRootName',
          name: directoryHandle.name,
          forceUpdate: true
        }, '*');
      }

      fe.src += '';

      updateStatus(\`Opened folder: \${directoryHandle.name}\`);

    } catch (e) {
      console.error('Error opening folder:', e);
    }
  }

  async function closeFolder() {
    try {
      // Reset to default project files
      state.files = [{ name: 'untitled.html', type: 'file' }];
      state.fileExplorerPath = '';

      // Save to localStorage
      saveProjectFiles();

      // Close all tabs except the current one
      const currentTabId = state.currentTabId;
      state.tabs = state.tabs.filter(tab => tab.id === currentTabId);

      // If no tabs remain, create a default one
      if (state.tabs.length === 0) {
        const tabId = generateTabId();
        state.tabs.push({
          id: tabId,
          name: 'untitled.html',
          type: 'html',
          content: INIT_CONTENTS,
          handle: null,
          active: true,
          tabSize: 2
        });
        state.currentTabId = tabId;
      }

      // Reset the root name in FE
      const fe = document.getElementById("FEIframe");
      if (fe && fe.contentWindow) {
        fe.contentWindow.postMessage({
          type: 'setRootName',
          name: "root"
        }, '*');
      }

      // Update UI
      renderTabs();
      saveTabsToStorage();
      refreshExploreFileList();
      updateStatus("Closed folder and reset project");
    } catch (error) {
      showError(\`Failed to close folder: \${error.message}\`);
      showAlert(\`Failed to close folder:\\n\${error.message}\`, 'ERR', 'Close Folder Error', 'ERR');
    }

    setTimeout(() => {
      let fe = document.getElementById("FEIframe");
      if (fe) {
        fe.src = fe.src;
      }
    }, 50);
  }

  // Helper function to find first file by extension

  async function findFileHandle(fileName) {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      return await getFileHandle(directoryHandle, fileName);
    } catch {
      return null;
    }
  }

  async function getFileHandle(directoryHandle, fileName) {
    try {
      return await directoryHandle.getFileHandle(fileName);
    } catch {
      return null;
    }
  }

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

  // Unsaved changes protection
  function setupBeforeUnload() {
    window.addEventListener('beforeunload', (e) => {
      if (state.unsavedChanges) {
        e.preventDefault();
        return e.returnValue = 'You have unsaved changes';
      }
    });

    editor.onDidChangeModelContent(() => {
      const currentTab = getCurrentTab();
      if (currentTab) {
        currentTab.content = editor.getValue();
        markTabUnsaved(currentTab.id, true);
        saveTabsToStorage();
      }

      // Skip preview updates for Python files
      if (!currentTab.name.endsWith('.py')) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, DEBOUNCE_DELAY);
      }
    });
  }

  // Autosave functionality
  let autosaveInterval;
  function setupAutosave(enabled = true, interval = 30000) {
    if (autosaveInterval) {
      clearInterval(autosaveInterval);
    }
    if (enabled) {
      autosaveInterval = setInterval(async () => {
        const currentTab = getCurrentTab();
        if (currentTab && currentTab.unsaved) {
          await saveFile();
        }
      }, interval);
      updateStatus("Autosave enabled");
    }
  }

  // Status management
  function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError
      ? 'var(--error-red)'
      : 'var(--text-dark)';
  }

  function showError(message) {
    console.error(message);
    showAlert(message); // Replace updateStatus with showAlert for errors
    updateStatus(message, true);
  }

  // Theme handling for AI sidebar
  function syncAITheme(theme) {
    const aiIframe = document.querySelector('#ai-sidebar iframe');
    if (aiIframe && aiIframe.contentWindow) {
      aiIframe.contentWindow.postMessage({
        type: 'themeChange',
        theme: theme
      }, '*');
    }
  }

  // Theme switching
  function setTheme(theme) {
    // Remove all theme classes first
    document.body.classList.remove(
      'light-theme',
      'contrast-dark-theme',
      'contrast-light-theme',
      'main-dark-theme',
      'main-light-theme',
      'main-high-contrast-dark-theme',
      'main-high-contrast-light-theme',
    );

    // Apply selected theme
    switch (theme) {
      case 'light':
        document.body.classList.add('light-theme', 'main-light-theme');
        monaco.editor.setTheme('vs');
        break;
      case 'contrast-dark':
        document.body.classList.add('contrast-dark-theme', 'main-high-contrast-dark-theme');
        monaco.editor.setTheme('hc-black');
        break;
      case 'contrast-light':
        document.body.classList.add('contrast-light-theme', 'main-high-contrast-light-theme');
        monaco.editor.setTheme('hc-light');
        break;
      case 'automatic':
        // Detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.body.classList.add('main-dark-theme');
          monaco.editor.setTheme('vs-dark');
        } else {
          document.body.classList.add('main-light-theme');
          monaco.editor.setTheme('vs');
        }
        // Listen for changes in system theme
        if (!setTheme._autoListener) {
          setTheme._autoListener = () => setTheme('automatic');
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme._autoListener);
        }
        break;
      default:
        // Default dark theme
        document.body.classList.add('main-dark-theme');
        monaco.editor.setTheme('vs-dark');
    }

    // Sync with Python terminal
    const pythonTerminal = document.querySelector('#preview iframe.python-preview');
    if (pythonTerminal && pythonTerminal.contentWindow) {
      pythonTerminal.contentWindow.postMessage({
        type: 'themeChange',
        theme: theme
      }, '*');
    }

    // Update File Explorer theme
    const fileExplorer = document.querySelector('#file-explorer iframe');
    if (fileExplorer && fileExplorer.contentWindow) {
      fileExplorer.contentWindow.postMessage({
        type: 'themeChange',
        theme: theme,
        forceUpdate: true
      }, '*');
    }

    // Sync with AI sidebar
    syncAITheme(theme);

    localStorage.setItem('editorTheme', theme);
    updateStatus(\`Theme set to \${theme}\`);
  }

  // Add message listener for AI theme requests
  window.addEventListener('message', (event) => {
    if (event.data.type === 'requestTheme') {
      const theme = localStorage.getItem('editorTheme') || 'dark';
      event.source.postMessage({
        type: 'themeChange',
        theme: theme
      }, event.origin);
    }
  });

  // Run code
  function runCode(newTab) {
    const content = editor.getValue();
    const currentTab = getCurrentTab();
    const isJS = currentTab.name.endsWith('.js');

    if (newTab) {
      const newWindow = window.open();
      if (!newWindow) {
        showAlert("Failed to open new tab, please allow popups for this site.", 'ERR');
        showError("Popup blocked or failed to open new tab");
        return;
      }

      if (isJS) {
        const theme = localStorage.getItem('editorTheme') || 'dark';
        const colorThemes = {
          dark: { bg: '#111', text: '#eee', log: '#0f0', error: '#f55', accent: '#ffa500' },
          light: { bg: '#fff', text: '#111', log: '#080', error: '#c00', accent: '#d2691e' },
          'contrast-dark': { bg: '#000', text: '#fff', log: '#0ff', error: '#f00', accent: '#ff0' },
          'contrast-light': { bg: '#fff', text: '#000', log: '#00f', error: '#900', accent: '#a52a2a' }
        };
        const colors = colorThemes[theme] || colorThemes.dark;

        const html = \`
        <!DOCTYPE html>
        <html>
        <head>
          <title>\${currentTab.name}</title>
          <style>
            body {
              font-family: monospace;
              background: \${colors.bg};
              color: \${colors.text};
              padding: 1rem;
              white-space: pre-wrap;
            }
            .log { color: \${colors.log}; margin-bottom: 0.5rem; }
            .error-block {
              border-left: 4px solid \${colors.error};
              background: rgba(255, 0, 0, 0.1);
              padding: 1rem;
              margin: 1rem 0;
              font-family: monospace;
            }
            .err-title { color: \${colors.error}; font-weight: bold; font-size: 1.2em; }
            .err-msg   { color: \${colors.accent}; margin: 0.5rem 0; }
            .err-stack { color: #ccc; font-size: 0.9em; }
            input.inline-input {
              background: \${colors.bg};
              color: \${colors.text};
              border: 1px solid #666;
              padding: 4px;
              font-family: monospace;
              width: 80%;
              margin-top: 0.2rem;
            }
          </style>
        </head>
        <body>
          <script>
            // Function to load external files
            async function loadFile(path) {
              try {
                const response = await fetch(path);
                if (!response.ok) throw new Error('File not found');
                return await response.text();
              } catch (err) {
                console.error('Failed to load file:', path, err);
                return null;
              }
            }
          </script>
          <script>
            (async function() {
              const log = (...args) => {
                const div = document.createElement('div');
                div.className = 'log';
                div.textContent = args.map(a => String(a)).join(' ');
                document.body.appendChild(div);
              };

              const showError = (err) => {
                const container = document.createElement('div');
                container.className = 'error-block';
                container.innerHTML = \`
                  <div class="err-title">\${err.name}</div>
                  <div class="err-msg">\${err.message}</div>
                  <pre class="err-stack">\${err.stack}</pre>
                \`;
                document.body.appendChild(container);
              };

              console.log = log;

              window.prompt = function(message, _default = '') {
                return new Promise(resolve => {
                  const wrapper = document.createElement('div');
                  wrapper.innerHTML = \`
                    <div>\${message}</div>
                    <pre>> <input class="inline-input" type="text"></pre>
                  \`;
                  const input = wrapper.querySelector('input');
                  input.value = _default;
                  input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') {
                      input.disabled = true;
                      resolve(input.value);
                    }
                  });
                  document.body.appendChild(wrapper);
                  input.focus();
                });
              };

              try {
                // Add support for importing files
                const importRegex = /\/\/ @import\\s+(.+)/g;
                let code = \${JSON.stringify(content)};
                const imports = code.match(importRegex);

                if (imports) {
                  for (const imp of imports) {
                    const path = imp.match(/\/\/ @import\\s+(.+)/)[1];
                    const fileContent = await loadFile(path);
                    if (fileContent) {
                      code = code.replace(imp, fileContent);
                    }
                  }
                }

                // Execute user code
                new Function(code)();
              } catch (err) {
                showError(err);
              }
            })();
          </script>
        </body>
        </html>
      \`;

        newWindow.document.write(html);
        newWindow.document.close();
      } else {
        // For non-JS files, process imports before displaying
        const importRegex = /<!-- @import\s+(.+)\s*-->/g;
        const linkRegex = /<link[^>]*href=["']([^"']+)["'][^>]*>/g;
        const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/g;
        const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/g;
        let finalContent = content;

        // Process @import comments
        const imports = content.match(importRegex);
        if (imports) {
          for (const imp of imports) {
            const path = imp.match(/<!-- @import\s+(.+)\s*-->/)[1];
            const fileEntry = findFileEntry(path, state.files);
            if (fileEntry && fileEntry.content) {
              finalContent = finalContent.replace(imp, fileEntry.content);
            }
          }
        }

        // Process <link> tags for CSS
        const links = content.match(linkRegex);
        if (links) {
          for (const link of links) {
            const href = link.match(/href=["']([^"']+)["']/)[1];
            const cleanPath = href.replace(/^\.\//, '');
            const fileEntry = findFileEntry(cleanPath, state.files);
            if (fileEntry && fileEntry.content) {
              const cssContent = \`<style>\\n\${fileEntry.content}\\n</style>\`;
              finalContent = finalContent.replace(link, cssContent);
            }
          }
        }

        // Process <script> tags
        const scripts = content.match(scriptRegex);
        if (scripts) {
          for (const script of scripts) {
            const src = script.match(/src=["']([^"']+)["']/)[1];
            const cleanPath = src.replace(/^\.\//, '');
            const fileEntry = findFileEntry(cleanPath, state.files);
            if (fileEntry && fileEntry.content) {
              const scriptContent = \`<script>\\n\${fileEntry.content}\\n</script>\`;
              finalContent = finalContent.replace(script, scriptContent);
            }
          }
        }

        // Process <img> tags
        const images = content.match(imgRegex);
        if (images) {
          for (const img of images) {
            const src = img.match(/src=["']([^"']+)["']/)[1];
            if (src.startsWith('data:')) continue; // Skip data URLs

            const cleanPath = src.replace(/^\.\//, '');
            const fileEntry = findFileEntry(cleanPath, state.files);
            if (fileEntry && fileEntry.content) {
              // Determine image type from extension
              const ext = cleanPath.split('.').pop().toLowerCase();
              const mimeType = {
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'svg': 'image/svg+xml'
              }[ext] || 'image/png';

              // For SVG files, use the content directly
              if (ext === 'svg') {
                const dataUrl = \`data:\${mimeType};charset=utf-8,\${encodeURIComponent(fileEntry.content)}\`;
                finalContent = finalContent.replace(src, dataUrl);
              }
              // For binary images (already stored as data URLs)
              else if (fileEntry.content.startsWith('data:')) {
                finalContent = finalContent.replace(src, fileEntry.content);
              }
            }
          }
        }

        newWindow.document.write(finalContent);
        newWindow.document.close();
      }
    } else {
      updatePreview();
    }
  }

  // Font size adjustments
  function adjustFontSize(change) {
    const currentSize = parseInt(editor.getOption(monaco.editor.EditorOption.fontSize));
    const newSize = Math.max(8, Math.min(36, currentSize + change));
    editor.updateOptions({ fontSize: newSize });
    localStorage.setItem('editorFontSize', newSize);
    updateStatus(\`Font size: \${newSize}px\`);
  }

  function resetFontSize() {
    editor.updateOptions({ fontSize: DEFAULT_FONT_SIZE });
    localStorage.setItem('editorFontSize', DEFAULT_FONT_SIZE);
    updateStatus("Font size reset to 16px");
  }

  // Layout options
  function setLayout(layout) {
    const container = document.getElementById('mainContainer');
    const editorWrapper = document.querySelector('.editor-wrapper');
    const previewPane = document.querySelector('.preview-pane');
    const resizer = document.getElementById('resizer');

    if (layout === 'horizontal' || layout === 'vertical') {
      container.style.flexDirection = layout === 'horizontal' ? 'row' : 'column';
      editorWrapper.style.display = 'flex';
      previewPane.style.display = 'flex';
      resizer.style.display = 'block'; // Show resizer in split views
      updateStatus(\`Layout set to \${layout} split\`);
    } else if (layout === 'editor-only') {
      editorWrapper.style.display = 'flex';
      previewPane.style.display = 'none';
      resizer.style.display = 'none'; // Hide resizer in editor-only mode
      updateStatus("Showing editor only");
    } else if (layout === 'output-only') {
      editorWrapper.style.display = 'none';
      previewPane.style.display = 'flex';
      resizer.style.display = 'none'; // Hide resizer in output-only mode
      updateStatus("Showing output only");
    }
  }

  function toggleAIIframe() {
    const aiSidebar = document.getElementById('ai-sidebar');
    if (aiSidebar) {
      aiSidebar.classList.toggle('ai-sidebar-open');
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
  }

  // Set up menu event listeners
  document.querySelectorAll('.menu-item').forEach( (menu) => {
    menu.addEventListener('mouseenter', () => {
      document.querySelectorAll('.dropdown').forEach( (dropdown) => {
        if (dropdown !== menu.querySelector('.dropdown')) {
          dropdown.style.display = 'none';
        }
      });
      const dropdown = menu.querySelector('.dropdown');
      if (dropdown) dropdown.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) {
        const dropdown = menu.querySelector('.dropdown');
        if (dropdown) dropdown.style.display = 'none';
      }
    });
  });

  // Special handling for sub-menus
  document.querySelectorAll('.sub-menus').forEach( (subMenu) => {
    const dropdownItem = subMenu.querySelector('.dropdown-item');
    const dropdown = subMenu.querySelector('.dropdown');

    dropdownItem.addEventListener('click', (e) => {
      e.stopPropagation();
      subMenu.classList.toggle('active');
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    dropdownItem.addEventListener('mouseenter', () => {
      subMenu.classList.add('active');
      dropdown.style.display = 'block';
    });
  });

  // Handle all dropdown item clicks
  document.querySelectorAll('.dropdown-item').forEach( (item) => {
    item.addEventListener('click', (e) => {
      if (item.hasAttribute('disabled')) return;

      const action = e.target.dataset.action;
      const file = e.target.dataset.file;
      const path = e.target.dataset.path;
      const tabId = e.target.dataset.tabId;
      if (action) {
        handleMenuAction(action, { file, path, tabId });
        document.querySelectorAll('.dropdown').forEach( (dropdown) => {
          dropdown.style.display = 'none';
        });
      }
    });
  });

  // Set up resizer
  const resizer = document.getElementById('resizer');
  let isResizing = false;

  resizer.addEventListener('mousedown', () => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  });

  function resize(e) {
    if (!isResizing) return;
    const containerWidth = document.getElementById('mainContainer').offsetWidth;
    const editorWidth = (e.clientX / containerWidth) * 100;
    document.querySelector('.editor-wrapper').style.flex = \`0 0 \${editorWidth}%\`;
    document.querySelector('.preview-pane').style.flex = \`0 0 \${100 - editorWidth}%\`;
  }

  function stopResize() {
    isResizing = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  }

  // File input handler
  document.getElementById('fileInput').addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (file) {

      // Create a new tab for the opened file
      const tabId = generateTabId();
      const newTab = {
        id: tabId,
        name: file.name,
        type: file.name.split('.').pop().toLowerCase(),
        content: await file.text(),
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
      updateStatus(\`Opened \${file.name}\`);
      await detectLanguage();
      saveTabsToStorage();
    }
  });

  // Initialize
  function init() {
    setupBeforeUnload();
    // Always ensure at least one tab exists
    getCurrentTab();
    renderTabs();
    refreshExploreFileList();

    // Set empty state on load if needed
    const editorWrapper = document.querySelector('.editor-wrapper');
    if (state.tabs.length === 0) {
      editorWrapper.classList.add('empty');
      // Always ensure at least one tab exists
      getCurrentTab();
    } else {
      editorWrapper.classList.remove('empty');
    }

    let debounceTimer;
    editor.onDidChangeModelContent(() => {
      const currentTab = getCurrentTab();
      if (currentTab) {
        currentTab.content = editor.getValue();
        markTabUnsaved(currentTab.id, true);
        saveTabsToStorage();
      }

      // Skip preview updates for Python files
      if (!currentTab.name.endsWith('.py')) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, DEBOUNCE_DELAY);
      }
    });

    editor.onDidChangeCursorPosition((e) => {
      lineInfo.textContent = \`Ln \${e.position.lineNumber}, Col \${e.position.column}\`;
    });

    updatePreview();
    toggleFileExplorer();
    const theme = localStorage.getItem('editorTheme') || 'automatic';
    setTheme(theme);

    // Force theme sync with file explorer and AI sidebar after a short delay
    setTimeout(() => {
      // File explorer
      const fileExplorer = document.querySelector('#file-explorer iframe');
      if (fileExplorer && fileExplorer.contentWindow) {
        fileExplorer.contentWindow.postMessage({
          type: 'themeChange',
          theme: theme
        }, '*');
      }

      // AI sidebar
      syncAITheme(theme);
    }, 500);

    refreshExploreFileList();
    setLayout("editor-only");
    toggleFileExplorer();
    detectLanguage();
    updateStatus("IDE Setup Ready");

    // Add space selector functionality
    const spaceInfo = document.getElementById('SpaceInfo');
    spaceInfo.addEventListener('click', (e) => {
      e.stopPropagation();

      // Remove existing selector if present
      const existing = document.querySelector('.spaces-selector');
      if (existing) {
        existing.remove();
        return;
      }

      const selector = document.createElement('div');
      selector.className = 'spaces-selector';

      // Add search input
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'spaces-selector-input';
      input.placeholder = 'Select indentation size...';
      selector.appendChild(input);

      // Available tab sizes with descriptions
      let spaces = [];
      for (i = 1; i < 8; i++) {
        spaces.push(
          {
            size: i,
            label: \`\${i} Spaces\`,
          }
        )
      }

      const currentTabSize = editor.getModel().getOptions().tabSize;
      let selectedIndex = spaces.findIndex(s => s.size === currentTabSize);
      if (selectedIndex === -1) selectedIndex = 0;

      function renderOptions(filter = '') {
        const optionsContainer = selector.querySelector('.options-container');
        if (optionsContainer) optionsContainer.remove();

        const container = document.createElement('div');
        container.className = 'options-container';

        const filteredSpaces = spaces.filter(s =>
          s.label.toLowerCase().includes(filter.toLowerCase()) ||
          s.description.toLowerCase().includes(filter.toLowerCase())
        );

        filteredSpaces.forEach((space, idx) => {
          const option = document.createElement('div');
          option.className = \`space-option \${idx === selectedIndex ? 'selected' : ''}\`;
          option.innerHTML = \`
                    <span class="label">\${space.label}</span>
                \`;
          option.addEventListener('click', () => {
            editor.getModel().updateOptions({ tabSize: space.size });
            spaceInfo.textContent = \`Spaces: \${space.size}\`;
            selector.remove();
            updateStatus(\`Tab size set to \${space.size} spaces\`);
          });
          container.appendChild(option);
        });

        selector.appendChild(container);
      }

      // Initial render
      renderOptions();

      // Handle input changes
      input.addEventListener('input', (e) => renderOptions(e.target.value));

      // Handle keyboard navigation
      input.addEventListener('keydown', (e) => {
        const options = selector.querySelectorAll('.space-option');
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % options.length;
          options.forEach( (opt, idx) =>
            opt.classList.toggle('selected', idx === selectedIndex));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = selectedIndex <= 0 ? options.length - 1 : selectedIndex - 1;
          options.forEach( (opt, idx) =>
            opt.classList.toggle('selected', idx === selectedIndex));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selectedOption = selector.querySelector('.space-option.selected');
          if (selectedOption) selectedOption.click();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          selector.remove();
        }
      });

      // Position and show the selector
      document.body.appendChild(selector);
      input.focus();

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!selector.contains(e.target) && e.target !== spaceInfo) {
          selector.remove();
        }
      });
    });
  }

  init();
});`
        editor.update()
    });
});

editorDiv.addEventListener("wheel", (event) => {
    if (event.deltaY > 0) {
        editor.json.scroll.scrollLine += 3;
        const amount = Math.ceil(editor.json.content.split('\n').length - editor.canvas.getBoundingClientRect().height / editor.json.theming.fontSize);
        if (editor.json.scroll.scrollLine > amount) editor.json.scroll.scrollLine = amount;
    }
    else {
        editor.json.scroll.scrollLine -= 3;
        if (editor.json.scroll.scrollLine < 0) editor.json.scroll.scrollLine = 0;
    }
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
    const fontSize = Number(editor.json.theming.fontSize);

    const visibleLines = Math.ceil(canvasHeight / fontSize);
    const maxScroll = Math.max(0, lines - visibleLines);

    const thumbHeight = Math.max(
        (visibleLines / lines) * canvasHeight,
        20
    );

    const trackHeight = canvasHeight - thumbHeight;

    const scrollRatio = maxScroll === 0 ? 0 : editor.json.scroll.scrollLine / maxScroll;
    const thumbY = scrollRatio * trackHeight;

    const clickedOnThumb =
        y >= thumbY &&
        y <= thumbY + thumbHeight;

    if (!clickedOnThumb) {
        const clickRatio = Math.min(
            Math.max((y - thumbHeight / 2) / trackHeight, 0),
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

window.addEventListener("mousemove", (event) => {
    if (!isDraggingScrollbar) return;

    const rect = editorDiv.getBoundingClientRect();
    const canvasHeight = rect.height;

    const lines = editor.json.content.split("\n").length;
    const fontSize = Number(editor.json.theming.fontSize);

    const visibleLines = Math.floor(canvasHeight / fontSize);
    const maxScroll = Math.max(0, lines - visibleLines);

    const thumbHeight = Math.max(
        (visibleLines / lines) * canvasHeight,
        20
    );

    const trackHeight = canvasHeight - thumbHeight;

    let thumbY = (event.clientY - rect.top) - grabOffsetY;

    thumbY = Math.max(0, Math.min(trackHeight, thumbY));

    const scrollRatio = trackHeight === 0 ? 0 : thumbY / trackHeight;

    editor.json.scroll.scrollLine = Math.ceil(scrollRatio * maxScroll);

    editor.update();
});

window.addEventListener("mouseup", () => {
    isDraggingScrollbar = false;
});

window.addEventListener("keydown", (event) => {
    // Prevent default browser behavior (like scrolling with arrows)
    event.preventDefault();

    if (event.key === "Backspace") {
        editor.json.content = editor.json.content.slice(0, -1);
    }
    else if (event.key === "Enter") {
        editor.json.content += "\n";
    }
    else if (event.key === "Tab") {
        editor.json.content += "    "; // or "\t"
    }
    else if (event.key.length === 1) {
        // Only add printable characters
        editor.json.content += event.key;
    }

    const amount = Math.ceil(editor.json.content.split('\n').length - editor.canvas.getBoundingClientRect().height / editor.json.theming.fontSize);
    if (editor.json.scroll.scrollLine > amount) editor.json.scroll.scrollLine = amount;
    if (editor.json.scroll.scrollLine < 0) editor.json.scroll.scrollLine = 0;

    editor.update();
});

setInterval(() => {
    requestAnimationFrame(() => {
        editor.update();
    });
}, 0);
