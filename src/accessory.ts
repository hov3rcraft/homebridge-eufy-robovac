import { Service, PlatformAccessory, CharacteristicValue } from "homebridge";

import { EufyRobovacPlatform } from "./platform";
import { RoboVac, RobovacStatus } from "./api/robovac-api";
import { Logger } from "./console-logger";
import { RobovacCommand, StringCommandValueMapping } from "./api/robovac-command";
import { error } from "node:console";
import { DeviceError } from "./api/device-errors";

export class EufyRobovacAccessory {
  private readonly platform: EufyRobovacPlatform;
  private readonly accessory: PlatformAccessory;
  private readonly informationService: Service;
  private readonly vacuumService: Service;
  private readonly findRobotService: Service | undefined;
  private readonly batteryService: Service | undefined;
  private readonly errorSensorService: Service | undefined;
  private readonly roboVac: RoboVac;
  private readonly log: Logger;

  private readonly name: string;
  private readonly model: string;
  private readonly connectionConfig: { deviceId: string; localKey: string; deviceIp: string };
  private readonly findButtonEnabled: boolean;
  private readonly batteryInformationEnabled: boolean;
  private readonly errorSensorEnabled: boolean;

  private readonly callbackTimeout = 1000;
  private readonly cachingDuration = 60000;
  private readonly lowBatteryThreshold = 10;

  constructor(platform: EufyRobovacPlatform, accessory: PlatformAccessory, config: any, log: Logger) {
    log.debug("Initializing EufyRobovacAccessory...");

    this.platform = platform;
    this.accessory = accessory;
    this.log = log;

    this.name = accessory.displayName;

    if (config.model) {
      this.model = config.model;
    } else {
      log.warn("No model configured. This is required for v4.0.0 and later. Please set the correct model in the plugin config.");
      this.model = "T0000";
    }
    this.connectionConfig = {
      deviceId: config.deviceId,
      localKey: config.localKey,
      deviceIp: config.deviceIp,
    };
    this.findButtonEnabled = config.findButtonEnabled;
    this.batteryInformationEnabled = config.batteryInformationEnabled;
    this.errorSensorEnabled = config.errorSensorEnabled;

    // set accessory information
    this.informationService = this.accessory.getService(this.platform.Service.AccessoryInformation)!;
    this.informationService.getCharacteristic(this.platform.Characteristic.Identify).onSet(this.setIdentify.bind(this));
    this.informationService.setCharacteristic(this.platform.Characteristic.Manufacturer, "Eufy");
    this.informationService.setCharacteristic(this.platform.Characteristic.Model, "RoboVac");
    this.informationService.setCharacteristic(this.platform.Characteristic.Name, this.name);
    this.informationService.setCharacteristic(this.platform.Characteristic.SerialNumber, config.deviceId);
    this.informationService.setCharacteristic(this.platform.Characteristic.FirmwareRevision, "unknown");

    // create main service for the vacuum cleaner
    if (config.useSwitchService) {
      this.vacuumService = this.accessory.getService("Vacuum") || this.accessory.addService(this.platform.Service.Switch, "Vacuum", "VACUUM");
    } else {
      this.vacuumService = this.accessory.getService("Vacuum") || this.accessory.addService(this.platform.Service.Fan, "Vacuum");
    }
    this.vacuumService.getCharacteristic(this.platform.Characteristic.On).onGet(this.getRunning.bind(this)).onSet(this.setRunning.bind(this));

    // create find robot service
    if (this.findButtonEnabled) {
      this.findRobotService = this.accessory.getService("FindRobot") || this.accessory.addService(this.platform.Service.Switch, "FindRobot", "FIND_ROBOT");
      this.findRobotService.getCharacteristic(this.platform.Characteristic.On).onGet(this.getFindRobot.bind(this)).onSet(this.setFindRobot.bind(this));
    }

    // create battery service
    if (this.batteryInformationEnabled) {
      this.batteryService = this.accessory.getService("Battery") || this.accessory.addService(this.platform.Service.Battery, "Battery", "BATTERY");
      this.batteryService.getCharacteristic(this.platform.Characteristic.StatusLowBattery).onGet(this.getLowBattery.bind(this));
      this.batteryService.getCharacteristic(this.platform.Characteristic.BatteryLevel).onGet(this.getBatteryLevel.bind(this));
      this.batteryService.getCharacteristic(this.platform.Characteristic.ChargingState).onGet(this.getCharging.bind(this));
    }

    // create error sensor service
    if (this.errorSensorEnabled) {
      this.errorSensorService =
        this.accessory.getService("ErrorSensor") || this.accessory.addService(this.platform.Service.MotionSensor, "ErrorSensor", "ERROR_SENSOR");
      this.errorSensorService.getCharacteristic(this.platform.Characteristic.MotionDetected).onGet(this.getErrorStatus.bind(this));
    }

    this.roboVac = new RoboVac(this.connectionConfig, this.model, this.updateCharacteristics.bind(this), this.cachingDuration, this.log);

    this.log.info("Finished initializing accessory:", this.name);
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   */
  async getRunning(): Promise<CharacteristicValue> {
    this.log.debug(`getRunning for ${this.name}`);

    let running: boolean | undefined = undefined;
    try {
      running = await Promise.race([
        this.roboVac.getRunning(),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        }),
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }

    if (running === undefined) {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
    return running;
  }

  async getFindRobot(): Promise<CharacteristicValue> {
    this.log.debug(`getFindRobot for ${this.name}`);

    let find_robot: boolean | undefined = undefined;
    try {
      find_robot = await Promise.race([
        this.roboVac.getFindRobot(),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        }),
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }

    if (find_robot === undefined) {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
    return find_robot;
  }

  async getLowBattery(): Promise<CharacteristicValue> {
    this.log.debug(`getLowBattery for ${this.name}`);

    let battery_level: number | undefined = undefined;
    try {
      battery_level = await Promise.race([
        this.roboVac.getBatteryLevel(),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        }),
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
    if (battery_level === undefined) {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
    return battery_level <= this.lowBatteryThreshold;
  }

  async getBatteryLevel(): Promise<CharacteristicValue> {
    this.log.debug(`getBatteryLevel for ${this.name}`);

    let battery_level: number | undefined = undefined;
    try {
      battery_level = await Promise.race([
        this.roboVac.getBatteryLevel(),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        }),
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }

    if (battery_level === undefined) {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
    return battery_level;
  }

  async getCharging(): Promise<CharacteristicValue> {
    this.log.debug(`getCharging for ${this.name}`);

    let work_status: string | undefined = undefined;
    try {
      work_status = await Promise.race([
        this.roboVac.getWorkStatus(),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        }),
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }

    if (work_status === undefined) {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
    return this.workStatusToChargingState(work_status);
  }

  async getErrorStatus(): Promise<CharacteristicValue> {
    this.log.debug(`getErrorStatus for ${this.name}`);

    try {
      const device_error = await Promise.race([
        this.roboVac.getErrorCode(),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        }),
      ]);
      return !(device_error === undefined || device_error.id === DeviceError.NO_ERROR.id);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setRunning(state: CharacteristicValue) {
    this.log.debug(`setRunning for ${this.name} set to ${state}`);

    if (!state && this.roboVac.getRunningCached() == false) {
      // don't send additional "RETURN HOME" command when already off
      this.log.debug(
        `setRunning for ${this.name} set to ${state} received, but not sending RETURN HOME command because according to cache the device is already off`
      );
      return;
    }

    try {
      return await Promise.race([
        state ? this.roboVac.setPlayPause(true) : this.roboVac.setGoHome(true),
        new Promise<void>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        }),
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async setFindRobot(state: CharacteristicValue) {
    this.log.debug(`setFindRobot for ${this.name} set to ${state}`);

    try {
      return await Promise.race([
        this.roboVac.setFindRobot(state as boolean),
        new Promise<void>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        }),
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  /**
   * Handle requests to set the "Identify" characteristic
   */
  setIdentify(value: any) {
    this.log.info("Triggered SET Identify:", value);
  }

  updateCharacteristics(status: RobovacStatus) {
    this.log.debug(`updateCharacteristics for ${this.name}`);
    let counter = 0;
    const status_running = status[RobovacCommand.RUNNING] as boolean | undefined;
    if (status_running !== undefined) {
      this.log.debug(`updating ${RobovacCommand.RUNNING} for ${this.name} to ${status_running}`);
      this.vacuumService.updateCharacteristic(this.platform.Characteristic.On, status_running);
      counter++;
    }
    const status_find_robot = status[RobovacCommand.FIND_ROBOT] as boolean | undefined;
    if (this.findRobotService && status_find_robot !== undefined) {
      this.log.debug(`updating ${RobovacCommand.FIND_ROBOT} for ${this.name} to ${status_find_robot}`);
      this.findRobotService.updateCharacteristic(this.platform.Characteristic.On, status_find_robot);
      counter++;
    }
    if (this.batteryService) {
      const status_battery_level = status[RobovacCommand.BATTERY_LEVEL] as number | undefined;
      if (status_battery_level !== undefined) {
        this.log.debug(`updating ${RobovacCommand.BATTERY_LEVEL} for ${this.name} to ${status_battery_level}`);
        this.batteryService.updateCharacteristic(this.platform.Characteristic.StatusLowBattery, status_battery_level <= this.lowBatteryThreshold);
        this.batteryService.updateCharacteristic(this.platform.Characteristic.BatteryLevel, status_battery_level);
        counter++;
      }
      const status_work_status = status[RobovacCommand.WORK_STATUS] as string | undefined;
      if (status_work_status !== undefined) {
        this.log.debug(`updating ${RobovacCommand.WORK_STATUS} for ${this.name} to ${status_work_status}`);
        this.batteryService.updateCharacteristic(this.platform.Characteristic.ChargingState, this.workStatusToChargingState(status_work_status));
        counter++;
      }
    }
    if (this.errorSensorService) {
      const status_error = status[RobovacCommand.ERROR] as StringCommandValueMapping | undefined;
      const is_error = status_error !== undefined && status_error.id !== DeviceError.NO_ERROR.id;
      this.log.debug(`updating Error Sensor status for ${this.name} to ${is_error}`);
      this.errorSensorService.updateCharacteristic(this.platform.Characteristic.MotionDetected, is_error);
      if (is_error) this.log.info(`${this.name} reported a device error: ${status_error.friendly_message}`);
      counter++;
    }
    this.log.debug(`updateCharacteristics for ${this.name} complete - updated ${counter} characteristics.`);
  }

  workStatusToChargingState(workStatus: string): number {
    // TODO replace with robust check
    if (workStatus === "Charging" || workStatus === "Charging completed") {
      return this.platform.Characteristic.ChargingState.CHARGING;
    } else {
      return this.platform.Characteristic.ChargingState.NOT_CHARGING;
    }
  }
}
