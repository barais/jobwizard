<template>
  <div class="q-ml-lg">
    <q-btn-dropdown
      v-if="isLoggedIn"
      flat
      no-caps
    >
      <template #label>
        <div class="row items-center no-wrap">
          <q-avatar>
            <q-icon name="person" />
          </q-avatar>
        </div>
      </template>
      <q-list>
        <q-item v-close-popup>
          <q-item-section>
            <q-item-label>{{ user.username }}</q-item-label>
            <q-item-label caption>{{ user.email }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-close-popup clickable>
          <q-item-section>
            <q-btn class="bg-primary text-white" @click="logout">
              {{ $t('btn.logout') }}
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn
      v-else
      outline
      :label="$t('btn.login')"
      class="align-items-center"
      @click="prompt = true"
    />
    <q-dialog v-model="prompt" persistent>
      <q-card style="width: 400px; max-width: 60vw;">
        <q-bar>
          <q-icon name="img:../../yawik_logo-mobile.svg" />
          <div>{{ $t('welcome') }}</div>

          <q-space />

          <q-btn v-close-popup dense flat icon="close">
            <q-tooltip>{{ $t('btn.close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="signin" :label="$t('btn.login')" />
          <q-tab name="signup" :label="$t('btn.register')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="signin">
            <div class="text-h6">{{ $t('btn.login') }}</div>
            <q-card-section class="q-mb-md">
              <q-input
                v-model="username"
                class="q-pa-md"
                outlined
                :label="$t('label.email_or_username')"
                dense
              />
              <q-input
                v-model="password"
                class="q-pa-md" :type="isPwd ? 'password' : 'text'"
                outlined
                :label="$t('label.password')"
                dense
              >
                <template #append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-card-section>

            <q-card-actions
              align="between"
              class="relative-position bg-grey-2 absolute-bottom text-primary"
            >
              <q-btn
                no-caps
                flat
                :label="$t('label.forgot_password')"
                @click="forgot_password = true"
              />
              <q-btn
                no-caps
                color="primary"
                :label="$t('btn.login')"
                :loading="isLoading"
                @click="login"
              />
            </q-card-actions>
          </q-tab-panel>

          <q-tab-panel name="signup">
            <div class="text-h6">{{ $t('btn.register') }}</div>
            <q-card-section class="q-mb-md">
              <q-input
                v-model="username"
                class="q-pa-md"
                outlined :label="$t('label.username')"
                dense
              />
              <q-input
                v-model="email"
                class="q-pa-md"
                outlined :label="$t('btn.email')"
                dense
              />
              <q-input
                v-model="password"
                class="q-pa-md"
                :type="isPwd ? 'password' : 'text'"
                outlined
                :label="$t('label.password')"
                dense
              >
                <template #append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input
                v-model="password_repeat"
                class="q-pa-md"
                :type="isPwd ? 'password' : 'text'"
                outlined
                :label="$t('label.password_repeat')"
                dense
              >
                <template #append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions
              align="right"
              class="relative-position bg-grey-2 absolute-bottom text-primary"
            >
              <q-btn
                no-caps
                color="primary"
                :label="$t('btn.register')"
                :loading="isLoading"
                @click="register"
              />
            </q-card-actions>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="forgot_password"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 300px;">
        <q-card-section>
          <div class="text-h6">{{ $t('label.forgot_password') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="email"
            class="q-pa-md"
            outlined
            :label="$t('btn.email')"
            dense
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-2 text-primary">
          <q-btn
            v-close-popup
            color="primary"
            :label="$t('label.reset_password')"
            @click="forgotPassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { SET_TOKEN, HAS_AUTH } from '../store/names';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'LoginStrapi',
  setup()
  {
    const $q = useQuasar();
    return {
      tab: ref('signin'),
      forgot_password: ref(false),
      loginSuccess()
      {
        $q.notify({
          message: 'Logged in successfully!',
          color: 'green',
          type: 'positive',
          position: 'top'
        });
      },
      loginFail(data)
      {
        $q.notify({
          message: 'Login Failed. ' + data.error.message,
          color: 'red',
          type: 'negative',
          position: 'top'
        });
      },
      registerSuccess()
      {
        $q.notify({
          message: 'Registered successfully! Please check your Mail.',
          color: 'green',
          type: 'positive',
          position: 'top'
        });
      },
      registerFail(data)
      {
        console.log('ERROR: ', data);
        $q.notify({
          message: 'Registration failed. ' + data.error.message,
          color: 'red',
          type: 'negative',
          position: 'top'
        });
      },
      forgotPasswordSuccess()
      {
        $q.notify({
          message: 'Forgot Password! Please check your Mail.',
          color: 'green',
          type: 'positive',
          position: 'top'
        });
      },
      forgotPasswordFail(data)
      {
        console.log('ERROR: ', data);
        $q.notify({
          message: 'Forgot Password failed. ' + data.error.message,
          color: 'red',
          type: 'negative',
          position: 'top'
        });
      },
    };
  },
  data()
  {
    return {
      prompt: false,
      username: '',
      password: '',
      email: '',
      password_repeat: '',
      isPwd: true,
      isLoading: false,
      isLoggedIn: false,
      user: {
        username: '',
        email: ''
      }
    };
  },
  computed:
  {
    ...mapGetters([HAS_AUTH]),
  },
  mounted()
  {
    this.checkUserLogged();
  },
  methods: {
    ...mapMutations([SET_TOKEN]),
    logout()
    {
      this.isLoggedIn = false;
      this[SET_TOKEN](null);
      localStorage.removeItem('user');
    },
    login()
    {
      this.isLoading = true;
      axios.post(process.env.YAWIK_AUTH_URL + '/api/auth/local', {
        identifier: this.username,
        password: this.password
      }).then(response =>
      {
        const token = response.data.jwt;
        const user = response.data.user;
        this[SET_TOKEN](token);
        localStorage.setItem('user', JSON.stringify(user));
        this.loginSuccess();
        this.prompt = false;
        this.checkUserLogged();
      }).catch(error =>
      {
        this.loginFail(error.response.data);
      }).finally(() =>
      {
        this.isLoading = false;
      });
    },
    register()
    {
      this.isLoading = true;
      axios.post(process.env.YAWIK_AUTH_URL + '/api/auth/local/register', {
        username: this.username,
        email: this.email,
        password: this.password
      }).then(response =>
      {
        const token = response.data.jwt;
        const user = response.data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.registerSuccess();
        this.prompt = false;
        this.checkUserLogged();
      }).catch(error =>
      {
        this.registerFail(error.response.data);
      }).finally(() =>
      {
        this.isLoading = false;
      });
    },
    forgotPassword()
    {
      this.isLoading = true;
      axios.post(process.env.YAWIK_AUTH_URL + '/api/auth/forgot-password', {
        email: this.email
      }).then(response =>
      {
        this.forgotPasswordSuccess();
        this.prompt = false;
      }).catch(error =>
      {
        this.forgotPasswordFail(error.response.data);
      }).finally(() =>
      {
        this.isLoading = false;
      });
    },

    checkUserLogged()
    {
      const token = this[HAS_AUTH];
      if (token != null)
      {
        this.isLoggedIn = true;
        const storedUser = localStorage.getItem('user');
        if (storedUser)
        {
          const user = JSON.parse(storedUser);
          this.user.username = user.username;
          this.user.email = user.email;
        }
      }
    }
  }
};
</script>
