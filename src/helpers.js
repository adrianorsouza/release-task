const chalk = require('chalk');

const errorLog = (msg) => console.log(`==> ${chalk.bgRed.bold(msg)}\n`);
const writeLog = (msg) => console.log(`==> ${chalk.green(msg)}\n`);

module.exports = {
  errorLog,
  writeLog,
};
