<template>
  <div class="row q-col-gutter-md">
    <div class="col-6 row q-col-gutter-md">
      <!-- Job title -->
      <TextInput
        v-model="jobTitle"
        name="job_title"
        class="col-12"
        :label="$t('job_title')"
        :rules="[ruleRequired]"
        @enterPress="gotoNext"
      />

      <q-select
        v-model="organization"
        :label="$t('label.organization')"
        :rules="[ruleRequired]"
        outlined
        use-input
        dense
        :placeholder="organization === null ? $t('select_or_create') : ''"
        input-debounce="0"
        :options="filterOptions"
        option-value="id"
        option-label="name"
        class="col-12"
        @new-value="createValue"
        @filter="filterFn"
      >
        <template v-if="organization" #append>
          <q-icon name="cancel" class="cursor-pointer" @click.stop="organization = null" />
        </template>
      </q-select>

      <div class="col-12">
        <div class="row">
          <q-input
            id="location"
            ref="location"
            v-model.trim="locationDisplay"
            :label="$t('label.location')"
            color="primary"
            class="col-lg-6 col-md-6"
            name="location"
            outlined
            dense
            :rules="[ruleRequired]"
            @keypress.enter="gotoNext"
          />
          <q-checkbox
            v-model="remoteWork"
            style="margin-top: -20px;"
            :label="$t('label.homeoffice')"
            color="primary"
            name="apply_post"
            class="col-lg-3 col-md-3"
          />
          <q-slider
            v-if="remoteWork"
            v-model="remoteWorkPercentage"
            name="remoteWorkPercentage"
            class="col-lg-3 col-md-3"
            :label-value="remoteWorkPercentage + '%'"
            label-always
            :min="10"
            :max="100"
            :step="10"
          />
        </div>
      </div>
      <!-- URL -->
      <TextInput
        v-if="urlEnabled"
        v-model="applyUrl"
        name="apply_url"
        class="col-12"
        :label="$t('label.apply_url')"
        :rules="[validURL]"
        :disable="applyPost"
        @enterPress="gotoNext"
      />

      <!-- Email -->
      <TextInput
        v-if="emailEnabled"
        v-model="applyEmail"
        name="apply_email"
        class="col-12"
        :label="$t('label.apply_email')"
        :rules="[validEmail]"
        :disable="applyPost"
        @enterPress="gotoNext"
      />

      <q-checkbox
        v-if="postEnabled"
        v-model="applyPost"
        :label="$t('label.apply_post')"
        color="primary"
        name="apply_post"
      >
        <Tooltip :text="$t('help.apply_post')" />
      </q-checkbox>

      <!-- Reference -->
      <TextInput
        v-if="referenceEnabled"
        v-model="reference"
        name="reference"
        class="col-12"
        :label="$t('label.reference')"
        @enterPress="gotoNext"
      />
    </div>
    <div class="col-6 q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="text-h4">
            {{ $t('wizard-help-title') }}
          </div>
        </q-card-section>
        <q-card-section>
          <div>
            {{ $t('wizard-help-text') }}
          </div>
        </q-card-section>
        <q-card-section align="center">
          <q-btn flat :to="'/' + $yawik.lang() + '/settings'">{{ $t('nav.settings') }}</q-btn>
        </q-card-section>
        <q-card-section v-if="!$yawik.isAuth()">
          <div>
            {{ $t('wizard-help-anonymous') }}
          </div>
        </q-card-section>
        <q-card-actions v-if="!$yawik.isAuth()" align="center">
          <q-btn type="a" :href="$yawik.loginUrl('jobs')" no-caps color="primary">
            {{ $t('btn.login') }}
          </q-btn>
          <q-btn type="a" :href="$yawik.registerUrl('jobs')" no-caps color="primary">
            {{ $t('btn.register') }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { GET_FORM, GET_TOKEN, GET_SETTINGS, SET_META, GET_META, SET_FIELD } from 'src/store/names';
import mixinValidations from 'src/lib/validations';
import TextInput from 'src/components/form/TextInput.vue';
import Tooltip from 'src/components/form/Tooltip.vue';

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
];

export default {
  name: 'StepOne',
  components: {
    TextInput,
    Tooltip
  },
  mixins: [mixinValidations],
  emits: ['next'],
  data()
  {
    return {
      hideDelay: 600,
      googleSearchBox: null,
      googleMapsListener: null,
      locationForm: [
        'location',
        'locality',
        'administrative_area_level_1',
        'country',
        'postal_code',
      ],
      locationData: {
        streetAddress: '',
        addressLocality: '',
        addressRegion: '',
        postalCode: '',
        addressCountry: ''
      },
      locationNameFormat: {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name',
      },
      pagination: {
        sortBy: 'desc',
        descending: true,
        rowsNumber: 10,
        page: 1,
        rowsPerPage: 10
      },
      filterOptions: [],
      organizations: [],
    };
  },
  computed:
      {
        ...mapGetters([GET_TOKEN, GET_FORM, GET_META, GET_SETTINGS]),

        jobTitle:

          {
            get()
            {
              return this[GET_FORM].jobTitle;
            },
            set(val)
            {
              this[SET_FIELD]({ jobTitle: val });
            }
          },
        remoteWork:
          {
            get()
            {
              return this[GET_META].remoteWork;
            },
            set(val)
            {
              this[SET_META]({ remoteWork: val });
            }
          },
        remoteWorkPercentage:
          {
            get()
            {
              return this[GET_META].remoteWorkPercentage;
            },
            set(val)
            {
              this[SET_META]({ remoteWorkPercentage: val });
            }
          },
        organization:
          {
            get()
            {
              return this[GET_FORM].organization;
            },
            set(val)
            {
              this[SET_FIELD]({ organization: val });
            }
          },

        applyUrl:
          {
            get()
            {
              return this[GET_FORM].applyURL;
            },
            set(val)
            {
              this[SET_FIELD]({ applyURL: val });
            }
          },
        applyEmail:
          {
            get()
            {
              return this[GET_FORM].applyEmail;
            },
            set(val)
            {
              this[SET_FIELD]({ applyEmail: val });
            }
          },
        applyPost:
          {
            get()
            {
              return this[GET_FORM].applyPost;
            },
            set(val)
            {
              this[SET_FIELD]({ applyPost: val });
            }
          },
        reference:
          {
            get()
            {
              return this[GET_FORM].reference;
            },
            set(val)
            {
              this[SET_FIELD]({ reference: val });
            }
          },
        locationDisplay:
          {
            get()
            {
              return this[GET_FORM].formattedAddress;
            },
            set(val)
            {
              this[SET_FIELD]({ formattedAddress: val });
            }
          },
        countries:
          {
            get()
            {
              return this[GET_SETTINGS].countries;
            }
          },
        emailEnabled:
        {
          get()
          {
            return this[GET_SETTINGS].applications_applyEmail_enabled;
          }
        },
        postEnabled:
        {
          get()
          {
            return this[GET_SETTINGS].applications_applyPost_enabled;
          }
        },
        urlEnabled:
        {
          get()
          {
            return this[GET_SETTINGS].applications_applyUrl_enabled;
          }
        },
        referenceEnabled:
        {
          get()
          {
            return this[GET_SETTINGS].jobs_reference_enabled;
          }
        }
      },
  mounted()
  {
    if (window.google)
    {
      const autocompleteInput = this.$refs.location.getNativeElement();
      this.googleSearchBox = new window.google.maps.places.Autocomplete(autocompleteInput, {
        fields: ['formatted_address', 'address_components'],
        types: ['(cities)']
      });
      if (this.countries)
      {
        this.googleSearchBox.setComponentRestrictions(
          {
            country: this.countries.map(element => element.value)
          }
        );
      }
      this.googleSearchBox.addListener('place_changed', () =>
      {
        const place = this.googleSearchBox.getPlace();
        this.locationChanged(place);
      }
      );
    }
    if (this.$yawik.isAuth())
    {
      this.getOrganizations();
    }
  },
  beforeUnmount()
  {
    if (this.googleMapsListener) this.googleSearchBox.removeListener(this.googleMapsListener);
    this.googleSearchBox = null;
  },
  methods:
      {
        ...mapMutations([SET_FIELD, SET_META]),
        gotoNext()
        {
          this.$emit('next');
        },
        getLocationComp(place, type)
        {
          for (const component of place)
          {
            if (component.types[0] === type)
            {
              return component[this.locationNameFormat[type]];
            }
          }
          return '';
        },
        insertLocatationData(loc)
        {
          for (const component of this.locationForm)
          {
            switch (component)
            {
              case 'location':
                this.locationData.streetAddress = this.getLocationComp(loc, 'street_number') + ' ' + this.getLocationComp(loc, 'route');
                break;
              case 'locality':
                this.locationData.addressLocality = this.getLocationComp(loc, component);
                break;
              case 'administrative_area_level_1':
                this.locationData.addressRegion = this.getLocationComp(loc, component);
                break;
              case 'country':
                this.locationData.addressCountry = this.getLocationComp(loc, component);
                break;
              case 'postal_code':
                this.locationData.postalCode = this.getLocationComp(loc, component);
                break;
            }
          }
        },
        locationChanged(place)
        {
          const addressComponents = place.address_components;
          this.insertLocatationData(addressComponents);
          this.$store.commit('SET_LOCATION', Object.assign({}, this.locationData));
          this.locationDisplay = place.formatted_address;
        },
        createValue(val, done)
        {
          // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
          // and it resets the input textbox to empty string
          // ----
          // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
          // only if is not already set
          // and it resets the input textbox to empty string
          // ----
          // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
          // (adds to model if not already in the model, removes from model if already has it)
          // and it resets the input textbox to empty string
          // ----
          // If "var" content is undefined/null, then it doesn't tampers with the model
          // and only resets the input textbox to empty string

          if (val.length > 0)
          {
            if (!stringOptions.includes(val))
            {
              stringOptions.push(val);
            }
            done(val, 'toggle');
          }
        },

        filterFn(val, update)
        {
          update(() =>
          {
            if (val === '')
            {
              this.filterOptions = this.organizations;
            }
            else
            {
              const needle = val.toLowerCase();
              this.filterOptions = this.organizations.filter(
                v => v.name.toLowerCase().indexOf(needle) > -1
              );
            }
          });
          console.log('FILTER', val, update);
        },
        getOrganizations(pagination = { pagination: this.pagination })
        {
          this.loading = true;
          this.$axios.get(process.env.YAWIK_STRAPI_URL + '/api/organizations', {
            params: {
              'pagination[page]': pagination.pagination.page,
              'pagination[pageSize]': pagination.pagination.rowsPerPage,
              sort: 'name:desc'
            },
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + this[GET_TOKEN]
            }
          }
          ).then(response =>
          {
            console.log(response.data.data);
            this.organizations = response.data.data.map(({ attributes }) => attributes);
            this.setPagination(response.data.meta.pagination);
          }).finally(() =>
          {
            this.loading = false;
          });
        },
        setPagination(pagination)
        {
          this.pagination = {
            sortBy: 'asc',
            descending: true,
            rowsNumber: pagination.total,
            page: pagination.page,
            rowsPerPage: pagination.pageSize
          };
        },
      }
};
</script>

<i18n>
{
  "en": {
    "wizard-help-title": "Create job ad",
    "wizard-help-text": "The Jobwizard supports you in creating an advertisement. The use of the Job Wizard and the creation of the advertisement is free of charge. You can activate and deactivate further fields via the settings.",
    "wizard-help-anonymous": "You are currently not logged in. You can use all functions as an anonymous user. However, at the end you can only download the advertisement as HTML.",
    "select_or_create": "Choose a company or create a new one."
  },
  "de": {
    "wizard-help-title": "Stellenanzeige erstellen",
    "wizard-help-text": "Der Jobwizard unterstützt sie bei der Erstellung einer Anzeige. Die Nutzung des Jobwizard und die Erstellung der Anzeige ist kostenlos. Über die Einstellungen können sie weitere Felder aktivieren und deaktivieren.",
    "wizard-help-anonymous": "Sie sind momentan nicht angemeldet. Sie können als anonymer Benutzer alle Funktionen nutzen. Allerdings können Sie am Ende die Anzeige nur als HTML downloaden.",
    "select_or_create": "Wählen sie eine Firma oder erstellen sie eine neue."
  },
  "fr": {
    "wizard-help-title": "Créer une offre d'emploi",
    "wizard-help-text": "Le Jobwizard vous aide à créer une annonce. L'utilisation du Jobwizard et la création de l'annonce sont gratuites. Vous pouvez activer ou désactiver d'autres champs dans les paramètres.",
    "wizard-help-anonymous": "Vous n'êtes actuellement pas connecté. Vous pouvez utiliser toutes les fonctions en tant qu'utilisateur anonyme. Cependant, vous ne pourrez finalement télécharger l'annonce qu'au format HTML.",
    "select_or_create": "Choisissez une entreprise ou créez-en une nouvelle."
  }
}
</i18n>
