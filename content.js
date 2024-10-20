document.addEventListener('focusin', function (event) {
    if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT' && event.target.type === 'text') {
        chrome.runtime.sendMessage({ action: "openEditor", text: event.target.value });
        event.target.blur();
    }
})
