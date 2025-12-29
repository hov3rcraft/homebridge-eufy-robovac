import { RobovacCommand, RobovacCommandSpec } from "../robovac-command";
import { SUPPORTED_MODELS_BY_ID, SUPPORTED_ROBOVAC_MODELS } from "./supported-models";

export abstract class RobovacModelDetails {
  readonly modelId: string;
  readonly modelName: string;
  readonly commands: Partial<Record<RobovacCommand, RobovacCommandSpec>>;

  constructor(modelId: string, modelName: string, commands: Partial<Record<RobovacCommand, RobovacCommandSpec>>) {
    this.modelId = modelId;
    this.modelName = modelName;
    this.commands = commands;
  }
}

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
