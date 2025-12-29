import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";
import { RobovacModelDetails } from "./robovac-model-details";

export class T2267RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, {
      [RobovacCommand.DEFAULT]: ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      [RobovacCommand.RUNNING]: {
        code: 156,
        valueType: RobovacCommandValueType.BOOLEAN,
      },
      [RobovacCommand.WORK_STATUS]: {
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "BgoAEAUyAA===": "unknown",
          "BgoAEAVSAA===": "unknown",
          "CAoAEAUyAggB": "unknown",
          "CAoCCAEQBTIA": "unknown",
          "CAoCCAEQBVIA": "unknown",
          "CgoCCAEQBTICCAE=": "unknown",
          "CAoCCAIQBTIA": "unknown",
          "CAoCCAIQBVIA": "unknown",
          "CgoCCAIQBTICCAE=": "unknown",
          "BAoAEAY=": "unknown",
          "BBAHQgA=": "unknown",
          "BBADGgA=": "unknown",
          "BhADGgIIAQ==": "unknown",
          "AA==": "unknown",
          "AhAB": "unknown",
        },
      },
      [RobovacCommand.RETURN_HOME]: {
        code: 173,
        valueType: RobovacCommandValueType.BOOLEAN,
      },
      [RobovacCommand.FIND_ROBOT]: {
        code: 160,
        valueType: RobovacCommandValueType.BOOLEAN,
      },
      [RobovacCommand.BATTERY_LEVEL]: {
        code: 163,
        valueType: RobovacCommandValueType.NUMBER,
      },
      [RobovacCommand.ERROR]: {
        code: 177,
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
    });
  }
}
