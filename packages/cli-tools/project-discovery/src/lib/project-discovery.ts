import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export function projectDiscovery(repoPath: string): string[] {
  const packagesPath = join(repoPath, 'packages');

  if (!existsSync(packagesPath)) {
    console.warn(
      `❗️Warning: No packages/ directory found in ${repoPath}. Repository structure may not match expectations.`
    );
    return [];
  }

  try {
    const entries = readdirSync(packagesPath);
    const folders = entries.filter((entry) => {
      const entryPath = join(packagesPath, entry);
      return statSync(entryPath).isDirectory();
    });

    console.log(`📦 Discovered packages in ${packagesPath}:`, folders);
    return folders;
  } catch (error) {
    throw new Error(
      `Failed to read packages directory at ${packagesPath}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
