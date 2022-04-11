<template>
  <q-dialog v-model="value">
    <q-form @submit="submitForm">
      <q-card class="relative-position">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="text-h6">{{ $t('change_org') }}</div>
        </q-card-section>
        <q-card-section>
          <q-input ref="company" v-model.trim="orgName" :label="$t('company')" outlined dense :rules="[ruleRequired]" lazy-rules />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" outline class="q-mr-sm" @click="value = false">
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
</template>

<script>
import validations from 'src/lib/validations';
import eventBus, { AJAX_FAILED } from 'src/lib/eventBus';

export default
{
  name: 'DialogOrg',
  mixins: [validations],
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
      orgName: '',
      sending: false,
    };
  },
  computed:
    {
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
        }
    },
  watch:
    {
      value(newVal)
      {
        if (newVal)
        {
          this.fetchData();
          setTimeout(() =>
          {
            this.$refs.company.focus();
          }, 120);
        }
      }
    },
  methods:
    {
      fetchData()
      {
        this.sending = true;
        this.$axios.get(process.env.YAWIK_API_URL + '/organization').then(response =>
        {
          this.orgName = response.data.orgName;
        }).catch(err =>
        {
          eventBus.emit(AJAX_FAILED, err);
        }).finally(() =>
        {
          this.sending = false;
        });
      },
      submitForm()
      {
        this.sending = true;
        const data = new FormData();
        data.append('organization', this.orgName);
        this.$axios.post(process.env.YAWIK_STRAPI_URL + '/api/organizations', data).then(response =>
        {
          this.value = false;
        }).catch(err =>
        {
          eventBus.emit(AJAX_FAILED, err);
        }).finally(() =>
        {
          this.sending = false;
        });
      },
    }
};
</script>

<i18n>
  {
    "en": {
      "change_org": "Change organization",
      "company": "Company",
    }
  }
</i18n>
