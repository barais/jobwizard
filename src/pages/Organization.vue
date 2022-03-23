<template>
  <q-page padding>
    <h1>{{ $t('organization') }} {{ orgId }}#</h1>
    <pre>{{ org.name }}</pre>
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
        id: null
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
      this.organization(this.orgId);
    }
  },
  methods:
  {
    organization(id)
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
    }
  }

};
</script>
