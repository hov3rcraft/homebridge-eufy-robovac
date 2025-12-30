import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { RobovacModelDetails } from "./robovac-model-details";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";
import { WorkMode } from "../work-mode";
import { FanSpeed } from "../fan-speed";

export class T2320RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, [
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.RUNNING],
      {
        command: RobovacCommand.WORK_MODE,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "auto": WorkMode.AUTO,
          "return": WorkMode.RETURN_HOME,
          "pause": WorkMode.PAUSE,
          "small_room": WorkMode.SMALL_ROOM,
          "single_room": WorkMode.SINGLE_ROOM,
        },
      },
      {
        command: RobovacCommand.RETURN_HOME,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "return_home": "return_home",
        },
      },
      {
        command: RobovacCommand.FIND_ROBOT,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "locate": "locate",
        },
      },
      {
        command: RobovacCommand.FAN_SPEED,
        code: 154,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "Quiet": FanSpeed.QUIET,
          "standard": FanSpeed.STANDARD,
          "boost_iq": FanSpeed.BOOST_IQ,
          "max": FanSpeed.MAX,
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
      },
    ]);
  }
}
