import { StringCommandValueMapping } from "./robovac-command";

export const FanSpeed: Record<string, StringCommandValueMapping> = {
  STANDARD: {
    id: 0,
    friendly_message: "Standard",
  },
  BOOST_IQ: {
    id: 1,
    friendly_message: "Boost IQ",
  },
  NO_SUCTION: {
    id: 2,
    friendly_message: "No Suction",
  },
  MAX: {
    id: 3,
    friendly_message: "Max",
  },
  TURBO: {
    id: 4,
    friendly_message: "Max",
  },
  QUIET: {
    id: 5,
    friendly_message: "Max",
  },
};
