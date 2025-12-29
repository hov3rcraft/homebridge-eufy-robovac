import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { RobovacModelDetails } from "./robovac-model-details";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";

export class T2320RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, {
      [RobovacCommand.DEFAULT]: ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      [RobovacCommand.RUNNING]: ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.RUNNING],
      [RobovacCommand.WORK_STATUS]: {
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
      [RobovacCommand.RETURN_HOME]: {
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "return_home": "return_home",
        },
      },
      [RobovacCommand.FIND_ROBOT]: {
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "locate": "locate",
        },
      },
      [RobovacCommand.BATTERY_LEVEL]: {
        code: 172,
        valueType: RobovacCommandValueType.NUMBER,
      },
      [RobovacCommand.ERROR]: {
        code: 169,
        valueType: RobovacCommandValueType.STRING,
      },
    });
  }
}
