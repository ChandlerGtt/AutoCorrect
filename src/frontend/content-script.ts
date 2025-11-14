import { GmailComposeDetector, GmailDetectionState } from "./gmail-detector";
import { correct, SpellcheckResult } from "./spellchecker/spellchecker";

console.log("Content script loaded — Gmail compose field detection active.");

let popup: HTMLDivElement | null = null;
let popupLabel: HTMLDivElement | null = null;

// Tracks current word
let currentWord: string = "";

// 10-word grouping
let currentBlock: string[] = [];
let previousBlock: string[] | null = null; // <-- NOW USED

// Create popup
function createPopup(): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.zIndex = "999999";
  wrapper.style.pointerEvents = "auto";
  wrapper.style.display = "none";

  const label = document.createElement("div");
  label.style.background = "rgba(255, 0, 0, 0.8)";
  label.style.color = "white";
  label.style.fontSize = "11px";
  label.style.padding = "2px 4px";
  label.style.borderRadius = "4px";
  label.style.display = "none";
  label.innerText = "Click to correct";

  const box = document.createElement("div");
  box.style.background = "white";
  box.style.border = "2px solid #ccc";
  box.style.borderRadius = "6px";
  box.style.padding = "6px 10px";
  box.style.fontSize = "14px";
  box.style.color = "#333";
  box.style.pointerEvents = "auto";
  box.style.boxShadow = "0px 2px 10px rgba(0,0,0,0.2)";

  wrapper.appendChild(label);
  wrapper.appendChild(box);

  document.body.appendChild(wrapper);

  popupLabel = label;
  popup = box;

  return wrapper;
}

const popupWrapper = createPopup();

// Update popup
function updatePopup(
  text: string,
  isError: boolean,
  suggestion?: string
): void {
  if (!popup || !popupWrapper) return;

  if (text.trim().length === 0) {
    popupWrapper.style.display = "none";
    return;
  }

  popup.innerHTML = isError
    ? `<b>${text}</b> → <span style="color:red">${suggestion}</span>`
    : text;

  popup.style.borderColor = isError ? "red" : "#ccc";

  popupLabel!.style.display = isError ? "block" : "none";

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    popupWrapper.style.display = "none";
    return;
  }

  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  popupWrapper.style.left = `${rect.left + window.scrollX}px`;
  popupWrapper.style.top = `${rect.bottom + window.scrollY + 5}px`;
  popupWrapper.style.display = "block";
}

// Replace word in Gmail body
function applyCorrection(corrected: string): void {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);

  // Step 1 — Expand range left until reaching the word boundary
  const wordBoundaryRegex = /\s/;
  let startNode = range.startContainer;
  let startOffset = range.startOffset;

  // Ensure we are in a text node
  while (startNode.nodeType !== Node.TEXT_NODE && startNode.firstChild) {
    startNode = startNode.firstChild;
    startOffset = startNode.textContent ? startNode.textContent.length : 0;
  }

  const textContent = startNode.textContent ?? "";

  // Move left until a whitespace or start of node
  let offset = startOffset;
  while (offset > 0 && !wordBoundaryRegex.test(textContent[offset - 1])) {
    offset--;
  }

  // Step 2 — Create new range covering ONLY the misspelled word
  const wordRange = document.createRange();
  wordRange.setStart(startNode, offset);
  wordRange.setEnd(startNode, startOffset);

  // Step 3 — Replace the word safely
  wordRange.deleteContents();
  wordRange.insertNode(document.createTextNode(corrected + " "));

  // Step 4 — Move caret to end of inserted word
  sel.removeAllRanges();
  const newRange = document.createRange();
  newRange.setStart(startNode, offset + corrected.length + 1);
  newRange.collapse(true);
  sel.addRange(newRange);
}

// Finalize one word
function finalizeCurrentWord(): void {
  const word = currentWord.trim();
  if (word.length === 0) {
    currentWord = "";
    return;
  }

  const result: SpellcheckResult = correct(word);

  if (!result.isCorrect) {
    updatePopup(word, true, result.corrected);

    popupWrapper!.onclick = () => {
      applyCorrection(result.corrected);
      popupWrapper!.style.display = "none";
    };
  }

  currentBlock.push(word);

  console.log("📝 Added word:", word);

  // When 10 reached
  if (currentBlock.length === 10) {
    console.log("🔟 10-word block:", currentBlock);

    // NOW previousBlock IS USED
    if (previousBlock !== null) {
      console.log("📦 Previous block:", previousBlock);
    }

    previousBlock = [...currentBlock]; // <-- IMPORTANT: used & meaningful
    currentBlock = [];
  }

  currentWord = "";
}

// MAIN detector
const detector = new GmailComposeDetector(
  (state: GmailDetectionState) => {
    console.log("📨 Gmail State Changed:", state);

    if (state.activeField === "body") {
      currentWord = state.caretText ?? "";
      updatePopup(currentWord, false);
    } else {
      popupWrapper.style.display = "none";
    }
  },
  (key: string) => {
    if (key === " " || key === "Enter") {
      finalizeCurrentWord();
      popupWrapper.style.display = "none";
    }
  }
);

detector.start();
