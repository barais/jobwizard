import { describe, expect, it } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { config, shallowMount } from '@vue/test-utils';
import Logo from '../Logo';

/*
 * You can provide a config object as param like such:
 *
 * ```ts
 * installQuasarPlugin({ plugins: { Dialog } });
 * ```
 */
installQuasarPlugin();

describe('Logo', () =>
{
  const OLD_ENV = process.env;

  let cmp;

  beforeEach(() =>
  {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.VUE_ROUTER_BASE = 'yawik/';
    cmp = shallowMount(Logo, {
      global: {
        mocks: {
          $yawik: {
            lang()
            {
              return 'fr';
            }
          },
          $t: () =>
          {}
        }
      }
    });
  });

  afterAll(() =>
  {
    process.env = OLD_ENV; // Restore old environment
  });

  it('mounts without errors', () =>
  {
    expect(cmp).toBeTruthy();
  });

  it('check home', () =>
  {
    expect(cmp.vm.home).toBe('yawik/de');
  });
});
