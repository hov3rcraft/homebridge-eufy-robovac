import { Service, PlatformAccessory, CharacteristicValue } from "homebridge";

import { EufyRobovacPlatform } from "./platform";
import { RoboVac, RobovacStatus } from "./api/robovac-api";
import { Logger } from "./console-logger";
import { RobovacCommand, StringCommandValueMapping } from "./api/robovac-command";
import { error } from "node:console";
import { DeviceError } from "./api/device-errors";
import { RaceStatus } from "./race-status";
import { PromiseTimeoutException } from "./promise-timeout-exception";

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

  private readonly callbackTimeout = 1500;
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

    this.roboVac = new RoboVac(
      this.connectionConfig,
      this.model,
      this.cachingDuration,
      this.log,
      this.updateRunning.bind(this),
      this.updateWorkStatus.bind(this),
      undefined,
      this.updateFindRobot.bind(this),
      this.updateBatteryLevel.bind(this),
      this.updateErrorStatus.bind(this),
      this.updateAllCharacteristics.bind(this)
    );

    this.log.info("Finished initializing accessory:", this.name);
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   */
  async getRunning(): Promise<CharacteristicValue> {
    const raceStatus = new RaceStatus();
    this.log.debug(`getRunning for ${this.name}. [race id: ${raceStatus.raceId}]`);

    let running: boolean | undefined = undefined;
    try {
      running = await Promise.race([
        this.roboVac.getRunning(raceStatus),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => {
            raceStatus.setRaceOver();
            reject(new PromiseTimeoutException(this.callbackTimeout));
          }, this.callbackTimeout);
        }),
      ]);

      if (running === undefined) {
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
      return running;
    } catch (error) {
      if (error instanceof PromiseTimeoutException) {
        this.log.debug(`${this.name} lost its promise race for getRunning(). [race id: ${raceStatus.raceId}]`);
      } else {
        this.log.error(`An error occured during getRunning() for ${this.name}. [race id: ${raceStatus.raceId}]`, error);
      }
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getFindRobot(): Promise<CharacteristicValue> {
    const raceStatus = new RaceStatus();
    this.log.debug(`getFindRobot for ${this.name}. [race id: ${raceStatus.raceId}]`);

    let find_robot: boolean | undefined = undefined;
    try {
      find_robot = await Promise.race([
        this.roboVac.getFindRobot(raceStatus),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => {
            raceStatus.setRaceOver();
            reject(new PromiseTimeoutException(this.callbackTimeout));
          }, this.callbackTimeout);
        }),
      ]);

      if (find_robot === undefined) {
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
      return find_robot;
    } catch (error) {
      if (error instanceof PromiseTimeoutException) {
        this.log.debug(`${this.name} lost its promise race for getFindRobot(). [race id: ${raceStatus.raceId}]`);
      } else {
        this.log.error(`An error occured during getFindRobot() for ${this.name}. [race id: ${raceStatus.raceId}]`, error);
      }
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getLowBattery(): Promise<CharacteristicValue> {
    const raceStatus = new RaceStatus();
    this.log.debug(`getLowBattery for ${this.name}. [race id: ${raceStatus.raceId}]`);

    let battery_level: number | undefined = undefined;
    try {
      battery_level = await Promise.race([
        this.roboVac.getBatteryLevel(raceStatus),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => {
            raceStatus.setRaceOver();
            reject(new PromiseTimeoutException(this.callbackTimeout));
          }, this.callbackTimeout);
        }),
      ]);

      if (battery_level === undefined) {
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
      return battery_level <= this.lowBatteryThreshold;
    } catch (error) {
      if (error instanceof PromiseTimeoutException) {
        this.log.debug(`${this.name} lost its promise race for getLowBattery(). [race id: ${raceStatus.raceId}]`);
      } else {
        this.log.error(`An error occured during getLowBattery() for ${this.name}. [race id: ${raceStatus.raceId}]`, error);
      }
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getBatteryLevel(): Promise<CharacteristicValue> {
    const raceStatus = new RaceStatus();
    this.log.debug(`getBatteryLevel for ${this.name}. [race id: ${raceStatus.raceId}]`);

    let battery_level: number | undefined = undefined;
    try {
      battery_level = await Promise.race([
        this.roboVac.getBatteryLevel(raceStatus),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => {
            raceStatus.setRaceOver();
            reject(new PromiseTimeoutException(this.callbackTimeout));
          }, this.callbackTimeout);
        }),
      ]);

      if (battery_level === undefined) {
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
      return battery_level;
    } catch (error) {
      if (error instanceof PromiseTimeoutException) {
        this.log.debug(`${this.name} lost its promise race for getBatteryLevel(). [race id: ${raceStatus.raceId}]`);
      } else {
        this.log.error(`An error occured during getBatteryLevel() for ${this.name}. [race id: ${raceStatus.raceId}]`, error);
      }
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getCharging(): Promise<CharacteristicValue> {
    const raceStatus = new RaceStatus();
    this.log.debug(`getCharging for ${this.name}. [race id: ${raceStatus.raceId}]`);

    let work_status: string | undefined = undefined;
    try {
      work_status = await Promise.race([
        this.roboVac.getWorkStatus(raceStatus),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => {
            raceStatus.setRaceOver();
            reject(new PromiseTimeoutException(this.callbackTimeout));
          }, this.callbackTimeout);
        }),
      ]);

      if (work_status === undefined) {
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
      return this.workStatusToChargingState(work_status);
    } catch (error) {
      if (error instanceof PromiseTimeoutException) {
        this.log.debug(`${this.name} lost its promise race for getCharging(). [race id: ${raceStatus.raceId}]`);
      } else {
        this.log.error(`An error occured during getCharging() for ${this.name}. [race id: ${raceStatus.raceId}]`, error);
      }
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async getErrorStatus(): Promise<CharacteristicValue> {
    const raceStatus = new RaceStatus();
    this.log.debug(`getErrorStatus for ${this.name}. [race id: ${raceStatus.raceId}]`);

    try {
      const device_error = await Promise.race([
        this.roboVac.getErrorCode(raceStatus),
        new Promise<undefined>((resolve, reject) => {
          setTimeout(() => {
            raceStatus.setRaceOver();
            reject(new PromiseTimeoutException(this.callbackTimeout));
          }, this.callbackTimeout);
        }),
      ]);
      return !(device_error === undefined || device_error.id === DeviceError.NO_ERROR.id);
    } catch (error) {
      if (error instanceof PromiseTimeoutException) {
        this.log.debug(`${this.name} lost its promise race for getErrorStatus(). [race id: ${raceStatus.raceId}]`);
      } else {
        this.log.error(`An error occured during getErrorStatus() for ${this.name}. [race id: ${raceStatus.raceId}]`, error);
      }
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  setIdentify(value: any) {
    this.log.info("Triggered SET Identify:", value);
  }

  setRunning(state: CharacteristicValue) {
    this.log.debug(`setRunning for ${this.name} set to ${state}`);

    if (!state && this.roboVac.getRunningCached() == false) {
      // don't send additional "RETURN HOME" command when already off
      this.log.debug(
        `setRunning for ${this.name} set to ${state} received, but not sending RETURN HOME command because according to cache the device is already off`
      );
      return;
    }

    if (state) {
      this.roboVac.setPlayPause(true).catch((error) => {
        this.log.error(`An error occured during setRunning(ON) for ${this.name}.`, error);
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      });
    } else {
      this.roboVac.setGoHome(true).catch((error) => {
        this.log.error(`An error occured during setRunning(OFF) for ${this.name}.`, error);
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      });
    }
  }

  setFindRobot(state: CharacteristicValue) {
    this.log.debug(`setFindRobot for ${this.name} set to ${state}`);
    this.roboVac.setFindRobot(state as boolean).catch((error) => {
      this.log.error(`An error occured during setFindRobot() for ${this.name}.`, error);
      throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    });
  }

  /*
   * Handles characteristic updates from the API
   */
  private updateRunning(running: boolean) {
    this.log.debug(`updating ${RobovacCommand.RUNNING} for ${this.name} to ${running}`);
    this.vacuumService.updateCharacteristic(this.platform.Characteristic.On, running);
  }

  private updateFindRobot(find_robot: boolean) {
    if (this.findRobotService) {
      this.log.debug(`updating ${RobovacCommand.FIND_ROBOT} for ${this.name} to ${find_robot}`);
      this.findRobotService.updateCharacteristic(this.platform.Characteristic.On, find_robot);
    }
  }

  private updateBatteryLevel(battery_level: number) {
    if (this.batteryService) {
      this.log.debug(`updating ${RobovacCommand.BATTERY_LEVEL} for ${this.name} to ${battery_level}`);
      this.batteryService.updateCharacteristic(this.platform.Characteristic.StatusLowBattery, battery_level <= this.lowBatteryThreshold);
      this.batteryService.updateCharacteristic(this.platform.Characteristic.BatteryLevel, battery_level);
    }
  }

  private updateWorkStatus(work_status: string) {
    if (this.batteryService) {
      this.log.debug(`updating ${RobovacCommand.WORK_STATUS} for ${this.name} to ${work_status}`);
      this.batteryService.updateCharacteristic(this.platform.Characteristic.ChargingState, this.workStatusToChargingState(work_status));
    }
  }

  private updateErrorStatus(error_status: StringCommandValueMapping | undefined) {
    if (this.errorSensorService) {
      const is_error = error_status !== undefined && error_status.id !== DeviceError.NO_ERROR.id;
      this.log.debug(`updating Error Sensor status for ${this.name} to ${is_error}`);
      this.errorSensorService.updateCharacteristic(this.platform.Characteristic.MotionDetected, is_error);
      if (is_error) this.log.info(`${this.name} reported a device error: ${error_status.friendly_message}`);
    }
  }

  updateAllCharacteristics(status: RobovacStatus) {
    this.log.debug(`updateCharacteristics for ${this.name}`);
    let counter = 0;
    const status_running = status[RobovacCommand.RUNNING] as boolean | undefined;
    if (status_running !== undefined) {
      this.updateRunning(status_running);
      counter++;
    }
    const status_find_robot = status[RobovacCommand.FIND_ROBOT] as boolean | undefined;
    if (this.findRobotService && status_find_robot !== undefined) {
      this.updateFindRobot(status_find_robot);
      counter++;
    }
    if (this.batteryService) {
      const status_battery_level = status[RobovacCommand.BATTERY_LEVEL] as number | undefined;
      if (status_battery_level !== undefined) {
        this.updateBatteryLevel(status_battery_level);
        counter++;
      }
      const status_work_status = status[RobovacCommand.WORK_STATUS] as string | undefined;
      if (status_work_status !== undefined) {
        this.updateWorkStatus(status_work_status);
        counter++;
      }
    }
    if (this.errorSensorService) {
      const status_error = status[RobovacCommand.ERROR] as StringCommandValueMapping | undefined;
      this.updateErrorStatus(status_error);
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
