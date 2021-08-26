import execa from 'execa';
import comment from './mr-bot-action.js';

const pattern = `
🚀 UpLeveled Preflight
[STARTED] All changes committed to Git
[STARTED] ESLint
[STARTED] ESLint config is latest version
[STARTED] GitHub repo has deployed project link under About
[STARTED] No dependencies without types
[STARTED] No dependency problems
[STARTED] No extraneous files committed to Git
[STARTED] No secrets committed to Git
[STARTED] No unused dependencies
[STARTED] Preflight is latest version
[STARTED] Prettier
[STARTED] Use single package manager
[STARTED] node_modules/ folder ignored in Git
[SUCCESS] All changes committed to Git
[SUCCESS] ESLint
[SUCCESS] ESLint config is latest version
[SUCCESS] GitHub repo has deployed project link under About
[SUCCESS] No dependencies without types
[SUCCESS] No dependency problems
[SUCCESS] No extraneous files committed to Git
[SUCCESS] No secrets committed to Git
[SUCCESS] No unused dependencies
[SUCCESS] Preflight is latest version
[SUCCESS] Prettier
[SUCCESS] Use single package manager
[SUCCESS] node_modules/ folder ignored in Git
`;

const messageExamples = {
  good: `
@upleveled ready to check
Repo: https://github.com/josehower/myprojecturl
Deployed: https://myproject.netlify.app
  `,
  bad: `
  Deployed: https://myproject.netlify.app
  @upleveled ready to check
Repo: https://github.com/josehower/myprojecturl
  `,
};

async function init() {
  /**
   * TODO:
   *
   * - Check the links are there
   * - Check pre-flight runs smooth
   * - Answer according errors founded 1 and 2
   * - Tag tech person when issue is ready for review
   *
   */

  // Check the links are there
  // console.log(process.env.COMMENT_BODY.split('\n'));
  const message = process.env.COMMENT_BODY || messageExamples.bad;

  console.log('message', message);
  const splittedMessage = message
    .trim()
    .split(/(\r?\n|$)/)
    .filter((line) => line !== '')
    .map((line) => line.replaceAll(' ', ''));

  console.log('splittedMessage', splittedMessage);

  const botCall = splittedMessage.some(
    (line) => line === '@upleveledreadytocheck',
  );

  console.log(botCall);
  if (!botCall) {
    console.log(botCall);
    return comment("The Bot wasn't invoked");
  }

  const repoUrl = splittedMessage
    .find((line) => line?.toLowerCase().split(/repo:(.+)/)[1])
    ?.toLowerCase()
    .split(/repo:(.+)/)[1];
  const deployUrl = splittedMessage
    .find((line) => line?.toLowerCase().split(/deployed:(.+)/)[1])
    ?.toLowerCase()
    .split(/deployed:(.+)/)[1];

  const errors = [];

  if (!repoUrl) errors.push({ id: 1, message: 'I need a repo to review' });
  if (!deployUrl)
    errors.push({
      id: 2,
      message: "I can't find the deployed version of your project",
    });

  if (errors.length) {
    let message = '';
    errors.forEach((error) => (message += error.message + '\n'));
    comment(message.trim());
  } else {
    // --------------- from here

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
    console.log('--------------------------');
    console.log('-                        -');
    console.log('--------------------------');
    console.log(pattern);
    console.log(
      'is equal??',
      stdoutSortedWithoutVersionNumber.trim() === pattern.trim(),
    );
    console.log(
      'it match?',
      stdoutSortedWithoutVersionNumber.trim().match(pattern.trim()),
    );
    comment('@josehower This is ready for you');
  }
}

init();
