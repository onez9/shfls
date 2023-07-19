// Импортируем модуль для работ с путями
const path = require('path');

module.exports = {

  // Указываем входную точку
  entry: './src/server/server.mjs',

  // Указываем точку выхода
  output: {

    // Тут мы указываем полный путь к директории, где будет храниться конечный файл
    path: path.resolve(__dirname, 'dist'),

	// Указываем имя этого файла
    filename: 'my-first-webpack.bundle.js',
  },
};
