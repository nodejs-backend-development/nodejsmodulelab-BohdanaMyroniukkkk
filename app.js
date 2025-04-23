const http = require('http');
const fs = require('fs');
const split2 = require('split2');
const through2 = require('through2');
const path = require('path');

// Точний шлях до вашого CSV файлу
const csvFilePath = "C:\\Users\\myroniukkk\\OneDrive\\Робочий стіл\\js\\lab2\\nodejsmodulelab-BohdanaMyroniukkkk\\data.csv";

// Порт сервера
const PORT = process.env.PORT || 3000;

// Функція для читання CSV файлу та конвертації в масив об'єктів
function readCsvAndConvertToJson() {
  return new Promise((resolve, reject) => {
    const results = [];
    let headers = null;
    
    console.log(`Починаємо читати файл: ${csvFilePath}`);

    // Перевіряємо існування файлу перед його читанням
    if (!fs.existsSync(csvFilePath)) {
      return reject(new Error(`Файл не знайдено: ${csvFilePath}`));
    }

    fs.createReadStream(csvFilePath)
      .on('error', (err) => {
        reject(new Error(`Помилка читання файлу: ${err.message}`));
      })
      .pipe(split2())
      .pipe(
        through2.obj(function (line, enc, callback) {
          // Пропускаємо порожні рядки
          if (!line.trim()) {
            return callback();
          }

          // Розділяємо рядок на значення
          const values = line.split(',').map(value => value.trim());

          // Якщо це перший рядок, зберігаємо як заголовки
          if (!headers) {
            headers = values;
            console.log(`Знайдено заголовки: ${headers.join(', ')}`);
            return callback();
          }

          // Створюємо об'єкт з поточного рядка даних
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });

          results.push(obj);
          callback();
        })
      )
      .on('data', () => {})
      .on('end', () => {
        console.log(`Зчитано ${results.length} записів`);
        resolve(results);
      })
      .on('error', err => {
        reject(new Error(`Помилка обробки файлу: ${err.message}`));
      });
  });
}

// Створюємо HTTP сервер
const server = http.createServer(async (req, res) => {
  // Обробляємо лише GET запити
  if (req.method === 'GET') {
    try {
      console.log(`Отримано GET запит: ${req.url}`);
      
      // Читаємо і конвертуємо CSV файл
      const jsonData = await readCsvAndConvertToJson();
      
      // Налаштування заголовків відповіді
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      
      // Відправляємо дані у форматі JSON
      res.end(JSON.stringify(jsonData, null, 2));
      
      console.log('Дані успішно відправлені клієнту');
    } catch (error) {
      console.error('Помилка:', error.message);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        error: error.message 
      }, null, 2));
    }
  } else {
    // Якщо метод не GET
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Метод не підтримується' }));
  }
});

// Запускаємо сервер
server.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
  console.log(`Шлях до CSV файлу: ${csvFilePath}`);
  
  // Перевіряємо наявність файлу при запуску
  if (fs.existsSync(csvFilePath)) {
    console.log('CSV файл знайдено!');
  } else {
    console.error(`УВАГА: Файл не знайдено: ${csvFilePath}`);
  }
});