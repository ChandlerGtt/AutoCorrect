// src/frontend/background.ts

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  if (tab.url.includes("mail.google.com")) {
    console.log("[AutoCorrect BG] Active tab is Gmail:", tab.url);
  } else if (tab.url.includes("docs.google.com")) {
    console.log("[AutoCorrect BG] Active tab is Google Docs:", tab.url);
  }
});
