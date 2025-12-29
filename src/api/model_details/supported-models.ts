import { DefaultRobovacModelDetails } from "./default-robovac-model-details";
import { RobovacModelDetails } from "./robovac-model-details";
import { T2080RobovacModelDetails } from "./t2080";
import { T2267RobovacModelDetails } from "./t2267";
import { T2275RobovacModelDetails } from "./t2275";
import { T2276RobovacModelDetails } from "./t2276";
import { T2277RobovacModelDetails } from "./t2277";
import { T2278RobovacModelDetails } from "./t2278";
import { T2280RobovacModelDetails } from "./t2280";

export interface SupportedRobovacModel {
  modelId: string;
  modelName: string;
  modelDetailsClass: new (modelId: string, modelName: string) => RobovacModelDetails;
}

/**
 * Register supported models here.
 *
 * Based on: https://github.com/damacus/robovac/tree/main/custom_components/robovac/vacuums
 *
 */

export const SUPPORTED_ROBOVAC_MODELS: ReadonlyArray<SupportedRobovacModel> = [
  {
    modelId: "T2080",
    modelName: "RoboVac S1 Pro",
    modelDetailsClass: T2080RobovacModelDetails,
  },
  {
    modelId: "T2103",
    modelName: "RoboVac 11C",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2117",
    modelName: "RoboVac 35C",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2118",
    modelName: "RoboVac 30C",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2119",
    modelName: "RoboVac 11S Plus",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2120",
    modelName: "RoboVac 15C",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2123",
    modelName: "RoboVac 25C",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2128",
    modelName: "RoboVac 15C MAX",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2130",
    modelName: "RoboVac 30C MAX",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2132",
    modelName: "RoboVac 25C MAX",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2150",
    modelName: "RoboVac G10 Hybrid",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2181",
    modelName: "RoboVac LR30 Hybrid+",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2190",
    modelName: "RoboVac L70 Hybrid",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2192",
    modelName: "RoboVac L35 Hybrid+",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2193",
    modelName: "RoboVac LR30 Hybrid",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2194",
    modelName: "RoboVac L35 Hybrid",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2250",
    modelName: "RoboVac G30",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2251",
    modelName: "RoboVac G30 Edge",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2252",
    modelName: "RoboVac G30 Verge",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2253",
    modelName: "RoboVac G30 Hybrid",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2254",
    modelName: "RoboVac G35",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2255",
    modelName: "RoboVac G40",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2259",
    modelName: "RoboVac G32 Pro",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2261",
    modelName: "RoboVac X8 Hybrid",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2262",
    modelName: "RoboVac X8",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
  {
    modelId: "T2267",
    modelName: "RoboVac L60",
    modelDetailsClass: T2267RobovacModelDetails,
  },
  {
    modelId: "T2268",
    modelName: "RoboVac L60 Hybrid",
    modelDetailsClass: T2267RobovacModelDetails,
  },
  {
    modelId: "T2270",
    modelName: "RoboVac G35+",
    modelDetailsClass: T2267RobovacModelDetails,
  },
  {
    modelId: "T2272",
    modelName: "RoboVac G40+",
    modelDetailsClass: T2267RobovacModelDetails,
  },
  {
    modelId: "T2273",
    modelName: "RoboVac G40 Hybrid+",
    modelDetailsClass: T2267RobovacModelDetails,
  },
  {
    modelId: "T2275",
    modelName: "RoboVac L50 SES",
    modelDetailsClass: T2275RobovacModelDetails,
  },
  {
    modelId: "T2275",
    modelName: "RoboVac X8 Pro SES",
    modelDetailsClass: T2276RobovacModelDetails,
  },
  {
    modelId: "T2277",
    modelName: "RoboVac L60 SES",
    modelDetailsClass: T2277RobovacModelDetails,
  },
  {
    modelId: "T2278",
    modelName: "RoboVac L60 Hybrid SES",
    modelDetailsClass: T2278RobovacModelDetails,
  },
  {
    modelId: "T2280",
    modelName: "RoboVac C20 Hybrid SES",
    modelDetailsClass: T2280RobovacModelDetails,
  },
  {
    modelId: "T0000",
    modelName: "default",
    modelDetailsClass: DefaultRobovacModelDetails,
  },
];

/**
 * Fast lookup map from modelId -> supported model entry.
 */
export const SUPPORTED_MODELS_BY_ID: ReadonlyMap<string, SupportedRobovacModel> = new Map(SUPPORTED_ROBOVAC_MODELS.map((m) => [m.modelId, m]));

/**
 * Create the correct RobovacModelDetails instance from just a modelId.
 */
export function createModelDetailsFromModelId(modelId: string): RobovacModelDetails {
  const entry = SUPPORTED_MODELS_BY_ID.get(modelId);
  if (!entry) {
    throw new Error(`Unsupported Robovac modelId '${modelId}'. Supported modelIds: ${Array.from(SUPPORTED_MODELS_BY_ID.keys()).join(", ")}`);
  }

  return new entry.modelDetailsClass(entry.modelId, entry.modelName);
}

/**
 * Generate config.schema.json model enum entries
 *
 * [...SUPPORTED_ROBOVAC_MODELS]
 *  .sort((a, b) => a.modelName.localeCompare(b.modelName))
 *  .forEach((model) => {
 *    console.log(`{ "title": "${model.modelName} (${model.modelId})", "enum": ["${model.modelId}"] },`);
 * });
 */
