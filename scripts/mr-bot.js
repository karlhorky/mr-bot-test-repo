import execa from 'execa';

async function init() {
  const fixturesTempDir = '__tests__/fixtures/__temp';

  async function cloneRepoToFixtures(repoPath, fixtureDirName) {
    return execa.command(
      `git clone --depth 1 --single-branch --branch=main https://github.com/${repoPath}.git ${fixturesTempDir}/${fixtureDirName} --config core.autocrlf=input`,
    );
  }

  await cloneRepoToFixtures(
    'upleveled/preflight-test-project-react-passing',
    'react-passing',
  );

  console.log('Domo arigato misuta Robotto');

  console.log(process.env.MY_STRING);

  console.log('::set-output name=SELECTED_COLOR::brown');
}

init;
