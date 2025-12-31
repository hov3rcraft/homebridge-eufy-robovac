import { StringCommandValueMapping } from "./robovac-command";

export const SpecialCommand: Record<string, StringCommandValueMapping> = {
  RETURN_HOME: {
    id: 0,
    friendly_message: "Return home",
  },
  FIND_ROBOT: {
    id: 1,
    friendly_message: "Find robot",
  },
};
