<template>
  <q-page padding align="center">
    <h2>{{ $t('landing') }}</h2>
    <div class="row q-my-xl">
      <div class="col-6">
        <q-card align="left" class="q-ma-lg">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">
                    {{ $t('create_job_postings') }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="edit_note" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('Eingabe von Stellenanzeigen') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('Ein Formular unterstützt bei der Eingabe von Stellenanzeigen.') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="secondary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="image" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('Individuell & Responsive') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('Farben und Logos können individuell definiert werden') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="secondary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="contact_mail" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('Bewerbung per Email oder Bewerbungslink') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('Hinterlegen Sie der Stellenanzeige einen Bewerbungslink oder eine Email Adresse') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="secondary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="cloud" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('Selfhosted oder Cloud') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('Wählen sie zwischen Selfhosted und Managed. Ein Wechsel ist jederzeit möglich.') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="secondary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6">
        <q-card flat class="q-ma-lg">
          <q-carousel
            v-model="slide1"
            animated
            arrows
            control-color="primary"
            navigation
            infinite
          >
            <q-carousel-slide :name="1" img-src="../../public/images/screens/create_job-1.png" />
            <q-carousel-slide :name="2" img-src="../../public/images/screens/create_job-2.png" />
          </q-carousel>
        </q-card>
      </div>

      <q-separator color="primary" />

      <div class="col-6">
        <transition mode="out-in">
          <q-card flat class="q-ma-lg">
            <q-carousel
              v-model="slide2"
              animated
              arrows
              control-color="primary"
              navigation
              infinite
            >
              <q-carousel-slide :name="1" img-src="../../public/images/screens/create_job-3.png" />
            </q-carousel>
          </q-card>
        </transition>
      </div>

      <div class="col-6">
        <q-card align="left" class="q-ma-lg">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">
                    {{ $t('publish_job_postings') }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="secondary" name="mdi-google" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('Veröffentlichen auf Google') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('Anzeigen sind Google Jobs konform. Erreichen Sie Bewerber mit Google.') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="primary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="secondary" name="home" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('Integration in ihrer Homepage') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('So einfach wie Google Analytics. HTML Schnipsel in Homepage. Fertig.') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="primary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="secondary" name="img:../../yawik_logo-mobile.svg" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('Veröffenlichung im Yawik Jobboard') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('Ihre Anzeige wird im Yawik Jobboard veröffenlicht.') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="primary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="secondary" name="download" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('DIY. Download and publish yourself') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('Wählen sie zwischen Selfhosted und Managed. Ein Wechsel ist jederzeit möglich.') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="primary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-btn
      size="xl"
      color="secondary"
      rounded
      push
      :to="'/' + $yawik.lang() + '/demo'"
      :label="$t('demo')"
    />
  </q-page>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Landing',
  setup()
  {
    return {
      slide1: ref(1),
      slide2: ref(1)
    };
  }

};
</script>

<i18n>
{
  "en": {
    "landing": "Manage and place ads free of charge",
    "create_job_postings": "Create job advertisements",
    "publish_job_postings": "Publish job postings"
  },
  "de": {
    "landing": "Kostenlos Anzeigen verwalten und schalten",
    "create_job_postings": "Stellenanzeigen erstellen",
    "publish_job_postings": "Stellenanzeigen veröffentlichen"
  },
  "fr": {
    "landing": "Gérer et diffuser des annonces gratuitement",
    "create_job_postings": "Créer des annonces d'emploi",
    "publish_job_postings": "Publier des offres d'emploi"

  }
}
</i18n>
