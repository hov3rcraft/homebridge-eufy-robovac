import { StringCommandValueMapping } from "./robovac-command";

export const WorkStatus: Record<string, StringCommandValueMapping> = {
  UNKNOWN: {
    id: 0,
    friendly_message: "Unknown",
  },
  RUNNING: {
    id: 1,
    friendly_message: "Running",
  },
  PAUSED: {
    id: 2,
    friendly_message: "Paused",
  },
  STANDBY: {
    id: 3,
    friendly_message: "Standby",
  },
  SLEEPING: {
    id: 4,
    friendly_message: "Sleeping",
  },
  CHARGING: {
    id: 5,
    friendly_message: "Charging",
  },
  CHARGING_COMPLETED: {
    id: 6,
    friendly_message: "Charging completed",
  },
  RECHARGE_NEEDED: {
    id: 7,
    friendly_message: "Recharge needed",
  },
  ROOM_CLEANING: {
    id: 8,
    friendly_message: "Room cleaning",
  },
  ROOM_POSITIONING: {
    id: 9,
    friendly_message: "Room positioning",
  },
  RETURNING_HOME: {
    id: 10,
    friendly_message: "Returning home",
  },
  ADDING_WATER: {
    id: 11,
    friendly_message: "Adding water",
  },
  DRYING_MOP: {
    id: 12,
    friendly_message: "Drying mop",
  },
  WASHING_MOP: {
    id: 13,
    friendly_message: "Washing mop",
  },
  REMOVING_WATER: {
    id: 14,
    friendly_message: "Removing dirty water",
  },
  MANUAL_CONTROL: {
    id: 15,
    friendly_message: "Manual control",
  },
  EMPTYING_DUST: {
    id: 16,
    friendly_message: "Emptying dust",
  },
  AUTO_CLEANING: {
    id: 17,
    friendly_message: "Auto cleaning",
  },
  TEMPORARY_RETURN: {
    id: 18,
    friendly_message: "Temporary return",
  },
  SPOT_POSITIONING: {
    id: 19,
    friendly_message: "Spot positioning",
  },
  ERROR: {
    id: 99,
    friendly_message: "Error",
  },
};
