<template>
  <div class="full-width">
    <div class="text-h4 q-mb-md">{{ $t("nav.jobs") }}</div>
    <h5>{{ $t("settings.jobs_location.header") }}</h5>
    <div>{{ $t("settings.jobs_location.help") }}</div>
    <div class="q-mt-md">
      <q-input
        ref="autocomplete"
        v-model="location"
        :dark="$q.dark.mode"
        dense
        outlined
        label="Location"
        for="address"
        :placeholder="$t('settings.jobs_location.placeholder')"
      />
    </div>
    <h5>{{ $t("settings.jobs_stats.header") }}</h5>
    <div>{{ $t("settings.jobs_stats.help") }}</div>
    <q-checkbox
      v-model="statistics"
      :label="$t('settings.jobs_stats.label')"
      color="primary"
      name="statistics"
    />

    <h5>{{ $t("settings.jobs_powered.header") }}</h5>
    <div>{{ $t("settings.jobs_powered.help") }}</div>
    <q-checkbox
      v-model="powered"
      disable
      :label="$t('settings.jobs_powered.label')"
      color="primary"
      name="statistics"
    />
    <!-- Country and location -->
    <h5>{{ $t("settings.jobs_country.header") }}</h5>
    <div>{{ $t("settings.jobs_country.help") }}</div>
    <div class="row q-mt-lg">
      <div class="col-4 q-mt-sm">
        <q-select
          v-model="countries"
          :label="$t('settings.jobs_country.header')"
          :options="filteredCountries"
          color="primary"
          name="country"
          outlined
          dense
          options-dense
          use-input
          clearable
          fill-input
          multiple
          input-debounce="200"
          class="col-lg-1 col-md-2 col-sm-3 col-xs-4"
          @filter="countryAutocomplete"
        />
      </div>
    </div>

    <h5>{{ $t("settings.jobs_reference.header") }}</h5>
    <div>{{ $t("settings.jobs_reference.help") }}</div>
    <q-checkbox
      v-model="reference"
      :label="$t('settings.jobs_reference.label')"
      color="primary"
      name="reference"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import mixinValidations from 'src/lib/validations';
import { GET_SETTINGS, SET_SETTINGS_FIELD } from 'src/store/names';
import countries from '../../countries.json';

export default {
  name: 'Jobs',
  mixins: [mixinValidations],
  data()
  {
    return {
      filteredCountries: [],
      powered: false
    };
  },
  computed: {
    ...mapGetters([GET_SETTINGS]),
    statistics: {
      get()
      {
        return this[GET_SETTINGS].jobsStatsEnabled;
      },
      set(val)
      {
        this[SET_SETTINGS_FIELD]({ jobsStatsEnabled: val });
      }
    },
    location: {
      get()
      {
        return this[GET_SETTINGS].location;
      },
      set(val)
      {
        this[SET_SETTINGS_FIELD]({ location: val });
      }
    },
    countries:
        {
          get()
          {
            return this[GET_SETTINGS].countries;
          },
          set(val)
          {
            this[SET_SETTINGS_FIELD]({ countries: val });
          }
        },
    reference:
        {
          get()
          {
            return this[GET_SETTINGS].jobs_reference_enabled;
          },
          set(val)
          {
            this[SET_SETTINGS_FIELD]({ jobs_reference_enabled: val });
          }
        },
    countryList()
    {
      return Object.entries(countries).map(([code, name]) => ({
        value: code,
        label: name,
        search: name.toLocaleLowerCase(),
      }));
    },
  },
  mounted()
  {
    if (window.google)
    {
      this.autocomplete = new window.google.maps.places.Autocomplete(
        (document.getElementById('address')),
        { types: ['geocode'] });
      this.autocomplete.addListener('place_changed', () =>
      {
        const place = this.autocomplete.getPlace();
        console.error(place);
        //  let ac = place.address_components;
        this.location = place.formatted_address;
      });
    }
  },
  methods: {
    ...mapMutations([SET_SETTINGS_FIELD]),
    countryAutocomplete(val, update, abort)
    {
      update(() =>
      {
        const needle = val.toLocaleLowerCase();
        this.filteredCountries = this.countryList.filter(v => v.search.indexOf(needle) > -1);
      });
    },
  },
};
</script>

<i18n>
{
  "en": {
    "settings": {
      "jobs_location": {
        "header": "Location",
        "label": "",
        "help": "If they recruit repeatedly at certain locations, they can define a list of locations here."
      },
      "jobs_stats": {
        "header": "Statistics",
        "label": "Evaluate clicks and page views in accordance with data protection regulations.",
        "help": "with the activate, a code is built into the job advertisement that collects access figures.",
        "placeholder": "Enter Location"
      },
      "jobs_powered": {
        "header": "Powered By Jobwizard",
        "label": "Remove reference to Jobwizard in job advertisement",
        "help": "The job ads contain a Powered by Jobwizard link at the end. Sponsors have the option to hide this link. Become a sponsor!",
        "placeholder": "Enter Location"
      },

      "jobs_country": {
        "header": "Countries",
        "help": "In which countries do you want to publish job advertisements? A selection restricts the automatic completion in the Google Place Search to the countries",
        "placeholder": "Select countries"
      }

    },
  },
  "de": {
    "settings": {
      "jobs_location": {
        "header": "Dienstsitz",
        "help": "Wenn sie immer wieder an bestimmten Orten rekrutieren, können sie hier eine Liste von Orten definieren."
      },
      "jobs_stats": {
        "header": "Statistiken",
        "label": "Klicks und Pageviews datenschutzkonform auswerten.",
        "help": "mit dem Aktivieren wird in die Anzeige ein Code eingebaut, der Zugriffszahlen sammelt.",
       "placeholder": "Enter Location"
      },
      "jobs_reference": {
        "header": "Referenznummerm",
        "label": "Referenznummer für Stellenanzeige aktivieren",
        "help": "mit dem Aktivieren erscheint ein weiteres Feld für die eingabe einer Referenznummer.",
       "placeholder": "Enter Location"
      },
      "jobs_powered": {
        "header": "Powered By Jobwizard",
        "label": "Hinweis auf Jobwizard in Stellenanzeige entfernen",
        "help": "Die Stellenanzeigen anthalten am Ende einen Powered by Jobwizard Link. Sponsoren haben die Möglichkeit diesen Link auszublenden. Werden Sie ein Sponsor!",
        "placeholder": "Enter Location"
      },
      "jobs_country": {
        "header": "Länder",
        "help": "In welchen Ländern möchten Sie Stellenanzeigen veröffentlichen? Eine Auswahl schränkt die automatische Vervollständigung bei der Google Ort Suche auf die Länder ein.",
        "placeholder": "Länder auswählen"
      }
    }
  },
  "fr": {
    "settings": {
      "jobs_location": {
        "header": "Lieu de travail",
        "help": "S'ils recrutent toujours à certains endroits, ils peuvent définir ici une liste de lieux."
      },
      "jobs_stats": {
        "header": "Statistiques",
        "label": "Evaluer les clics et les pages vues conformément à la protection des données.",
        "help": "mit dem Aktivieren wird in die Anzeige ein Code eingebaut, der Zugriffszahlen sammelt.",
        "placeholder": "Enter Location"
      },
      "jobs_powered": {
        "header": "Powered By Jobwizard",
        "label": "Supprimer la référence à Jobwizard dans l'offre d'emploi",
        "help": "Les offres d'emploi contiennent un lien Powered by Jobwizard à la fin. Les sponsors ont la possibilité de masquer ce lien. Devenez un sponsor !",
        "placeholder": "Enter Location"
      },
      "jobs_country": {
        "header": "Pays",
        "help": "Dans quels pays souhaitez-vous publier des offres d'emploi ? Une sélection limite la complétion automatique lors de la recherche Google Lieu aux pays.",
        "placeholder": "Sélectionner les pays"
      }
    }
  }
}
</i18n>
