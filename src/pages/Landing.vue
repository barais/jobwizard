<template>
  <q-page padding align="center">
    <h1>{{ $t('landing') }}</h1>
    <q-btn
      size="10vh"
      color="secondary"
      rounded
      push
      :to="'/' + $yawik.lang() + '/demo'"
      :label="$t('demo')"
    />
  </q-page>
</template>

<script>
export default {
  name: 'Landing',
};
</script>

<i18n>
  {
    "en": {
      "landing": "The requested page could not be found",
      "go-home": "go to home page",
    },
    "de": {
      "landing": "Kostenlos Anzeigen verwalten und schalten",
      "file-not-found": "Die angeforderte Seite konnte nicht gefunden werden"
    },
    "fr": {
      "landing": "vers la page d'accueil",
      "file-not-found": "La page demandée n'a pas été trouvée"
    }
  }
</i18n>
