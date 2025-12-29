import { RobovacCommand, RobovacCommandSpec } from "../robovac-command";

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
