const semver = require('semver');
const { exec } = require('child_process');
const { writeLog } = require('../helpers');

module.exports = function tag(version, options) {
  writeLog('TASK tag');

  return new Promise((resolve, reject) => {
    if (!semver.valid(version)) {
      return reject(`CreateTag failed due invalid tag: "${version}"`);
    }

    let tagName = options.tagName.replace('%VERSION%', version);
    let tagMessage = options.tagMessage.replace('%VERSION%', version);

    exec(options.tagFormatCmd, (error, stdout, stderr) => {
      if (error) {
        return reject('Can not list the latest commits:\n  ' + stderr);
      }

      tagMessage = tagMessage + '\n' + stdout.split('\n').join(' \n');

      exec(
        `git tag -a ${tagName} -m "${tagMessage}"`,
        (error, stdout, stderr) => {
          if (error) {
            return reject(`Can't create the tag ${tagName}:\n\n${stderr}`);
          }

          resolve(`TASK tag done!\n\n${tagName}`);
        }
      );
    });
  });
};
