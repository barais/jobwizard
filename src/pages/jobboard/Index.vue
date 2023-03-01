<template>
  <q-page class="flex">
    <q-table
      v-model:pagination="pagination"
      :title="$t('public_jobs')"
      :rows="rows"
      :grid="grid"
      :columns="columns"
      :rows-per-page-options="rowsPerPageOptions"
      :loading="loading"
      row-key="name"
      class="full-width"
      table-class="jobtable"
      title-class="text-h5"
      table-header-class="jobtable-header"
      @request="getJobs"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="date" :props="props">
            {{ new Date(props.row.attributes.publishedAt).toLocaleString($yawik.lang()) }}
          </q-td>
          <q-td key="title" :props="props">
            <span class="jobtitle">
              {{ props.row.attributes.jobTitle }}
            </span>
            <div>
              <span v-if="props.row.attributes.meta?.salary">
                <q-badge>{{ props.row.attributes.meta?.salary.label }}</q-badge>
              </span>
              <span v-if="props.row.attributes.meta?.workKind && props.row.attributes.meta?.workKind.length > 0">
                <q-badge color="secondary">{{ props.row.attributes.meta?.workKind.map(item => `${$t('label.' + item)}`).join(', ') }}</q-badge>
              </span>
              <span v-if="props.row.attributes.meta?.workDuration && props.row.attributes.meta?.workDuration.length > 0">
                <q-badge color="green">{{ props.row.attributes.meta?.workDuration.map(item => `${$t('label.' + item)}`).join(', ') }}</q-badge>
              </span>
            </div>
          </q-td>
          <q-td key="location" :props="props">
            {{ props.row.attributes.formattedAddress }}
            <div v-if="props.row.attributes.meta?.remoteWork">
              <q-badge>{{ $t('label.homeoffice') }}</q-badge>
            </div>
          </q-td>
          <q-td key="company" :props="props">
            <q-img v-if="props.row.attributes.logo" class="companylogo" :src="$q.config.jobUrl + props.row.attributes.logo.formats.thumbnail.url" spinner-color="primary" />
            <q-img v-if="!props.row.attributes.logo" class="companylogo">
              <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z" />
              </svg>
            </q-img><q-tooltip> {{ props.row.attributes.intro }}</q-tooltip>
            {{ props.row.attributes.organization }}
          </q-td>
        </q-tr>
      </template>
      <template #top-right>
        <q-btn color="primary" no-caps :disable="loading" :label="$t('create_job')" :to="'/' + $yawik.lang() + '/create/job'" />
      </template>
    </q-table>
  </q-page>
</template>

<script>

import { useMeta } from 'quasar';
import Tooltip from 'src/components/form/Tooltip.vue';

export default {
  name: 'Index',
  components: [
    Tooltip
  ],
  setup()
  {
    useMeta({
      link: {
        material: {
          rel: 'canonical',
          href: 'https://jobwizard.yawik.org' + window.location.pathname
        }
      },
    });
  },
  data()
  {
    return {
      rows: [],
      jobsUrl: `${process.env.YAWIK_API_URL}/api/jobs`,
      loading: false,
      rowsPerPageOptions: [10, 25, 50, 100],
      pagination: {
        sortBy: 'desc',
        descending: true,
        rowsNumber: 10,
        page: 1,
        rowsPerPage: 10
      },
    };
  },
  computed:
      {
        grid()
        {
          return this.$q.platform.is.mobile;
        },
        columns()
        {
          return [
            {
              name: 'date',
              align: 'left',
              label: this.$t('date'),
              field: 'date',
              sortable: false
            },
            {
              name: 'title',
              required: true,
              label: this.$t('job_title'),
              align: 'left',
              field: row => row.attributes.jobTitle,
              format: val => `${val}`,
              sortable: false
            },
            {
              name: 'location',
              align: 'left',
              label: this.$t('location'),
              field: 'location',
              sortable: false
            },
            {
              name: 'company',
              align: 'left',
              label: this.$t('company'),
              field: 'company',
              sortable: false
            }
          ];
        },
      },
  mounted()
  {
    this.getJobs();
  },
  methods:
      {
        getJobs(pagination = { pagination: this.pagination })
        {
          this.loading = true;
          this.$axios.get(this.jobsUrl, {
            params: {
              'pagination[page]': pagination.pagination.page,
              'pagination[pageSize]': pagination.pagination.rowsPerPage,
              populate: 'html,logo',
              sort: 'publishedAt:desc'
            }
          }
          ).then(response =>
          {
            this.rows = response.data.data;
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

<style>

  .jobtable
  {
    font-size: 15px;
  }

  .body--dark .jobtitle
  {
    color: #FAA427;
  }

  .body--light .jobtitle
  {
    color: #5498D7;
  }

  .companylogo
  {
    max-height: 30px;
    max-width: 30px;
  }
</style>
