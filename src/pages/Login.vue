<template>
  <div class="row justify-center">
    <div class="col-6">
      <q-card class="q-mt-md">
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
          class="relative-position bg-grey-2  text-primary"
        >
          <q-btn
            no-caps
            flat
            :label="$t('label.forgot_password')"
            @click="forgot_password = true"
          />
          <q-btn
            no-caps
            flat
            :label="$t('btn.register')"
            @click="openRegisterPage"
          />
          <q-btn
            no-caps
            color="primary"
            :label="$t('btn.login')"
            :loading="isLoading"
            style="width: 80px; height: 40px; margin-top: 5px;"
            class="absolute-right q-mr-md"
            @click="login"
          />
        </q-card-actions>
      </q-card>
    </div>
    <q-dialog
      v-model="forgot_password"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 450px;">
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
            :loading="forgotPwdLoading"
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
import { SET_TOKEN } from '../store/names';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { mapMutations } from 'vuex';

export default {
  name: 'Login',
  setup()
  {
    const $q = useQuasar();
    return {
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
      forgotPwdLoading: false,
    };
  },
  methods: {
    ...mapMutations([SET_TOKEN]),
    openRegisterPage()
    {
      this.$router.push({ name: 'register' });
    },
    login()
    {
      this.loginSuccess();
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
        //  this.checkUserLogged();
      }).catch(error =>
      {
        this.loginFail(error.response.data);
      }).finally(() =>
      {
        this.isLoading = false;
      });
    },
    forgotPassword()
    {
      this.forgotPwdLoading = true;
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
        this.forgotPwdLoading = false;
      });
    },
  }
};
</script>
