import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { RobovacModelDetails } from "./robovac-model-details";

export const ROBOVAC_COMMAND_DEFAULTS = {
  [RobovacCommand.DEFAULT]: {
    code: 1,
    valueType: RobovacCommandValueType.BOOLEAN,
  },
  [RobovacCommand.RUNNING]: {
    code: 2,
    valueType: RobovacCommandValueType.BOOLEAN,
  },
  [RobovacCommand.WORK_STATUS]: {
    code: 15,
    valueType: RobovacCommandValueType.STRING,
    stringValues: {
      "running": "Running",
      "paused": "Paused",
      "standby": "Standby",
      "sleeping": "Sleeping",
      "charging": "Charging",
      "completed": "Charging completed",
      "recharge": "Recharge needed",
    },
  },
  [RobovacCommand.RETURN_HOME]: {
    code: 101,
    valueType: RobovacCommandValueType.BOOLEAN,
  },
  [RobovacCommand.FIND_ROBOT]: {
    code: 103,
    valueType: RobovacCommandValueType.BOOLEAN,
  },
  [RobovacCommand.BATTERY_LEVEL]: {
    code: 104,
    valueType: RobovacCommandValueType.NUMBER,
  },
  [RobovacCommand.ERROR]: {
    code: 106,
    valueType: RobovacCommandValueType.STRING,
    stringValues: {
      "no_error": "No Error",
      "Stuck_5_min": "Stuck (5 Minutes)",
      "Crash_bar_stuck": "Crash Bar Stuck",
      "sensor_dirty": "Sensor Dirty",
      "N_enough_pow": "Not Enough Power",
      "Wheel_stuck": "Wheel Stuck",
      "S_brush_stuck": "Brush Stuck",
      "Fan_stuck": "Fan Stuck",
      "R_brush_stuck": "Brush Stuck",
    },
  },
};

export class DefaultRobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, ROBOVAC_COMMAND_DEFAULTS);
  }
}
