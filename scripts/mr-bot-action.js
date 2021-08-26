import { inspect } from 'node:util';
import core from '@actions/core';
import github from '@actions/github';

const comment = async (message = 'Domo Arigato Misuta Roboto') => {
  try {
    const inputs = {
      token: process.env.GITHUB_TOKEN,
      issueNumber: process.env.ISSUE_NUMBER,
      commentId: process.env.COMMENT_ID,
      body: message,
    };

    core.debug(`Inputs: ${inspect(inputs)}`);

    const octokit = github.getOctokit(inputs.token);

    const repository = process.env.GITHUB_REPOSITORY;
    const repo = repository.split('/');

    const { data: comment } = await octokit.rest.issues.createComment({
      owner: repo[0],
      repo: repo[1],
      issue_number: inputs.issueNumber,
      body: inputs.body,
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

export default comment;
