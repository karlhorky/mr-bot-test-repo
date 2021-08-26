import execa from 'execa';

const fixturesTempDir = 'fixtures/__temp';
// git clone --depth 1 --single-branch --branch=main https://github.com/upleveled/preflight-test-project-react-passing.git fixtures/__temp/react-passing --config core.autocrlf=input
async function init() {
  async function cloneRepoToFixtures(repoPath, fixtureDirName) {
    return execa.command(
      `git clone --depth 1 --single-branch --branch=main https://github.com/${repoPath}.git ${fixturesTempDir}/${fixtureDirName} --config core.autocrlf=input`,
    );
  }

  console.log('step 1');

  const { stderr, stdout } = await cloneRepoToFixtures(
    'upleveled/preflight-test-project-react-passing',
    'react-passing',
  );

  console.log('Domo arigato misuta Robotto');

  // const anss = await execa.command('yarn --frozen-lockfile', {
  //   cwd: `${fixturesTempDir}/react-passing`,
  // });

  console.log('step 2');
  // console.log(__dirname);
  console.log(process.cwd());

  const anss = await execa.command('yarn', {
    cwd: `${fixturesTempDir}/react-passing`,
  });

  console.log('step 2.5');

  const ansse = await execa.command(
    'yarn upgrade --latest @upleveled/eslint-config-upleveled',
    {
      cwd: `${fixturesTempDir}/react-passing`,
    },
  );

  const ansas = await execa.command('git reset --hard HEAD', {
    cwd: `${fixturesTempDir}/react-passing`,
  });

  console.log('step 3');

  const ans = await execa.command(`preflight`, {
    cwd: `../fixtures/__temp/react-passing`,
  });

  console.log(ans.stderr ? 'error' : 'good');
  // console.log(ans.stdout);

  const stdoutSortedWithoutVersionNumber = ans.stdout
    .replace(/(UpLeveled Preflight) v\d+\.\d+\.\d+/, '$1')
    .split('\n')
    .sort((a, b) => {
      if (b.includes('UpLeveled Preflight')) return 1;
      return a < b ? -1 : 1;
    })
    .join('\n');

  console.log(
    `::set-output name=SELECTED_COLOR::${stdoutSortedWithoutVersionNumber}`,
  );
}

init();
