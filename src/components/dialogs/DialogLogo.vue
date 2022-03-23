<template>
  <q-dialog v-model="value">
    <q-form @submit="submitForm">
      <q-card class="relative-position">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="text-h6">{{ $t('change_logo') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="column">
            <upload-logo />
          </div>
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
import UploadLogo from 'src/components/UploadLogo';
import eventBus, { AJAX_FAILED } from 'src/lib/eventBus';

export default
{
  name: 'DialogLogo',
  components:
    {
      UploadLogo,
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
      sending: false,
      photo: null,
      image: null,
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
        if (newVal) this.fetchData();
      }
    },
  methods:
    {
      fetchData()
      {
        this.sending = true;
        this.$axios.get(process.env.YAWIK_API_URL + '/logo').then(response =>
        {
          this.image = response.data.logoUrl;
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
        data.append('logo', this.photo || '');
        this.$axios.post(process.env.YAWIK_API_URL + '/logo', data).then(response =>
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
      choosePhoto(list)
      {
        if (list[0].size)
        {
          if (list[0].size > 1e6)
          {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              icon: 'mdi-alert',
              message: this.$t('photo_rejected'),
            });
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) =>
          {
            this.image = e.target.result;
          };
          reader.readAsDataURL(list[0]);
          this.photo = list[0];
        }
      }
    }
};
</script>

<i18n>
  {
    "en": {
      "change_logo": "Change logo",
      "photo_rejected": "Image was rejected",
    }
  }
</i18n>
