const core = require('@actions/core');
const github = require('@actions/github');

const inputs = {
  token: core.getInput('token'),
  repository: core.getInput('repository'),
  issueNumber: core.getInput('issue-number'),
  commentId: core.getInput('comment-id'),
  body: core.getInput('body'),
  editMode: core.getInput('edit-mode'),
  reactions: core.getInput('reactions')
    ? core.getInput('reactions')
    : core.getInput('reaction-type'),
};
core.debug(`Inputs: ${inspect(inputs)}`);

const octokit = github.getOctokit(inputs.token);

const repository = inputs.repository
  ? inputs.repository
  : process.env.GITHUB_REPOSITORY;
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
