import { getBooleanInput, warning } from '@actions/core';
import { context } from '@actions/github';
import { SingleBar, Presets } from 'cli-progress';

import { Config } from './config';
import { raise } from './error';
import { Git } from './git';
import { CustomOctokit } from './octokit';
import { PullRequest } from './pull-request';
import { UpstreamRelatedCommits } from './upstream';
import { createMetadata, getFailedMessage, getSuccessMessage } from './util';

async function action(
  octokit: CustomOctokit,
  pr: PullRequest
): Promise<string | void> {
  let message: string[] = [];
  let err: string[] = [];
  let labels: { add: string[] } = { add: [] };

  const config = await Config.getConfig(octokit);

  const isWaived = pr.currentLabels.includes(config.labels['waive']);
  if (isWaived) {
    labels.add.push(config.labels['waive']);
    message.push('🟠 Mentions, Follow-ups and Revert commits - Waived');
  }

  const [upstreamOwner, upstreamRepo] = config.upstream.split('/');
  let detectedReverts = new UpstreamRelatedCommits(
    { heading: 'Reverts', tableHeader: 'revert' },
    upstreamOwner,
    upstreamRepo
  );
  let detectedFollowUps = new UpstreamRelatedCommits(
    { heading: 'Follow-ups', tableHeader: 'follow-up' },
    upstreamOwner,
    upstreamRepo
  );
  let detectedMentions = new UpstreamRelatedCommits(
    { heading: 'Commit mentions', tableHeader: 'mention' },
    upstreamOwner,
    upstreamRepo
  );

  // clone upstream and downstream git repo
  const upstreamGit = new Git(
    upstreamOwner,
    upstreamRepo,
    'abc_UpstreamRepo_cba'
  );
  const downstreamGit = new Git(
    context.repo.owner,
    context.repo.repo,
    'abc_DownstreamRepo_cba'
  );

  upstreamGit.clone();
  downstreamGit.clone();

  // Create progress bar for commit processing
  const progressBar = new SingleBar(
    {
      format:
        'Processing commits |{bar}| {percentage}% || {value}/{total} commits || ETA: {eta}s',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    },
    Presets.shades_classic
  );

  // Start progress bar
  progressBar.start(pr.commits.length, 0);

  // Process commits with progress tracking
  for (let i = 0; i < pr.commits.length; i++) {
    const commit = pr.commits[i];

    if (getBooleanInput('check-revert', { required: true })) {
      let reverts: string[] = [];

      commit.message.cherryPick.map(cherryPick => {
        reverts.push(
          ...upstreamGit.grepLog(cherryPick.sha, config.filters.revert)
        );
      });

      // remove commits included in the pull request
      reverts = reverts.filter(revert => !pr.isUpstreamCommitIncluded(revert));

      // remove commits that are already backported to downstream (async operation)
      const revertFilterPromises = reverts.map(async revert =>
        !(await pr.isUpstreamCommitBackPorted(
          downstreamGit,
          config.filters['cherry-pick'],
          revert
        ))
          ? revert
          : null
      );
      const filteredReverts = (await Promise.all(revertFilterPromises)).filter(
        Boolean
      ) as string[];

      if (filteredReverts.length > 0) {
        detectedReverts.addResultEntry(filteredReverts, commit);
      }
    }

    if (getBooleanInput('check-follow-up', { required: true })) {
      let followUps: string[] = [];

      commit.message.cherryPick.map(cherryPick => {
        followUps.push(
          ...upstreamGit.grepLog(cherryPick.sha, config.filters['follow-up'])
        );
      });

      // remove commits included in the pull request
      followUps = followUps.filter(
        followUp => !pr.isUpstreamCommitIncluded(followUp)
      );

      // remove commits that are already backported to downstream (async operation)
      const followUpFilterPromises = followUps.map(async followUp =>
        !(await pr.isUpstreamCommitBackPorted(
          downstreamGit,
          config.filters['cherry-pick'],
          followUp
        ))
          ? followUp
          : null
      );
      const filteredFollowUps = (
        await Promise.all(followUpFilterPromises)
      ).filter(Boolean) as string[];

      if (filteredFollowUps.length > 0) {
        detectedFollowUps.addResultEntry(filteredFollowUps, commit);
      }
    }

    if (getBooleanInput('check-mentions', { required: true })) {
      let mentions: string[] = [];

      commit.message.cherryPick.map(cherryPick => {
        mentions.push(
          ...upstreamGit.grepLog(cherryPick.sha, config.filters.mention)
        );
      });

      // remove commits included in the pull request
      mentions = mentions.filter(
        mention => !pr.isUpstreamCommitIncluded(mention)
      );

      // remove commits that are already backported to downstream (async operation)
      const mentionFilterPromises = mentions.map(async mention =>
        !(await pr.isUpstreamCommitBackPorted(
          downstreamGit,
          config.filters['cherry-pick'],
          mention
        ))
          ? mention
          : null
      );
      const filteredMentions = (
        await Promise.all(mentionFilterPromises)
      ).filter(Boolean) as string[];

      // remove mention commits that are in follow-ups or reverts
      const finalMentions = filteredMentions.filter(
        mention =>
          !detectedFollowUps.results.some(({ commits }) =>
            commits.some(commit => commit.sha === mention)
          ) &&
          !detectedReverts.results.some(({ commits }) =>
            commits.some(commit => commit.sha === mention)
          )
      );

      if (finalMentions.length > 0) {
        detectedMentions.addResultEntry(finalMentions, commit);
      }
    }

    // Update progress bar
    progressBar.update(i + 1);
  }

  // Stop progress bar
  progressBar.stop();

  let statusSummary: string[] = [];
  let statusTables: string[] = [];

  if (detectedReverts.isRelatedCommitDetected()) {
    warning('Some reverts detected');
    if (!isWaived) {
      labels.add.push(config.labels['revert']);
      statusSummary.push(
        '🔴 Some revert commits for this Pull Request were detected in upstream'
      );
    } else {
      if (pr.currentLabels.includes(config.labels['revert'])) {
        await pr.removeLabel(config.labels['revert']);
      }
    }
    statusTables.push(detectedReverts.getStatusMessage() + '\n');
  } else {
    if (pr.currentLabels.includes(config.labels['revert'])) {
      await pr.removeLabel(config.labels['revert']);
    }
  }

  if (detectedFollowUps.isRelatedCommitDetected()) {
    warning('Some follow-ups detected');
    if (!isWaived) {
      labels.add.push(config.labels['follow-up']);
      statusSummary.push(
        '🔴 Some follow-up commits for this Pull Request were detected in upstream'
      );
    } else {
      if (pr.currentLabels.includes(config.labels['follow-up'])) {
        await pr.removeLabel(config.labels['follow-up']);
      }
    }
    statusTables.push(detectedFollowUps.getStatusMessage() + '\n');
  } else {
    if (pr.currentLabels.includes(config.labels['follow-up'])) {
      await pr.removeLabel(config.labels['follow-up']);
    }
  }

  if (detectedMentions.isRelatedCommitDetected()) {
    warning('Some mentions detected');
    if (!isWaived) {
      labels.add.push(config.labels['mention']);
      statusSummary.push(
        '🔴 Some mentions of commits from this Pull Request were detected in upstream'
      );
    } else {
      if (pr.currentLabels.includes(config.labels['mention'])) {
        await pr.removeLabel(config.labels['mention']);
      }
    }
    statusTables.push(detectedMentions.getStatusMessage() + '\n');
  } else {
    if (pr.currentLabels.includes(config.labels['mention'])) {
      await pr.removeLabel(config.labels['mention']);
    }
  }

  const metadata = createMetadata([
    ...detectedReverts.getMetadata(),
    ...detectedFollowUps.getMetadata(),
    ...detectedMentions.getMetadata(),
  ]);

  await pr.setLabels(labels.add);
  err.push(...statusSummary, ...statusTables);

  if (err.length > 0) {
    const status =
      metadata +
      '\n' +
      // Show '#### Failed' header only when there is a failed message
      getFailedMessage(err, statusSummary.length > 0) +
      '\n\n' +
      getSuccessMessage(message);

    // Don't raise error if waive label is set
    if (isWaived) {
      return status;
    }

    raise(status);
  }

  // success message only when waive label is set otherwise don't show success message only failed message
  if (message.length > 0) {
    return metadata + '\n' + getSuccessMessage(message);
  }
}

// TODO:
//? - when no message is returned issue commentator still adds --- in the comment
//! - add tests for action
//! - add readme
//! - remove development debug logs
//! - add regular/debug logs

export default action;
