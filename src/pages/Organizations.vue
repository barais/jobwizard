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
      @request="organizations"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="logo" :props="props">
            <q-img
              v-if="props.row.attributes.logo"
              width="100px"
              height="50px"
              fit="cover"
              :src="$q.config.jobUrl + props.row.attributes.logo.formats.thumbnail.url"
            />
            <q-btn
              v-else
              dense icon="mdi-plus" label="logo"
              @click="value = false,dlgLogo = true"
            />
          </q-td>
          <q-td key="header" :props="props">
            <q-img
              v-if="props.row.attributes.header"
              width="100px"
              height="50px"
              fit="cover"
              :src="$q.config.jobUrl + props.row.attributes.header[0].formats.thumbnail.url"
            />
            <q-btn v-else dense icon="mdi-plus" label="header" />
          </q-td>
          <q-td key="company" :props="props">
            <span v-if="props.row.attributes.name" class="jobtitle">
              {{ props.row.attributes.name }}
            </span>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              size="sm"
              color="primary"
              dense class="cursor-pointer" icon="mdi-pencil"
              :to="'/' + $yawik.lang() + '/organization/' + props.row.id"
            >
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
        <q-btn no-caps color="primary" :disable="loading" :label="$t('nav.create_org')" to="#" />
      </template>
    </q-table>
    <q-card v-if="!$yawik.isAuth()" class="absolute-center channel shadow-5">
      <div class="text-h4 q-mb-md full-width">{{ $t('title') }}</div>
      <p>{{ $t('please_register') }}</p>
    </q-card>
    <DialogLogo v-model="dlgLogo" />
  </q-page>
</template>

<script>
import { GET_TOKEN } from 'src/store/names';
import { mapGetters } from 'vuex';
import { api } from 'boot/axios';
import DialogLogo from 'src/components/dialogs/DialogLogo';

export default {
  name: 'Organizations',
  components: {
    DialogLogo
  },
  props:
  {
    modelValue:
      {
        type: Boolean,
        default: false
      },
  },
  emits: ['update:modelValue'],
  data()
  {
    return {
      rows: [],
      dlgLogo: false,
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
    value:
    {
      get()
      {
        return this.modelValue;
      },
      set(val)
      {
        this.$emit('update:modelValue', val);
      }
    },
  },
  mounted()
  {
    if (this.$yawik.isAuth())
    {
      this.organizations();
    }
  },
  methods:
  {
    organizations(pagination = { pagination: this.pagination })
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
    deleteOrganization(id)
    {
      api.delete('/api/organizations/' + id, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        }
      }).then(response =>
      {
        this.organizations();
        this.$q.notify({
          type: 'positive',
          message: `company deleted successfully.`
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
        message: this.$t('confirm_del') + '<p><b>' + title + '</b></p>',
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

  }
};
</script>
