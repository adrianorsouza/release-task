const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { writeLog } = require('../helpers');

module.exports = async function bump(version, options) {
  writeLog('TASK bump');

  const result = [];
  options.bumpFiles.forEach((file) => {
    const filePath = path.resolve(file);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Bump ${file} does not exists ${filePath}`);
    }

    // bump the file version
    const data = require(path.resolve(file));

    if (!data.version || !semver.valid(data.version)) {
      throw new Error(
        `Bump file ${file} was not update due invalid version: "${data.version}"`
      );
    }

    data.version = version;
    const content =
      JSON.stringify(data, null, options.config.indentSize) + '\n';
    fs.writeFileSync(filePath, content, 'utf8');
    result.push(file);
  });

  return `TASK bump done! ${result.join(` | `)}\n`;
};
