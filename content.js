document.addEventListener('focusin', function (event) {
    if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT' && event.target.type === 'text') {
        const screenWidth = screen.width;
        const screenHeight = screen.height;
        chrome.runtime.sendMessage({ 
            action: "openEditor", 
            text: event.target.value,
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            
        });
        event.target.blur();
    }
})
