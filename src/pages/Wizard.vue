<template>
  <q-page class="flex">
    <q-form ref="frm" autocomplete="false" :spellcheck="spellcheck" class="grow full-width" @submit="submitForm"
            @validation-error="hasErrors"
    >
      <q-page-sticky style="z-index: 5900;" position="bottom-left" :offset="[18, -65]">
        <div class="justify-center q-pb-lg flex">
          <q-btn-group push>
            <q-btn name="preview" color="primary" outline @click="dlgPreview = true">
              {{ $t('btn.preview') }}
            </q-btn>
            <SwitchLanguage v-if="!toolbar" class="q-mx-auto" />
            <q-btn name="abort" color="negative" @click="abortForm">
              {{ $t($q.platform.is.mobile ? 'btn.cancel' :
                'btn.abort') }}
            </q-btn>
          </q-btn-group>
        </div>
      </q-page-sticky>
      <!-- eslint-disable quasar/no-invalid-props -->
      <q-stepper
        ref="stepper"
        v-model="currentStep"
        animated
        bordered
        header-nav
        all-panels
        :swipeable="$q.platform.is.mobile"
        :contracted="$q.platform.is.mobile"
        header-class="bg-third"
      >
        <!-- eslint-enable quasar/no-invalid-props -->
        <q-step
          v-for="stepName in steps"
          :key="stepName"
          :name="stepName"
          :prefix="steps.indexOf(stepName)+1"
          :title="$t('steps.' + stepName)"
          done-color="positive"
          active-color="primary"
          error-color="negative"
          :done="isCompleted(stepName)"
          :error="validationErrors[stepName] && isCompleted(stepName)"
        >
          <component :is="stepName" style="min-height: 500px;" @next="navigate('next')" />
        </q-step>
        <template #navigation>
          <q-page-sticky style="z-index: 5900;" position="bottom-right" :offset="[18, -65]">
            <div class="row justify-end q-px-lg q-pb-lg">
              <q-btn
                v-if="steps.indexOf(currentStep) > 0 && mode==='insert'"
                name="prev" outline color="primary"
                :label="$t('btn.back')"
                class="q-mr-md"
                @click.stop="navigate('previous')"
              />
              <q-btn
                v-if="lastStep & !$yawik.isAuth()"
                color="primary"
                name="next"
                :label="$t('btn.download')"
                @click.stop="trySubmit"
              />
              <q-btn-dropdown
                v-if="lastStep & $yawik.isAuth() | mode==='edit'"
                split
                color="primary"
                name="next"
                :label="$t('btn.publish')"
                @click.stop="onSave"
              >
                <q-list>
                  <q-item v-close-popup clickable @click.stop="onSave">
                    <q-item-section side>
                      <q-icon name="mdi-content-save" color="secondary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $t('btn.save') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-close-popup clickable @click.stop="trySubmit">
                    <q-item-section side>
                      <q-icon name="mdi-download" color="secondary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $t('btn.download') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn
                v-if="!lastStep && mode==='insert'"
                color="primary" name="next" :label="$t('btn.continue')"
                @click.stop="navigate('next')"
              />
            </div>
          </q-page-sticky>
        </template>
      </q-stepper>
    </q-form>
    <DialogPreview ref="preview" v-model="dlgPreview" />
  </q-page>
</template>

<script>
import SwitchLanguage from 'src/components/SwitchLanguage';
import DialogPreview from './DialogPreview';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';
import StepFour from './steps/StepFour';
import { GET_STEP, SET_STEP, CLEAR_FORM, GET_FORM, GET_META, GET_LOGO, GET_HEADER, GET_SETTINGS } from '../store/names';
import { mapGetters, mapMutations } from 'vuex';
import saveAs from 'src/lib/FileSaver';

const maxContentWidth = 800; // pixels

export default {
  name: 'Wizard',
  components:
      {
        SwitchLanguage,
        DialogPreview,
        StepOne,
        StepTwo,
        StepThree,
        StepFour,
      },
  props:
      {
        toolbar:
          {
            type: Boolean,
            default: false
          }
      },
  data()
  {
    return {
      stepper: null, // used by steps to navigate to next step on ENTER key in any input field
      maxWidth: 1024, // used to limit the width of QEditor, otherwise it grows too much when you type text
      dlgPreview: false,
      lastStep: false,
      validationErrors:
          {
            stepOne: false,
            stepTwo: false,
            stepThree: false,
            stepFour: false,
          }
    };
  },
  computed:
      {
        ...mapGetters([GET_STEP, GET_FORM, GET_META, GET_SETTINGS, GET_LOGO, GET_HEADER]),
        currentStep:
          {
            get()
            {
              return this[GET_STEP];
            },
            set(value)
            {
              this[SET_STEP](value);
            }
          },
        steps()
        {
          return Object.keys(this.validationErrors);
        },
        spellcheck()
        {
          return this[GET_SETTINGS].formSpellcheckEnabled;
        },
        mode()
        {
          return this[GET_FORM].id ? 'edit' : 'insert';
        },
        logo()
        {
          return this[GET_LOGO];
        },
        header()
        {
          return this[GET_HEADER];
        },
      },
  watch:
      {
        currentStep(newVal, oldVal)
        {
          this.$nextTick(() =>
          {
            // Quasar is too fast - as soon as it detects MouseDown event on the CONTINUE button, it goes to the next step
            // And on the last step the button becomes a SUBMIT type too fast, even before MouseUp - which then leads to speculative form submit
            this.lastStep = this.currentStep === this.steps[this.steps.length - 1];
            this.validateStep(oldVal);
          });
        },
      },
  created()
  {
    // we have to update maxWidth on window resize
    window.addEventListener('resize', this.onResize, false);
    this.lastStep = this.currentStep === this.steps[this.steps.length - 1];
  },
  mounted()
  {
    this.stepper = this.$refs.stepper; // used by steps to navigate to next step by ENTER key inside any input field
    this.onResize();
    this.steps.slice(0, this.steps.indexOf(this.currentStep)).forEach(step =>
    {
      this.validateStep(step);
    });
  },
  beforeUnmount()
  {
    window.removeEventListener('resize', this.onResize, false);
  },
  methods:
      {
        ...mapMutations([SET_STEP, CLEAR_FORM]),
        onResize()
        {
          // limit the width of QEditor - otherwise it grows too much on typing
          this.maxWidth = Math.min(maxContentWidth, document.body.clientWidth);
        },
        navigate(direction)
        {
          this.$nextTick(() =>
          {
            this.$refs.stepper[direction]();
          });
        },
        onSave()
        {
          let methodType = 'POST';
          let url = process.env.YAWIK_STRAPI_URL + '/api/jobs';
          const form = { ...this.$store.getters.GET_FORM };
          if (form.id != null)
          {
            methodType = 'PUT';
            url = process.env.YAWIK_API_URL + '/api/jobs/' + form.id;
          }

          const formData = new FormData();
          const formObj = JSON.parse(JSON.stringify(form));
          const html = new Blob([this.$refs.preview.htmlCode], {
            type: 'text/html',
            name: 'job_ad.html'
          });
          formObj.html = html;

          const logo = this.logo;
          const header = this.header;
          if (logo)
          {
            const binary = this.base64toBlob(logo);
            formData.append('logo', binary);
          }
          if (header)
          {
            const binary = this.base64toBlob(header);
            formData.append('header', binary);
          }

          this.progress = 0;
          this.sending = true;

          formData.append('html', html, 'job_ad.html');
          formData.append('data', JSON.stringify(formObj));
          this.$axios({
            method: methodType,
            url: url,
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + this.$store.getters.GET_TOKEN,
              'Content-Type': 'multipart/form-data'
            },
            data: formData
          })
            .then(data =>
            {
              if (data.data.error)
              {
                this.$q.notify({
                  color: 'negative',
                  position: 'top',
                  icon: 'mdi-alert',
                  message: data.data.error.message || this.$t('job_saved_error'),
                });
              }
              else
              {
                this.$q.notify({
                  color: 'positive',
                  position: 'top',
                  icon: 'mdi-alert',
                  message: this.$t('msg.job_saved_success'),
                });
                if (this.mode === 'insert')
                {
                  this[CLEAR_FORM]();
                }
                this.$router.push({
                  name: 'jobs',
                });
              }
            }).catch(error =>
            {
              console.log('Error', error);
            });
        },
        trySubmit()
        {
          this.$refs.frm.submit();
        },
        hasErrors(ref)
        {
          // ensure the first invalid field is focused when it is on a different panel/q-step
          let node = ref;
          do
          {
            node = node.$parent;
            if (node.$options.name === 'QStep')
            {
              if (node.name !== node.$parent.value)
              {
                const newName = node.name;
                do
                {
                  node = node.$parent;
                  if (node.$options.name === 'QStepper')
                  {
                    node.$emit('update:modelValue', newName);
                    break;
                  }
                } while (node !== this.$root);
                this.$nextTick(() =>
                {
                  ref.focus();
                });
              }
              break;
            }
          } while (node !== this.$root);
        },
        findStep(component)
        {
          let node = component;
          do
          {
            node = node.$parent;
            if (node.$options.name === 'QStep') return node.name;
          } while (node !== this.$root);
        },
        isCompleted(step)
        {
          return (this.steps.indexOf(this.currentStep) > this.steps.indexOf(step));
        },
        validateStep(step)
        {
          const components = this.$refs.frm.getValidationComponents().filter(ref => this.findStep(ref) === step);
          this.validationErrors[step] = components.some(item => !item.validate()); // stop on the first validation error
          //this.validationErrors[step] = components.filter(item => !item.validate()).length > 0; // validate all fields
        },
        submitForm()
        {
          const html = this.$refs.preview.htmlCode;
          saveAs(new Blob([html], { type: 'text/html' }), 'job_ad.html', { autoBOM: true });
        },
        abortForm()
        {
          this[CLEAR_FORM]();
        },
        base64toBlob(dataURI)
        {
          // convert base64/URLEncoded data component to raw binary data held in a string
          let byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0)
          {
            byteString = atob(dataURI.split(',')[1]);
          }
          else
          {
            byteString = unescape(dataURI.split(',')[1]);
          }

          // separate out the mime component
          const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

          // write the bytes of the string to a typed array
          const ia = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++)
          {
            ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], { type: mimeString });
        }
      }
}
;
</script>
