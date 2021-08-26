// import execa from 'execa';
import comment from './mr-bot-action.js';

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
    .split(/.*(\r?\n|$)/)
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
  }
}

init();
