import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";
import { RobovacModelDetails } from "./robovac-model-details";

export class T2277RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, [
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      {
        command: RobovacCommand.RUNNING,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AA==": "standby",
          "AggN": "pause",
          "AggG": "return",
          "BBoCCAE=": "auto",
          "AggO": "nosweep",
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
        command: RobovacCommand.RETURN_HOME,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "AggG": "return",
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
