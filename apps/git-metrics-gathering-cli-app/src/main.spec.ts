/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @nx/enforce-module-boundaries */
import { runCli } from './main';
import { projectDiscovery } from '@nx-take-home-npm/project-discovery';
import { countMultiProjectContributors } from '@nx-take-home-npm/metrics';
import { updateReadmeSection } from '@nx-take-home-npm/readme-manager';

jest.mock('@nx-take-home-npm/project-discovery', () => ({
  projectDiscovery: jest.fn(),
}));
jest.mock('@nx-take-home-npm/metrics', () => ({
  countMultiProjectContributors: jest.fn(),
}));
jest.mock('@nx-take-home-npm/readme-manager', () => ({
  updateReadmeSection: jest.fn(),
}));

const mockDiscovery = projectDiscovery as jest.Mock;
const mockCount = countMultiProjectContributors as jest.Mock;
const mockUpdate = updateReadmeSection as jest.Mock;

describe('CLI runCli', () => {
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('counts contributors and updates README when packages exist', async () => {
    mockDiscovery.mockReturnValue(['proj-a', 'proj-b']);
    mockCount.mockResolvedValue(3);

    await runCli('/mock/repo');

    expect(mockDiscovery).toHaveBeenCalledWith('/mock/repo');
    expect(mockCount).toHaveBeenCalledWith('/mock/repo', [
      'packages/proj-a',
      'packages/proj-b',
    ]);
    expect(mockUpdate).toHaveBeenCalledWith('/mock/repo', 3);
    expect(logSpy).toHaveBeenCalledWith(
      '✅ Counted 3 cross-project contributors'
    );
  });

  it('exits early with code 0 when no packages are found', async () => {
    mockDiscovery.mockReturnValue([]);

    await expect(runCli('/mock/repo')).rejects.toThrow('process.exit called');
    expect(warnSpy).toHaveBeenCalledWith(
      '⚠️ No valid packages found. Exiting.'
    );
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('logs error and exits when something fails', async () => {
    mockDiscovery.mockReturnValue(['proj-a']);
    mockCount.mockRejectedValue(new Error('Some failure'));

    await expect(runCli('/mock/repo')).rejects.toThrow('process.exit called');
    expect(errorSpy).toHaveBeenCalledWith('❌ Error: Some failure');
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
