import { DeviceError } from "../device-errors";
import { Direction } from "../direction";
import { RobovacCommand, RobovacCommandSpec, RobovacCommandValueType } from "../robovac-command";
import { RobovacModelDetails } from "./robovac-model-details";

const ROBOVAC_COMMAND_DEFAULTS_ARRAY: RobovacCommandSpec[] = [
  {
    command: RobovacCommand.DEFAULT,
    code: 1,
    valueType: RobovacCommandValueType.BOOLEAN,
  },
  {
    command: RobovacCommand.RUNNING,
    code: 2,
    valueType: RobovacCommandValueType.BOOLEAN,
  },
  {
    command: RobovacCommand.DIRECTION,
    code: 3,
    valueType: RobovacCommandValueType.STRING,
    stringValues: {
      "forward": Direction.FORWARD,
      "left": Direction.LEFT,
      "right": Direction.RIGHT,
      "back": Direction.BACK,
    },
  },
  {
    command: RobovacCommand.WORK_STATUS,
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
  {
    command: RobovacCommand.RETURN_HOME,
    code: 101,
    valueType: RobovacCommandValueType.BOOLEAN,
  },
  {
    command: RobovacCommand.FIND_ROBOT,
    code: 103,
    valueType: RobovacCommandValueType.BOOLEAN,
  },
  {
    command: RobovacCommand.BATTERY_LEVEL,
    code: 104,
    valueType: RobovacCommandValueType.NUMBER,
  },
  {
    command: RobovacCommand.ERROR,
    code: 106,
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
];

export const ROBOVAC_COMMAND_DEFAULTS = Object.fromEntries(ROBOVAC_COMMAND_DEFAULTS_ARRAY.map((cmd) => [cmd.command, cmd])) as Record<
  RobovacCommand,
  RobovacCommandSpec
>;

export class DefaultRobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, ROBOVAC_COMMAND_DEFAULTS_ARRAY);
  }
}
