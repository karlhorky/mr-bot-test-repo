import execa from 'execa';
import action from './mr-bot-action.js';

async function init() {
  const fixturesTempDir = 'fixtures/__temp';

  async function cloneRepoToFixtures(repoPath, fixtureDirName) {
    return execa.command(
      `git clone --depth 1 --single-branch --branch=main https://github.com/${repoPath}.git ${fixturesTempDir}/${fixtureDirName} --config core.autocrlf=input`,
    );
  }

  console.log('cloning the repo...');

  await cloneRepoToFixtures(
    'upleveled/preflight-test-project-react-passing',
    'react-passing',
  );

  console.log('installing preflight...');

  await execa.command('yarn global add @upleveled/preflight');

  console.log('installing repo dependencies...');

  await execa.command('yarn', {
    cwd: `${fixturesTempDir}/react-passing`,
  });

  console.log('updating @upleveled/eslint-config-upleveled...');

  await execa.command(
    'yarn upgrade --latest @upleveled/eslint-config-upleveled',
    {
      cwd: `${fixturesTempDir}/react-passing`,
    },
  );

  console.log('cleaning the repo for preflight check...');

  await execa.command('git reset --hard HEAD', {
    cwd: `${fixturesTempDir}/react-passing`,
  });

  console.log('preflight check...');

  const { stderr, stdout } = await execa.command(`preflight`, {
    cwd: `${fixturesTempDir}/react-passing`,
  });

  console.log(stderr ? 'error' : 'good');

  const stdoutSortedWithoutVersionNumber = stdout
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
