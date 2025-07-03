import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { updateReadmeSection } from './update-readme-section.js';

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

import * as fs from 'fs';
const mockExistsSync = fs.existsSync as Mock;
const mockReadFileSync = fs.readFileSync as Mock;
const mockWriteFileSync = fs.writeFileSync as Mock;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateReadmeSection', () => {
  it('creates README.md with the section if it does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    updateReadmeSection('/my/repo', 3);

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      '/my/repo/README.md',
      '## Cross-Project Contributors\n3',
      'utf-8'
    );
  });

  it('adds section to existing README.md if section does not exist', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('# My Project\n\nSome content.\n');

    updateReadmeSection('/my/repo', 5);

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      '/my/repo/README.md',
      '# My Project\n\nSome content.\n\n## Cross-Project Contributors\n5',
      'utf-8'
    );
  });

  it('replaces existing section content', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      '# My Project\n\n## Cross-Project Contributors\nOld Content'
    );

    updateReadmeSection('/my/repo', 7);

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      '/my/repo/README.md',
      '# My Project\n\n## Cross-Project Contributors\n7',
      'utf-8'
    );
  });
});
