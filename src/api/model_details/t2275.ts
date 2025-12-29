import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";
import { RobovacModelDetails } from "./robovac-model-details";

export class T2275RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, {
      [RobovacCommand.DEFAULT]: ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      [RobovacCommand.RUNNING]: {
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AA==": "small_room",
          "AggN": "pause",
          "AggG": "edge",
          "BBoCCAE=": "auto",
          "AggO": "nosweep",
        },
      },
      [RobovacCommand.WORK_STATUS]: {
        code: 173,
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
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AggB": "return",
        },
      },
      [RobovacCommand.FIND_ROBOT]: {
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AggC": "return",
        },
      },
      [RobovacCommand.BATTERY_LEVEL]: {
        code: 172,
        valueType: RobovacCommandValueType.NUMBER,
      },
      [RobovacCommand.ERROR]: {
        code: 169,
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
