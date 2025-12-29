export class PromiseTimeoutException extends Error {
  public expectedResponse?: string;
  public actualResponse?: string;

  constructor(timeoutSeconds?: number) {
    super(timeoutSeconds ? `Promise timed out after ${timeoutSeconds}ms.` : `Promise timed out`); // Pass the message to the parent Error class
    this.name = "PromiseTimeoutException"; // Set the error name

    // Ensure the prototype chain is correctly set for instanceof checks
    Object.setPrototypeOf(this, PromiseTimeoutException.prototype);
  }
}
