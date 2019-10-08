
const fs = require('fs');
const chalk = require('chalk');
const dayjs = require('dayjs');
const {exec} = require('child_process');
const {writeLog} = require('../helpers');

module.exports = function changelog(version, options) {

   writeLog('TASK changelog');

   return new Promise((resolve, reject) => {

      const cmd = `${options.changelog.gitChangeLog} ${options.changelog.gitChangeLogArguments.join(' ')}`;

      exec(cmd, (error, stdout, stderr) => {

         if (error) {
            return reject('Can not list the latest commits message for changelog:\n  ' + stderr);
         }

         const currentChangelogContent = fs.readFileSync(options.changelog.filename, 'utf8');
         const changes = stdout.split("\n").map(line => `  - ${line}`).join("\n");

         const changelogHeader = options.changelog.header;
         const changelogChanges = options.changelog.template
            .replace(/%VERSION%/, version)
            .replace(/%DATE%/, dayjs().format('YYYY-MM-DD'))
            .replace(/%CHANGES%/, changes)
         ;
         const changelogContent = currentChangelogContent.replace(/# Changelog/, '');

         const template = `${changelogHeader}\n\n${changelogChanges}\n${changelogContent}`;

         fs.writeFile(options.changelog.filename, template, 'utf8', (err, content) => {
            if (err) return reject(`Update Changelog file error: ${err}`);
            resolve(`TASK changelog filename: ${options.changelog.filename} was updated:\n\n${chalk.reset(changes)}`);
         });
      })
   })
};
