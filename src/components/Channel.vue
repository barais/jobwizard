<template>
  <q-card class="channel">
    <q-img fit="contain" class="channel-logo" :src="logo" />
    <q-card-section>
      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">
          {{ name }}
        </div>
        <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
          <q-icon :name="icon" />
          &nbsp;{{ $t(id + '.slug') }}
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-subtitle1">
        {{ $t(id + '.slogan') }}
      </div>
      <div class="text-caption text-grey">
        {{ $t(id + '.description') }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-icon name="mdi-cash" />
      <q-btn flat color="primary">
        {{ price > 0 ? price + '€' : $t('free') }}
      </q-btn>
      <q-toggle
        v-model="portal"
        :val="name"
        :disable="!$yawik.isAuth()"
      >
        <Tooltip v-if="!$yawik.isAuth()" :text="$t('pleaseRegister')" />
      </q-toggle>
    </q-card-actions>
  </q-card>
</template>

<script>
import { GET_META, SET_META } from 'src/store/names';
import { mapGetters, mapMutations } from 'vuex';
import Tooltip from 'src/components/form/Tooltip';
export default
{
  name: 'Channel',
  components: {
    Tooltip,
  },
  props: {
    id: {
      type: String,
      default: undefined
    },
    name: {
      type: String,
      default: undefined
    },
    logo: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: undefined
    },
    price: {
      type: Number,
      default: undefined
    },
    delay: {
      type: Number,
      default: 500
    },
    hideDelay: {
      type: Number,
      default: 650
    },
    mode: {
      type: Boolean
    },
  },
  computed:
    {
      ...mapGetters([GET_META]),
      portal:
        {
          get()
          {
            return this[GET_META].channels;
          },
          set(val)
          {
            this[SET_META]({ channels: val });
          }
        },
    },
  methods:
    {
      ...mapMutations([SET_META]),
    }
};
</script>

<style scoped>
  .channel
  {
    padding: 10px;
    width: 100%;
    max-width: 300px;
  }

  .channel-logo
  {
    max-height: 92px;
    width: auto;
    display: block;
  }
</style>

<i18n>
  {
    "en": {
      "channel": "Where would you like to publish your job advertisement?",
      "product1": {
        "name": "Google",
        "slug": "for jobs",
        "slogan": "publish on google for jobs",
        "description": "the job posting will be published on Google for jobs"
      },
      "product2": {
        "name": "Homepage",
        "slug": "Homepage",
        "slogan": "publish on your homepage",
        "description": "the job posting will be published on your homepage"
      },
      "free": "free",
      "pleaseRegister": "You must be logged in to use this channel. If you are not logged in, you can only download the job advertisement."
    },
    "de": {
      "channel": "Wo möchten Sie ihre Stellenanzeige veröffentlichen?",
      "product1": {
        "name": "Google",
        "slug": "for jobs",
        "slogan": "auf Google for Jobs schalten",
        "description": "Die Stellenanzeige wird auf Google for Jobs veröffentlicht."
      },
      "product2": {
        "name": "Homepage",
        "slug": "Homepage",
        "slogan": "auf Homepage veröffentlichen",
        "description": "Die Stellenanzeige wird auf ihrer Homepage veröffentlicht."
      },
      "free": "kostenlos",
      "pleaseRegister": "Sie müssen angemeldet ein, um diesen Kanal nutzen zu können. Unangemeldet können Sie die Stellenanzeige nur downloaden.",
    }
  }
</i18n>
