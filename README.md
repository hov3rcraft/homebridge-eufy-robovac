# homebridge-eufy-robovac
Homebridge plugin for Eufy RoboVac

### About this Fork

A full rewrite of [apexad/homebridge-eufy-robovac](https://github.com/apexad/homebridge-eufy-robovac) to
* improve performance
* solve "This plugin slows down Homebridge" warnings ([#34](https://github.com/apexad/homebridge-eufy-robovac/issues/34))
* repair broken features, like the "Find Robot" switch
* convert to a "homebridge dynamic platform" plugin

### Features

* Switch on / off. When switching off, the RoboVac will return to charging dock first.

* Display battery level, and notify on low battery.

* Display battery charging state.

* Find robot

### Supported Devices
Some newer RoboVac models, such as the Eufy Clean L60, are currently not supported as some messages are encrypted (see [#6](https://github.com/hov3rcraft/homebridge-eufy-robovac/issues/6)).

### Get Device ID & Local Key
To access your RoboVac, you need both the `deviceId`/`localKey`.
To get the `deviceId`/`localKey` use the [`eufy-clean-local-key-grabber`](https://github.com/Rjevski/eufy-clean-local-key-grabber/tree/master) repository.
In the README of that project it says they are not sure if it still works, but I can confirm that it still works as of August 2024.

### Configuration
This easiest way to use this plugin is to use [homebridge-config-ui-x](https://www.npmjs.com/package/homebridge-config-ui-x).  
To configure manually, add to the `platform` section of homebridge's `config.json` after installing the plugin.

**Command:** ```npm install -g @hov3rcraft/homebridge-eufy-robovac```

**Config:**
  ```json
    {
      "devices": [
        {
          "name": "<deviceName, required>",
          "deviceId": "<deviceId, required>",
          "localKey": "<localKey, required>",
          "deviceIp": "<deviceIp, defaults to undefined>",
          "useSwitchService": "<true | false, defaults to false>",
          "findButtonEnabled": "<true | false, defaults to true>",
          "batteryInformationEnabled": "<true | false, defaults to true>",
          "errorSensorEnabled": "<true | false, defaults to true>"
        }
      ],
      "debugLog": "<true | false, defaults to false>",
      "platform": "EufyRobovac"
    }
  ``` 

You can add multiple RoboVacs under `devices`.
* `deviceName`: Give each device a unique name.
* `deviceId`/`localKey`: Required to access your device's API (see instructions above).
* `deviceIp`: If your device has a static IP, enter it here to improve performance.
* `useSwitchService`: By default, RoboVac will be added to Home app as a fan accessory (since HomeKit does not natively support vacuums). If set to true, a Switch accessory will be used instead.
* `findButtonEnabled`: If set to true, a switch that performs the 'Find Robot' function will also be added.  
* `batteryInformationEnabled`: If set to true, the device will show information about the battery charge level and charging status.
* `errorSensorEnabled`: If set to true, a motion sensor that reacts to the device's error messages will also be added. Also, the devices error messages will be logged to HomeBridge.

* `debugLog`: Diverts the log messages for all log levels directly to the console.
* `platform`: Tells Homebridge that this platform config belongs to this plugin. Do not change. 

### Thank You

* [mitchellrj](https://github.com/mitchellrj) - Did most of the legwork in figuring out how to talk to the Eufy
* [apexad](https://github.com/apexad) - Created the [original version](https://github.com/apexad/homebridge-eufy-robovac) of the plugin.


## Development

This plugin is written in TypeScript. You should just need to run `npm run build` after making changes in the `src/` directory.
