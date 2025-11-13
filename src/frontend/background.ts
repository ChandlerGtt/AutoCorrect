// src/frontend/background.ts

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  const url = tab.url;

  if (url.includes("mail.google.com")) {
    if (url.includes("compose=")) {
      console.log("[AC BG] Gmail Compose detected:", url);
    } else if (url.includes("#inbox")) {
      console.log("[AC BG] Gmail Inbox detected:", url);
    } else {
      console.log("[AC BG] Gmail (other view):", url);
    }
  }

  if (url.includes("docs.google.com")) {
    if (url.includes("/document/d/")) {
      console.log("[AC BG] Google Docs Document detected:", url);
    } else if (url.includes("/document/")) {
      console.log("[AC BG] Google Docs Home detected:", url);
    } else {
      console.log("[AC BG] Google Docs (other view):", url);
    }
  }
});
