export type GmailFieldType = "to" | "subject" | "body" | "none";

export interface GmailDetectionState {
  inCompose: boolean;
  activeField: GmailFieldType;
  bodyText: string;
  caretText: string;
  elements: {
    to: HTMLElement | null;
    subject: HTMLElement | null;
    body: HTMLElement | null;
  };
}

export class GmailComposeDetector {
  private observer: MutationObserver | null = null;
  private inputListener: ((e: Event) => void) | null = null;
  private keyListener: ((e: KeyboardEvent) => void) | null = null;
  private lastState: GmailDetectionState | null = null;

  constructor(
    private callback: (state: GmailDetectionState) => void,
    private onKeyEvent: (key: string) => void
  ) {}

  public start(): void {
    this.observer = new MutationObserver(() => this.evaluate());
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.evaluate();
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

    const inCompose = Boolean(toField || subjectField || bodyField);

    let active: GmailFieldType = "none";
    const activeElem = document.activeElement;

    if (activeElem === toField) active = "to";
    else if (activeElem === subjectField) active = "subject";
    else if (activeElem === bodyField) active = "body";

    const bodyText =
      bodyField instanceof HTMLElement ? bodyField.innerText ?? "" : "";

    // Track caret word for popup window
    const caretText = this.getCaretWord(bodyField);

    if (bodyField) {
      this.attachBodyListeners(bodyField);
    }

    const newState: GmailDetectionState = {
      inCompose,
      activeField: active,
      bodyText,
      caretText,
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

  private getCaretWord(body: HTMLElement | null): string {
    if (!body) return "";

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return "";

    const range = sel.getRangeAt(0);
    const textBeforeCaret = range.startContainer.textContent ?? "";

    const partial = textBeforeCaret
      .slice(0, range.startOffset)
      .split(/\s+/)
      .pop();

    return partial ?? "";
  }

  private attachBodyListeners(bodyElement: HTMLElement): void {
    if (!this.inputListener) {
      this.inputListener = () => this.evaluate();
      bodyElement.addEventListener("input", this.inputListener);
    }

    if (!this.keyListener) {
      this.keyListener = (e: KeyboardEvent) => {
        this.onKeyEvent(e.key);
      };
      bodyElement.addEventListener("keydown", this.keyListener);
    }
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
      a.caretText === b.caretText &&
      a.elements.to === b.elements.to &&
      a.elements.subject === b.elements.subject &&
      a.elements.body === b.elements.body
    );
  }

  public stop(): void {
    if (this.observer) this.observer.disconnect();
  }
}
