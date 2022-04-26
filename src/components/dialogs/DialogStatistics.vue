<template>
  <q-dialog v-model="alert">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('nav.statistics') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <charts
          width="500"
          height="350"
          type="bar"
          :options="chartOptions"
          :series="series"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup no-caps flat
          :label="$t('btn.close')" color="primary" @click="close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

import Charts from 'vue3-apexcharts';

export default {
  name: 'DialogStatistics',
  components: {
    Charts
  },
  emits: ['close'],
  props: {
    statistics: {
      type: [Object, null],
      required: false,
      default: () =>
      {}
    }
  },
  data: function()
  {
    return {};
  },
  computed:
  {
    chartOptions()
    {
      const options = {
        dataLabels: {
          enabled: true
        },
        xaxis: {
          categories: this.statistics.map(
            x => new Date(x.date).toLocaleDateString()
          )
        },
      };
      return options;
    },
    series()
    {
      const data = [
        {
          name: this.$t('nav.clicks'),
          data: this.statistics.map(x => x.clicks)
        },
      ];
      return data;
    },
    alert()
    {
      return !!this.statistics;
    }
  },
  methods:
  {
    close()
    {
      this.$emit('close', true);
    }
  }

};
</script>
