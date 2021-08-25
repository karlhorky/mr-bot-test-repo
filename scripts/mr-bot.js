import execa from 'execa';

const fixturesTempDir = 'fixtures/__temp';

async function init() {
  async function cloneRepoToFixtures(repoPath, fixtureDirName) {
    return execa.command(
      `git clone --depth 1 --single-branch --branch=main https://github.com/${repoPath}.git ${fixturesTempDir}/${fixtureDirName} --config core.autocrlf=input`,
    );
  }

  const { stderr, stdout } = await cloneRepoToFixtures(
    'upleveled/preflight-test-project-react-passing',
    'react-passing',
  );

  console.log('Domo arigato misuta Robotto');

  const ans = await execa.command(
    `preflight ./${fixturesTempDir}/react-passing`,
  );

  const anss = await execa.command('yarn --frozen-lockfile', {
    cwd: `${fixturesTempDir}/react-passing`,
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
