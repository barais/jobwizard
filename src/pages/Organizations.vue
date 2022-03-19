<template>
  <q-page class="flex">
    <q-table
      v-if="$yawik.isAuth()"
      v-model:pagination="pagination"
      :title="$t('nav.organizations')"
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
          <q-td key="logo" :props="props">
            <q-img
              v-if="props.row.attributes.logo"
              width="100px"
              height="50px"
              fit="cover"
              :src="jobDetailUrl + props.row.attributes.logo.formats.thumbnail.url"
            />
            <q-btn v-else dense icon="mdi-plus" label="logo" />
          </q-td>
          <q-td key="header" :props="props">
            <q-img
              v-if="props.row.attributes.header"
              width="100px"
              height="50px"
              fit="cover"
              :src="jobDetailUrl + props.row.attributes.header[0].formats.thumbnail.url"
            />
            <q-btn v-else dense icon="mdi-plus" label="header" />
          </q-td>
          <q-td key="company" :props="props">
            <span v-if="props.row.attributes.name" class="jobtitle">
              {{ props.row.attributes.name }}
            </span>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn size="sm" color="primary" dense class="cursor-pointer" icon="mdi-pencil" @click="editJob(props.row)">
              <q-tooltip :delay="500">
                {{ $t('nav.edit_org') }}
              </q-tooltip>
            </q-btn>
            <q-btn size="sm" color="negative" style="margin-left: 5px;" dense class="cursor-pointer" icon="mdi-delete" @click="confirm(props.row.id,props.row.attributes.jobTitle)">
              <q-tooltip :delay="500">
                {{ $t('nav.del_org') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #top-right>
        <q-btn no-caps color="primary" :disable="loading" :label="$t('nav.create_org')" @click="createAd" />
      </template>
    </q-table>
    <q-card v-if="!$yawik.isAuth()" class="absolute-center channel shadow-5">
      <div class="text-h4 q-mb-md full-width">{{ $t('title') }}</div>
      <p>{{ $t('please_register') }}</p>
    </q-card>
  </q-page>
</template>

<script>
import { GET_TOKEN } from 'src/store/names';
import { mapGetters } from 'vuex';
import { api } from 'boot/axios';

export default {
  name: 'Organizations',
  data()
  {
    return {
      jobDetailUrl: `${process.env.YAWIK_STRAPI_URL}`,
      rows: [],
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
          name: 'logo',
          align: 'left',
          label: this.$t('logo'),
          sortable: false
        },
        {
          name: 'header',
          align: 'left',
          label: this.$t('header'),
          sortable: false
        },
        {
          name: 'company',
          required: true,
          label: this.$t('nav.organization'),
          align: 'left',
          field: row => row.attributes.name,
          format: val => `${val}`,
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
      this.getMedia();
    }
  },
  methods:
  {
    getMedia(pagination = { pagination: this.pagination })
    {
      this.loading = true;
      api.get('/api/organizations', {
        params: {
          'pagination[page]': pagination.pagination.page,
          'pagination[pageSize]': pagination.pagination.rowsPerPage,
          fields: ['name'],
          sort: 'name:desc',
          populate: ['header', 'logo', 'jobs'],
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
  }
};
</script>
