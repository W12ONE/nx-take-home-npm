import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as dataAccess from '@nx-take-home-npm/data-access';
import { countMultiProjectContributors } from './contributor-metrics.js';

vi.mock('@nx-take-home-npm/data-access', () => ({
  getContributorsForPath: vi.fn(),
}));

const mockGetContributorsForPath =
  dataAccess.getContributorsForPath as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('countMultiProjectContributors', () => {
  it('counts contributors who worked in multiple projects', async () => {
    mockGetContributorsForPath
      .mockResolvedValueOnce(new Set(['a@example.com', 'b@example.com']))
      .mockResolvedValueOnce(new Set(['a@example.com', 'c@example.com']))
      .mockResolvedValueOnce(new Set(['d@example.com']));

    const result = await countMultiProjectContributors('/some/repo', [
      'libs/core',
      'libs/cli',
      'libs/extra',
    ]);

    // Only "a@example.com" appears in 2 packages => should count as multi-project
    expect(result).toBe(1);
  });

  it('returns 0 when no contributor worked in multiple projects', async () => {
    mockGetContributorsForPath
      .mockResolvedValueOnce(new Set(['a@example.com']))
      .mockResolvedValueOnce(new Set(['b@example.com']))
      .mockResolvedValueOnce(new Set(['c@example.com']));

    const result = await countMultiProjectContributors('/some/repo', [
      'libs/core',
      'libs/cli',
      'libs/utils',
    ]);

    expect(result).toBe(0);
  });

  it('handles errors from getContributorsForPath and still counts correctly', async () => {
    mockGetContributorsForPath
      .mockResolvedValueOnce(new Set(['a@example.com']))
      .mockRejectedValueOnce(new Error('git error'))
      .mockResolvedValueOnce(new Set(['a@example.com', 'b@example.com']));

    const result = await countMultiProjectContributors('/some/repo', [
      'libs/core',
      'libs/cli',
      'libs/utils',
    ]);

    // "a@example.com" worked in core and utils (cli errored out) → still counts
    expect(result).toBe(1);
  });
});
