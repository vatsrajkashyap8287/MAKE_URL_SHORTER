const { customAlphabet } = require('nanoid');

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Encoder {
  static generateShortCode(length = 7) {
    const nanoid = customAlphabet(BASE62, length);
    return nanoid();
  }
}

module.exports = Encoder;