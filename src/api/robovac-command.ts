/**
 * Supported Robovac commands with their friendly names as value.
 */
export enum RobovacCommand {
  DEFAULT = "Default Property (ignore)",
  RUNNING = "Running",
  DIRECTION = "Direction",
  WORK_MODE = "Work Mode",
  WORK_STATUS = "Work Status",
  RETURN_HOME = "Return Home",
  FAN_SPEED = "Fan Speed",
  FIND_ROBOT = "Find Robot",
  BATTERY_LEVEL = "Battery Level",
  ERROR = "Error",
  SPECIAL_COMMAND = "Special Command",
}

export interface RobovacCommandSpec {
  command: RobovacCommand;
  code: number;
  valueType: RobovacCommandValueType;
  stringValues?: Record<string, StringCommandValueMapping>;
}

export enum RobovacCommandValueType {
  BOOLEAN,
  NUMBER,
  STRING,
}

export interface StringCommandValueMapping {
  id: number;
  friendly_message: string;
}

export class CommandNotSupportedError extends Error {
  constructor(robovac_command: RobovacCommand, model_id?: string) {
    super(`Command ${robovac_command} is not supported for ${model_id ? `RoboVac model ${model_id}` : `this model`}.`); // Pass the message to the parent Error class
    this.name = "CommandNotSupportedError"; // Set the error name

    // Ensure the prototype chain is correctly set for instanceof checks
    Object.setPrototypeOf(this, CommandNotSupportedError.prototype);
  }
}

export class ValueNotSupportedError extends Error {
  constructor(value: boolean | number | StringCommandValueMapping | undefined, robovac_command: RobovacCommand, model_id?: string) {
    super(
      `Value ${typeof value === "object" ? value.friendly_message : JSON.stringify(value)} for command ${robovac_command} is not supported for ${
        model_id ? `RoboVac model ${model_id}` : `this model`
      }.`
    ); // Pass the message to the parent Error class
    this.name = "ValueNotSupportedError"; // Set the error name

    // Ensure the prototype chain is correctly set for instanceof checks
    Object.setPrototypeOf(this, ValueNotSupportedError.prototype);
  }
}
