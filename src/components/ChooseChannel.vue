<template>
  <div>
    <h5 v-if="$yawik.isAuth()">{{ $t('channel') }}</h5>
    <q-dialog v-if="!$yawik.isAuth()" v-model="alert">
      <q-card>
        <q-bar>
          <q-icon name="mdi-emoticon-wink-outline" />
          <div class="text-h6">{{ $t('congratulations') }}</div>
          <q-space />

          <q-btn dense flat icon="mdi-close" @click="closeDialog">
            <q-tooltip :delay="400">{{ $t('btn.close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pt-md">
          {{ $t('you-have-created-a-job') }}
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ $t('your-are-not-logged-in') }}
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-checkbox v-model="hide" :label="$t('hide')" @click.stop="closeDialog" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn type="a" no-caps color="primary">
            {{ $t('btn.download') }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row justify-center q-gutter-lg" :style="'opacity: ' + ( $yawik.isAuth() ? '1;' : '0.2;')">
      <Channel v-for="c in data" :key="c.id" v-bind="c" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Channel from 'src/components/Channel.vue';
import Channels from 'src/settings/channels.json';
import { Cookies } from 'quasar';

const settingsBanner = 'please_register';

export default
{
  name: 'ChooseChannel',
  setup()
  {
    return {
      alert: ref(true),
      settingsBanner: ref(false),
      hide: ref(false),
    };
  },
  components: {
    Channel
  },
  computed:
  {
    data()
    {
      return Channels;
    }
  },
  mounted()
  {
    if (!this.$yawik.isAuth())
    {
      this.alert = !Cookies.has(settingsBanner);
    }
  },
  methods:
  {
    closeDialog()
    {
      this.$yawik.setCookies(settingsBanner, '1d');
      this.alert = false;
    }
  },

};
</script>

<style scoped>
  .channel
  {
    padding: 10px;
    width: 100%;
    max-width: 300px;
  }

  .button
  {
    margin: 0 50px 0 50px;
  }
</style>

<i18n>
{
  "en": {
    "congratulations": "Congratulations",
    "channel": "Where would you like to publish your job advertisement?",
    "your-are-not-logged-in": "You are not logged in. As an anonymous user, you can only download your job ad. To save the ad and publish it on different channels, you need to register. The registration as well as the management of job advertisements is free of charge.",
    "job-wont-be-lost": "Ihre Anzeige geht durch einen Registrier- oder Anmeldeprozess nicht verloren.",
    "hide": "Hide this dialogue for the next 24 hours"
  },
  "de": {
    "congratulations": "Glückwunsch",
    "you-have-created-a-job": "Sie haben erfolgreich eine Stellenanzeige erstellt.",
    "channel": "Wo möchten sie ihre Stellenanzeige veröffentlichen?",
    "your-are-not-logged-in": "Sie sind nicht angemeldet. Als anonymer Benutzer können sie ihre Stellenanzeige nur downloaden. Um die Anzeige zu speichern und auf unterschiedlichen Kanälen zu veröffentlichen, müssen sie sich anmelden. Die Registrierung sowie die Verwaltung von Stellenanzeigen ist kostenlos.",
    "job-wont-be-lost": "Ihre Anzeige geht durch einen Registrier- oder Anmeldeprozess nicht verloren.",
    "hide": "Diesen Dialog die nächsten 24 Stunden ausblenden"
  },
  "fr": {
    "congratulations": "Félicitations",
    "channel": "Où souhaitez-vous publier votre offre d'emploi ?",
    "your-are-not-logged-in": "Vous n'êtes pas connecté. En tant qu'utilisateur anonyme, vous pouvez uniquement télécharger votre annonce d'emploi. Pour enregistrer l'annonce et la publier sur différents canaux, vous devez vous inscrire. L'inscription ainsi que la gestion des annonces d'emploi sont gratuites.",
    "job-wont-be-lost": "Ihre Anzeige geht durch einen Registrier- oder Anmeldeprozess nicht verloren.",
    "hide": "Masquer ce dialogue pendant les prochaines 24 heures"
  }
}
</i18n>
