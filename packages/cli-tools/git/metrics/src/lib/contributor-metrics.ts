import { getContributorsForPath } from '@nx-take-home-npm/data-access';

async function getContributorProjectMap(
  repoRoot: string,
  subPaths: string[]
): Promise<Map<string, Set<string>>> {
  const contributorMap = new Map<string, Set<string>>();

  for (const path of subPaths) {
    try {
      const contributors = await getContributorsForPath(repoRoot, path);
      const projectName = path.split('/').pop();

      for (const email of contributors) {
        if (!contributorMap.has(email)) {
          contributorMap.set(email, new Set());
        }
        contributorMap.get(email)?.add(projectName ?? path);
      }
    } catch (err) {
      console.error(err);
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
