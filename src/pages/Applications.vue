<template>
  <q-page class="flex">
    <q-table
      v-if="$yawik.isAuth()"
      v-model:pagination="pagination"
      :title="$t('nav.applications')"
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
            {{ props.row.attributes.publishedAt ? new Date(props.row.attributes.publishedAt).toLocaleString($yawik.lang()) : new Date(props.row.attributes.createdAt).toLocaleString($yawik.lang()) }}
          </q-td>
          <q-td key="applicant" :props="props">
            <q-img
              v-if="props.row.attributes.photo"
              height="60px"
              width="50px"
              fit="cover"
              class="float-left q-mr-sm"
              :src="$q.config.jobUrl + props.row.attributes.photo.url" spinner-color="primary"
            />
            <div>
              {{ props.row.attributes.gender === 'male' ? $t('Mr') : '' }}
              {{ props.row.attributes.gender === 'female' ? $t('Mrs') : '' }}
              {{ props.row.attributes.gender === 'diverse' ? $t('X') : '' }}
              {{ props.row.attributes.firstname }}
              {{ props.row.attributes.lastname }}<br>
              {{ props.row.attributes.postalcode }} {{ props.row.attributes.city }}<br>
              {{ props.row.attributes.street }} {{ props.row.attributes.housnumber }}
              <q-tooltip :delay="500">
                {{ props.row.attributes.id }}
              </q-tooltip>
            </div>
            <span v-if="!props.row.attributes.html" class="jobtitle">
              {{ props.row.attributes.jobTitle }}
            </span>
          </q-td>
          <q-td key="contact" :props="props">
            {{ props.row.attributes.phone }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn size="sm" color="primary" dense class="cursor-pointer" icon="mdi-pencil" @click="editJob(props.row)">
              <q-tooltip :delay="500">
                {{ $t('nav.edit_application') }}
              </q-tooltip>
            </q-btn>
            <q-btn size="sm" color="negative" style="margin-left: 5px;" dense class="cursor-pointer" icon="mdi-delete" @click="confirm(props.row.id,props.row.attributes.jobTitle)">
              <q-tooltip :delay="500">
                {{ $t('nav.del_application') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #top-right>
        <q-btn no-caps color="primary" :disable="loading" :label="$t('import_application')" @click="createAd" />
      </template>
    </q-table>
    <q-card v-if="!$yawik.isAuth()" class="absolute-center channel shadow-5">
      <div class="text-h4 q-mb-md full-width">{{ $t('title') }}</div>
      <p>{{ $t('please_register_ats') }}</p>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
          <q-icon name="mdi-content-copy" /> &nbsp; {{ $t("applicant_tracking_system") }}
        </div>
        <div class="text-caption text-grey">
          {{ $t('ats_description') }}
        </div>
      </q-card-section>

      <q-separator />

      <div class="text-center text-h4 q-mb-md full-width">{{ $t('preis1') }}</div>
    </q-card>
  </q-page>
</template>

<script>
import { useMeta } from 'quasar';
import { SET_JOB, SET_LOGO, SET_HEADER, GET_TOKEN } from 'src/store/names';
import { mapGetters, mapMutations } from 'vuex';
import { api } from 'boot/axios';

export default {
  name: 'Applications',
  setup()
  {
    useMeta({
      link: {
        material: {
          rel: 'canonical',
          href: 'https://jobwizard.yawik.org' + window.location.pathname
        }
      }
    });
  },
  data()
  {
    return {
      rows: [],
      jobsUrl: `${process.env.YAWIK_STRAPI_URL}/api/jobs`,
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
        ...mapGetters([GET_TOKEN]),
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
              sortable: true
            },
            {
              name: 'applicant',
              required: true,
              label: this.$t('nav.applicant'),
              align: 'left',
              field: row => row.attributes.firstname,
              format: val => `${val}`,
              sortable: false
            },
            {
              name: 'contact',
              align: 'left',
              label: this.$t('name.contact'),
              field: 'location',
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
      this.getApplications();
    }
  },
  methods:
  {
    ...mapMutations([SET_JOB, SET_LOGO, SET_HEADER]),
    getApplications(pagination = { pagination: this.pagination })
    {
      this.loading = true;
      api.get('/api/applications', {
        params: {
          'pagination[page]': pagination.pagination.page,
          'pagination[pageSize]': pagination.pagination.rowsPerPage,
          populate: 'photo,attachments',
          sort: 'createdAt:desc'
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
        sortBy: 'asc',
        descending: true,
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
          message: `Application deleted successfully.`
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
        message: this.$t('confirm.delete_application') + '<p><b>' + title + '</b></p>',
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
    }
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
