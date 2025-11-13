import { GmailComposeDetector, GmailDetectionState } from "./gmail-detector";

console.log("Content script loaded — Gmail compose field detection active.");

const detector = new GmailComposeDetector((state: GmailDetectionState) => {
  console.log("📨 Gmail State Changed:", state);

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
});

detector.start();
