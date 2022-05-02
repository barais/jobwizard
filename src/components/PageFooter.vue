<template>
  <q-footer
    bordered
  >
    <q-tabs
      no-caps
    >
      <q-tab
        name="yawik"
      >
        <q-btn
          class="full-width"
          flat
          no-caps
          type="a"
          rel="noopener noreferrer"
          target="_blank"
          :href="urlOperator"
        >
          {{ $t('copyright', {year: new Date().getFullYear() }) }}
        </q-btn>
      </q-tab>
      <q-tab
        name="imprint"
      >
        <q-btn
          class="full-width"
          flat
          :ripple="false"
          no-caps
          type="a"
          rel="noopener noreferrer"
          target="_blank"
          :href="urlImprint"
          :label="$t('imprint')"
        />
      </q-tab>
      <q-tab
        name="privacy"
      >
        <q-btn
          class="full-width"
          flat
          no-caps
          type="a"
          rel="noopener noreferrer"
          target="_blank"
          :href="urlPrivacy"
          :label="$t('privacy')"
        />
      </q-tab>
      <q-tab
        name="docs"
      >
        <q-btn
          class="full-width"
          flat
          no-caps
          type="a"
          rel="noopener noreferrer"
          target="_blank"
          :href="urlDocs"
          :label="$t('docs')"
        />
      </q-tab>
      <q-tab
        name="contact"
      >
        <q-btn
          class="full-width"
          text-color="primary"
          flat
          no-caps
          type="button"
          :label="$t('nav.contact')"
          @click="showDialog"
        />
      </q-tab>
    </q-tabs>
    <contact :show="dialogPopup" />
  </q-footer>
</template>

<script>
import Contact from 'components/Contact';
export default
{
  name: 'PageFooter',
  components: { Contact },
  data()
  {
    return {
      dialogPopup: false
    };
  },
  computed:
    {
      urlOperator()
      {
        return process.env.YAWIK_URL_OPERATOR;
      },
      urlPrivacy()
      {
        return process.env.YAWIK_URL_PRIVACY;
      },
      urlImprint()
      {
        return process.env.YAWIK_URL_IMPRINT;
      },
      urlDocs()
      {
        return process.env.YAWIK_URL_DOCS;
      }
    },
  methods: {
    showDialog()
    {
      this.dialogPopup = false;
      setTimeout(() =>
      {
        this.dialogPopup = true;
      }, 100);
    }
  }
};
</script>

<style>
  .uploader .q-item__section--thumbnail img
  {
    object-fit: contain;
  }

  .uploader .q-uploader__list .q-item__label
  {
    line-height: 1.25em !important;
  }
</style>

<i18n>
  {
    "en": {
      "copyright": "Copyright",
      "docs": "Documentation",
      "privacy": "Privacy",
      "imprint": "Imprint",
    },
    "de": {
      "docs": "Dokumentation",
      "privacy": "Datenschutz",
      "imprint": "Impressum",
      "copyright": "Copyright"
    }

  }
</i18n>
