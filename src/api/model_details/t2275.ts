import { DeviceError } from "../device-errors";
import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { SpecialCommand } from "../special-command";
import { WorkMode } from "../work-mode";
import { WorkStatus } from "../work-status";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";
import { RobovacModelDetails } from "./robovac-model-details";

export class T2275RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, [
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      {
        command: RobovacCommand.WORK_MODE,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AA==": WorkMode.SMALL_ROOM,
          "AggN": WorkMode.PAUSE,
          "AggG": WorkMode.EDGE,
          "BBoCCAE=": WorkMode.AUTO,
          "AggO": WorkMode.NO_SWEEP,
        },
      },
      {
        command: RobovacCommand.WORK_STATUS,
        code: 173,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "running": WorkStatus.RUNNING,
          "paused": WorkStatus.PAUSED,
          "standby": WorkStatus.STANDBY,
          "sleeping": WorkStatus.SLEEPING,
          "charging": WorkStatus.CHARGING,
          "completed": WorkStatus.CHARGING_COMPLETED,
          "recharge": WorkStatus.RECHARGE_NEEDED,
        },
      },
      {
        command: RobovacCommand.SPECIAL_COMMAND,
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AggB": SpecialCommand.RETURN_HOME,
          "AggC": SpecialCommand.FIND_ROBOT,
        },
      },
      {
        command: RobovacCommand.BATTERY_LEVEL,
        code: 172,
        valueType: RobovacCommandValueType.NUMBER,
      },
      {
        command: RobovacCommand.ERROR,
        code: 169,
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
