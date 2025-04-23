const CustomStream = require('./customStream');
const { stdin, stdout } = require('process');

// Підключаємо CustomStream
const customStream = new CustomStream();

// Підключаємо потоки: ввід → трансформація → вивід
stdin.pipe(customStream).pipe(stdout);
