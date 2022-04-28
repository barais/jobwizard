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

      <company-select
        class="col-12"
        :label="$t('label.organization')"
        @update:org="saveOrg"
      />

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
            {{ $t('wizard_help_title') }}
          </div>
        </q-card-section>
        <q-card-section>
          <div>
            {{ $t('wizard_help_text') }}
          </div>
        </q-card-section>
        <q-card-section align="center">
          <q-btn flat :to="'/' + $yawik.lang() + '/settings'">{{ $t('nav.settings') }}</q-btn>
        </q-card-section>
        <q-card-section v-if="!$yawik.isAuth()">
          <div>
            {{ $t('wizard_help_anonymous') }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import {
  GET_FORM,
  GET_TOKEN,
  SET_LOCATION,
  GET_SETTINGS,
  SET_META,
  GET_META,
  SET_FIELD,
  GET_LOGO,
  SET_LOGO, GET_HEADER, SET_HEADER
} from 'src/store/names';
import mixinValidations from 'src/lib/validations';
import TextInput from 'src/components/form/TextInput.vue';
import Tooltip from 'src/components/form/Tooltip.vue';
import CompanySelect from 'src/components/CompanySelect.vue';
import { api } from 'boot/axios';

export default {
  name: 'StepOne',
  components: {
    TextInput,
    Tooltip,
    CompanySelect
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
    };
  },
  computed:
  {
    ...mapGetters([GET_TOKEN, GET_FORM, GET_META, GET_SETTINGS, GET_LOGO, GET_HEADER]),
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
    org:
    {
      get()
      {
        return this[GET_FORM].org;
      },
      set(val)
      {
        this[SET_FIELD]({ org: val });
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
    },
    imageLogo:
      {
        get()
        {
          return this[GET_LOGO];
        },
        set(val)
        {
          this[SET_LOGO](val);
        }
      },
    imageHeader:
      {
        get()
        {
          return this[GET_HEADER];
        },
        set(val)
        {
          this[SET_HEADER](val);
        }
      },
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

    if (this.org != null)
    {
      setTimeout(() =>
      {
        this.getOrg(this.org.id);
      }, 3000);
    }
  },
  beforeUnmount()
  {
    if (this.googleMapsListener) this.googleSearchBox.removeListener(this.googleMapsListener);
    this.googleSearchBox = null;
  },
  methods:
  {
    ...mapMutations([SET_FIELD, SET_LOCATION, SET_META, SET_LOGO, SET_HEADER]),
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
      this[SET_LOCATION] = this.locationData;
      this.locationDisplay = place.formatted_address;
    },
    saveOrg(val)
    {
      this[SET_FIELD].organization = val.name;
      this[SET_FIELD].org = val;
      this.getOrg(val.id);
    },
    getOrg(id)
    {
      api.get('/api/organizations/' + id,
        {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + this[GET_TOKEN]
          }
        }
      ).then(response =>
      {
        const org = response.data;
        this.imageLogo = this.$q.config.jobUrl + org.logo.url;
        this.imageHeader = org.header != null ? (this.$q.config.jobUrl + org.header[0].url) : null;
      });
    },
  }
};
</script>
