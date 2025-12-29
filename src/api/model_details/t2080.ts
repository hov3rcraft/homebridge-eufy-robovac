import { RobovacCommand, RobovacCommandValueType } from "../robovac-command";
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
        command: RobovacCommand.RETURN_HOME,
        code: 152,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "BBoCCAE=": "auto",
          "AggN": "pause",
          "AA==": "Spot",
          "AggG": "return",
          "AggO": "Nosweep",
          "AggB": "Vacuum and Mop",
        },
      },
      {
        command: RobovacCommand.WORK_STATUS,
        code: 153,
        valueType: RobovacCommandValueType.STRING,
        stringValues: {
          "CAoAEAUyAggB": "Paused",
          "CAoCCAEQBTIA": "Room Cleaning",
          "CAoCCAEQBVIA": "Room Positioning",
          "DAoCCAEQBTICEAFSAA==": "Room Positioning",
          "CgoCCAEQBTICCAE=": "Room Paused",
          "BhAHQgBSAA==": "Standby",
          "BBAHQgA=": "Heading Home",
          "BBADGgA=": "Charging",
          "BhADGgIIAQ==": "Completed",
          "AA==": "Standby",
          "AgoA": "Heading Home",
          "AhAB": "Sleeping",
          "DAoCCAEQCRoCCAEyAA==": "Adding Water",
          "DgoAEAkaAggBMgA6AhAB": "Adding Water",
          "DAoAEAUaADICEAFSAA==": "Adding Water",
          "BhAJOgIQAg==": "Drying Mop",
          "CBAJGgA6AhAC": "Drying Mop",
          "ChAJGgIIAToCEAI=": "Drying Mop",
          "DgoAEAUaAggBMgIQAVIA": "Washing Mop", // Maybe.. this occurred in amongst several "adding water"
          "EAoCCAEQCRoCCAEyADoCEAE=": "Washing Mop",
          "BhAJOgIQAQ==": "Washing Mop",
          "AhAJ": "Removing Dirty Water",
          "BhAGGgIIAQ==": "Manual Control", // Double check this
          // "BxAJGgD6AQA=": "Emptying Dust", Not certain of this
          "BRAJ+gEA": "Emptying Dust",
          "BgoAEAUyAA==": "Auto Cleaning",
          "CgoAEAkaAggBMgA=": "Auto Cleaning",
          "CgoAEAUyAhABUgA=": "Auto Cleaning",
          // "DAoCCAEQBzICCAFCAA==": "", # This occurred in between 'Room Cleaning' and 'Charge Mid-Clean', but I didn't see it happening. Maybe some variant of 'returning'..?
          "DAoCCAEQAxoAMgIIAQ==": "Charge Mid-Clean",
          //"CgoAEAcyAggBQgA=": "Temporary Return",  # This was when mid-clean, it needed to return to base to get more water
          //"DAoCCAEQBzICCAFCAA==": "Temporary Return",  # This was when mid-clean, it needed to return to base to empty dust
          "DQoCCAEQCTICCAH6AQA=": "Remove Dust Mid-Clean",
          "CAoAEAIyAggB": "Error",
        },
      },
    ]);
  }
}
