import * as types from './device_types';
import {LoRaMoteDevice} from './loramote/loramote_device';
import {NucleoDevice} from './nucleo/nucleo_device';
import {LoRaMoteCodec} from './loramote/loramote_codec';
import {NucleoCodec} from './nucleo/nucleo_codec';

export class DeviceManager {

  constructor() {
    this.devices = {};
    this.availableCodecs = {
                          loramote: { type: types.DEV_TYPE_LORAMOTE,
                                      codec: new LoRaMoteCodec() },
                          nucleo: { type: types.DEV_TYPE_NUCLEO,
                                    codec: new NucleoCodec() }
                        };
  }

  getDevices() {
    return this.devices;
  }

  tryCodecsAndReturnDeviceType(data) {
    for (let codecName in this.availableCodecs) {
      let codec = this.availableCodecs[codecName].codec;
      if (codec.mayMatch(data)) {
        return this.availableCodecs[codecName].type;
      }
    }
    return undefined;
  }

  tryToCreateDeviceFromData(eui, data) {
    let dev = undefined;
    let type = this.tryCodecsAndReturnDeviceType(data);
    if (type != undefined) {
      dev = this.createDevice(eui, type);
    } else {
      return;
    }
    return dev;
  }

  createDevice(eui, type) {
    if (this.findDevice(eui) != undefined) {
      throw new Error('Device with this EUI already exists');
    }

    switch (type) {
        case types.DEV_TYPE_LORAMOTE:
            var dev = new LoRaMoteDevice(eui);
            this.devices[eui] = dev;
            return dev;
        break;
        case types.DEV_TYPE_NUCLEO:
            var dev = new NucleoDevice(eui);
            this.devices[eui] = dev;
            return dev;
        break;
        default:
            throw Error('unsupported device type');
        break;
    }
  }

  removeDevice(eui) {
    delete this.devices[eui];
  }

  findDevice(eui) {
    return this.devices[eui];
  }

  getDeviceNb() {
    return Object.keys(this.devices).length;
  }
}