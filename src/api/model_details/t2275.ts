import { DeviceError } from "../device-errors";
import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { WorkMode } from "../work-mode";
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
          "running": "Running",
          "paused": "Paused",
          "standby": "Standby",
          "sleeping": "Sleeping",
          "charging": "Charging",
          "completed": "Charging completed",
          "recharge": "Recharge needed",
        },
      },
      {
        command: RobovacCommand.RETURN_HOME,
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AggB": "return",
        },
      },
      {
        command: RobovacCommand.FIND_ROBOT,
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AggC": "locate",
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
