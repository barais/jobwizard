<template>
  <div>
    <q-select
      v-if="$yawik.isAuth()"
      v-model="organization"
      :label="$t('label.organization')"
      :rules="[ruleRequired]"
      outlined
      use-input
      dense
      :placeholder="organization === null ? $t('select_or_create') : ''"
      input-debounce="0"
      :options="filterOptions"
      option-value="id"
      option-label="name"
      class="col-12"
      @new-value="createValue"
      @filter="filterFn"
    >
      <template v-if="organization" #append>
        <q-icon name="cancel" class="cursor-pointer" @click.stop="organization = null" />
      </template>
    </q-select>

    <TextInput
      v-else
      v-model.trim="organization"
      name="organization"
      class="col-12"
      :label="$t('label.organization')"
      :rules="[ruleRequired]"
      @enterPress="gotoNext"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { GET_FORM, SET_FIELD, GET_TOKEN } from 'src/store/names';

export default {
  name: 'CompanySelect',
  setup()
  {
    return {
      pagination: {
        sortBy: 'desc',
        descending: true,
        rowsNumber: 10,
        page: 1,
        rowsPerPage: 10
      },
      filterOptions: [],
      organizations: []
    };
  },
  computed:
  {
    ...mapGetters([GET_FORM, GET_TOKEN]),
    organization:
    {
      get()
      {
        return this[GET_FORM].organization;
      },
      set(val)
      {
        this[SET_FIELD]({ organization: val });
      }
    },
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
    createValue(val, done)
    {
      // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
      // only if is not already set
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string

      if (val.length > 0)
      {
        if (!this.organizations.map(v => v.name).includes(val))
        {
          this.organizations.push(val);
        }
        done(val, 'toggle');
      }
    },
    filterFn(val, update)
    {
      update(() =>
      {
        if (val === '')
        {
          this.filterOptions = this.organizations;
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
    getOrganizations(pagination = { pagination: this.pagination })
    {
      this.loading = true;
      this.$axios.get(process.env.YAWIK_STRAPI_URL + '/api/organizations', {
        params: {
          'pagination[page]': pagination.pagination.page,
          'pagination[pageSize]': pagination.pagination.rowsPerPage,
          sort: 'name:desc'
        },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + this[GET_TOKEN]
        }
      }
      ).then(response =>
      {
        console.log(response.data.data);
        this.filterOptions = response.data.data.map(({ attributes }) => attributes);
        this.organizations = this.filterOptions;
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

<i18n>
{
  "en": {
    "select_or_create": "Choose a company or create a new one."
  },
  "de": {
     "select_or_create": "Wählen sie eine Firma oder erstellen sie eine neue."
  },
  "fr": {
   "select_or_create": "Choisissez une entreprise ou créez-en une nouvelle."
  }
}
</i18n>
