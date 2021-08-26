import { inspect } from 'node:util';
import core from '@actions/core';
import github from '@actions/github';

const run = async () => {
  try {
    const inputs = {
      token: process.env.GITHUB_TOKEN,
      issueNumber: process.env.ISSUE_NUMBER,
      commentId: process.env.COMMENT_ID,
      body: process.env.COMMENT_BODY,
    };

    core.debug(`Inputs: ${inspect(inputs)}`);

    const octokit = github.getOctokit(inputs.token);

    const repository = process.env.GITHUB_REPOSITORY;
    const repo = repository.split('/');

    const { data: comment } = await octokit.rest.issues.createComment({
      owner: repo[0],
      repo: repo[1],
      issue_number: inputs.issueNumber,
      body: 'Domo Arigato Misuta Roboto',
    });

    core.info(
      `Created comment id '${comment.id}' on issue '${inputs.issueNumber}'.`,
    );
    core.setOutput('comment-id', comment.id);
  } catch (error) {
    core.debug(inspect(error));
    core.setFailed(error.message);
  }
};

export default run;
