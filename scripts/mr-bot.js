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

  console.log(stderr ? 'error' : 'good');
  console.log(stderr || stdout);

  const ans = await execa.command(
    `preflight ./${fixturesTempDir}/react-passing`,
  );

  console.log(ans.stderr ? 'error' : 'good');
  console.log(ans.stdout);

  console.log(`::set-output name=SELECTED_COLOR::${ans.stdout}`);
}

init();
