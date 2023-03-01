import { useQuasar, Cookies } from 'quasar';
import { store } from '../store';
const yawik = {
  lang()
  {
    const $q = useQuasar();
    console.error($q);
    return $q.lang.isoName === 'en-GB' ? 'en' : $q.lang.isoName;
  },
  dateFormat()
  {
    return this.lang() === 'de' ? 'DD.MM.YYYY' : 'MM-DD-YYYY';
  },
  isAuth()
  {
    return store.getters.HAS_AUTH;
  },
  setCookies(name, duration)
  {
    const options = {
      expires: duration
    };
    Cookies.set(name, name, options);
  }
};
export default ({ app }) =>
{
  app.config.globalProperties.$yawik = yawik;
};
export { yawik };
