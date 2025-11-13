// src/frontend/content-script.ts

function detectGmailState(url: string): void {
  // Gmail inbox example:
  // https://mail.google.com/mail/u/0/#inbox
  const isInbox = url.includes("#inbox") && !url.includes("compose=");

  // Gmail compose example:
  // https://mail.google.com/mail/u/0/#inbox?compose=new
  const isCompose = url.includes("compose=");

  if (isCompose) {
    console.log("[AC] Gmail Compose window detected:", url);
  } else if (isInbox) {
    console.log("[AC] Gmail Inbox detected:", url);
  } else {
    console.log("[AC] Gmail detected (other view):", url);
  }
}

function detectGoogleDocsState(url: string): void {
  // Docs home example:
  // https://docs.google.com/document/u/0/
  const isDocsHome =
    url.includes("docs.google.com/document/") && !url.includes("/d/");

  // Docs document example:
  // https://docs.google.com/document/d/<id>/edit
  const isInsideDocument = url.includes("/document/d/");

  if (isInsideDocument) {
    console.log("[AC] Google Docs Document detected:", url);
  } else if (isDocsHome) {
    console.log("[AC] Google Docs Home detected:", url);
  } else {
    console.log("[AC] Google Docs detected (other view):", url);
  }
}

function detectSite(): void {
  const url = window.location.href;
  const host = window.location.host;

  if (host.includes("mail.google.com")) {
    detectGmailState(url);
  } else if (host.includes("docs.google.com")) {
    detectGoogleDocsState(url);
  } else {
    console.log("[AC] Not Gmail or Google Docs:", url);
  }
}

// Run immediately
detectSite();

// Gmail/Docs often use dynamic navigation; listen for state changes
window.addEventListener("hashchange", detectSite);
window.addEventListener("popstate", detectSite);
