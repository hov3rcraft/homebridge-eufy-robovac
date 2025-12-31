import { FanSpeed } from "../fan-speed";
import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { WorkMode } from "../work-mode";
import { WorkStatus } from "../work-status";
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
          "BgoAEAUyAA===": WorkStatus.AUTO_CLEANING,
          "BgoAEAUyAA==": WorkStatus.AUTO_CLEANING,
          "BgoAEAVSAA===": WorkStatus.ROOM_POSITIONING,
          "BgoAEAVSAA==": WorkStatus.ROOM_POSITIONING,
          "CAoAEAUyAggB": WorkStatus.PAUSED,
          "AggB": WorkStatus.PAUSED,
          "CAoCCAEQBTIA": WorkStatus.ROOM_POSITIONING,
          "CAoCCAEQBVIA": WorkStatus.ROOM_POSITIONING,
          "CgoCCAEQBTICCAE=": WorkStatus.PAUSED,
          "CAoCCAIQBTIA": WorkStatus.SPOT_POSITIONING,
          "CAoCCAIQBVIA": WorkStatus.SPOT_POSITIONING,
          "CgoCCAIQBTICCAE=": WorkStatus.PAUSED,
          "BAoAEAY=": WorkStatus.MANUAL_CONTROL,
          "BBAHQgA=": WorkStatus.RETURNING_HOME,
          "BBADGgA=": WorkStatus.CHARGING,
          "BhADGgIIAQ==": WorkStatus.CHARGING_COMPLETED,
          "AA==": WorkStatus.STANDBY,
          "AhAB": WorkStatus.SLEEPING,
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
