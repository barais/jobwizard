<template>
  <q-page class="flex">
    <q-layout
      view="hHh Lpr lff"
      container
      style="height: 800px;"
    >
      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="500"
        bordered
        no-swipe-open
        no-swipe-close
        no-swipe-backdrop
      >
        <q-scroll-area class="fit">
          <q-list>
            <template v-for="(menuItem, index) in menuList" :key="index">
              <q-item
                v-ripple
                clickable
                :active="index===selectedIndex"
                @click="selectedIndex=index"
              >
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" color="secondary" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator v-if="menuItem.separator" :key="'sep' + index" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <div v-if="selectedIndex===0">
            <Organization />
          </div>
          <div v-else-if="selectedIndex===1">
            <Jobs />
          </div>
          <div v-else-if="selectedIndex===2">
            <Applications />
          </div>
          <div v-else-if="selectedIndex===3">
            <Misc />
          </div>
          <q-banner
            v-if="!$yawik.isAuth() && showBanner" rounded class="login z-top fixed-bottom"
          >
            <template #avatar>
              <q-avatar>
                <img src="https://www.gravatar.com/avatar/c51d961553bd9e448b0768c401e98e7b">
              </q-avatar>
            </template>
            {{ $t('notify.please_login') }}
            <template #action>
              <q-btn flat :label="$t('btn.close')" @click="closeBanner" />
            </template>
          </q-banner>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import Organization from './settings/Organization';
import Misc from './settings/Misc';
import Jobs from './settings/Jobs';
import Applications from './settings/Applications';
import { Cookies, useMeta } from 'quasar';

const settingsBanner = 'settings_banner';
export default
{
  name: 'Settings',
  components:
  {
    Organization,
    Jobs,
    Applications,
    Misc
  },
  data()
  {
    return {
      selectedIndex: 0,
      showBanner: true
    };
  },
  computed:
  {
    menuList()
    {
      return [
        {
          icon: 'mdi-domain',
          label: this.$t('nav.organization'),
          separator: true
        },
        {
          icon: 'mdi-newspaper-variant-outline',
          label: this.$t('nav.jobs'),
          separator: true
        },
        {
          icon: 'mdi-account-box-multiple-outline',
          label: this.$t('nav.applications'),
          separator: true
        },
        {
          icon: 'mdi-cog',
          label: this.$t('nav.misc'),
          separator: false
        }
      ];
    }
  },
  setup()
  {
    useMeta({
      link: {
        material: {
          rel: 'canonical',
          href: 'https://jobwizard.yawik.org' + window.location.pathname
        }
      },
    });
    return {
      tab: ref('organization'),
      splitterModel: ref(10),
      drawer: ref(false),
    };
  },
  mounted()
  {
    this.showBanner = !Cookies.has(settingsBanner);
  },
  methods: {
    closeBanner()
    {
      this.$yawik.setCookies(settingsBanner, '1d');
      this.showBanner = false;
    }
  }
};
</script>

<style lang="scss">

.body--dark .q-banner
{
  background-color: $primary;
}

.body--light .q-banner
{
  background-color: $secondary;
}

</style>

<i18n>
  {
    "en": {
      "settings": "Settings",
      "misc": "Misc",
      "organization": "Organization",
      "notify": {
        "please_login": "You are currently not logged in. All settings are saved in the local memory of your browser. If you want to save settings permanently so that you can use them on another device, please register. Registration is free of charge."
      }
    },
    "de": {
      "settings": "Einstellungen",
      "misc": "Sonstiges",
      "organization": "Organisation",
      "notify": {
        "please_login": "Sie sind momentan nicht angemeldet. Alle Einstellungen werden im lokalen Speicher ihres Browsers gespeichert. Wenn Sie Einstellungen dauerhaft speichern möchten, um sie auch auf einem weiteren Gerät nutzen zu können melden sie sich bitte an. Die Registrierung ist kostenlos."
      }
    }
  }
</i18n>
