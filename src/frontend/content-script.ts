import { GmailComposeDetector, GmailDetectionState } from "./gmail-detector";

console.log("Content script loaded — Gmail compose field detection active.");

let currentWords: string[] = [];
let popup: HTMLDivElement | null = null;

// Create floating popup
function createPopup(): HTMLDivElement {
  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.zIndex = "999999";
  el.style.background = "white";
  el.style.border = "1px solid #ccc";
  el.style.borderRadius = "6px";
  el.style.padding = "6px 10px";
  el.style.fontSize = "13px";
  el.style.color = "#333";
  el.style.pointerEvents = "none";
  el.style.boxShadow = "0px 2px 10px rgba(0,0,0,0.15)";
  el.style.display = "none";
  document.body.appendChild(el);
  return el;
}

popup = createPopup();

function updatePopup(text: string): void {
  if (!popup) return;

  if (text.trim().length === 0) {
    popup.style.display = "none";
    return;
  }

  popup.innerText = text;
  popup.style.display = "block";

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  popup.style.left = `${rect.left + window.scrollX}px`;
  popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
}

const detector = new GmailComposeDetector(
  (state: GmailDetectionState) => {
    console.log("📨 Gmail State Changed:", state);

    // Existing message for background
    chrome.runtime.sendMessage({
      type: "GMAIL_COMPOSE_STATE",
      inCompose: state.inCompose,
      activeField: state.activeField,
      bodyText: state.bodyText,
      fields: {
        hasTo: state.elements.to !== null,
        hasSubject: state.elements.subject !== null,
        hasBody: state.elements.body !== null,
      },
    });

    // Only show popup in body
    if (state.activeField === "body") {
      updatePopup(state.caretText);
    } else {
      updatePopup("");
    }
  },

  // Key press listener
  (key: string) => {
    if (key === " ") {
      const sel = window.getSelection();
      if (!sel) return;

      const word = sel.focusNode?.textContent?.split(/\s+/).slice(-1)[0] ?? "";

      if (word.trim().length > 0) {
        currentWords.push(word.trim());
        console.log("📝 Word added:", word.trim());
      }

      updatePopup("");

      if (currentWords.length === 10) {
        console.log("🔟 Ten words typed:", currentWords);
        currentWords = [];
      }
    }
  }
);

detector.start();
