<template>
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
</template>

<script>
import { mapMutations } from 'vuex';
import { GET_TOKEN, SET_SETTINGS_FIELD, SET_TOKEN } from '../store/names';
import eventBus, { AJAX_FAILED, TOGGLE_LOGIN } from '../lib/eventBus';

export default {
  name: 'Logout',
  data()
  {
    return {
      tokenTimer: null,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        role: ''
      },
    };
  },
  computed:
      {
        initials()
        {
          return this.user.firstName[0] + this.user.lastName[0];
        }
      },
  created()
  {
    eventBus.on(TOGGLE_LOGIN, this.toggleLogin);
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
