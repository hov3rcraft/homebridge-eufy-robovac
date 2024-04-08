import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { EufyRobovacPlatform } from './platform';
import { ErrorCode, RoboVac, StatusDps, StatusResponse, WorkStatus, getErrorCodeFriendlyName, statusDpsFriendlyNames } from './robovac-api';
import { Logger } from './consoleLogger';

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
  private readonly connectionConfig: { deviceId: string; localKey: string; deviceIp: string };
  private readonly findButtonEnabled: boolean;
  private readonly batteryInformationEnabled: boolean;
  private readonly errorSensorEnabled: boolean;


  private readonly callbackTimeout = 3000;
  private readonly cachingDuration = 60000;
  private readonly lowBatteryThreshold = 10;

  constructor(platform: EufyRobovacPlatform, accessory: PlatformAccessory, config: any, log: Logger) {

    log.debug('Initializing EufyRobovacAccessory...');

    this.platform = platform;
    this.accessory = accessory;
    this.log = log;

    this.name = accessory.displayName;
    this.connectionConfig = {
      deviceId: config.deviceId,
      localKey: config.localKey,
      deviceIp: config.deviceIp
    };
    this.findButtonEnabled = config.findButtonEnabled;
    this.batteryInformationEnabled = config.batteryInformationEnabled;
    this.errorSensorEnabled = config.errorSensorEnabled;

    // set accessory information
    this.informationService = this.accessory.getService(this.platform.Service.AccessoryInformation)!;
    this.informationService.getCharacteristic(this.platform.Characteristic.Identify).onSet(this.setIdentify.bind(this));
    this.informationService.setCharacteristic(this.platform.Characteristic.Manufacturer, 'Eufy');
    this.informationService.setCharacteristic(this.platform.Characteristic.Model, 'RoboVac');
    this.informationService.setCharacteristic(this.platform.Characteristic.Name, this.name);
    this.informationService.setCharacteristic(this.platform.Characteristic.SerialNumber, config.deviceId);
    this.informationService.setCharacteristic(this.platform.Characteristic.FirmwareRevision, "unknown");

    // create main service for the vacuum cleaner
    if (config.useSwitchService) {
      this.vacuumService = this.accessory.getService("Vacuum") || this.accessory.addService(this.platform.Service.Switch, "Vacuum", "VACUUM");
    } else {
      this.vacuumService = this.accessory.getService("Vacuum") || this.accessory.addService(this.platform.Service.Fan, "Vacuum");
    }
    this.vacuumService.getCharacteristic(this.platform.Characteristic.On)
      .onGet(this.getRunning.bind(this))
      .onSet(this.setRunning.bind(this));

    // create find robot service
    if (this.findButtonEnabled) {
      this.findRobotService = this.accessory.getService("FindRobot") || this.accessory.addService(this.platform.Service.Switch, "FindRobot", "FIND_ROBOT");
      this.findRobotService.getCharacteristic(this.platform.Characteristic.On)
        .onGet(this.getFindRobot.bind(this))
        .onSet(this.setFindRobot.bind(this));
    }

    // create battery service
    if (this.batteryInformationEnabled) {
      this.batteryService = this.accessory.getService("Battery") || this.accessory.addService(this.platform.Service.Battery, "Battery", "BATTERY");
      this.batteryService.getCharacteristic(this.platform.Characteristic.StatusLowBattery)
        .onGet(this.getLowBattery.bind(this));
      this.batteryService.getCharacteristic(this.platform.Characteristic.BatteryLevel)
        .onGet(this.getBatteryLevel.bind(this));
      this.batteryService.getCharacteristic(this.platform.Characteristic.ChargingState)
        .onGet(this.getCharging.bind(this));
    }

    // create error sensor service
    if (this.errorSensorEnabled) {
      this.errorSensorService = this.accessory.getService("ErrorSensor") || this.accessory.addService(this.platform.Service.MotionSensor, "ErrorSensor", "ERROR_SENSOR");
      this.errorSensorService.getCharacteristic(this.platform.Characteristic.MotionDetected)
        .onGet(this.getErrorStatus.bind(this))
    }

    this.roboVac = new RoboVac(this.connectionConfig, this.updateCharacteristics.bind(this), this.cachingDuration, this.log);

    this.log.info('Finished initializing accessory:', this.name);
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   */
  async getRunning(): Promise<CharacteristicValue> {
    this.log.debug(`getRunning for ${this.name}`);

    try {
      return await Promise.race([
        this.roboVac.getRunning(),
        new Promise<boolean>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        })
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getFindRobot(): Promise<CharacteristicValue> {
    this.log.debug(`getFindRobot for ${this.name}`);

    try {
      return await Promise.race([
        this.roboVac.getFindRobot(),
        new Promise<boolean>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        })
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getLowBattery(): Promise<CharacteristicValue> {
    this.log.debug(`getLowBattery for ${this.name}`);

    try {
      const battery_level = await Promise.race([
        this.roboVac.getBatteryLevel(),
        new Promise<number>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        })
      ]);
      return battery_level <= this.lowBatteryThreshold;
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getBatteryLevel(): Promise<CharacteristicValue> {
    this.log.debug(`getBatteryLevel for ${this.name}`);

    try {
      return await Promise.race([
        this.roboVac.getBatteryLevel(),
        new Promise<number>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        })
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getCharging(): Promise<CharacteristicValue> {
    this.log.debug(`getCharging for ${this.name}`);

    try {
      const work_status = await Promise.race([
        this.roboVac.getWorkStatus(),
        new Promise<WorkStatus>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        })
      ]);
      return this.workStatusToChargingState(work_status);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getErrorStatus(): Promise<CharacteristicValue> {
    this.log.debug(`getErrorStatus for ${this.name}`);

    try {
      const error_code = await Promise.race([
        this.roboVac.getErrorCode(),
        new Promise<string>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        })
      ]);
      return error_code !== ErrorCode.NO_ERROR;
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

    try {
      return await Promise.race([
        (state) ? this.roboVac.setPlayPause(true) : this.roboVac.setGoHome(true),
        new Promise<CharacteristicValue>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        })
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
        new Promise<CharacteristicValue>((resolve, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), this.callbackTimeout);
        })
      ]);
    } catch {
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  /**
   * Handle requests to set the "Identify" characteristic
   */
  setIdentify(value: any) {
    this.log.info('Triggered SET Identify:', value);
  }

  updateCharacteristics(statusResponse: StatusResponse) {
    this.log.debug(`updateCharacteristics for ${this.name}`);
    let counter = 0;
    if (statusResponse.dps[StatusDps.RUNNING] !== undefined) {
      this.log.debug(`updating ${statusDpsFriendlyNames.get(StatusDps.RUNNING)} for ${this.name} to ${statusResponse.dps[StatusDps.RUNNING]}`);
      this.vacuumService.updateCharacteristic(this.platform.Characteristic.On, statusResponse.dps[StatusDps.RUNNING]);
      counter++;
    }
    if (this.findRobotService && statusResponse.dps[StatusDps.FIND_ROBOT] !== undefined) {
      this.log.debug(`updating ${statusDpsFriendlyNames.get(StatusDps.FIND_ROBOT)} for ${this.name} to ${statusResponse.dps[StatusDps.FIND_ROBOT]}`);
      this.findRobotService.updateCharacteristic(this.platform.Characteristic.On, statusResponse.dps[StatusDps.FIND_ROBOT]);
      counter++;
    }
    if (this.batteryService) {
      if (statusResponse.dps[StatusDps.BATTERY_LEVEL] !== undefined) {
        this.log.debug(`updating ${statusDpsFriendlyNames.get(StatusDps.BATTERY_LEVEL)} for ${this.name} to ${statusResponse.dps[StatusDps.BATTERY_LEVEL]}`);
        this.batteryService.updateCharacteristic(this.platform.Characteristic.StatusLowBattery, statusResponse.dps[StatusDps.BATTERY_LEVEL] <= this.lowBatteryThreshold);
        this.batteryService.updateCharacteristic(this.platform.Characteristic.BatteryLevel, statusResponse.dps[StatusDps.BATTERY_LEVEL]);
        counter++;
      }
      if (statusResponse.dps[StatusDps.WORK_STATUS] !== undefined) {
        this.log.debug(`updating ${statusDpsFriendlyNames.get(StatusDps.WORK_STATUS)} for ${this.name} to ${statusResponse.dps[StatusDps.WORK_STATUS]}`);
        this.batteryService.updateCharacteristic(this.platform.Characteristic.ChargingState, this.workStatusToChargingState(statusResponse.dps[StatusDps.WORK_STATUS] as WorkStatus));
        counter++;
      }
    }
    if (this.errorSensorService && statusResponse.dps[StatusDps.ERROR_CODE] !== undefined) {
      const is_error = (statusResponse.dps[StatusDps.ERROR_CODE] !== ErrorCode.NO_ERROR);
      this.log.debug(`updating Error Sensor status for ${this.name} to ${is_error}`);
      this.errorSensorService.updateCharacteristic(this.platform.Characteristic.MotionDetected, is_error);
      if (is_error) this.log.info(`${this.name} reported a device error: ${getErrorCodeFriendlyName(statusResponse.dps[StatusDps.ERROR_CODE])}`);
      counter++;
    }
    this.log.info(`New data from ${this.name} received - updated ${counter} characteristics.`)
  }

  workStatusToChargingState(workStatus: WorkStatus): number {
    switch (workStatus) {
      case WorkStatus.CHARGING:
      case WorkStatus.CHARGING_COMPLETED:
        return this.platform.Characteristic.ChargingState.CHARGING;
      default:
        return this.platform.Characteristic.ChargingState.NOT_CHARGING;
    }
  }
}
