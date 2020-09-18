# TS Retry

## About

This module aims to ease the retry of a function, using an exponential time between tries.

## Getting started

## Usage

```javascript
import { retry } from '@prismamedia/retry';

try {
  const myResult = await retry(async () => {
    // Do my processing that may throw an Error

    return 2;
  });
} catch (err) {
  // Handle error after "n" tries
}
```
