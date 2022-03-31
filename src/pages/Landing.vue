<template>
  <q-page padding align="center">
    <h2>{{ $t('landing') }}</h2>

    <div class="row q-my-xl">
      <q-card class="col-6">
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>
                  {{ $t('create_job_postings') }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <q-card class="col-6" flat>
        <q-carousel
          v-model="slide"
          animated
          arrows
          control-color="primary"
          navigation
          infinite
        >
          <q-carousel-slide :name="1" img-src="../../public/images/screens/create_job-1.png" />
          <q-carousel-slide :name="2" img-src="../../public/images/screens/create_job-2.png" />
          <q-carousel-slide :name="3" img-src="../../public/images/screens/create_job-3.png" />
        </q-carousel>
      </q-card>
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
      slide: ref(1)
    };
  }

};
</script>

<i18n>
{
  "en": {
    "landing": "Manage and place ads free of charge",
    "create_job_postings": "Create job advertisements"
  },
  "de": {
    "landing": "Kostenlos Anzeigen verwalten und schalten",
    "create_job_postings": "Stellenanzeigen erstellen"
  },
  "fr": {
    "landing": "Gérer et diffuser des annonces gratuitement",
    "create_job_postings": "Créer des annonces d'emploi"
  }
}
</i18n>
