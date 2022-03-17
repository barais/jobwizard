import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import yawik from './yawik';
let store = null;
export default function(/* { ssrContext } */)
{
  const Store = createStore({
    modules: {
      yawik,
    },
    plugins:
      [
        createPersistedState({
          key: 'yawik',
          paths: [
            'yawik.form',
            'yawik.settings',
            'yawik.token'
          ]
        })
      ],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot)
  {
    module.hot.accept(['./yawik'], () =>
    {
      const newData = require('./yawik').default;
      Store.hotUpdate({ modules: { yawik: newData } });
    });
  }
  store = Store;
  return Store;
}
export { store };
