import { simpleGit } from 'simple-git';
import { resolve } from 'path';

export async function getContributorsForPath(
  repoRoot: string,
  subPath: string
): Promise<Set<string>> {
  const git = simpleGit(resolve(repoRoot));

  try {
    const log = await git.raw([
      'log',
      '--pretty=format:%ae',
      '--',
      subPath, // ← scoped path (e.g., 'packages/folderA')
    ]);

    const emails = log
      .split('\n')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    return new Set(emails);
  } catch (err) {
    throw new Error(
      `Failed to get contributors for ${subPath}: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
