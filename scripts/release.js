const { exec } = require('child_process');
const releaseTask = require('../index');
const { writeLog } = require('../src/helpers');

// This is a sample of a custom task that push changes to origin
// releaseTask expose the method addTask witch takes three arguments
// the task name, task function and the action checkbox values
const push = () => {
  writeLog('TASK push');
  return new Promise((resolve, reject) => {
    exec('git push -u origin master --tags 2>&1', (err, stdout, stderr) => {
      if (err) reject(`TASK push result an error ${err}`);
      resolve(`TASK push has been completed. ${stdout}`);
    });
  });
};

// create a new instance of releaseTask
const tasks = new releaseTask({
  bumpFiles: ['package.json'],
  commitFiles: ['package.json', 'CHANGELOG.md'],
});

// Create a custom task named push
tasks.addTask('push', push, {
  checked: false,
  value: 'push',
  name: 'Push new releases',
});

tasks.init();
