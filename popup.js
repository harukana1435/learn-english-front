function parseText(inputText) {
  // 初期化
  const result = {
    translation: "",
    vocabulary: [],
    idioms: [],
  };

  // ステータス管理
  let currentSection = "translation";

  // テキストを行ごとに分けて解析
  const lines = inputText.split("|");

  lines.forEach((line) => {
    if (line.startsWith("1. 和訳:")) {
      result.translation = line.slice(6);
      currentSection = "vocabulary";
    }
    // 難しい単語の処理
    else if (
      line.trim().startsWith("単語") &&
      currentSection === "vocabulary"
    ) {
      // 和訳部分
      const parts = line.trim().slice(2).split("-");
      const wordData = {
        word: parts[0].slice(2),
        meaning: parts[1].slice(4),
        pronunciation: parts[2].slice(4),
        example: parts[3].slice(4),
        synonym: parts[4].slice(5),
        antonym: parts[5].slice(5),
        common: parts[6].slice(13),
      };
      result.vocabulary.push(wordData);
    }

    // 慣用句や特殊なフレーズの処理
    else if (line.trim().startsWith("3. 熟語")) {
      currentSection = "idioms";
    } else if (currentSection === "idioms" && line.trim().startsWith("熟語")) {
      const idiomParts = line.trim().slice(2).split("-");
      const idiomData = {
        phrase: idiomParts[0].slice(2),
        meaning: idiomParts[1].slice(4),
        explanation: idiomParts[2].slice(4),
        similar: idiomParts[3].slice(6),
      };
      result.idioms.push(idiomData);
    }
  });

  return result;
}

document.addEventListener("DOMContentLoaded", function () {
  // Chromeストレージから選択したテキストを取得
  chrome.storage.local.get("selectedText", async function (data) {
    const selectedText = data.selectedText;
    if (selectedText) {
      try {
        const response = await fetch(
          "https://api-backend-coral.vercel.app/api/gemini",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "AIzaSyDJIS4OMJCVN-B8mCsPWejrZkR6zMdiGg4",
            },
            body: JSON.stringify({ text: selectedText }),
          }
        );
        const result = await response.json();

        const data = parseText(result.result);

        document.getElementById("source").innerText = selectedText;

        document.getElementById("translation").innerText = data.translation;

        // 難しい単語の表示
        const vocabularyContainer = document.getElementById("vocabulary");
        data.vocabulary.forEach((wordData) => {
          const wordElement = document.createElement("div");
          wordElement.innerHTML = `
      <strong>${wordData.word}</strong><br>
      意味：${wordData.meaning}<br>
      発音：${wordData.pronunciation}<br>
      例文：${wordData.example}<br>
            同義語：${wordData.synonym}<br>
      反義語：${wordData.antonym}<br>
      よく一緒に使われる単語：${wordData.common}<br><br>
    `;
          vocabularyContainer.appendChild(wordElement);
        });

        // 慣用句や特殊なフレーズの表示
        const idiomsContainer = document.getElementById("idioms");
        data.idioms.forEach((phraseData) => {
          const phraseElement = document.createElement("div");
          phraseElement.innerHTML = `
      <strong>${phraseData.phrase}</strong><br>
      意味：${phraseData.meaning}<br>
      解説：${phraseData.explanation}<br>
            類似表現：${phraseData.similar}<br><br>
    `;
          idiomsContainer.appendChild(phraseElement);
        });
      } catch (error) {
        console.error("Error fetching meaning:", error);
        document.getElementById("meaning").textContent =
          "Error fetching meaning.";
      }
    } else {
      document.getElementById("meaning").textContent = "No text selected.";
    }
  });
});
