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
}

export interface RobovacCommandSpec {
  command: RobovacCommand;
  code: number;
  valueType: RobovacCommandValueType;
  stringValues?: Record<string, StringCommandValueMapping | string>; // TODO remove the second string here
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
