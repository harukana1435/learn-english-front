// ユーザーが選択したテキストをChromeストレージに保存
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();

  // 選択したテキストが存在する場合のみ保存
  if (selectedText) {
    chrome.storage.local.set({ selectedText: selectedText }, () => {
      console.log("Selected text saved:", selectedText);
    });
  }
});

// キーボードイベントをリッスンして Shift + S を検出
document.addEventListener("keydown", function (event) {
  if (event.shiftKey && event.key === "S") {
    // 選択されたテキストを取得
    const selectedText = window.getSelection().toString().trim();
    // テキストが選択されていれば、APIを叩く
    if (selectedText) {
      chrome.storage.local.set({ selectedText: selectedText });

      // APIを呼び出し、結果を表示するためのメッセージを送信
      chrome.runtime.sendMessage({ action: "fetchMeaning" });
    } else {
      alert("Please select some text first!");
    }
  }
});
