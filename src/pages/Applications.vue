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
      :wrap-cells="true"
      title-class="text-h5"
      table-header-class="jobtable-header"
      @request="getApplications"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="status" :props="props">
            <q-badge v-if="props.row.attributes.status">{{ $t(props.row.attributes.status) }}</q-badge>
          </q-td>
          <q-td key="createdAt" :props="props">
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
          <q-td key="attachments" :props="props">
            <attachments :files="props.row.attributes.attachments" />
          </q-td>
          <q-td key="contact" :props="props" style="max-width: 150px;">
            <q-btn
              v-if="props.row.attributes.phone"
              icon="phone"
              type="a"
              :href="'tel:' + props.row.attributes.phone"
              flat dense no-caps
              :label="props.row.attributes.phone"
            />
            <q-btn
              v-if="props.row.attributes.email"
              icon="mail"
              type="a"
              :href="'mailto:'+props.row.attributes.email"
              flat dense no-caps
              :label="props.row.attributes.email"
            />
          </q-td>
          <q-td key="job" :props="props">
            <q-btn
              to=""
              disabled
              flat
              dense
              no-caps
              :label="props.row.attributes.job?.jobTitle
                ? props.row.attributes.job?.jobTitle
                : $t('Initiativbewerbung')"
            />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              size="sm" color="primary"
              dense
              class="cursor-pointer"
              icon="mdi-pencil"
              @click="editApplication(props.row)"
            >
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
        <q-btn no-caps color="primary" disabled :disable="loading" :label="$t('import_application')" @click="createApplication" />
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
import { ref } from 'vue';
import { useMeta } from 'quasar';
import { SET_JOB, SET_LOGO, SET_HEADER, GET_TOKEN } from 'src/store/names';
import { mapGetters, mapMutations } from 'vuex';
import { api } from 'boot/axios';
import Attachments from 'components/AttachmentList.vue';

export default {
  name: 'Applications',
  emits: ['application'],
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
  components:
  {
    Attachments,
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
              name: 'status',
              align: 'left',
              label: this.$t('nav.state'),
              field: 'date',
              sortable: true
            },
            {
              name: 'createdAt',
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
              name: 'attachments',
              align: 'left',
              label: this.$t('nav.attachments'),
              field: 'attachments',
              sortable: false
            },
            {
              name: 'contact',
              align: 'left',
              label: this.$t('nav.contact'),
              field: 'location',
              sortable: false
            },
            {
              name: 'job',
              align: 'left',
              label: this.$t('nav.project'),
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
    getApplications(data = { pagination: this.pagination })
    {
      if (data.pagination.sortBy)
      {
        this.pagination.sortBy = data.pagination.sortBy;
      }
      this.pagination.descending = data.pagination.descending;
      this.loading = true;
      api.get('/api/applications', {
        params: {
          'pagination[page]': data.pagination.page,
          'pagination[pageSize]': data.pagination.rowsPerPage,
          populate: 'photo,job',
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
    editApplication(application)
    {
      this.$emit('application', application);
      this.$router.push({
        name: 'nav.application',
        params: {
          id: application.id
        }
      });
    },
    deleteJob(id)
    {
      api.delete('/api/applications/' + id, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        }
      }).then(response =>
      {
        this.getApplications();
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
    createApplication()
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
