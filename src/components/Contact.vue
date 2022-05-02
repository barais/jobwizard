<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="contactPopup" size="md">
      <q-card style="width: 700px; max-width: 80vw;" class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">{{ $t('nav.contact') }}</div>
        </q-card-section>
        <q-card-section class="row q-gutter-y-md">
          <q-input v-model="firstname" dense :label="$t('label.firstname')" outlined class="col-6" />
          <q-input v-model="lastname" dense :label="$t('label.lastname')" outlined class="col-6" />
          <q-input v-model="email" dense :label="$t('email')" outlined class="col-12" />
          <q-input v-model="company" dense :label="$t('company')" outlined class="col-12" />

          <q-input v-model="phone" dense :label="$t('phone')" outlined class="col-6" />
          <q-select
            v-model="reason"
            dense
            :label="$t('reason')"
            outlined
            use-input
            use-chips
            multiple
            input-debounce="0"
            :options="filterOptions"
            class="col-6"
            @new-value="createValue"
            @filter="filterFn"
          />
          <q-editor v-model="message" type="text" :label="$t('message')" class="col-12" />
          <q-list class="col-12">
            <q-item v-ripple :tag="$t('termsAccepted')">
              <q-item-section avatar>
                <q-checkbox v-model="terms" val="terms" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <i18n path="term" tag="label" for="privary">
                    <a :href="url">{{ $t('privacy' , ['/']) }}</a>
                  </i18n>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions>
          <q-btn
            no-caps
            :loading="isLoading"
            :label="$t('btn.send')"
            color="primary"
            @click="sendContact"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { api } from 'boot/axios';

const stringOptions = [
  'job-internet', 'job-print', 'need-support', 'wanna-say-thank-you'
];

export default {
  name: 'Contact',
  setup()
  {
    const filterOptions = ref(stringOptions);

    return {
      contactPopup: ref(false),
      slideVol: ref(39),
      slideAlarm: ref(56),
      slideVibration: ref(63),
      reason: ref(null),
      terms: ref(false),
      message: ref(''),
      firstname: ref(''),
      lastname: ref(''),
      email: ref(''),
      phone: ref(''),
      isLoading: ref(false),
      filterOptions,

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

        if (val.length > 2)
        {
          if (!stringOptions.includes(val))
          {
            done(val, 'add-unique');
          }
        }
      },

      filterFn(val, update)
      {
        update(() =>
        {
          if (val === '')
          {
            filterOptions.value = stringOptions;
          }
          else
          {
            const needle = val.toLowerCase();
            filterOptions.value = stringOptions.filter(
              v => v.toLowerCase().indexOf(needle) > -1
            );
          }
        });
      }
    };
  },
  props: {
    show: {
      required: false,
      default: false,
      type: Boolean
    }
  },
  watch: {
    show(newVal, oldVal)
    {
      this.contactPopup = newVal;
    }
  },
  methods: {
    sendContact()
    {
      this.isLoading = true;
      api.post('/api/contacts', {
        data: {
          firstname: this.firstname,
          lastname: this.lastname,
          phone: this.phone,
          email: this.email,
          message: this.message
        }
      },
      {
        headers: {
          accept: 'application/json'
        },
      }
      ).then(response =>
      {
        if (response.status === 200)
        {
          this.$q.notify({
            color: 'positive',
            position: 'top',
            message: 'Contact created successfully.',
          });
          this.contactPopup = false;
        }
      }).catch(() =>
      {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Unknown error occur.',
        });
      }).finally(() =>
      {
        this.isLoading = false;
      });
    },
  }
};
</script>

<i18n>
  {
  "en": {
  "contact": "We are happy to advise you",
  "firstname": "First name",
  "lastname": "Last name",
  "email": "E-mail address",
  "company": "Company",
  "phone": "Phone",
  "reason": "Contact reason"
  },
  "de": {
  "contact": "Wir beraten Sie gerne",
  "firstname": "First name",
  "lastname": "Last name",
  "email": "E-Mail-Adresse",
  "company": "Firma",
  "phone": "Telefon",
  "reason": "Kontaktgrund",
  "privacy": "Datenschutzbestimmungen",
  "term": "Ich habe die {0} gelesen und akzeptiere sie."
  },
  "fr": {
  "contact": "Nous vous conseillons volontiers",
  "firstname": "First name",
  "lastname": "Last name",
  "email": "Adresse électronique",
  "company": "Société",
  "phone": "Téléphone",
  "reason": "Raison du contact",
  "termsAccepted": ""
  }
  }
</i18n>
