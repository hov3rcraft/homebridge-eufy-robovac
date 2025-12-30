import { FanSpeed } from "../fan-speed";
import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { WorkMode } from "../work-mode";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";
import { RobovacModelDetails } from "./robovac-model-details";

export class T2277RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, [
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      {
        command: RobovacCommand.WORK_MODE,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AA==": WorkMode.STANDBY,
          "AggN": WorkMode.PAUSE,
          "AggG": WorkMode.RETURN_HOME,
          "BBoCCAE=": WorkMode.AUTO,
          "AggO": WorkMode.NO_SWEEP,
        },
      },
      {
        command: RobovacCommand.WORK_STATUS,
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "BgoAEAUyAA===": "auto",
          "BgoAEAUyAA==": "auto",
          "BgoAEAVSAA===": "positioning",
          "BgoAEAVSAA==": "positioning",
          "CAoAEAUyAggB": "Paused",
          "AggB": "Paused",
          "CAoCCAEQBTIA": "room",
          "CAoCCAEQBVIA": "room_positioning",
          "CgoCCAEQBTICCAE=": "room_pause",
          "CAoCCAIQBTIA": "spot",
          "CAoCCAIQBVIA": "spot_positioning",
          "CgoCCAIQBTICCAE=": "spot_pause",
          "BAoAEAY=": "start_manual",
          "BBAHQgA=": "going_to_charge",
          "BBADGgA=": "Charging",
          "BhADGgIIAQ==": "completed",
          "AA==": "Standby",
          "AhAB": "Sleeping",
        },
      },
      {
        command: RobovacCommand.FAN_SPEED,
        code: 158,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "quiet": FanSpeed.QUIET,
          "standard": FanSpeed.STANDARD,
          "turbo": FanSpeed.TURBO,
          "max": FanSpeed.MAX,
        },
      },
      {
        command: RobovacCommand.FIND_ROBOT,
        code: 160,
        valueType: RobovacCommandValueType.BOOLEAN,
      },
      {
        command: RobovacCommand.BATTERY_LEVEL,
        code: 163,
        valueType: RobovacCommandValueType.NUMBER,
      },
      {
        command: RobovacCommand.ERROR,
        code: 177,
        valueType: RobovacCommandValueType.STRING,
      },
    ]);
  }
}
