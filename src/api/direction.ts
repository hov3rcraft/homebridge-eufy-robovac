import { StringCommandValueMapping } from "./robovac-command";

export const Direction: Record<string, StringCommandValueMapping> = {
  FORWARD: {
    id: 0,
    friendly_message: "forwards",
  },
  LEFT: {
    id: 1,
    friendly_message: "left",
  },
  RIGHT: {
    id: 2,
    friendly_message: "right",
  },
  BACK: {
    id: 3,
    friendly_message: "backwards",
  },
  BRAKE: {
    id: 4,
    friendly_message: "brake",
  },
};
