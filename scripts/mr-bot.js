import execa from 'execa';
import action from './mr-bot-action.js';

const fixturesTempDir = 'fixtures/__temp';

async function init() {
  async function cloneRepoToFixtures(repoPath, fixtureDirName) {
    return execa.command(
      `git clone --depth 1 --single-branch --branch=main https://github.com/${repoPath}.git ${fixturesTempDir}/${fixtureDirName} --config core.autocrlf=input`,
    );
  }

  console.log('step 1');

  await cloneRepoToFixtures(
    'upleveled/preflight-test-project-react-passing',
    'react-passing',
  );

  console.log('step 2');

  await execa.command('yarn', {
    cwd: `${fixturesTempDir}/react-passing`,
  });

  console.log('step 2.5');

  await execa.command(
    'yarn upgrade --latest @upleveled/eslint-config-upleveled',
    {
      cwd: `${fixturesTempDir}/react-passing`,
    },
  );

  await execa.command('git reset --hard HEAD', {
    cwd: `${fixturesTempDir}/react-passing`,
  });

  console.log('step 3');

  await execa.command(`preflight`, {
    cwd: `${fixturesTempDir}/react-passing`,
  });

  console.log(ans.stderr ? 'error' : 'good');

  const stdoutSortedWithoutVersionNumber = ans.stdout
    .replace(/(UpLeveled Preflight) v\d+\.\d+\.\d+/, '$1')
    .split('\n')
    .sort((a, b) => {
      if (b.includes('UpLeveled Preflight')) return 1;
      return a < b ? -1 : 1;
    })
    .join('\n');

  console.log(stdoutSortedWithoutVersionNumber);

  await action();
}

init();
