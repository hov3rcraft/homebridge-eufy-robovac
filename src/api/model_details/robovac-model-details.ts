import { RobovacCommand, RobovacCommandSpec } from "../robovac-command";

export abstract class RobovacModelDetails {
  readonly modelId: string;
  readonly modelName: string;
  private commandSpecsByCommand: Partial<Record<RobovacCommand, RobovacCommandSpec>>;
  private commandSpecsByCode: Partial<Record<number, RobovacCommandSpec>>;

  constructor(modelId: string, modelName: string, commands: RobovacCommandSpec[]) {
    this.modelId = modelId;
    this.modelName = modelName;

    this.commandSpecsByCommand = {};
    this.commandSpecsByCode = {};

    for (const originalCmd of commands) {
      // convert all keys to lowercase for case-insensitive matching
      const cmd: RobovacCommandSpec = {
        ...originalCmd,
        stringValues: originalCmd.stringValues ? Object.fromEntries(Object.entries(originalCmd.stringValues).map(([k, v]) => [k.toLowerCase(), v])) : undefined,
      };

      const existingByCommand = this.commandSpecsByCommand[cmd.command];
      if (existingByCommand) {
        throw new Error(
          `Duplicate RobovacCommand spec for command '${String(cmd.command)}' in model '${modelId}' (${modelName}). ` +
            `Existing code=${existingByCommand.code}, duplicate code=${cmd.code}`
        );
      }

      const existingByCode = this.commandSpecsByCode[cmd.code];
      if (existingByCode) {
        throw new Error(
          `Duplicate RobovacCommand spec for code ${cmd.code} in model '${modelId}' (${modelName}). ` +
            `Existing command='${String(existingByCode.command)}', duplicate command='${String(cmd.command)}'`
        );
      }

      this.commandSpecsByCommand[cmd.command] = cmd;
      this.commandSpecsByCode[cmd.code] = cmd;
    }
  }

  getCommandSpecByCommand(command: RobovacCommand): RobovacCommandSpec | undefined {
    return this.commandSpecsByCommand[command];
  }

  getCommandSpecByCode(code: number): RobovacCommandSpec | undefined {
    return this.commandSpecsByCode[code];
  }
}
