# react-native-pins

[![npm](https://img.shields.io/npm/v/react-native-pins.svg?style=flat-square)](https://www.npmjs.com/package/react-native-pins)
[![npm licence](http://img.shields.io/npm/l/react-native-pins.svg?style=flat-square)](https://npmjs.org/package/react-native-pins)
[![npm downloads](http://img.shields.io/npm/dt/react-native-pins.svg?style=flat-square)](https://npmjs.org/package/react-native-pins)

<img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-awesome-pin/pins.png" width="50%" /><br />

The pins come with a shake animation and configurable 
device vibration.

## Install

To get started install via npm:
```sh
 npm install react-native-pins
```

#### Usage

Import:
```js
 import { PinInput } from 'react-native-pins';
```

Then add it to your code:
```js
<PinInput
    onRef={ref => (this.pins = ref)}
    numberOfPins={5}
    numberOfPinsActive={2}
/>
```

The `<PinInput />` has a `shake()` method which can be called through a reference `this.pins.shake()`.
This will perform a shake animation and vibration if enabled. A callback can be passed through props which
will be fired when the animation is complete. See props below.

#### PinInput

| Prop            | Type          | Optional  | Default              | Description                                                                             |
| --------------- | ------------- | --------- | -------------------- | --------------------------------------------------------------------------------------- |
| onRef           | any           | No        |                      | onRef allows you to call the `shake()` method.                              |
| activeOnly           | booolean           | yes        |   false                   | Whether to only fill the active pin or to fill all of them.                              |
| numberOfPins    | number        | Yes       | 5                    | Number of pins to render.                                                               |
| numberOfPinsActive | number     | Yes       | 0                    | Number of active pins. You can pass the `pin.length` here.                              |
| vibration       | bool          | Yes       | true                 | Should vibration be enabled on shake?                                                   |
| animationShakeCallback | func   | Yes       |                      | A callback triggered when the pin shake animation has finished.                         |
| containerStyle  | object        | Yes       | See PinInput.js      | Style applied to PINS container.                                                        |
| pinStyle        | object        | Yes       | See PinInput.js      | Style applied to each circle PIN.                                                       |
| pinActiveStyle  | object        | Yes       | See PinInput.js      | Style applied to each circle PIN when it is active.                                     |

## Contributing

If you want to issue a PR, go ahead ;)

## Authors

* [**Luke Brandon Farrell**](https://lukebrandonfarrell.com/) - *Author*

## License

This project is licensed under the MIT License
