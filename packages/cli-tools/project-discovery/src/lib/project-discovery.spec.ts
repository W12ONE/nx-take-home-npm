import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { projectDiscovery } from './project-discovery.js';

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    statSync: vi.fn(),
  };
});

import * as fs from 'fs';
const mockExistsSync = fs.existsSync as Mock;
const mockReaddirSync = fs.readdirSync as Mock;
const mockStatSync = fs.statSync as Mock;

describe('projectDiscovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExistsSync.mockReturnValue(true); // ✅ default behavior
  });

  it('returns directories inside the packages folder', () => {
    mockReaddirSync.mockReturnValue(['a', 'proj-b', 'not-a-dir']);
    mockStatSync.mockImplementation((entryPath: string) => ({
      isDirectory: () => !entryPath.includes('not-a-dir'),
    }));

    const result = projectDiscovery('/mock/repo');
    expect(result).toEqual(['a', 'proj-b']);
  });

  it('throws an error when reading the packages folder fails', () => {
    mockReaddirSync.mockImplementation(() => {
      throw new Error('Boom');
    });

    expect(() => projectDiscovery('/mock/repo')).toThrowError(
      'Failed to read packages directory at /mock/repo/packages: Boom'
    );
  });

  it('returns empty array when packages folder does not exist', () => {
    mockExistsSync.mockReturnValue(false); // simulate missing packages folder

    const result = projectDiscovery('/mock/repo');
    expect(result).toEqual([]);
  });
});
