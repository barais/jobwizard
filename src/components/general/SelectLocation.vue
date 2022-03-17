<template>
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
</template>

<script>
import { GET_META, SET_META } from 'src/store/names';
import { mapGetters, mapMutations } from 'vuex';
export default
{
  name: 'SelectLocation',
  props: {
    countries: {
      type: String,
      default: ''
    },
  },
  computed:
  {
    ...mapGetters([GET_META]),
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
  },
  beforeUnmount()
  {
    if (this.googleMapsListener) this.googleSearchBox.removeListener(this.googleMapsListener);
    this.googleSearchBox = null;
  },
  methods:
  {
    ...mapMutations([SET_META]),
  }

};
</script>

<i18n>
  {
    "en": {
    }
  }
</i18n>
