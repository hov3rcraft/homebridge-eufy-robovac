import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { RobovacModelDetails } from "./robovac-model-details";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";

export class T2320RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, [
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.RUNNING],
      {
        command: RobovacCommand.WORK_STATUS,
        code: 173,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "auto": "auto",
          "return": "return",
          "pause": "pause",
          "small_room": "small room",
          "single_room": "single room",
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
