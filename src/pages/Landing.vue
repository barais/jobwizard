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
                  <q-item-label>{{ $t('create_job_postings') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('create_job_postings_desc') }}</q-item-label>
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
                  <q-item-label>{{ $t('individuell_and_responsive') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('individuell_and_responsive_desc') }}</q-item-label>
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
                  <q-item-label>{{ $t('email_or_link') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('email_or_link_desc') }}</q-item-label>
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
                  <q-item-label>{{ $t('selfhostet_or_cloud') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('selfhostet_or_cloud_desc') }}</q-item-label>
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
            <q-carousel-slide :name="2" img-src="../../public/images/screens/preview-job-5.png" />
            <q-carousel-slide :name="3" img-src="../../public/images/screens/manage-jobs-4.png" />
          </q-carousel>
        </q-card>
      </div>
    </div>

    <q-separator color="primary" />

    <div class="row q-my-xl">
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
                  <q-item-label>{{ $t('publish_on_google') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('publish_on_google_desc') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="primary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item href="https://jobwizard.yawik.org/docs/widget/">
                <q-item-section avatar>
                  <q-icon color="secondary" name="home" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('publish_on_homepage') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('publish_on_homepage_desc') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon color="primary" name="check" /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item href="https://jobboard.yawik.org/">
                <q-item-section avatar>
                  <q-icon color="secondary" name="img:../../yawik_logo-mobile.svg" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('publish_on_yawik') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('publish_on_yawik_desc') }}</q-item-label>
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
                  <q-item-label>{{ $t('download_and_publish') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('download_and_publish_desc') }}</q-item-label>
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

    <div class="row q-my-xl hidden">
      <div class="col-6">
        <q-card align="left" class="q-ma-lg">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">
                    {{ $t('manage_applications') }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="edit_note" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t('application_form_inclusive') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('application_form_with_file_upload') }}</q-item-label>
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
                  <q-item-label>{{ $t('integrate_own_ats') }}</q-item-label>
                  <q-item-label caption lines="2">{{ $t('applications_via_form_or_email') }}</q-item-label>
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
            <q-carousel-slide :name="2" img-src="../../public/images/screens/preview-job-5.png" />
            <q-carousel-slide :name="3" img-src="../../public/images/screens/manage-jobs-4.png" />
          </q-carousel>
        </q-card>
      </div>
    </div>

    <q-btn
      no-caps
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
    "email_or_link": "Application by email or application link",
    "email_or_link_desc": "Attach an application link or an email address to the job advertisement.",
    "individuell_and_responsive": "Individual & Responsive",
    "individuell_and_responsive_desc": "Colours and logos can be defined individually. Responsive by default.",
    "selfhostet_or_cloud": "Self-hosted or Cloud",
    "selfhostet_or_cloud_desc": "Choose between self-hosted and managed. A change is possible at any time.",
    "publish_job_postings": "Publish job postings",
    "publish_on_google": "Publish on Google",
    "publish_on_google_desc": "Ads are Google Jobs compliant. Reach applicants with Google.",
    "publish_on_homepage": "Integration into own homepage",
    "publish_on_homepage_desc": "As simple as Google Analytics. HTML snippet in homepage. Done.",
    "publish_on_yawik": "Publication on the Yawik Jobboard",
    "publish_on_yawik_desc": "Your job advertisement will be published on the Yawik Jobboard.",
    "create_job_postings": "Enter job advertisements",
    "create_job_postings_desc": "Forms support with auto-completion when entering job advertisements.",
    "download_and_publish": "DIY. Download and publish yourself",
    "download_and_publish_desc": "Simple connection to external job boards",
  },
  "de": {
    "landing": "Kostenlos Anzeigen verwalten und schalten",
    "create_job_postings": "Stellenanzeigen erstellen",
    "email_or_link": "Bewerbung per Email oder Bewerbungslink",
    "email_or_link_desc": "Hinterlegen Sie der Stellenanzeige einen Bewerbungslink oder eine Email Adresse",
    "individuell_and_responsive": "Individuell & Responsive",
    "individuell_and_responsive_desc": "Farben und Logos können individuell definiert werden. Responsive by Default.",
    "selfhostet_or_cloud": "Selbst gehostet oder Cloud",
    "selfhostet_or_cloud_desc": "Wählen sie zwischen Selfhosted und Managed. Ein Wechsel ist jederzeit möglich.",
    "publish_job_postings": "Stellenanzeigen veröffentlichen",
    "publish_on_google": "Veröffentlichen auf Google",
    "publish_on_google_desc": "Anzeigen sind Google Jobs konform. Erreichen Sie Bewerber mit Google.",
    "publish_on_homepage": "Integration in eigene Homepage",
    "publish_on_homepage_desc": "So einfach wie Google Analytics. HTML Schnipsel in Homepage. Fertig.",
    "publish_on_yawik": "Veröffentlichung auf dem Yawik Jobboard",
    "publish_on_yawik_desc": "Ihre Stellenanzeige wird im Yawik Jobboard veröffenlicht.",
    "create_job_postings": "Eingabe von Stellenanzeigen",
    "create_job_postings_desc": "Formulare unterstützen mit Autovervollständigung bei der Eingabe von Stellenanzeigen.",
    "download_and_publish": "DIY. Herunterladen und selbst veröffentlichen",
    "download_and_publish_desc": "Einfache Anbindung von externen Jobbörsen",

  },
  "fr": {
    "landing": "Gérer et diffuser des annonces gratuitement",
    "create_job_postings": "Créer des annonces d'emploi",
    "email_or_link": "Candidature par e-mail ou lien de candidature",
    "email_or_link_desc": "Joignez un lien de candidature ou une adresse e-mail à l'offre d'emploi.",
    "individuell_and_responsive": "Personnalisé & Responsive",
    "individuell_and_responsive_desc": "Les couleurs et les logos peuvent être définis individuellement. Responsive par défaut.",
    "selfhostet_or_cloud": "Hébergement autonome ou en nuage",
    "selfhostet_or_cloud_desc": "Choisissez entre Selfhosted et Managed. Il est possible de changer à tout moment.",
    "publish_job_postings": "Publier des offres d'emploi",
    "publish_on_google": "Publier sur Google",
    "publish_on_google_desc": "Les annonces sont conformes à Google Jobs. Touchez les candidats avec Google.",
    "publish_on_homepage": "Intégration dans la page d'accueil",
    "publish_on_homepage_desc": "Aussi simple que Google Analytics. Extrait HTML dans la page d'accueil. C'est fait.",
    "publish_on_yawik": "Publication sur le Yawik Jobboard",
    "publish_on_yawik_desc": "Votre offre d'emploi sera publiée sur le Yawik Jobboard.",
    "create_job_postings": "Saisie d'offres d'emploi",
    "create_job_postings_desc": "Les formulaires aident à la saisie des offres d'emploi grâce à l'autocomplétion.",
    "download_and_publish": "DIY. Download and publish yourself",
    "download_and_publish_desc": "BRICOLAGE. Téléchargez et publiez vous-même",
  }
}
</i18n>
