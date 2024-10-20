chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openEditor") {
        const screenWidth = message.screenWidth;
        const screenHeight = message.screenHeight;
        chrome.windows.create({
            url: "editor.html",
            type: "popup",
            width: 600,
            height: 400, 
            left: screenWidth / 2 - 300, 
            top: screenHeight / 2 - 200
        }, function (popup) {
            chrome.storage.local.set({ text: message.text });
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateText") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (text) => {
                    document.activeElement.value = text;
                },
                args: [message.text]
            });
        });
    }
});


