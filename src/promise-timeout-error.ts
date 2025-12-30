export class PromiseTimeoutError extends Error {
  constructor(timeoutSeconds?: number) {
    super(timeoutSeconds ? `Promise timed out after ${timeoutSeconds}ms.` : `Promise timed out`); // Pass the message to the parent Error class
    this.name = "PromiseTimeoutError"; // Set the error name

    // Ensure the prototype chain is correctly set for instanceof checks
    Object.setPrototypeOf(this, PromiseTimeoutError.prototype);
  }
}
