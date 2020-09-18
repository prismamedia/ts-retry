import { performance } from 'perf_hooks';
import { retry } from '../retry';

describe('Retry', () => {
  it('retry works, retries 2 times (a total of 3 execution)', async () => {
    const now = performance.now();

    let executionCount = 0;
    await expect(
      retry(
        async () => {
          executionCount++;

          throw new Error('KO');
        },
        { retries: 2 },
      ),
    ).rejects.toThrowError('KO');

    expect(executionCount).toEqual(3);
    expect(performance.now() - now).toBeGreaterThan(3000);
  }, 10000);

  it('skip retries after a conditional check', async () => {
    let executionCount = 0;
    await expect(
      retry(
        async (doNotRetry) => {
          doNotRetry();

          executionCount++;

          throw new Error('KO');
        },
        { retries: 2 },
      ),
    ).rejects.toThrowError('KO');

    expect(executionCount).toEqual(1);
  });
});
