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
      @click="openLoginPage"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { SET_TOKEN, HAS_AUTH } from '../store/names';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'LoginStrapi',
  setup()
  {
    return {
      tab: ref('signin'),
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
    openLoginPage()
    {
      this.$router.push({ name: 'login' });
    },
    logout()
    {
      this.isLoggedIn = false;
      this[SET_TOKEN](null);
      localStorage.removeItem('user');
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
