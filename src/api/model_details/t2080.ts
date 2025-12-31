import { FanSpeed } from "../fan-speed";
import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
import { WorkMode } from "../work-mode";
import { WorkStatus } from "../work-status";
import { ROBOVAC_COMMAND_DEFAULTS } from "./default-robovac-model-details";
import { RobovacModelDetails } from "./robovac-model-details";

export class T2080RobovacModelDetails extends RobovacModelDetails {
  constructor(modelId: string, modelName: string) {
    super(modelId, modelName, [
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.DEFAULT],
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.RUNNING],
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.FIND_ROBOT],
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.BATTERY_LEVEL],
      ROBOVAC_COMMAND_DEFAULTS[RobovacCommand.ERROR],
      {
        command: RobovacCommand.WORK_MODE,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "BBoCCAE=": WorkMode.AUTO,
          "AggN": WorkMode.PAUSE,
          "AA==": WorkMode.SPOT,
          "AggG": WorkMode.RETURN_HOME,
          "AggO": WorkMode.NO_SWEEP,
          "AggB": WorkMode.VACUUM_AND_MOP,
        },
      },
      {
        command: RobovacCommand.WORK_STATUS,
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "CAoAEAUyAggB": WorkStatus.PAUSED,
          "CAoCCAEQBTIA": WorkStatus.ROOM_CLEANING,
          "CAoCCAEQBVIA": WorkStatus.ROOM_POSITIONING,
          "DAoCCAEQBTICEAFSAA==": WorkStatus.ROOM_POSITIONING,
          "CgoCCAEQBTICCAE=": WorkStatus.PAUSED,
          "BhAHQgBSAA==": WorkStatus.STANDBY,
          "BBAHQgA=": WorkStatus.RETURNING_HOME,
          "BBADGgA=": WorkStatus.CHARGING,
          "BhADGgIIAQ==": WorkStatus.CHARGING_COMPLETED,
          "AA==": WorkStatus.STANDBY,
          "AgoA": WorkStatus.RETURNING_HOME,
          "AhAB": WorkStatus.SLEEPING,
          "DAoCCAEQCRoCCAEyAA==": WorkStatus.ADDING_WATER,
          "DgoAEAkaAggBMgA6AhAB": WorkStatus.ADDING_WATER,
          "DAoAEAUaADICEAFSAA==": WorkStatus.ADDING_WATER,
          "BhAJOgIQAg==": WorkStatus.DRYING_MOP,
          "CBAJGgA6AhAC": WorkStatus.DRYING_MOP,
          "ChAJGgIIAToCEAI=": WorkStatus.DRYING_MOP,
          "DgoAEAUaAggBMgIQAVIA": WorkStatus.WASHING_MOP, // Maybe.. this occurred in amongst several "adding water"
          "EAoCCAEQCRoCCAEyADoCEAE=": WorkStatus.WASHING_MOP,
          "BhAJOgIQAQ==": WorkStatus.WASHING_MOP,
          "AhAJ": WorkStatus.REMOVING_WATER,
          "BhAGGgIIAQ==": WorkStatus.MANUAL_CONTROL, // Double check this
          // "BxAJGgD6AQA=": WorkStatus.EMPTYING_DUST, Not certain of this
          "BRAJ+gEA": WorkStatus.EMPTYING_DUST,
          "BgoAEAUyAA==": WorkStatus.AUTO_CLEANING,
          "CgoAEAkaAggBMgA=": WorkStatus.AUTO_CLEANING,
          "CgoAEAUyAhABUgA=": WorkStatus.AUTO_CLEANING,
          // "DAoCCAEQBzICCAFCAA==": WorkStatus.TEMPORARY_RETURN, # This occurred in between 'Room Cleaning' and 'Charge Mid-Clean', but I didn't see it happening. Maybe some variant of 'returning'..?
          "DAoCCAEQAxoAMgIIAQ==": WorkStatus.CHARGING, // charging mid-clean
          //"CgoAEAcyAggBQgA=": WorkStatus.TEMPORARY_RETURN,  # This was when mid-clean, it needed to return to base to get more water
          //"DAoCCAEQBzICCAFCAA==": WorkStatus.TEMPORARY_RETURN,  # This was when mid-clean, it needed to return to base to empty dust
          "DQoCCAEQCTICCAH6AQA=": WorkStatus.EMPTYING_DUST, // emptying dust mid-clean
          "CAoAEAIyAggB": WorkStatus.ERROR,
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
    ]);
  }
}
