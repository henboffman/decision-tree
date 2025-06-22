import { describe, it } from 'vitest';
import { App } from '../src/app';
import { createFixture } from '@aurelia/testing';

describe('app', () => {
  it('should render message', async () => {
    const { assertText } = await createFixture(
      '<app></app>',
      {},
      [App],
    ).started;

    assertText('Hello World!', { compact: true });
  });
});
