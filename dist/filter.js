export function gitHubUrlFilter(owner, repo) {
    return `https:\\/\\/github\\.com\\/${owner}\\/${repo}\\/commit\\/`;
}
export const shaFilter = '%{sha}%';
export function commitFilter(owner, repo) {
    return `(${gitHubUrlFilter(owner, repo)})?(${shaFilter})`;
}
//# sourceMappingURL=filter.js.map