<template>
  <q-btn-dropdown no-caps color="primary">
    <template #label>
      <img
        :src="'flags/' + $root.$i18n.locale + '.svg'" width="28"
        :alt="$root.$i18n.locale.substr(0, 2).toUpperCase()"
        class="q-mr-md"
      >
      {{ $q.platform.is.mobile ? '' : $t('localeName') }}
    </template>

    <q-list>
      <q-item
        v-for="(msg,lang) in $root.$i18n.messages"
        :key="lang"
        v-close-popup
        clickable
        class="items-center"
        @click="setLocale(lang)"
      >
        <q-item-section side>
          <q-icon
            :color="lang === $root.$i18n.locale ? null : 'transparent'"
            name="mdi-check"
          />
        </q-item-section>
        <q-item-label>{{ $root.$i18n.messages[lang].localeName() }}</q-item-label>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { GET_SETTINGS, SET_SETTINGS_FIELD } from '../store/names';
import { mapMutations, mapGetters } from 'vuex';
import { useQuasar } from 'quasar';

export default {
  name: 'SwitchLanguage',
  computed:
  {
    ...mapGetters([GET_SETTINGS]),
    defaultLanguage()
    {
      console.log(this[GET_SETTINGS]);
      return this[GET_SETTINGS].defaultLanguage;
    }
  },
  created()
  {
    let lang = this.$root.$i18n.default;
    if (this.$route.params.lang && this.$root.$i18n.availableLocales.includes(this.$route.params.lang))
    {
      lang = this.$route.params.lang;
    }
    else
    {
      // detect browser language
      const $q = useQuasar();
      lang = $q.lang.getLocale().substr(0, 2).toLowerCase();

      console.log(lang, this.$route.params.lang);
      if (this.$route.params.lang && this.$root.$i18n.availableLocales.includes(this.$route.params.lang))
      {
        lang = this.$route.params.lang;
      }

      console.log(this.$route.params);

      if (this[GET_SETTINGS].defaultLanguage !== '')
      {
        lang = this[GET_SETTINGS].defaultLanguage;
      }
      this.$root.$i18n.locale = this.$root.$i18n.availableLocales.includes(lang)
        ? lang
        : this.$root.$i18n.fallbackLocale;
    }
  },
  methods:
  {
    ...mapMutations([SET_SETTINGS_FIELD]),
    setLocale(lang)
    {
      this.$root.$i18n.locale = lang;
      this[SET_SETTINGS_FIELD]({ defaultLanguage: lang });

      const routeName = this.$route.name;
      let routePath = '/' + lang;
      if (routeName !== 'wizard')
      {
        routePath = routePath + '/' + this.$route.path.split('/').slice(2).join('/');
      }
      this.$router.push(routePath);

      import(
        /* webpackInclude: /(fr|de|en-GB)\.js$/ */
        'quasar/lang/' + (lang === 'en' ? 'en-GB' : lang)
      ).then(lang =>
      {
        this.$q.lang.set(lang.default);
      });
    }
  }
};
</script>
