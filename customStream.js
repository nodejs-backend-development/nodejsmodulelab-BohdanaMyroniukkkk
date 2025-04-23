const { Transform } = require('stream');

// Створюємо клас CustomStream
class CustomStream extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const input = chunk.toString();
    const transformed = input.split('').map(char => {
      return /[a-z]/i.test(char) && isNaN(char) ? char.toUpperCase() : char;
    }).join('');

    console.log('Лог:', transformed); // Вивід у консоль
    this.push(transformed); // Продовжуємо передавати далі (опціонально)
    callback();
  }
}

module.exports = CustomStream;
