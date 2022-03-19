<template>
  <div class="q-gutter-md">
    <!-- Logo -->
    <div class="jobintro row q-col-gutter-md justify-center">
      <div class="col-lg-2 col-md-3">
        <q-uploader
          v-if="!(imageLogo && imageLogo.data)"
          hide-upload-btn
          :color="$q.dark.mode ? 'black' : 'grey-2' "
          :text-color="$q.dark.mode ? 'white' : 'dark'"
          accept="image/*"
          style="max-width: 220px; height: 220px;"
          :max-total-size="2e5"
          :max-files="1"
          :class="(imageLogo && imageLogo.data) ? 'hidden' : ''"
          :label="$t('choose_logo')"
          :factory="uploadLogo"
          auto-upload
          @rejected="rejectedFiles"
          @added="logoAdded"
          @removed="logoRemoved"
        />
        <q-img
          v-else width="220px" height="220px" fit="contain" :src="jobDetailUrl + imageLogo.data.formats.thumbnail.url"
        />
      </div>
      <div class="col-lg-10 col-md-9" :style="{maxWidth: (maxWidth * 2 * 0.8) + 'px'}">
        <q-item>
          <q-item-section class="full-width">
            <q-item-label class="text-h3" caption>{{ orgName }}</q-item-label>
            <q-item-label class="text-h2">{{ GET_FORM.jobTitle }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <!-- Header image -->
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" :style="{maxWidth: (maxWidth * 2) + 'px'}">
        <q-uploader
          v-if="!(imageHeader && imageHeader.data)"
          hide-upload-btn
          :color="$q.dark.mode ? 'black' : 'grey-2' "
          :text-color="$q.dark.mode ? 'white' : 'dark'"
          accept="image/*"
          style="max-height: 400px; min-height: 200px; width: 100%;"
          :max-total-size="2e6"
          :max-files="1"
          :class="(imageHeader && imageHeader.data) ? 'hidden' : ''"
          :label="$t('choose_header')"
          :factory="uploadHeader"
          auto-upload
          @rejected="rejectedFiles"
          @added="headerAdded"
          @removed="headerRemoved"
        />
        <q-img
          v-else
          height="200px"
          fit="cover"
          :src="jobDetailUrl + imageHeader.data[0].url"
        />
      </div>
    </div>

    <div class="jobfields row q-col-gutter-md justify-center">
      <!-- Intro -->
      <EditorInput
        v-if="!orgDescription"
        v-model:label="introLabel"
        v-model:value="intro"
        :rules="[ruleRequired]"
        name="intro"
      />
      <div
        v-if="orgDescription"
        class="col-md-12"
        :style="{maxWidth: (maxWidth * 2) + 'px'}"
      >
        <div style="width: 100%;" class="text-h5 q-mb-md">
          {{ orgDescriptionLabel }}
        </div>
        <!-- eslint-disable  vue/no-v-html -->
        <div v-html="orgDescription" />
      </div>

      <!-- Tasks -->
      <EditorInput
        v-model:label="taskLabel"
        v-model:value="tasks"
        :rules="[ruleRequired]"
        name="tasks"
      />

      <!-- Profile -->
      <EditorInput
        v-model:label="profileLabel"
        v-model:value="profile"
        :rules="[]"
        name="profile"
      />

      <!-- Offer -->
      <EditorInput
        v-model:label="offerLabel"
        v-model:value="offer"
        :rules="[]"
        name="offer"
      />

      <!-- Contact info -->
      <EditorInput
        v-if="!orgContactInfo"
        v-model:label="contactInfoLabel"
        v-model:value="contactInfo"
        :rules="applyPost ? [ruleRequired] : []"
        name="contactInfo"
      />
      <div
        v-if="orgContactInfo"
        class="col-md-12"
        :style="{maxWidth: (maxWidth * 2) + 'px'}"
      >
        <div style="width: 100%;" class="text-h5 q-mb-md">
          {{ orgContactInfoLabel }}
        </div>
        <!-- eslint-disable  vue/no-v-html -->
        <div v-html="orgContactInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import mixinValidations from 'src/lib/validations';
import { mapGetters, mapMutations } from 'vuex';
import { GET_SETTINGS, GET_STEP, GET_TOKEN, GET_FORM, SET_FIELD, GET_LOGO, GET_HEADER, SET_LOGO, SET_HEADER } from 'src/store/names';
import EditorInput from 'src/components/form/Editor.vue';
import { api } from 'boot/axios';

export default
{
  name: 'StepTwo',
  components: {
    EditorInput
  },
  mixins: [mixinValidations],
  data()
  {
    return {
      maxWidth: 800,
      jobDetailUrl: `${process.env.YAWIK_JOB_URL}`,
    };
  },
  computed:
    {
      ...mapGetters([GET_FORM, GET_TOKEN, GET_LOGO, GET_HEADER, GET_SETTINGS]),
      introLabel:
        {
          get()
          {
            return this[GET_FORM].introLabel ? this[GET_FORM].introLabel : this.$t('intro');
          },
          set(val)
          {
            this[SET_FIELD]({ introLabel: val });
          }
        },
      intro:
        {
          get()
          {
            return this[GET_FORM].intro;
          },
          set(val)
          {
            this[SET_FIELD]({ intro: val });
          }
        },
      taskLabel:
        {
          get()
          {
            return this[GET_FORM].taskLabel ? this[GET_FORM].taskLabel : this.$t('tasks');
          },
          set(val)
          {
            this[SET_FIELD]({ taskLabel: val });
          }
        },
      tasks:
        {
          get()
          {
            return this[GET_FORM].tasks;
          },
          set(val)
          {
            this[SET_FIELD]({ tasks: val });
          }
        },
      profileLabel:
        {
          get()
          {
            return this[GET_FORM].profileLabel ? this[GET_FORM].profileLabel : this.$t('profile');
          },
          set(val)
          {
            this[SET_FIELD]({ profileLabel: val });
          }
        },
      profile:
        {
          get()
          {
            return this[GET_FORM].profile;
          },
          set(val)
          {
            this[SET_FIELD]({ profile: val });
          }
        },
      offerLabel:
        {
          get()
          {
            return this[GET_FORM].offerLabel ? this[GET_FORM].offerLabel : this.$t('offer');
          },
          set(val)
          {
            this[SET_FIELD]({ offerLabel: val });
          }
        },
      offer:
        {
          get()
          {
            return this[GET_FORM].offer;
          },
          set(val)
          {
            this[SET_FIELD]({ offer: val });
          }
        },
      contactInfoLabel:
        {
          get()
          {
            return this[GET_FORM].contactInfoLabel ? this[GET_FORM].contactInfoLabel : this.$t('contact_info');
          },
          set(val)
          {
            this[SET_FIELD]({ contactInfoLabel: val });
          }
        },
      contactInfo:
        {
          get()
          {
            return this[GET_FORM].contactInfo;
          },
          set(val)
          {
            this[SET_FIELD]({ contactInfo: val });
          }
        },
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
      applyPost()
      {
        return this[GET_FORM].applyPost;
      },
      orgDescription()
      {
        return this[GET_SETTINGS].orgDescription;
      },
      orgDescriptionLabel()
      {
        return this[GET_SETTINGS].orgDescriptionLabel;
      },
      orgContactInfo()
      {
        return this[GET_SETTINGS].orgContactInfo;
      },
      orgContactInfoLabel()
      {
        return this[GET_SETTINGS].orgContactInfoLabel;
      },
      orgName()
      {
        const name = this[GET_FORM].organization;
        return (typeof name === 'object' && 'name' in name) ? name.name : name;
      },
      token()
      {
        return this[GET_TOKEN];
      },
    },
  watch:
    {
      [GET_STEP]()
      {
        this.setFocus();
      },
    },
  created()
  {
    if (this.orgDescription !== '')
    {
      this.intro = this.orgDescription;
      this.introLabel = this.orgDescriptionLabel;
    }
    if (this.orgContactInfo !== '')
    {
      this.contactInfo = this.orgContactInfo;
      this.contactInfoLabel = this.orgContactInfoLabel;
    }
  },
  mounted()
  {
    this.setFocus();
  },
  methods:
    {
      ...mapMutations([SET_FIELD, SET_LOGO, SET_HEADER]),
      setFocus()
      {
        if (this[GET_STEP] === 'stepTwo') this.$refs.editor.focus();
      },
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
        this.$q.notify({
          color: 'negative',
          position: 'top',
          icon: 'mdi-alert',
          message: this.$t('image_rejected'),
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
      headerAdded(files)
      {
        this.readFile(files[0]).then(b64 =>
        {
          console.log('Image ' + b64);
          this.imageHeader = b64;
        });
      },
      headerRemoved(files)
      {
        this.imageHeader = '';
      },
      uploadLogo(file)
      {
        const token = this.token;
        const fd = new FormData();
        console.log('FILE:', file);
        fd.append('ref', 'api::job.job');
        fd.append('refId', this.$route.params.id);
        fd.append('field', 'logo');
        fd.append('files', file[0]);
        fd.append('source', 'users-permissions');

        return new Promise((resolve, reject) =>
        {
          api.post('/api/upload', fd,
            {
              headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(res =>
            {
              console.log('Result', res);
              resolve(file);
            })
            .catch(err => reject(err));
        });
      },
      uploadHeader(file)
      {
        const token = this.token;
        const fd = new FormData();
        console.log('FILE:', file);
        fd.append('ref', 'api::job.job');
        fd.append('refId', this.$route.params.id);
        fd.append('field', 'header');
        fd.append('files', file[0]);

        return new Promise((resolve, reject) =>
        {
          api.post('/api/upload', fd, {
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + token,
              'Content-Type': 'multipart/form-data'
            },
          })
            .then(res =>
            {
              console.log('Result', res);
              resolve(file);
            })
            .catch(err => reject(err));
        });
      },

    }
};
</script>

<style>
  .img_logo
  {
    max-width: 220px;
    max-height: 220px;
  }

  .img_header
  {
    max-width: 100%;
    max-height: 220px;
  }

  .jobfields
  {
    padding-top: 16px;
    padding-left: 16px;
  }

  .jobintro
  {
    padding-left: 16px;
  }
</style>

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
      "image_rejected": "File too big - above 10Mb",
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
      "image_rejected": "Die Datei ist zu groß. über 10Mb",
      "choose_logo": "Logo wählen",
      "choose_header": "Header wählen",
    }
  }
</i18n>
