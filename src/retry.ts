import { setTimeout } from 'timers';

export type TRetryOptions = {
  /**
   * The maximum amount of times to retry the operation.
   * Default is 9 (= for a total of 10 tries)
   */
  retries?: number;

  /**
   * The exponential factor to use.
   * Default is 2
   */
  factor?: number;

  /**
   * The number of milliseconds before starting the first retry.
   * Default is 1000
   */
  retryAfterInMs?: number;
};

async function waitFor(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<R>(
  fn: (doNotRetry: () => void) => Promise<R>,
  { retries = 9, factor = 2, retryAfterInMs = 1000 }: TRetryOptions = {},
): Promise<R> {
  let doNotRetry: boolean = false;

  try {
    return await fn(() => {
      doNotRetry = true;
    });
  } catch (error) {
    if (retries === 0 || doNotRetry) {
      throw error;
    }

    await waitFor(retryAfterInMs);

    return retry(fn, {
      retries: retries - 1,
      factor,
      retryAfterInMs: retryAfterInMs * factor,
    });
  }
}
