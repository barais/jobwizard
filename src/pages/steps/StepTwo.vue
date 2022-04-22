<template>
  <div class="q-gutter-md">
    <!-- Logo -->
    <div class="row q-col-gutter-md justify-center">
      <upload-logo
        ref="job"
        class="col-md-2"
        :ref-id="$route.params.id"
        field="logo"
        fit="contain"
        height="200px"
        :label="$t('choose_logo')"
        :image="orgLogo"
      />
      <div class="col-lg-10 col-md-9" :style="{maxWidth: (maxWidth * 2 * 0.8) + 'px'}">
        <q-item>
          <q-item-section class="full-width">
            <q-item-label class="text-h3" caption>{{ orgName }}</q-item-label>
            <q-item-label class="text-h2">{{ GET_FORM.jobTitle }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <!-- Header image -->
      <upload-logo
        ref="job"
        ref2="api::job.job"
        :ref-id="$route.params.id"
        field="header"
        class="col-md-10 q-mr-lg"
        fit="fill"
        :width="(maxWidth * 2) + 'px'"
        height="200px"
        :image="orgHeader"
        :max-total-size="204800"
        :label="$t('choose_header')"
      />
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
import UploadLogo from 'src/components/UploadLogo.vue';
import { api } from 'boot/axios';

export default
{
  name: 'StepTwo',
  components: {
    EditorInput,
    UploadLogo
  },
  mixins: [mixinValidations],
  data()
  {
    return {
      maxWidth: 800,
      org: null,
      orgLogo: null,
      orgHeader: null,
    };
  },
  computed:
    {
      ...mapGetters([GET_FORM, GET_TOKEN, GET_LOGO, GET_HEADER, GET_SETTINGS]),
      organization:
        {
          get()
          {
            return this[GET_FORM].org;
          }
        },
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
    if (this.organization && this.organization.id != null)
    {
      this.getOrg(this.organization.id);
    }
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
          this.orgLogo = this.$q.config.jobUrl + this.org.logo.url;
          this.orgHeader = this.$q.config.jobUrl + this.org.header[0].url;
          console.log('Header ', this.orgHeader);
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
