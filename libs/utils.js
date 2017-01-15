'use strict';

const chalk = require('chalk');

let printError  = message => {
    console.error(chalk.red(message));
};

let printInfo  = message => {
    console.info(chalk.green(message));
};

module.exports = {
    printError: printError,
    printInfo: printInfo
};
