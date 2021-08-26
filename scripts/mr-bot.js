// import execa from 'execa';
// import action from './mr-bot-action.js';

const messageExamples = {
  good: `
  @upleveled ready to check
  Repo: https://github.com/josehower/myprojecturl
  Deployed: https://myproject.netlify.app
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
  console.log(process.env.COMMENT_BODY);
  console.log(messageExamples.good);

  // await action();
}

init();
