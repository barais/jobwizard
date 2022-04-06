<template>
  <div class="row justify-center">
    <div class="col-6">
      <q-card class="q-mt-md">
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
          class="relative-position bg-grey-2 text-primary"
        >
          <q-btn
            no-caps
            color="primary"
            :label="$t('btn.register')"
            :loading="isLoading"
            @click="register"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { SET_TOKEN } from '../store/names';
import { useQuasar } from 'quasar';
import { mapMutations } from 'vuex';

export default {
  name: 'Register',
  setup()
  {
    const $q = useQuasar();
    return {
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
    };
  },
  data()
  {
    return {
      username: '',
      password: '',
      email: '',
      password_repeat: '',
      isPwd: true,
      isLoading: false,
    };
  },
  methods: {
    ...mapMutations([SET_TOKEN]),
    openRegisterPage()
    {
      this.$router.push({ name: 'register' });
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
      }).catch(error =>
      {
        this.registerFail(error.response.data);
      }).finally(() =>
      {
        this.isLoading = false;
      });
    },
  }
};
</script>
