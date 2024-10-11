import { getInput, info, setFailed, setOutput } from '@actions/core';
import { exit } from 'node:process';
import '@total-typescript/ts-reset';
import action from './action';
import { getOctokit } from './octokit';
import { RegressionError } from './error';
import { pullRequestMetadataSchema } from './schema/input';
import { PullRequest } from './pull-request';
const octokit = getOctokit(getInput('token', { required: true }));
const prMetadataUnsafe = JSON.parse(getInput('pr-metadata', { required: true }));
const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
const statusTitle = getInput('status-title', { required: true });
try {
    const pr = new PullRequest(prMetadata, octokit);
    await pr.getLabels();
    let message = await action(octokit, pr);
    // When no related commits are found, we don't want to set the status output
    if (message === undefined) {
        info('No related upstream commits found.');
        exit(0);
    }
    if (statusTitle.length > 0) {
        message = `### ${statusTitle}\n\n${message}`;
    }
    setOutput('status', JSON.stringify(message));
}
catch (error) {
    let message;
    if (error instanceof Error) {
        message = error.message;
    }
    else {
        message = JSON.stringify(error);
    }
    if (statusTitle.length > 0) {
        message = `### ${statusTitle}\n\n${message}`;
    }
    // set status output only if error was thrown by us
    if (error instanceof RegressionError) {
        setOutput('status', JSON.stringify(message));
    }
    setFailed(message);
}
//# sourceMappingURL=main.js.map