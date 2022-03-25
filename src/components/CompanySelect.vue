<template>
  <div>
    <q-select
      v-if="$yawik.isAuth()"
      v-model="org"
      :label="$t('label.organization')"
      :rules="[ruleRequired]"
      outlined
      :use-input="!org"
      dense
      :placeholder="!org ? $t('select_or_create') : ''"
      input-debounce="0"
      :options="filterOptions"
      option-value="id"
      option-label="name"
      @filter="filterFn"
    >
      <template v-if="organization" #append>
        <q-icon name="cancel" class="cursor-pointer" @click.stop="organization = null" />
      </template>
    </q-select>

    <q-input
      v-else
      v-model="organization"
      outlined
      dense
      name="organization"
      class="col-12"
      :label="$t('label.organization')"
      :rules="[ruleRequired]"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { GET_FORM, SET_FIELD, GET_TOKEN } from 'src/store/names';
import mixinValidations from 'src/lib/validations';
import { api } from 'boot/axios';

export default {
  name: 'CompanySelect',
  components: { },
  mixins: [mixinValidations],
  emits: ['update:org'],
  data()
  {
    return {
      filterOptions: [],
      organizations: []
    };
  },
  computed:
  {
    ...mapGetters([GET_FORM, GET_TOKEN]),
    org: {
      set(val)
      {
        this.$emit('update:org', val);
        this[SET_FIELD]({ org: val });
      },
      get()
      {
        return this[GET_FORM].org;
      }
    }
  },
  mounted()
  {
    if (this.$yawik.isAuth())
    {
      this.getOrganizations();
    }
  },
  methods:
  {
    ...mapMutations([SET_FIELD]),
    filterFn(val, update)
    {
      update(() =>
      {
        if (val === '')
        {
          this.filterOptions = this.getOrganizations();
        }
        else
        {
          const needle = val.toLowerCase();
          this.filterOptions = this.organizations.filter(
            v => v.name.toLowerCase().indexOf(needle) > -1
          );
        }
      });
      console.log('FILTER', val, update);
    },
    getOrganizations()
    {
      this.loading = true;
      api.get('/api/organizations', {
        params: {
          'pagination[page]': 1,
          'pagination[pageSize]': 20,
          fields: ['id', 'name'],
          sort: 'name:desc'
        },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        }
      }
      ).then(response =>
      {
        this.organizations = response.data.data.map(({ attributes }) => attributes);
        this.filterOptions = this.organizations;
      }).finally(() =>
      {
        this.loading = false;
      });
      return this.organizations;
    }
  }
};
</script>
