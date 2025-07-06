import { simpleGit } from 'simple-git';
import { resolve } from 'path';

export async function getContributorProjectMap(
  repoRoot: string,
  subPaths: string[]
): Promise<Map<string, Set<string>>> {
  const contributorMap = new Map<string, Set<string>>();
  const git = simpleGit(resolve(repoRoot));

  console.time('⏱ Single git log for all packages');

  const log = await git.raw([
    'log',
    '--name-only',
    '--pretty=format:%ae',
    '--',
    ...subPaths,
  ]);

  console.timeEnd('⏱ Single git log for all packages');

  let currentEmail = '';
  const lines = log.split('\n');

  const pathToProject = new Map<string, string>();
  for (const sub of subPaths) {
    const parts = sub.split('/');
    const project = parts[parts.length - 1];
    pathToProject.set(sub, project);
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.includes('@')) {
      currentEmail = trimmed;
    } else if (currentEmail) {
      for (const [subPath, projectName] of pathToProject.entries()) {
        if (trimmed.startsWith(subPath)) {
          if (!contributorMap.has(currentEmail)) {
            contributorMap.set(currentEmail, new Set());
          }
          contributorMap.get(currentEmail)?.add(projectName);
          break;
        }
      }
    }
  }

  console.log(`Contributors found: ${contributorMap.size}`);
  return contributorMap;
}

/**
 * Counts how many contributors worked in more than one distinct package.
 */
export async function countMultiProjectContributors(
  repoRoot: string,
  paths: string[]
): Promise<number> {
  const contributorMap = await getContributorProjectMap(repoRoot, paths);
  let count = 0;

  for (const projects of contributorMap.values()) {
    if (projects.size > 1) count++;
  }

  return count;
}
