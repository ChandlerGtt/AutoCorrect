chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "GMAIL_COMPOSE_STATE") {
    if (msg.inCompose) {
      console.log("✉️ Gmail compose detected.");

      if (msg.activeField === "body") {
        console.log("🟢 User is typing in BODY.");
      } else if (msg.activeField === "to") {
        console.log("🟡 User is editing TO field.");
      } else if (msg.activeField === "subject") {
        console.log("🔵 User is editing SUBJECT.");
      }
    } else {
      console.log("❌ Not inside Gmail compose.");
    }
  }
});
