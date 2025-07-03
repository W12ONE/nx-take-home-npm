import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { getContributorsForPath } from './get-contributors.js';
import { simpleGit } from 'simple-git';

// Mock simpleGit
vi.mock('simple-git', async () => {
  const actual = await vi.importActual<typeof import('simple-git')>(
    'simple-git'
  );
  return {
    ...actual,
    simpleGit: vi.fn(),
  };
});

const mockRaw = vi.fn();
(simpleGit as unknown as Mock).mockImplementation(() => ({
  raw: mockRaw,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getContributorsForPath', () => {
  it('returns a set of contributor emails from git log output', async () => {
    mockRaw.mockResolvedValue('a@example.com\nb@example.com\na@example.com\n');

    const result = await getContributorsForPath('/some/repo', 'packages/core');

    expect(result).toEqual(new Set(['a@example.com', 'b@example.com']));
    expect(mockRaw).toHaveBeenCalledWith([
      'log',
      '--pretty=format:%ae',
      '--',
      'packages/core',
    ]);
  });

  it('returns an empty set when git log returns no output', async () => {
    mockRaw.mockResolvedValue('');

    const result = await getContributorsForPath('/some/repo', 'packages/cli');

    expect(result).toEqual(new Set());
  });

  it('throws an error when git fails', async () => {
    mockRaw.mockRejectedValue(new Error('Git error'));

    await expect(
      getContributorsForPath('/some/repo', 'packages/broken')
    ).rejects.toThrowError(
      'Failed to get contributors for packages/broken: Git error'
    );
  });
});
