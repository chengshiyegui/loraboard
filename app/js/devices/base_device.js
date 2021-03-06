function addPadding(string, padChar, finalSize) {
  let paddedString = string;
  while (paddedString.length < finalSize) {
    paddedString = padChar + paddedString;
  }
  return paddedString;
}

export class BaseDevice {

  constructor(codec, eui, type, name = 'Default name') {
    this.codec = codec;
    this.eui = eui;
    this.type = type;
    this.name = name;
    this.models = {};
    this.extras = {};
    this.formattedEUI = this.buildformattedEUI(eui);
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getEUI() {
    return this.eui;
  }

  buildformattedEUI(eui) {
    let formatted = '';
    let devEui = new BigNumber(eui);
    devEui = addPadding(devEui.toString(16), '0', 16);

    for (const c in devEui) {
      if (devEui.hasOwnProperty(c)) {
        formatted += devEui[c];
        if (c % 2) {
          formatted += '-';
        }
      }
    }
    return formatted.substring(0, formatted.length - 1);
  }

  getFormattedEUI() {
    return this.formattedEUI;
  }

  getPosition() {
    return { latitude: undefined, longitude: undefined };
  }

  getCapabilities() {
    return [];
  }

  setValue(model, value) {
    // force trigger event if value is the same
    model.set({ value }, { silent: true });
    model.trigger('change');
  }

  getModels() {
    return this.models;
  }

  getType() {
    return this.type;
  }

  setType(type) {
    this.type = type;
  }

  getCodec() {
    return this.codec;
  }

  setCodec(codec) {
    this.codec = codec;
  }

  getExtras() {
    return this.extras;
  }

  setExtras(extras) {
    this.extras = extras;
  }

  processReceivedData(data) {
    const decoded = this.processData(data);
    console.log(`frame from ${this.getFormattedEUI()}, decoded data:`, decoded);
  }
  processData(data) {
    throw new Error('You _must_ implement the processData(..) method in your device class');
  }
}
