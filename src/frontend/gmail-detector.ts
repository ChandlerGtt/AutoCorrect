// src/frontend/gmail-detector.ts

export type GmailFieldType = "to" | "subject" | "body" | "none";

export interface GmailDetectionState {
  inCompose: boolean;
  activeField: GmailFieldType;
  bodyText: string;
  elements: {
    to: HTMLElement | null;
    subject: HTMLElement | null;
    body: HTMLElement | null;
  };
}

export class GmailComposeDetector {
  private observer: MutationObserver | null = null;
  private inputListener: ((e: Event) => void) | null = null;
  private lastState: GmailDetectionState | null = null;

  constructor(private callback: (state: GmailDetectionState) => void) {}

  public start(): void {
    const config: MutationObserverInit = {
      childList: true,
      subtree: true,
    };

    this.observer = new MutationObserver(() => this.evaluate());
    this.observer.observe(document.body, config);

    this.evaluate(); // initial detection
  }

  private evaluate(): void {
    const toSelector =
      'input[name="to"], textarea[name="to"], div[aria-label="To"]';
    const subjectSelector =
      'input[name="subjectbox"], input[aria-label="Subject"]';
    const bodySelector =
      'div[aria-label="Message Body"][contenteditable="true"][g_editable="true"]';

    const toField = document.querySelector(toSelector) as HTMLElement | null;
    const subjectField = document.querySelector(
      subjectSelector
    ) as HTMLElement | null;
    const bodyField = document.querySelector(
      bodySelector
    ) as HTMLElement | null;

    const inCompose =
      toField !== null || subjectField !== null || bodyField !== null;

    // Determine active field
    let active: GmailFieldType = "none";
    const activeElem = document.activeElement;

    if (activeElem === toField) active = "to";
    else if (activeElem === subjectField) active = "subject";
    else if (activeElem === bodyField) active = "body";

    // Capture body text
    const bodyText: string =
      bodyField instanceof HTMLElement ? bodyField.innerText ?? "" : "";

    // Attach input listener only once per new body field
    if (bodyField) {
      this.attachBodyListener(bodyField);
    }

    const newState: GmailDetectionState = {
      inCompose,
      activeField: active,
      bodyText,
      elements: {
        to: toField,
        subject: subjectField,
        body: bodyField,
      },
    };

    if (!this.statesEqual(this.lastState, newState)) {
      this.lastState = newState;
      this.callback(newState);
    }
  }

  private attachBodyListener(bodyElement: HTMLElement): void {
    // If listener already added → skip
    if (this.inputListener) return;

    this.inputListener = () => {
      this.evaluate(); // re-run detection on input
    };

    bodyElement.addEventListener("input", this.inputListener);
  }

  private statesEqual(
    a: GmailDetectionState | null,
    b: GmailDetectionState
  ): boolean {
    if (a === null) return false;
    return (
      a.inCompose === b.inCompose &&
      a.activeField === b.activeField &&
      a.bodyText === b.bodyText &&
      a.elements.to === b.elements.to &&
      a.elements.subject === b.elements.subject &&
      a.elements.body === b.elements.body
    );
  }

  public stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
