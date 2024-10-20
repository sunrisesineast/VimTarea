document.addEventListener('DOMContentLoaded', function() {
  const editor = CodeMirror(document.getElementById('editor'), {
    mode: "text/plain",
    keyMap: "vim",
    lineNumbers: true,
    theme: "monokai"
  });

  // Get stored text
  chrome.storage.local.get('text', function (data) {
    editor.setValue(data.text || '');
  });

  // Listen for changes and update text
  editor.on('change', function () {
    chrome.storage.local.set({ text: editor.getValue() });
  });

  // On close, return the edited text to the original text area
  window.addEventListener('beforeunload', function () {
    chrome.runtime.sendMessage({ action: "updateText", text: editor.getValue() }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      }
    });
  });
});
