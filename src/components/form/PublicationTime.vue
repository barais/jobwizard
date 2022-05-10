<template>
  <div>
    <br>
    <div class="q-pb-sm">{{ $t('label.publication-time') }}</div>
    <div class="row">
      <div class="col-md-6">
        <DateInput
          ref="start"
          v-model.trim="dateStart"
          name="begin"
          :placeholder="$yawik.dateFormat()"
          lazy-rules
          :rules="[ruleRequired]"
          :disable="immediately"
          :label="$t('label.publication-start')"
        />
      </div>
      <q-checkbox v-model="immediately" class="col-md-6" :label="$t('label.immediately')" />
      <q-select
        v-model="days"
        class="col-md-6"
        :options="optionsEnd"
        :option-label="(item) => item === null ? $t('please-select') : item + ' ' + $t('label.days')"
        :label="$t('label.publication-time')"
        dense
        outlined
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import mixinValidations from 'src/lib/validations';
import DateInput from 'src/components/form/DateInput';
import { GET_META, SET_META } from 'src/store/names';
import { mapGetters, mapMutations } from 'vuex';

const date = new Date();

export default
{
  name: 'PublicationTime',
  components: {
    DateInput
  },
  setup()
  {
    return {
      immediatly: ref(false),
      date: ref(date)
    };
  },
  emits: [
    'update:publishEnd',
    'update:publishStart'
  ],
  mixins: [mixinValidations],
  inheritAttrs: false,
  computed:
  {
    ...mapGetters([GET_META]),
    optionsEnd()
    {
      return [30, 60, 90, 180, 360];
    },
    immediately:
    {
      get()
      {
        return this[GET_META].publishImmediately;
      },
      set(val)
      {
        this[SET_META]({ publishImmediately: val });
      }
    },
    days:
    {
      get()
      {
        return this[GET_META].publishDays;
      },
      set(val)
      {
        this[SET_META]({ publishDays: val });
      }
    },
    dateStart:
    {
      get()
      {
        return this[GET_META].publishStart;
      },
      set(val)
      {
        this[SET_META]({ publishStart: val });
      }
    },
    dateEnd()
    {
      return this.dateStart;
    },
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
    "label": {
      "publication-time": "Publication time",
      "days": "days",
      "immediately": "immediately",
      "publication-start": "Publication start"
    },
  },
  "de": {
    "label": {
      "publication-time": "Schaltungsdauer",
      "days": "Tage",
      "immediately": "sofort",
      "publication-start": "Schaltungsbeginn"
    },
  }
}
</i18n>
