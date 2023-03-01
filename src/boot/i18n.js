import { createI18n } from 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js';
import { messages } from 'src/i18n';

const i18n = createI18n({
  locale: 'fr',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  warnHtmlInMessage: 'off',
  messages
});

export default ({ app }) =>
{
  // Set i18n instance on app
  app.use(i18n);
};

// if you need to import it from
// other files, then:
export { i18n };
