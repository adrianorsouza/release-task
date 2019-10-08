const semver = require('semver');

module.exports = function prompt(options) {

   const {currentVersion, actions} = options;

   const defaultActions = [{
      checked: true,
      value: 'bump',
      name: 'Version Bump (package.json)'
   }, {
      checked: false,
      value: 'changelog',
      name: 'Update Changelog'
   }, {
      checked: false,
      value: 'commit',
      name: 'Commit Changes'
   }, {
      checked: false,
      value: 'tag',
      name: 'Create Tag'
   }].concat(actions);

   return [
      {
         // ---------------------------------
         // SELECT VERSION TYPE
         // ---------------------------------
         type: 'list',
         name: 'release',
         message: 'Define the release\n',
         default: 'patch',
         choices: [
            {
               value: 'prerelease',
               name: 'Unstable:  ' + (currentVersion + '-?') + ' Unstable, betas, and release candidates.'
            },
            {
               value: 'patch',
               name: 'Patch:  ' + semver.inc(currentVersion, 'patch') + ' Backwards-compatible bug fixes.'
            },
            {
               value: 'minor',
               name: 'Minor:  ' + semver.inc(currentVersion, 'minor') + ' Add functionality in a backwards-compatible manner.'
            },
            {
               value: 'major',
               name: 'Major:  ' + semver.inc(currentVersion, 'major') + ' Incompatible API changes.'
            },

         ],
         filter: value => value,
      },
      // ---------------------------------
      // Prerelease tag
      // ---------------------------------
      {
         type: 'list',
         name: 'releaseTag',
         default: 'prerelease',
         message: 'Prerelease Tag',
         choices: [
            {
               name: 'prepatch'
            },
            {
               name: 'prerelease'
            },
            {
               name: 'preminor'
            },
            {
               name: 'premajor'
            }
         ],
         when: value => value.release === 'prerelease'
      },
      // ---------------------------------
      // Prerelease Identifiers
      // ---------------------------------
      {
         name: 'releaseId',
         type: 'list',
         message: 'Prerelease Identifiers',
         default: 'rc',
         choices: [
            {
               name: 'alpha'
            },
            {
               name: 'beta'
            },
            {
               name: 'rc'
            }
         ],
         when: prev => prev.release === 'prerelease'
      },

      // ---------------------------------
      // Actions to do after release
      // ---------------------------------
      {
         type: 'checkbox',
         name: 'actions',
         message: 'Actions?\n',
         default: [], // default value if nothing is entered
         choices: defaultActions,

         filter: answers => {

            let filterAnswers = {};
            defaultActions.forEach(({value}) => {
               filterAnswers[value] = answers.indexOf(`${value}`) >= 0;
            });

            return filterAnswers;
         },

         when: () => true,
      }
   ];
};
