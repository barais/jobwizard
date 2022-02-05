<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      v-if="showToolbar"
      reveal
      elevated
    >
      <q-toolbar>
        <LogoPanel v-if="showToolbar" />
        <q-toolbar-title>
          <Breadcrumb v-if="!$q.platform.is.mobile" />
        </q-toolbar-title>

        <q-toggle
          v-model="dark"
          :color="$q.dark.mode ? 'primary' : 'secondary'"
          icon-color="secondary"
          :icon="$q.dark.mode ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
          size="lg"
          keep-color
          @click="$q.dark.toggle()"
        >
          <tooltip :text="$t('help.dark_mode')" />
        </q-toggle>

        <q-separator spaced vertical />

        <switch-language v-if="!$q.platform.is.mobile" class="q-mx-auto" />

        <q-separator v-if="!$q.platform.is.mobile" spaced vertical color="transparent" />

        <!--
 <q-btn v-if="!$yawik.isAuth()" outline type="a" :href="$yawik.loginUrl()" no-caps>
           {{ $t('btn.login') }}
         </q-btn>
-->
        <Login />

        <q-separator v-if="!$q.platform.is.mobile" spaced vertical color="transparent" />

        <q-btn v-if="!$yawik.isAuth()" type="a" :href="$yawik.registerUrl()" no-caps>
          {{ $t('btn.register') }}
        </q-btn>

        <Logout />
        <q-separator spaced vertical />

        <q-btn dense flat round :icon="showDrawer ? 'mdi-menu' : 'mdi-menu-open'" @click="showDrawer = !showDrawer" />
      </q-toolbar>

      <SidebarDrawer v-model="showDrawer" />
    </q-header>
    <q-page-container style="overflow-x: hidden;">
      <router-view v-slot="{ Component }">
        <transition name="fade" appear mode="out-in">
          <component :is="Component" :toolbar="showToolbar" />
        </transition>
      </router-view>
    </q-page-container>
    <PageFooter v-if="showFooter" />
  </q-layout>
</template>

<script>
import PageFooter from '../components/PageFooter';
import Tooltip from '../components/form/Tooltip';
import SwitchLanguage from '../components/SwitchLanguage';
import Breadcrumb from '../components/Breadcrumb';
import SidebarDrawer from '../components/Drawer.vue';
import LogoPanel from '../components/Logo';
import { GET_TOKEN, HAS_AUTH, GET_SETTINGS, SET_SETTINGS_FIELD } from '../store/names';
import { mapGetters } from 'vuex';
import { useMeta } from 'quasar';
import LoginButton from 'components/LoginButton';
import Logout from 'components/Logout';

const metaData = {
  title: 'JobWizard',
  titleTemplate: title => `${title} - Stellenanzeigen einfach auf Google veröffentlichen`,
  meta: {
    description: {
      name: 'description',
      content: 'Der Yawik Jobwizard ist ein Generator für Stellenanzeigen, die mobil und auf dem Desktop gut aussehen und die Sie auf Google Jobs schalten können'
    },
    keywords: {
      name: 'keywords',
      content: 'Anzeigengenerator Stellenanzeigen Google Jobs'
    }
  },
  link: {
    material: {
      rel: 'canonical',
      href: 'https://jobwizard.yawik.org' + window.location.pathname
    }
  },
  noscript: {
    default: 'Der Yawik Anzeigengenerator benötigt Javascript'
  }
};

export default {
  name: 'MainLayout',
  setup()
  {
    useMeta(metaData);
  },
  components:
      {
        Logout,
        Login: LoginButton,
        Breadcrumb,
        PageFooter,
        SidebarDrawer,
        LogoPanel,
        SwitchLanguage,
        Tooltip
      },
  data()
  {
    return {
      showDrawer: false,
    };
  },
  computed:
      {
        ...mapGetters([GET_TOKEN, HAS_AUTH, GET_SETTINGS]),
        showToolbar()
        {
          console.log(this.$route.query);
          return !(this.$route.query.tb === '0');
        },
        showFooter()
        {
          return !(this.$route.query.hf === '1');
        },
        dark:
          {
            get()
            {
              return this[GET_SETTINGS].miscDarkmode;
            },
            set(val)
            {
              this[SET_SETTINGS_FIELD]({ miscDarkmode: val });
            }
          }
      },
  created()
  {
    const lang = this.$route.params.lang;
    this.$root.$i18n.locale = lang;
    import(
      /* webpackInclude: /(de|en-GB)\.js$/ */
      'quasar/lang/' + (lang === 'en' ? 'en-GB' : lang)
    ).then(lang =>
    {
      this.$q.lang.set(lang.default);
    });
  },
  mounted()
  {
    this.$q.dark.set(this.dark);
  }
};
</script>
