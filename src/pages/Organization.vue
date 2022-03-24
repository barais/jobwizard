<template>
  <q-page padding>
    <h1>{{ $t('organization') }} {{ orgId }}#</h1>
    <pre>{{ org.name }}</pre>
    <div v-if="orgId">
      <q-input
        v-model="org.name"
        :label="$t('label.organization')"
        dense
        clearable
        outlined
      />
      <q-btn
        dense
        :label="$t('save')"
        color="primary"
        @click="updateOrg(org)"
      />
    </div>
    <div v-else>
      <q-input
        v-model="org.name"
        :label="$t('label.organization')"
        dense
        clearable
        outlined
      />
      <q-btn
        dense
        :label="$t('save')"
        color="primary"
        @click="createOrg"
      />
    </div>
  </q-page>
</template>

<script>
import { GET_TOKEN } from 'src/store/names';
import { mapGetters } from 'vuex';
import { api } from 'boot/axios';

export default {
  name: 'Organization',
  props:
  {
    orgId:
    {
      type: [String, Number],
      default: null
    },
  },
  data()
  {
    return {
      org: {
        name: null,
        id: null,
      },
      loading: false,
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
    ...mapGetters([GET_TOKEN])
  },
  mounted()
  {
    if (this.$yawik.isAuth())
    {
      this.getOrg(this.orgId);
    }
  },
  methods:
  {
    getOrg(id)
    {
      api.get('/api/organizations/' + id,
        {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + this[GET_TOKEN]
          }
        }
      ).then(response =>
      {
        this.org = response.data;
        console.log(response.data.success.org);
      });
    },
    createOrg(data)
    {
      console.log(data);
      api.post('/api/organizations', {
        data: this.org
      },
      {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        },
      }
      ).then(response =>
      {
        this.org = response.data;
        console.log(response.data.success.org);
      });
    },
    updateOrg(data)
    {
      console.log(data);
      api.put('/api/organizations/' + data.id, {
        data: data
      },
      {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        },
      }
      ).then(response =>
      {
        this.org = response.data;
        console.log(response.data.success.org);
      });
    }
  }

};
</script>
