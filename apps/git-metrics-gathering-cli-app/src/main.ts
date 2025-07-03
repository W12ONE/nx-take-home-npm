/* eslint-disable @nx/enforce-module-boundaries */
import { join } from 'path';
import { Command } from 'commander';
import { projectDiscovery } from '@nx-take-home-npm/project-discovery';
import { countMultiProjectContributors } from '@nx-take-home-npm/metrics';
import { updateReadmeSection } from '@nx-take-home-npm/readme-manager';

const program = new Command();

export async function runCli(repoRoot: string) {
  try {
    const packagePaths = projectDiscovery(repoRoot).map((pkg) =>
      join('packages', pkg)
    );
    if (packagePaths.length === 0) {
      console.warn('⚠️ No valid packages found. Exiting.');
      process.exit(0);
    }
    const count = await countMultiProjectContributors(repoRoot, packagePaths);
    updateReadmeSection(repoRoot, count);
    console.log(`✅ Counted ${count} cross-project contributors`);
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

program
  .name('contributor-metrics')
  .description('Counts contributors who committed to multiple projects')
  .argument('<repoRoot>', 'Path to the git repository')
  .action(runCli);

// Only run if called from CLI directly (not during tests)
if (require.main === module) {
  program.parse();
}
