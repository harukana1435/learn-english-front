chrome.runtime.onInstalled.addListener(() => {
  console.log("Llama2 English Learning Extension Installed");
});

function showPopup() {
  const selection = window.getSelection().toString();
  if (selection) {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.left = "0";
    popup.style.top = "50px";
    popup.style.backgroundColor = "white";
    popup.style.border = "1px solid black";
    popup.style.padding = "10px";
    popup.style.zIndex = "9999";
    popup.textContent = selection;
    document.body.appendChild(popup);
  }
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-popup") {
    // ポップアップを表示
    chrome.action.openPopup(); // ポップアップを開く
  }
});
