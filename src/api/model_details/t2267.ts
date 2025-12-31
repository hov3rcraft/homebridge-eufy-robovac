import { DeviceError } from "../device-errors";
import { Direction } from "../direction";
import { FanSpeed } from "../fan-speed";
import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { WorkStatus } from "../work-status";
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
          "BgoAEAUyAA===": WorkStatus.UNKNOWN,
          "BgoAEAVSAA===": WorkStatus.UNKNOWN,
          "CAoAEAUyAggB": WorkStatus.UNKNOWN,
          "CAoCCAEQBTIA": WorkStatus.UNKNOWN,
          "CAoCCAEQBVIA": WorkStatus.UNKNOWN,
          "CgoCCAEQBTICCAE=": WorkStatus.UNKNOWN,
          "CAoCCAIQBTIA": WorkStatus.UNKNOWN,
          "CAoCCAIQBVIA": WorkStatus.UNKNOWN,
          "CgoCCAIQBTICCAE=": WorkStatus.UNKNOWN,
          "BAoAEAY=": WorkStatus.UNKNOWN,
          "BBAHQgA=": WorkStatus.UNKNOWN,
          "BBADGgA=": WorkStatus.UNKNOWN,
          "BhADGgIIAQ==": WorkStatus.UNKNOWN,
          "AA==": WorkStatus.UNKNOWN,
          "AhAB": WorkStatus.UNKNOWN,
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
          "boost_iq": FanSpeed.BOOST_IQ,
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
