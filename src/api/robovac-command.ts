/**
 * Supported Robovac commands with their friendly names as value.
 */
export enum RobovacCommand {
  DEFAULT = "Default Property (ignore)",
  RUNNING = "Running",
  WORK_STATUS = "Work Status",
  RETURN_HOME = "Return Home",
  FIND_ROBOT = "Find Robot",
  BATTERY_LEVEL = "Battery Level",
  ERROR = "Error",
}

export interface RobovacCommandSpec {
  code: number;
  valueType: RobovacCommandValueType;
  stringValues?: Record<string, string>;
}

export enum RobovacCommandValueType {
  BOOLEAN,
  NUMBER,
  STRING,
}
