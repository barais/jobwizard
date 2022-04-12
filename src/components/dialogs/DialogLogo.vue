<template>
  <q-dialog v-model="value">
    <q-form @submit="submitForm">
      <q-card class="relative-position">
        <q-bar>
          <q-icon name="img:../../yawik_logo-mobile.svg" />
          <div>{{ $t('change_logo') }}</div>

          <q-space />

          <q-btn v-close-popup dense flat icon="close">
            <q-tooltip>{{ $t('btn.close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div>{{ $t('change_logo') }}</div>
        </q-card-section>
        <q-card-section>
          <div class="column">
            <upload-logo
              v-bind="$attrs"
              :ref2="ref2"
              :ref-id="refId"
              :field="field"
            />
          </div>
        </q-card-section>
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
  inheritAttrs: false,
  props:
  {
    modelValue:
    {
      type: Boolean,
      default: false
    },
    ref2:
    {
      type: [String, Number],
      default: ''
    },
    refId:
    {
      type: Number,
      default: 0
    },
    field:
    {
      type: String,
      default: ''
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
        console.log(newVal);
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
      "change_logo": "Upload Image",
      "photo_rejected": "Image was rejected",
    },
    "de": {
      "change_logo": "Logo hochladen",
      "photo_rejected": "Das Bild wurde abgelehnt",
    },
    "fr": {
      "change_logo": "Change logo",
      "photo_rejected": "Image was rejected",
    }
  }
</i18n>
