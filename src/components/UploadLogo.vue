<template>
  <div>
    <q-uploader
      v-if="!fileExists"
      hide-upload-btn
      :color="$q.dark.mode ? 'black' : 'grey-2' "
      :text-color="$q.dark.mode ? 'white' : 'dark'"
      accept="image/*"
      :max-total-size="maxTotalSize"
      :max-files="1"
      :class="fileExists ? 'hidden full-width' : 'full-width'"
      :label="label"
      :factory="uploadFile"
      auto-upload
      @rejected="rejectedFiles"
      @added="logoAdded"
      @removed="logoRemoved"
    />
    <q-img
      v-else
      :width="width"
      :height="height"
      :fit="fit"
      :src="$q.config.jobUrl + (field == 'logo' ? logoUrl : headerUrl)"
    />
  </div>
</template>

<script>
import mixinValidations from 'src/lib/validations';
import { format } from 'quasar';
import { api } from 'boot/axios';
import { mapGetters, mapMutations } from 'vuex';
import { GET_TOKEN, GET_LOGO, SET_LOGO, GET_HEADER, SET_HEADER } from 'src/store/names';

const { humanStorageSize } = format;
const maxWidth = 800;

export default {
  name: 'UploadLogo',
  emits: ['file-uploaded'],
  mixins: [mixinValidations],
  props:
      {
        ref:
          {
            type: String,
            default: 'api::job.job'
          },
        ref2:
          {
            type: String,
            default: ''
          },
        refId:
          {
            type: [Number, String],
            default: 300
          },
        field:
          {
            type: String,
            default: 'logo'
          },
        width:
          {
            type: String,
            default: 'logo'
          },
        height:
          {
            type: String,
            default: 'logo'
          },
        fit:
          {
            type: String,
            default: 'logo'
          },

        label:
          {
            type: String,
            default: ''
          },
        maxTotalSize:
          {
            type: [Number],
            default: 1024000
          }
      },
  setup()
  {
    return {};
  },
  computed:
      {
        ...mapGetters([GET_TOKEN, GET_LOGO, GET_HEADER]),
        imageLogo:
          {
            get()
            {
              return this[GET_LOGO];
            },
            set(val)
            {
              this[SET_LOGO](val);
            }
          },
        imageHeader:
          {
            get()
            {
              return this[GET_HEADER];
            },
            set(val)
            {
              this[SET_HEADER](val);
            }
          },
        fileExists()
        {
          return this.field === 'logo'
            ? this.imageLogo && this.imageLogo.data
            : this.imageHeader && this.imageHeader.data;
        },
        logoUrl()
        {
          return this.imageLogo.data.formats.thumbnail.url;
        },
        headerUrl()
        {
          return this.imageHeader.data[0].formats.thumbnail.url;
        },

        token()
        {
          return this[GET_TOKEN];
        },
        maxWidth()
        {
          return maxWidth;
        },
      },
  methods: {
    ...mapMutations([SET_LOGO, SET_HEADER, SET_LOGO]),
    readFile(file)
    {
      return new Promise((resolve) =>
      {
        if (file.size)
        {
          const reader = new FileReader();
          reader.onload = (e) =>
          {
            resolve(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    },
    rejectedFiles(files)
    {
      const size = this.maxTotalSize;
      console.log('SIZE: ', size);
      this.$q.notify({
        color: 'negative',
        position: 'top',
        icon: 'mdi-alert',
        message: this.$t('image_rejected') + ' ' + humanStorageSize(size),
      });
    },
    logoAdded(files)
    {
      this.readFile(files[0]).then(b64 =>
      {
        this.imageLogo = b64;
      });
    },
    logoRemoved(files)
    {
      this.imageLogo = '';
    },
    uploadFile(file)
    {
      const fd = new FormData();
      fd.append('ref', this.ref2);
      fd.append('refId', this.refId);
      fd.append('field', this.field);
      fd.append('files', file[0]);

      return new Promise((resolve, reject) =>
      {
        api.post('/api/upload', fd,
          {
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + this.token,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res =>
          {
            console.log('Result', res);
            this.$emit('file-uploaded', {
              uploaded: true,
              field: this.field
            });
            console.log('upload file');
            resolve(file);
          })
          .catch(err => reject(err));
      });
    },
  }

};
</script>

<i18n>
  {
  "en": {
  "logo": "Logo",
  "header": "Header image",
  "intro": "Company description",
  "tasks": "Tasks",
  "profile": "Profile",
  "offer": "Offer",
  "contact_info": "Contact",
  "image_rejected": "File too big - above",
  "choose_logo": "Choose company logo",
  "choose_header": "Choose a header image",
  },
  "de": {
  "logo": "Logo",
  "header": "Headerbild",
  "intro": "Unternehmensbeschreibung",
  "tasks": "Aufgaben",
  "profile": "Ihre Voraussetzungen",
  "offer": "Ihre Vorteile",
  "contact_info": "Kontakt",
  "image_rejected": "Die Datei ist zu groß. über",
  "choose_logo": "Logo wählen",
  "choose_header": "Header wählen",
  }
  }
</i18n>
