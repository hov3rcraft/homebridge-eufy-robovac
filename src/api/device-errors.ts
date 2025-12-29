import { StringCommandValueMapping } from "./robovac-command";

export const DeviceError: Record<string, StringCommandValueMapping> = {
  NO_ERROR: {
    id: 1,
    friendly_message: "No error",
  },
  STUCK_5_MIN: {
    id: 2,
    friendly_message: "The robovac is stuck for more than 5 minutes",
  },
  CRASH_BAR_STUCK: {
    id: 3,
    friendly_message: "The crash bar is stuck",
  },
  SENSOR_DIRTY: {
    id: 4,
    friendly_message: "A sensor is dirty",
  },
  NOT_ENOUGH_POWER: {
    id: 5,
    friendly_message: "The robovac does not have enough power",
  },
  WHEEL_STUCK: {
    id: 6,
    friendly_message: "A wheel is stuck",
  },
  S_BRUSH_STUCK: {
    id: 7,
    friendly_message: "The side brush is stuck",
  },
  FAN_STUCK: {
    id: 8,
    friendly_message: "The fan is stuck",
  },
  R_BRUSH_STUCK: {
    id: 9,
    friendly_message: "The rolling brush is stuck",
  },
};
