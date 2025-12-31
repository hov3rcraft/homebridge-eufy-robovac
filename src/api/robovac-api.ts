import { ConsoleLogger, Logger } from "../console-logger";

import TuyAPI from "tuyapi";
import { RobovacModelDetails } from "./model_details/robovac-model-details";
import { createModelDetailsFromModelId } from "./model_details/supported-models";
import { RobovacCommand, RobovacCommandValueType, StringCommandValueMapping, ValueNotSupportedError } from "./robovac-command";
import { RaceStatus } from "../race-status";

interface RobovacResponse {
  devId: string;
  dps: Record<string, any>;
}

export type RobovacStatus = Record<RobovacCommand, boolean | number | StringCommandValueMapping | undefined>;
export class RoboVac {
  api: TuyAPI;
  directConnect: boolean;
  lastResponse: RobovacResponse;
  lastStatus: RobovacStatus;
  lastStatusUpdate: Date;
  lastStatusValid: boolean;
  modelDetails: RobovacModelDetails;
  cachingDuration: number;
  ongoingStatusUpdate: Promise<RobovacStatus> | undefined;
  log: Logger;
  consoleDebugLog: boolean;

  dataReceivedCallback?: (status: RobovacStatus) => void;
  runningUpdateCallback?: (running: boolean) => void;
  directionUpdateCallback?: (direction: StringCommandValueMapping) => void;
  workModeUpdateCallback?: (direction: StringCommandValueMapping) => void;
  workStatusUpdateCallback?: (workStatus: StringCommandValueMapping) => void;
  returnHomeUpdateCallback?: (returnHome: boolean) => void;
  fanSpeedUpdateCallback?: (direction: StringCommandValueMapping) => void;
  findRobotUpdateCallback?: (findRobot: boolean) => void;
  batteryLevelUpdateCallback?: (batteryLevel: number) => void;
  errorCodeUpdateCallback?: (errorCode: StringCommandValueMapping) => void;

  constructor(
    config: { deviceId: string; localKey: string; deviceIp: string },
    model: string,
    cachingDuration: number,
    log: Logger = new ConsoleLogger(),
    runningUpdateCallback?: (running: boolean) => void,
    directionUpdateCallback?: (direction: StringCommandValueMapping) => void,
    workModeUpdateCallback?: (direction: StringCommandValueMapping) => void,
    workStatusUpdateCallback?: (workStatus: StringCommandValueMapping) => void,
    returnHomeUpdateCallback?: (returnHome: boolean) => void,
    fanSpeedUpdateCallback?: (direction: StringCommandValueMapping) => void,
    findRobotUpdateCallback?: (findRobot: boolean) => void,
    batteryLevelUpdateCallback?: (batteryLevel: number) => void,
    errorCodeUpdateCallback?: (errorCode: StringCommandValueMapping) => void,
    dataReceivedCallback?: (status: RobovacStatus) => void
  ) {
    this.log = log;
    if (log instanceof ConsoleLogger) {
      this.consoleDebugLog = (log as ConsoleLogger).logLevel <= 1;
    } else {
      this.consoleDebugLog = false;
    }

    this.runningUpdateCallback = runningUpdateCallback;
    this.directionUpdateCallback = directionUpdateCallback;
    this.workModeUpdateCallback = workModeUpdateCallback;
    this.workStatusUpdateCallback = workStatusUpdateCallback;
    this.returnHomeUpdateCallback = returnHomeUpdateCallback;
    this.fanSpeedUpdateCallback = fanSpeedUpdateCallback;
    this.findRobotUpdateCallback = findRobotUpdateCallback;
    this.batteryLevelUpdateCallback = batteryLevelUpdateCallback;
    this.errorCodeUpdateCallback = errorCodeUpdateCallback;
    this.dataReceivedCallback = dataReceivedCallback;

    this.modelDetails = createModelDetailsFromModelId(model);
    this.cachingDuration = cachingDuration;
    this.directConnect = config.deviceIp !== null && config.deviceIp !== undefined && config.deviceIp !== "";

    this.api = new TuyAPI({
      id: config.deviceId,
      key: config.localKey,
      ip: this.directConnect ? config.deviceIp : undefined,
      version: "3.3",
      issueRefreshOnConnect: true,
    });

    // Add event listeners
    this.api.on("connected", () => {
      log.info("Connected to device!");
    });

    this.api.on("disconnected", () => {
      log.info("Disconnected from device.");
    });

    this.api.on("error", (error: any) => {
      log.error("Error!", error);
      this.disconnect();
    });

    this.api.on("dp-refresh", (data: any) => {
      try {
        this.log.debug("Received dps refresh data from device:", "\n" + this.formatRobovacStatus(data));
      } catch {
        this.log.debug("Received dps refresh data from device:", data);
      }

      if (data.dps) {
        this.dataReceived(data);
        if (this.dataReceivedCallback) {
          this.dataReceivedCallback(data);
        }
      }
    });

    this.api.on("data", (data: any) => {
      try {
        this.log.debug("Received data from device:", "\n" + this.formatRobovacStatus(data));
      } catch {
        this.log.debug("Received data from device:", data);
      }

      if (data.dps) {
        this.dataReceived(data);
        if (this.dataReceivedCallback) {
          this.dataReceivedCallback(data);
          this.lastStatusUpdate = new Date();
          this.lastStatusValid = true;
        }
      }
    });

    // init with default values
    this.lastResponse = {
      devId: "default - invalid",
      dps: {},
    };
    this.lastStatus = {
      [RobovacCommand.DEFAULT]: undefined,
      [RobovacCommand.RUNNING]: undefined,
      [RobovacCommand.DIRECTION]: undefined,
      [RobovacCommand.WORK_MODE]: undefined,
      [RobovacCommand.WORK_STATUS]: undefined,
      [RobovacCommand.RETURN_HOME]: undefined,
      [RobovacCommand.FAN_SPEED]: undefined,
      [RobovacCommand.FIND_ROBOT]: undefined,
      [RobovacCommand.BATTERY_LEVEL]: undefined,
      [RobovacCommand.ERROR]: undefined,
      [RobovacCommand.SPECIAL_COMMAND]: undefined,
    };
    this.lastStatusUpdate = new Date(0);
    this.lastStatusValid = false;
    this.ongoingStatusUpdate = undefined;

    this.connect().catch((e) => {
      this.log.error("Error during initial connect:", e);
    });
  }

  private dataReceived(data: any) {
    this.lastResponse = data;
    for (const [dps_code, dps_value] of Object.entries(this.lastResponse.dps)) {
      const commandSpec = this.modelDetails.getCommandSpecByCode(Number(dps_code));
      if (commandSpec) {
        switch (commandSpec.valueType) {
          case RobovacCommandValueType.BOOLEAN:
            if (typeof dps_value !== "boolean") {
              this.log.warn(`Received unexpected BOOLEAN value for command ${commandSpec.command}:`, dps_value);
            }
            this.lastStatus[commandSpec.command] = dps_value;
            break;
          case RobovacCommandValueType.NUMBER:
            if (typeof dps_value !== "number") {
              this.log.warn(`Received unexpected NUMBER value for command ${commandSpec.command}:`, dps_value);
            }
            this.lastStatus[commandSpec.command] = dps_value;
            break;
          case RobovacCommandValueType.STRING:
            if (typeof dps_value !== "string") {
              this.log.warn(`Received unexpected STRING value for command ${commandSpec.command}:`, dps_value);
            }
            if (commandSpec.stringValues) {
              this.lastStatus[commandSpec.command] = commandSpec.stringValues[dps_value.toLowerCase()] ?? dps_value;
            } else {
              this.lastStatus[commandSpec.command] = dps_value;
            }
        }
      }
    }
  }

  async connect(): Promise<void> {
    if (!this.directConnect) {
      // Find device on network if there is no ip specified in config
      await this.api.find();
    }

    // Connect to device
    await this.api.connect();
  }

  async disconnect() {
    this.ongoingStatusUpdate = undefined;
    this.lastStatusValid = false;
    if (this.api.isConnected()) {
      await this.api.disconnect();
    }
  }

  private getStatusCached(): RobovacStatus | undefined {
    return this.lastStatusValid ? this.lastStatus : undefined;
  }

  private async getStatus(): Promise<RobovacStatus> {
    if (!this.lastStatusValid || Math.abs(new Date().getTime() - this.lastStatusUpdate.getTime()) > this.cachingDuration) {
      return this.getStatusFromDeviceSynchronized();
    } else {
      this.log.debug("Status request within max status update age");
      return this.lastStatus;
    }
  }

  private async getStatusFromDeviceSynchronized(): Promise<RobovacStatus> {
    if (this.ongoingStatusUpdate !== undefined) {
      this.log.debug("Duplicate status update request detected");
      return this.ongoingStatusUpdate;
    }

    this.ongoingStatusUpdate = this.getStatusFromDevice();
    return this.ongoingStatusUpdate;
  }

  private async getStatusFromDevice(): Promise<RobovacStatus> {
    this.log.info("Fetching status update...");
    try {
      if (!this.api.isConnected()) {
        await this.connect();
      }

      const schema = await this.api.get({ schema: true });
      this.dataReceived(schema as RobovacResponse);
      this.lastStatusUpdate = new Date();
      this.lastStatusValid = true;
      this.ongoingStatusUpdate = undefined;
      this.log.debug("Status update retrieved.");
      return this.lastStatus;
    } catch (e) {
      this.log.error("An error occurred (during GET status update)!", e);
      try {
        this.disconnect();
      } catch {}
      throw e;
    }
  }

  private formatRobovacStatus(statusResponse: RobovacResponse): string {
    let formattedStatus = `=== Status Start ===\n`;
    let first = true;
    const unknowns: [string, any][] = [];

    for (const [dps_code, dps_value] of Object.entries(statusResponse.dps)) {
      const commandSpec = this.modelDetails.getCommandSpecByCode(Number(dps_code));
      if (!commandSpec) {
        unknowns.push([dps_code, dps_value]);
        continue;
      }

      let friendlyValue: string | undefined = undefined;
      if (commandSpec.valueType === RobovacCommandValueType.STRING && commandSpec.stringValues) {
        const fv = commandSpec.stringValues[dps_value.toLowerCase()];
        if (fv === undefined) {
          unknowns.push([dps_code, dps_value]);
          continue;
        } else {
          friendlyValue = fv.friendly_message;
        }
      }

      if (first) {
        formattedStatus += `--- Known Codes ---\n`;
        first = false;
      }
      formattedStatus += `- ${commandSpec.command}: ${friendlyValue ?? JSON.stringify(dps_value)}\n`;
    }

    if (unknowns.length > 0) {
      formattedStatus += `--- Unknown Codes ---\n`;
      for (const [dps_code, dps_value] of unknowns) {
        formattedStatus += `- ${JSON.stringify(dps_code)}: ${JSON.stringify(dps_value)}\n`;
      }
    }

    formattedStatus += `=== Status End ===`;
    return formattedStatus;
  }

  private async set(command: RobovacCommand, newValue: string | number | boolean) {
    this.log.debug("Setting", command, "to", newValue, "...");

    const commandSpec = this.modelDetails.getCommandSpecByCommand(command);
    if (!commandSpec) {
      throw new Error(`Robovac command ${command} is not supported by model ${this.modelDetails.modelId}`);
    }

    switch (commandSpec.valueType) {
      case RobovacCommandValueType.BOOLEAN:
        if (typeof newValue !== "boolean") {
          throw new Error(`Invalid value type for command ${commandSpec.command}: expected BOOLEAN, got ${typeof newValue}`);
        }
        break;
      case RobovacCommandValueType.NUMBER:
        if (typeof newValue !== "number") {
          throw new Error(`Invalid value type for command ${commandSpec.command}: expected NUMBER, got ${typeof newValue}`);
        }
        break;
      case RobovacCommandValueType.STRING:
        if (typeof newValue !== "string") {
          throw new Error(`Invalid value type for command ${commandSpec.command}: expected STRING, got ${typeof newValue}`);
        }
        break;
    }

    try {
      if (!this.api.isConnected()) {
        await this.connect();
      }

      await this.api.set({ dps: commandSpec.code, set: newValue });
      this.log.info("Setting", commandSpec.command, "to", newValue, "successful.");
    } catch (e) {
      this.log.error("An error occurred! (during SET of", commandSpec.command, "to", newValue, "): ", e);
      try {
        this.disconnect();
      } catch {}
      throw e;
    }
  }

  async getRunning(raceStatus?: RaceStatus): Promise<boolean | undefined> {
    const robovac_status = await this.getStatus();
    const running = <boolean | undefined>robovac_status[RobovacCommand.RUNNING];
    if (raceStatus && !raceStatus.isRunning() && this.runningUpdateCallback && running) {
      this.runningUpdateCallback(running);
      this.log.info(`getRunning was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return running;
  }

  async getDirection(raceStatus?: RaceStatus): Promise<StringCommandValueMapping | undefined> {
    const robovac_status = await this.getStatus();
    const direction = <StringCommandValueMapping | undefined>robovac_status[RobovacCommand.DIRECTION];
    if (raceStatus && !raceStatus.isRunning() && this.directionUpdateCallback && direction) {
      this.directionUpdateCallback(direction);
      this.log.info(`getDirection was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return direction;
  }

  async getWorkMode(raceStatus?: RaceStatus): Promise<StringCommandValueMapping | undefined> {
    const robovac_status = await this.getStatus();
    const work_mode = <StringCommandValueMapping | undefined>robovac_status[RobovacCommand.WORK_MODE];
    if (raceStatus && !raceStatus.isRunning() && this.workModeUpdateCallback && work_mode) {
      this.workModeUpdateCallback(work_mode);
      this.log.info(`getWorkMode was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return work_mode;
  }

  async getWorkStatus(raceStatus?: RaceStatus): Promise<StringCommandValueMapping | undefined> {
    const robovac_status = await this.getStatus();
    const work_status = <StringCommandValueMapping | undefined>robovac_status[RobovacCommand.WORK_STATUS];
    if (raceStatus && !raceStatus.isRunning() && this.workStatusUpdateCallback && work_status) {
      this.workStatusUpdateCallback(work_status);
      this.log.info(`getWorkStatus was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return work_status;
  }

  async getReturnHome(raceStatus?: RaceStatus): Promise<boolean | undefined> {
    const robovac_status = await this.getStatus();
    const return_home = <boolean | undefined>robovac_status[RobovacCommand.RETURN_HOME];
    if (raceStatus && !raceStatus.isRunning() && this.returnHomeUpdateCallback && return_home) {
      this.returnHomeUpdateCallback(return_home);
      this.log.info(`getReturnHome was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return return_home;
  }

  async getFanSpeed(raceStatus?: RaceStatus): Promise<StringCommandValueMapping | undefined> {
    const robovac_status = await this.getStatus();
    const fan_speed = <StringCommandValueMapping | undefined>robovac_status[RobovacCommand.FAN_SPEED];
    if (raceStatus && !raceStatus.isRunning() && this.fanSpeedUpdateCallback && fan_speed) {
      this.fanSpeedUpdateCallback(fan_speed);
      this.log.info(`getFanSpeed was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return fan_speed;
  }

  async getFindRobot(raceStatus?: RaceStatus): Promise<boolean | undefined> {
    const robovac_status = await this.getStatus();
    const find_robot = <boolean | undefined>robovac_status[RobovacCommand.FIND_ROBOT];
    if (raceStatus && !raceStatus.isRunning() && this.findRobotUpdateCallback && find_robot) {
      this.findRobotUpdateCallback(find_robot);
      this.log.info(`getRunning was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return find_robot;
  }

  async getBatteryLevel(raceStatus?: RaceStatus): Promise<number | undefined> {
    const robovac_status = await this.getStatus();
    const battery_level = <number | undefined>robovac_status[RobovacCommand.BATTERY_LEVEL];
    if (raceStatus && !raceStatus.isRunning() && this.batteryLevelUpdateCallback && battery_level) {
      this.batteryLevelUpdateCallback(battery_level);
      this.log.info(`getRunning was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return battery_level;
  }

  async getErrorCode(raceStatus?: RaceStatus): Promise<StringCommandValueMapping | undefined> {
    const robovac_status = await this.getStatus();
    const error_code = <StringCommandValueMapping | undefined>robovac_status[RobovacCommand.ERROR];
    if (raceStatus && !raceStatus.isRunning() && this.errorCodeUpdateCallback && error_code) {
      this.errorCodeUpdateCallback(error_code);
      this.log.info(`getRunning was late to the party [race id: ${raceStatus.raceId}].`);
    }
    return error_code;
  }

  getRunningCached(): boolean | undefined {
    return this.lastStatusValid ? (this.lastStatus[RobovacCommand.RUNNING] as boolean | undefined) : undefined;
  }

  getDirectionCached(): StringCommandValueMapping | undefined {
    return this.lastStatusValid ? (this.lastStatus[RobovacCommand.DIRECTION] as StringCommandValueMapping | undefined) : undefined;
  }

  getWorkModeCached(): StringCommandValueMapping | undefined {
    return this.lastStatusValid ? (this.lastStatus[RobovacCommand.WORK_MODE] as StringCommandValueMapping | undefined) : undefined;
  }

  getWorkStatusCached(): StringCommandValueMapping | undefined {
    return this.lastStatusValid ? <StringCommandValueMapping>this.lastStatus[RobovacCommand.WORK_STATUS] : undefined;
  }

  getReturnHomeCached(): boolean | undefined {
    return this.lastStatusValid ? (this.lastStatus[RobovacCommand.RETURN_HOME] as boolean | undefined) : undefined;
  }

  getFanSpeedCached(): StringCommandValueMapping | undefined {
    return this.lastStatusValid ? (this.lastStatus[RobovacCommand.FAN_SPEED] as StringCommandValueMapping | undefined) : undefined;
  }

  getFindRobotCached(): boolean | undefined {
    return this.lastStatusValid ? (this.lastStatus[RobovacCommand.FIND_ROBOT] as boolean | undefined) : undefined;
  }

  getBatteryLevelCached(): number | undefined {
    return this.lastStatusValid ? (this.lastStatus[RobovacCommand.BATTERY_LEVEL] as number | undefined) : undefined;
  }

  getErrorCodeCached(): StringCommandValueMapping | undefined {
    return this.lastStatusValid ? (this.lastStatus[RobovacCommand.ERROR] as StringCommandValueMapping | undefined) : undefined;
  }

  async setPlayPause(newValue: boolean) {
    return this.set(RobovacCommand.RUNNING, newValue);
  }

  async setDirection(newValue: StringCommandValueMapping) {
    const stringValues = this.modelDetails.getCommandSpecByCommand(RobovacCommand.DIRECTION)?.stringValues as Record<string, StringCommandValueMapping>;
    const entry = Object.entries(stringValues).find(([, value]) => value.id === newValue.id);
    if (!entry) {
      throw new ValueNotSupportedError(newValue, RobovacCommand.DIRECTION, this.modelDetails.modelId);
    }

    return this.set(RobovacCommand.DIRECTION, entry[0]);
  }

  async setWorkMode(newValue: StringCommandValueMapping) {
    const stringValues = this.modelDetails.getCommandSpecByCommand(RobovacCommand.WORK_MODE)?.stringValues as Record<string, StringCommandValueMapping>;
    const entry = Object.entries(stringValues).find(([, value]) => value.id === newValue.id);
    if (!entry) {
      throw new ValueNotSupportedError(newValue, RobovacCommand.WORK_MODE, this.modelDetails.modelId);
    }

    return this.set(RobovacCommand.WORK_MODE, entry[0]);
  }

  async setGoHome(newValue: boolean) {
    return this.set(RobovacCommand.RETURN_HOME, newValue);
  }

  async setFanSpeed(newValue: StringCommandValueMapping) {
    const stringValues = this.modelDetails.getCommandSpecByCommand(RobovacCommand.FAN_SPEED)?.stringValues as Record<string, StringCommandValueMapping>;
    const entry = Object.entries(stringValues).find(([, value]) => value.id === newValue.id);
    if (!entry) {
      throw new ValueNotSupportedError(newValue, RobovacCommand.FAN_SPEED, this.modelDetails.modelId);
    }

    return this.set(RobovacCommand.FAN_SPEED, entry[0]);
  }

  async setFindRobot(newValue: boolean) {
    return this.set(RobovacCommand.FIND_ROBOT, newValue);
  }
}
