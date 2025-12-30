import { StringCommandValueMapping } from "./robovac-command";

export const WorkMode: Record<string, StringCommandValueMapping> = {
  UNKNOWN: {
    id: 0,
    friendly_message: "unknown",
  },
  AUTO: {
    id: 1,
    friendly_message: "auto",
  },
  SMALL_ROOM: {
    id: 2,
    friendly_message: "small room",
  },
  SPOT: {
    id: 3,
    friendly_message: "spot",
  },
  EDGE: {
    id: 4,
    friendly_message: "edge",
  },
  NO_SWEEP: {
    id: 5,
    friendly_message: "no sweep",
  },
  PAUSE: {
    id: 6,
    friendly_message: "pause",
  },
  RETURN_HOME: {
    id: 7,
    friendly_message: "return home",
  },
  VACUUM_AND_MOP: {
    id: 8,
    friendly_message: "vacuum and mop",
  },
  STANDBY: {
    id: 9,
    friendly_message: "standby",
  },
  SINGLE_ROOM: {
    id: 10,
    friendly_message: "single room",
  },
};
