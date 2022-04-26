<template>
  <q-page class="flex">
    <q-table
      v-if="$yawik.isAuth()"
      v-model:pagination="pagination"
      :title="$t('ad_management')"
      :rows="rows"
      :grid="grid"
      :columns="columns"
      :filter="filter"
      :rows-per-page-options="rowsPerPageOptions"
      :loading="loading"
      row-key="id"
      class="full-width"
      table-class="jobtable"
      title-class="text-h5"
      table-header-class="jobtable-header"
      binary-state-sort
      @request="getJobs"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="createdAt" :props="props">
            {{ props.row.attributes.publishedAt ? new Date(props.row.attributes.publishedAt).toLocaleString($yawik.lang()) : new Date(props.row.attributes.createdAt).toLocaleString($yawik.lang()) }}
            <div v-if="!props.row.attributes.publishedAt">
              <q-badge>{{ $t('unpublished') }}</q-badge>
            </div>
          </q-td>
          <q-td key="jobTitle" :props="props">
            <a v-if="props.row.attributes.html" target="_new" :href="$q.config.jobUrl + props.row.attributes.html.url">
              <span class="cursor-pointer jobtitle">
                {{ props.row.attributes.jobTitle }}
                <q-tooltip :delay="500">
                  {{ props.row.attributes.id }}
                </q-tooltip>
              </span>
            </a>
            <span v-if="!props.row.attributes.html" class="jobtitle">
              {{ props.row.attributes.jobTitle }}
            </span>
          </q-td>
          <q-td key="formattedAddress" :props="props">
            {{ props.row.attributes.formattedAddress }}
          </q-td>
          <q-td key="organization" :props="props">
            <p v-if="props.row.attributes.org"
               class="cursor-pointer text-blue"
               @click="editOrg(props.row.attributes.org)"
            >
              {{ props.row.attributes.org.name }}
            </p>
            <span v-else>{{ props.row.attributes.organization }}</span>
          </q-td>
          <q-td key="statistics" :props="props">
            <q-btn
              v-if="props.row.attributes.statistics &&
                props.row.attributes.statistics.length"
              flat
              @click="showStatisticsDialog = !showStatisticsDialog;
                      statistics = props.row.attributes.statistics"
            >
              {{ props.row.attributes.statistics.reduce(function(pv, cv) { return pv + cv.clicks; }, 0) }}
            </q-btn>
          </q-td>
          <q-td key="applications" :props="props">
            <q-btn
              v-if="props.row.attributes.applications &&
                props.row.attributes.applications.length"
              flat
              :to="'applications/' + props.row.attributes.id"
              :label="props.row.attributes.applications.length"
            />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn size="sm" color="primary" dense class="cursor-pointer" icon="mdi-pencil" @click="editJob(props.row)">
              <q-tooltip :delay="500">
                {{ $t('nav.edit_job') }}
              </q-tooltip>
            </q-btn>
            <q-btn size="sm" color="negative" style="margin-left: 5px;" dense class="cursor-pointer" icon="mdi-delete" @click="confirm(props.row.id,props.row.attributes.jobTitle)">
              <q-tooltip :delay="500">
                {{ $t('nav.del_job') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #top-right>
        <q-input v-model="filter" class="q-mr-sm" outlined dense debounce="300" :placeholder="$t('search')">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn no-caps color="primary" :disable="loading" :label="$t('create_job')" @click="createAd" />
      </template>
    </q-table>
    <q-card v-if="!$yawik.isAuth()" class="absolute-center channel shadow-5">
      <div class="text-h4 q-mb-md full-width">{{ $t('title') }}</div>
      <p>{{ $t('please_register') }}</p>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
          <q-icon name="mdi-content-copy" /> &nbsp; {{ $t("ad_management") }}
        </div>
        <div class="text-caption text-grey">
          {{ $t('ad-management-description') }}
        </div>
      </q-card-section>

      <q-separator />

      <div class="text-center text-h4 q-mb-md full-width">{{ $t('preis1') }}</div>
    </q-card>

    <q-dialog v-model="showOrgAddDialog">
      <q-form @submit="updateOrg">
        <q-card class="relative-position">
          <q-card-section class="bg-primary text-white q-py-sm">
            <div class="text-h6">{{ $t('nav.update_org') }}</div>
          </q-card-section>
          <q-card-section>
            <q-input ref="company" v-model.trim="orgName" :label="$t('company')" outlined dense :rules="[ruleRequired]"
                     lazy-rules
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" outline class="q-mr-sm" @click="showOrgAddDialog = false">
              {{ $t('btn.cancel') }}
            </q-btn>
            <q-btn color="primary" class="q-ml-sm" type="submit">
              {{ $t('btn.send') }}
            </q-btn>
          </q-card-actions>
          <q-inner-loading :showing="sending">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </q-form>
    </q-dialog>
    <dialog-statistics :statistics="statistics" @close="statistics = false" />
  </q-page>
</template>

<script>

import { ref } from 'vue';
import { useMeta } from 'quasar';
import { SET_JOB, SET_LOGO, SET_HEADER, GET_TOKEN } from 'src/store/names';
import { mapGetters, mapMutations } from 'vuex';
import { api } from 'boot/axios';
import DialogStatistics from 'src/components/dialogs/DialogStatistics';

export default {
  name: 'Index',
  components: {
    DialogStatistics
  },
  setup()
  {
    const filter = ref('');

    useMeta({
      link: {
        material: {
          rel: 'canonical',
          href: 'https://jobwizard.yawik.org' + window.location.pathname
        }
      }
    });
    return {
      filter
    };
  },
  data()
  {
    return {
      rows: [],
      loading: false,
      rowsPerPageOptions: [10, 25, 50, 100],
      pagination: {
        sortBy: 'createdAt',
        descending: true,
        rowsNumber: 10,
        page: 1,
        rowsPerPage: 10
      },
      sending: false,
      orgName: null,
      showOrgAddDialog: false,
      selectedOrg: null,
      statistics: false
    };
  },
  computed:
      {
        ...mapGetters([GET_TOKEN]),
        grid()
        {
          return this.$q.platform.is.mobile;
        },
        columns()
        {
          return [
            {
              name: 'createdAt',
              align: 'left',
              label: this.$t('date'),
              field: row => row.attributes.createAd,
              sortable: true
            },
            {
              name: 'jobTitle',
              required: true,
              label: this.$t('job_title'),
              align: 'left',
              field: 'row => row.attributes.jobTitle',
              format: val => `${val}`,
              sortable: true
            },
            {
              name: 'formattedAddress',
              align: 'left',
              label: this.$t('location'),
              field: 'location',
              sortable: true
            },
            {
              name: 'organization',
              align: 'left',
              label: this.$t('company'),
              field: 'company',
              sortable: true
            },
            {
              name: 'statistics',
              align: 'left',
              label: this.$t('nav.clicks'),
              field: 'statistics',
              sortable: false
            },
            {
              name: 'applications',
              align: 'left',
              label: this.$t('nav.applications'),
              field: 'applications',
              sortable: false
            },
            {
              name: 'action',
              align: 'left',
              label: this.$t('action'),
              sortable: false
            },
          ];
        },
      },
  mounted()
  {
    if (this.$yawik.isAuth())
    {
      this.getJobs();
    }
  },
  methods:
  {
    ...mapMutations([SET_JOB, SET_LOGO, SET_HEADER]),
    getJobs(data = { pagination: this.pagination })
    {
      if (data.pagination.sortBy)
      {
        this.pagination.sortBy = data.pagination.sortBy;
      }
      this.pagination.descending = data.pagination.descending;

      this.loading = true;
      api.get('/api/jobs', {
        params: {
          'pagination[page]': data.pagination.page,
          'pagination[pageSize]': data.pagination.rowsPerPage,
          populate: 'html,org,applications,statistics',
          filters: {
            $or: [
              {
                jobTitle: {
                  $containsi: data.filter
                }
              },
              {
                organization: {
                  $containsi: data.filter
                }
              }
            ]
          },
          sort: this.pagination.sortBy + ':' + (this.pagination.descending ? 'desc' : 'asc')
        },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        }
      }
      ).then(response =>
      {
        console.log(response);
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
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending,
        rowsNumber: pagination.total,
        page: pagination.page,
        rowsPerPage: pagination.pageSize
      };
    },
    editJob(job)
    {
      this.$router.push({
        name: 'job',
        params: {
          id: job.id
        }
      });
    },
    deleteJob(id)
    {
      api.delete('/api/jobs/' + id, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        }
      }).then(response =>
      {
        this.getJobs();
        this.$q.notify({
          type: 'positive',
          message: `Job deleted successfully.`
        });
      });

      this.$router.push({
        name: 'jobs',
      });
    },
    confirm(id, title)
    {
      this.$q.dialog({
        title: this.$t('alert'),
        message: this.$t('confirm.delete_job') + '<p><b>' + title + '</b></p>',
        cancel: true,
        persistent: true,
        html: true
      }).onOk(() =>
      {
        this.deleteJob(id);
        console.log('>>>> OK');
      }).onOk(() =>
      {
        console.log('>>>> second OK catcher');
      }).onCancel(() =>
      {
        console.log('>>>> Cancel');
      }).onDismiss(() =>
      {
        console.log('I am triggered on both OK and Cancel');
      });
    },
    createAd()
    {
      this.$router.push(
        {
          name: 'create_job'
        }
      );
    },
    editOrg(organization)
    {
      console.log(JSON.stringify(organization));
      this.selectedOrg = organization;
      this.orgName = organization.name;
      this.showOrgAddDialog = true;
    },
    updateOrg()
    {
      this.sending = true;
      api.put('/api/organizations/' + this.selectedOrg.id, {
        data: {
          name: this.orgName,
          id: this.selectedOrg.id
        }
      },
      {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        },
      }
      ).then(response =>
      {
        if (response.status === 200)
        {
          this.$q.notify({
            type: 'positive',
            message: `Company name updated successfully.`
          });
          this.showOrgAddDialog = false;
          this.selectedOrg = null;
          this.getJobs();
        }
      }).finally(() =>
      {
        this.sending = false;
      });
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
    color: var(--q-secondary);
  }

  .body--light .jobtitle
  {
    color: var(--q-primary);
  }

  .channel
  {
    padding: 10px;
    width: 100%;
    max-width: 500px;
  }

</style>
