import { getContributorsForPath } from '@nx-take-home-npm/data-access';

async function getContributorProjectMap(
  repoRoot: string,
  subPaths: string[]
): Promise<Map<string, Set<string>>> {
  const contributorMap = new Map<string, Set<string>>();

  const results = await Promise.all(
    subPaths.map(async (path) => {
      try {
        const contributors = await getContributorsForPath(repoRoot, path);
        const projectName = path.split('/').pop() ?? path;
        return { path, projectName, contributors };
      } catch (err) {
        console.error(`❌ Failed to process ${path}:`, err);
        return null;
      }
    })
  );

  for (const result of results) {
    if (!result) continue;
    for (const email of result.contributors) {
      if (!contributorMap.has(email)) {
        contributorMap.set(email, new Set());
      }
      contributorMap.get(email)?.add(result.projectName);
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
