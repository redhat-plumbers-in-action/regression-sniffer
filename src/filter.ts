export function gitHubUrlFilter(owner: string, repo: string) {
  return `https:\\/\\/github\\.com\\/${owner}\\/${repo}\\/commit\\/`;
}

export const shaFilter = '%{sha}%';

export function commitFilter(owner: string, repo: string) {
  return `(${gitHubUrlFilter(owner, repo)})?(${shaFilter})`;
}
