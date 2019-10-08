
const {exec} = require('child_process');
const {writeLog} = require('../helpers');

module.exports = function commit(version, options) {

   writeLog('TASK commit');

   const commitMsg = options.commitMessage.replace(/%VERSION%/, version);
   const cmd = `git commit ${options.commitFiles.join(' ')} -m "${commitMsg}"`;

   return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
         if (err) {
            reject(err)
         }

         resolve(`commit done!\n\n${stdout}`);
      });
   })
};
