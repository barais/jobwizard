<template>
  <q-page class="flex row" style="height: 600px;">
    <q-form
      ref="frm" autocomplete="false" :spellcheck="spellcheck"
      class="grow col-6" @submit="submitForm"
      @validation-error="hasErrors"
    >
      <!-- eslint-disable quasar/no-invalid-props -->
      <q-scroll-area :style="stepperHeight">
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
            <component :is="stepName" :style="'min-height: ' + ($q.screen.height-230) + 'px;'" @next="navigate('next')" />
          </q-step>
          <template #navigation>
            <div class="row">
              <div class="col-6">
                <q-page-sticky position="bottom" style="z-index: 5900;" class="q-mt-md bg-white" />
              </div>
            </div>
          </template>
        </q-stepper>
      </q-scroll-area>
      <div style="position: sticky; z-index: 5900;">
        <div class="row q-px-lg q-pb-lg q-mt-md ">
          <div class="col-8">
            <div class="q-pb-lg">
              <q-btn-group push>
                <SwitchLanguage v-if="!toolbar" class="q-mx-auto" />
                <q-btn name="abort" color="negative" @click="abortForm">
                  {{ $t($q.platform.is.mobile ? 'btn.cancel' :
                    'btn.abort') }}
                </q-btn>
              </q-btn-group>
            </div>
          </div>
          <div class="col-4 justify-content-end">
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
              icon="download"
              name="next"
              no-caps
              :label="$t('btn.download')"
              @click.stop="trySubmit"
            />
            <q-btn-dropdown
              v-if="(lastStep && $yawik.isAuth())"
              split
              no-caps
              color="primary"
              name="next"
              :loading="sending"
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
                    <q-icon name="download" color="secondary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $t('btn.download') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn
              v-if="!lastStep"
              color="primary" name="next" :label="$t('btn.continue')"
              @click.stop="navigate('next')"
            />
          </div>
        </div>
      </div>
    </q-form>
    <preview class="col-6" />
  </q-page>
</template>

<script>
import SwitchLanguage from 'src/components/SwitchLanguage';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';
import StepFour from './steps/StepFour';
import Preview from 'components/Preview';
import {
  SET_JOB,
  GET_STEP,
  SET_STEP,
  CLEAR_FORM,
  GET_FORM,
  GET_META,
  GET_LOGO,
  GET_TOKEN,
  SET_LOGO,
  SET_HEADER,
  GET_HEADER,
  GET_SETTINGS,
  SET_FIELD
} from '../store/names';
import { mapGetters, mapMutations } from 'vuex';
import saveAs from 'src/lib/FileSaver';
import { api } from 'boot/axios';

const maxContentWidth = 800; // pixels

export default {
  name: 'Wizard',
  components:
      {
        SwitchLanguage,
        StepOne,
        StepTwo,
        StepThree,
        StepFour,
        Preview,
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
      sending: false,
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
        ...mapGetters([GET_TOKEN, GET_STEP, GET_FORM, GET_META, GET_SETTINGS, GET_LOGO, GET_HEADER]),
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
        org:
          {
            get()
            {
              return this[GET_FORM].org;
            },
            set(value)
            {
              this[SET_FIELD].org = value;
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
        filename()
        {
          let name = 'job_';
          if (this.mode === 'edit')
          {
            name = name + this[GET_FORM].id;
          }
          name = name + '.html';

          return name;
        },
        stepperHeight()
        {
          return 'height: ' + (this.$q.screen.height - 210) + 'px;';
        }

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
    if (this.$route.params.id)
    {
      this.getJob(this.$route.params.id);
    }
  },
  beforeUnmount()
  {
    window.removeEventListener('resize', this.onResize, false);
  },
  methods:
      {
        ...mapMutations([SET_JOB, SET_LOGO, SET_HEADER, SET_STEP, CLEAR_FORM]),
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
          let url = '/api/jobs';
          const form = { ...this[GET_FORM] };
          if (form.id != null)
          {
            methodType = 'PUT';
            url = '/api/jobs/' + form.id;
          }
          if (form.org != null)
          {
            const id = form.org.id;
            delete form.org;
            form.org = id;
          }

          const formData = new FormData();
          const formObj = JSON.parse(JSON.stringify(form));
          const html = new Blob([this.$refs.preview.htmlCode], {
            type: 'text/html',
            name: this.filename
          });
          formObj.html = html;

          this.progress = 0;
          this.sending = true;

          formData.append('html', html, this.filename);
          formData.append('data', JSON.stringify(formObj));
          api({
            method: methodType,
            url: url,
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + this[GET_TOKEN],
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
          saveAs(new Blob([html], { type: 'text/html' }), this.filename, { autoBOM: true });
        },
        abortForm()
        {
          this[CLEAR_FORM]();
        },
        getJob(id)
        {
          api.get('/api/jobs/' + id, {
            params: {
              populate: 'html,logo,header,org', // is overwritten on server side
              sort: 'createdAt:desc'
            },
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + this[GET_TOKEN]
            }
          }).then(response =>
          {
            this[SET_JOB]({ data: response.data.success.job });
            console.log(response.data.success.job);
            if (response.data.success.job.logo)
            {
              this[SET_LOGO]({ data: response.data.success.job.logo });
            }
            if (response.data.success.job.header)
            {
              this[SET_HEADER]({ data: response.data.success.job.header });
            }
          });
        },
      }
}
;
</script>
