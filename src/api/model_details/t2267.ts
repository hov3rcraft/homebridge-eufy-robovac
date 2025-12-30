import { DeviceError } from "../device-errors";
import { Direction } from "../direction";
import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";
import { RobovacModelDetails } from "./robovac-model-details";

export class T2267RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, [
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      {
        command: RobovacCommand.RUNNING,
        code: 156,
        valueType: RobovacCommandValueType.BOOLEAN,
      },
      {
        command: RobovacCommand.DIRECTION,
        code: 155,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "forward": Direction.FORWARD,
          "left": Direction.LEFT,
          "right": Direction.RIGHT,
          "back": Direction.BACK,
          "brake": Direction.BRAKE,
        },
      },
      {
        command: RobovacCommand.WORK_STATUS,
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
      {
        command: RobovacCommand.RETURN_HOME,
        code: 173,
        valueType: RobovacCommandValueType.BOOLEAN,
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
        stringValues: {
          "no_error": DeviceError.NO_ERROR,
          "Stuck_5_min": DeviceError.STUCK_5_MIN,
          "Crash_bar_stuck": DeviceError.CRASH_BAR_STUCK,
          "sensor_dirty": DeviceError.SENSOR_DIRTY,
          "N_enough_pow": DeviceError.NOT_ENOUGH_POWER,
          "Wheel_stuck": DeviceError.WHEEL_STUCK,
          "S_brush_stuck": DeviceError.SIDE_BRUSH_STUCK,
          "Fan_stuck": DeviceError.FAN_STUCK,
          "R_brush_stuck": DeviceError.ROLLER_BRUSH_STUCK,
        },
      },
    ]);
  }
}
