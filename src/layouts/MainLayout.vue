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

        <q-btn v-if="!$yawik.isAuth()" outline type="a" :href="$yawik.loginUrl()" no-caps>
          {{ $t('btn.login') }}
        </q-btn>

        <q-separator v-if="!$q.platform.is.mobile" spaced vertical color="transparent" />

        <q-btn v-if="!$yawik.isAuth()" type="a" :href="$yawik.registerUrl()" no-caps>
          {{ $t('btn.register') }}
        </q-btn>

        <q-btn-dropdown
          v-if="$yawik.isAuth()"
          flat
          rounded
          no-caps
        >
          <template #label>
            <div class="row items-center no-wrap">
              <q-avatar>
                {{ initials }}
              </q-avatar>
            </div>
          </template>
          <q-list>
            <q-item v-close-popup>
              <q-item-section>
                <q-item-label>{{ user.firstName }} {{ user.lastName }}</q-item-label>
                <q-item-label caption>{{ user.email }}</q-item-label>
                <q-item-label caption>{{ user.role.includes('recruiter') ? $t('recruiter') : '' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-close-popup clickable>
              <q-item-section>
                <q-btn class="bg-primary text-white" @click="toggleLogin">
                  {{ $t($yawik.isAuth() ? 'logout' : 'login') }}
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
import eventBus, { AJAX_FAILED, TOGGLE_LOGIN } from 'src/lib/eventBus';
import { GET_TOKEN, SET_TOKEN, HAS_AUTH, GET_SETTINGS, SET_SETTINGS_FIELD } from '../store/names';
import { mapGetters, mapMutations } from 'vuex';
import { useMeta } from 'quasar';

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

export default
{
  name: 'MainLayout',
  setup()
  {
    useMeta(metaData);
  },
  components:
    {
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
      tokenTimer: null,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        role: ''
      }
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
      initials()
      {
        return this.user.firstName[0] + this.user.lastName[0];
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
    eventBus.on(TOGGLE_LOGIN, this.toggleLogin);
    const lang = this.$route.params.lang;
    this.$root.$i18n.locale = lang;
    import(
      /* webpackInclude: /(de|en-GB)\.js$/ */
      'quasar/lang/' + (lang === 'en' ? 'en-GB' : lang)
    ).then(lang =>
    {
      this.$q.lang.set(lang.default);
    });
    const cloak = new window.Keycloak({
      url: process.env.YAWIK_SSO_URL,
      realm: process.env.YAWIK_SSO_REALM,
      clientId: process.env.YAWIK_SSO_CLIENT,
    });
    cloak.init({
      onLoad: 'check-sso'
    }).then(() =>
    {
      this[SET_TOKEN](cloak);
      if (cloak.tokenParsed)
      {
        console.log(cloak);
        this.user.email = cloak.tokenParsed.email;
        this.user.firstName = cloak.tokenParsed.given_name;
        this.user.lastName = cloak.tokenParsed.family_name;
        this.user.role = cloak.tokenParsed.realm_access?.roles;
      }
    });
    cloak.onTokenExpired = () =>
    {
      console.log('expired at' + new Date());
      cloak.updateToken(70).success((refreshed) =>
      {
        if (refreshed)
        {
          console.log('refreshed at ' + new Date());
        }
        else
        {
          console.log('not refreshed at ' + new Date());
        }
      }).error(() =>
      {
        console.error('Failed to refresh token ' + new Date());
      });
    };
  },
  mounted()
  {
    this.$q.dark.set(this.dark);
  },
  beforeUnmount()
  {
    eventBus.off(TOGGLE_LOGIN, this.toggleLogin);
    this.clearTimer();
  },
  methods:
    {
      ...mapMutations([SET_TOKEN, SET_SETTINGS_FIELD]),
      clearTimer()
      {
        if (this.tokenTimer) clearInterval(this.tokenTimer);
      },
      toggleLogin()
      {
        if (this.$yawik.isAuth())
        {
          window.location.href = process.env.YAWIK_SSO_URL +
            'realms/' + process.env.YAWIK_SSO_REALM +
            '/protocol/openid-connect/logout?redirect_uri=' +
            encodeURI(window.location.href);
        }
        else
        {
          const cloak = this[GET_TOKEN];
          cloak.init({
            onLoad: 'login-required',
          }).then(authenticated =>
          {
            if (authenticated)
            {
              //Token Refresh
              this.clearTimer();
              this.tokenTimer = setInterval(() =>
              {
                cloak.updateToken(70).then((refreshed) =>
                {
                  if (!refreshed)
                  {
                    console.warn('Token not refreshed, valid for ' + Math.round(cloak.tokenParsed.exp + cloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
                  }
                }).catch(() =>
                {
                  console.error('Failed to refresh token');
                });
              }, 6000);
            }
          }).catch(err =>
          {
            eventBus.emit(AJAX_FAILED, err);
          });
        }
      },
    }
};
</script>
