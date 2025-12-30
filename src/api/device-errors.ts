import { StringCommandValueMapping } from "./robovac-command";

export const DeviceError: Record<string, StringCommandValueMapping> = {
  NO_ERROR: {
    id: 0,
    friendly_message: "No error",
  },
  STUCK_5_MIN: {
    id: 101,
    friendly_message: "The robovac is stuck for more than 5 minutes",
  },
  CRASH_BAR_STUCK: {
    id: 102,
    friendly_message: "The crash bar is stuck",
  },
  SENSOR_DIRTY: {
    id: 103,
    friendly_message: "A sensor is dirty",
  },
  NOT_ENOUGH_POWER: {
    id: 104,
    friendly_message: "The robovac does not have enough power",
  },
  WHEEL_STUCK: {
    id: 105,
    friendly_message: "A wheel is stuck",
  },
  S_BRUSH_STUCK: {
    id: 106,
    friendly_message: "The side brush is stuck",
  },
  R_BRUSH_STUCK: {
    id: 107,
    friendly_message: "The rolling brush is stuck",
  },
  FAN_STUCK: {
    id: 108,
    friendly_message: "The fan is stuck",
  },
};
