let activeElement = null;

function isEditableElement(element) {
    return element.isContentEditable ||
           element.tagName === 'TEXTAREA' ||
           (element.tagName === 'INPUT' && 
            (element.type === 'text' || element.type === 'search' || element.type === 'url' || element.type === 'tel' || element.type === 'email'));
}

document.addEventListener('focusin', function (event) {
    if (isEditableElement(event.target)) {
        activeElement = event.target;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        
        let text = activeElement.isContentEditable ? activeElement.innerText : activeElement.value;
        
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ 
                action: "openEditor", 
                text: text,
                screenWidth: screenWidth,
                screenHeight: screenHeight,
            });
        } else {
            console.error('Chrome runtime API is not available');
        }
        
        event.target.blur();
    }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateText" && activeElement) {
        updateInputValue(activeElement, message.text);
        activeElement = null;
    }
});

function updateInputValue(input, value) {
    if (input.isContentEditable) {
        input.innerText = value;
        let inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: value });
        input.dispatchEvent(inputEvent);
    } else {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // For React-based inputs
    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        
        let inputEvent = new Event('input', { bubbles: true });
        input.dispatchEvent(inputEvent);
    }
}
