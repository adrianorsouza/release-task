
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const inquirer = require('inquirer');
const series = require('run-series');
const bump = require('./tasks/bump');
const tag = require('./tasks/tag');
const changelog = require('./tasks/changelog');
const commit = require('./tasks/commit');
const promptChoices = require('./prompt');
const {errorLog, writeLog} = require('./helpers');
const {name, version} = require(path.resolve('package.json'));

const defaults = {
   currentVersion: version,
   bumpFiles: ['package.json'],
   commitFiles: ['package.json', 'CHANGELOG.md'],
   commitMessage: 'chore(release): v%VERSION%',
   changelog: {
      gitChangeLog: `git --no-pager log`,
      gitChangeLogArguments: [
         '@{push}..',
         '--pretty=format:"%ad - %s"',
         '--date=short',
      ],
      filename: 'CHANGELOG.md',
      header: `# Changelog`,
      template: `Version %VERSION% - %DATE%\n===========================\n\n%CHANGES%`,
   },
   tagFormatCmd: `git log @{push}.. --date=iso8601 --pretty=format:"- %s"`,
   tagName: 'v%VERSION%',
   tagMessage: name || '',
   actions: [],
   config: {
      indentSize: 2,
   }
};

const prompt = inquirer.createPromptModule();

module.exports = function releaseTask(options) {

   this.options = {
      ...defaults,
      ...options,
   };

   /**
    * Default task property.
    *
    * @property {Object} tasks Default task object.
    * */
   this.tasks = {
      bump,
      changelog,
      tag,
      commit,
   };

   /**
    * Adds a new task the prompt
    *
    * @param {String}   task    The task name.
    * @param {Function} handler The task function handler.
    * @param {String}   name    The name of the action
    * @param {String}   value   The value of the action: NOTE: Should be the same as task name.
    * @param {Boolean}  checked The default value for the action checked
    * */
   this.addTask = (task, handler, {name, value, checked}) => {

      this.tasks[task] = handler;

      this.options.actions.push({
         checked,
         value,
         name,
      })
   };

   this.init = () => {

      prompt(promptChoices(this.options))

         .then(answers => {

            const queue = [];
            const tasks = this.tasks;
            const {release, releaseTag, releaseId, actions} = answers;

            // --------------------------------------------------------
            // version increment
            // --------------------------------------------------------
            const incVersion = (release === 'prerelease')
               ? semver.inc(version, releaseTag, releaseId)
               : semver.inc(version, release);

            Object.keys(actions).forEach(task => {

               const error = [];
               queue.push((callback) => {

                  if (typeof tasks[task] !== 'function') {
                     error.push(`Task Error: ${task} is not a function: ${typeof tasks[task]}`);
                  }

                  if (! tasks[task] instanceof Promise) {
                     error.push(`Task Error ${task} should return a Promise`);
                  }

                  if (! actions[task]) {
                     error.push(`SKIP ${task}`);
                  }

                  if (error.length) {
                     callback(null, chalk.yellow(`${error.join(" - ")}`));
                     return;
                  }

                  tasks[task](incVersion, this.options)
                     .then(result => callback(null, result))
                     .catch(err => callback(err))
                  ;
               })
            });

            series(queue, function (err, results) {

               if (err) {
                  errorLog(err);
               }

               writeLog(chalk.blueBright(
                  '===================================='
               ));

               results.forEach(result => {
                  writeLog(result);
               });
            });
         });
   }
};
