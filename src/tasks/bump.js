
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const {writeLog} = require('../helpers');

module.exports = function bump(version, options) {

   writeLog('TASK bump');

   return new Promise((resolve, reject) => {

      const result = [];
      options.bumpFiles.forEach(file => {

         const filePath = path.resolve(file);

         if (! fs.existsSync(filePath)) {
            reject(`Bump ${file} does not exists ${filePath}`);
            return;
         }

         // bump the file version
         const data = require(path.resolve(file));

         if (!data.version || !semver.valid(data.version)) {
            reject(`Bump file ${file} was not update due invalid version: "${data.version}"`);
            return;
         }

         data.version = version;
         const content = JSON.stringify(data, null, options.config.indentSize)+"\n";
         fs.writeFileSync(filePath, content, 'utf8');
         result.push(file)

      });

      resolve(`TASK bump done! ${result.join(` | `)}\n`);
   })
};
