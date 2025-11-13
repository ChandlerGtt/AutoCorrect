// src/frontend/content-script.ts

function detectSite(): void {
  const host = window.location.host;
  const url = window.location.href;

  if (host.includes("mail.google.com")) {
    console.log("[AutoCorrect] Gmail detected:", url);
  } else if (host.includes("docs.google.com")) {
    console.log("[AutoCorrect] Google Docs detected:", url);
  } else {
    console.log("[AutoCorrect] Not Gmail or Google Docs:", url);
  }
}

detectSite();
