import { GmailComposeDetector, GmailDetectionState } from "./gmail-detector";

console.log("Content script loaded — Gmail compose field detection active.");

const detector = new GmailComposeDetector((state: GmailDetectionState) => {
  // Log changes
  console.log("📨 Gmail State Changed:", state);

  // Build message payload
  const message = {
    type: "GMAIL_COMPOSE_STATE",
    inCompose: state.inCompose,
    activeField: state.activeField,
    fields: {
      hasTo: state.elements.to !== null,
      hasSubject: state.elements.subject !== null,
      hasBody: state.elements.body !== null,
    },
  };

  chrome.runtime.sendMessage(message);
});

// Start observing Gmail UI
detector.start();
