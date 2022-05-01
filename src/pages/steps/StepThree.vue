<template>
  <div>
    <q-splitter
      v-model="splitterModel"
    >
      <template #before>
        <div class="q-pa-md">
          <div class="q-col-gutter-sm row">
            <div class="col-12 column">
              <div class="q-pb-sm">{{ $t('label.work_kind') }}</div>
              <q-field :model-value="workKind" name="workKind" :rules="[ruleRequired]" borderless>
                <template #control>
                  <q-option-group v-model="workKind" :options="listKinds" type="checkbox" color="primary"
                                  name="workKind"
                  />
                </template>
              </q-field>
            </div>

            <div class="col-12 column">
              <div class="q-pb-sm">{{ $t('label.work_duration') }}</div>
              <q-field :model-value="workDuration" name="workDuration" :rules="[ruleRequired]" borderless>
                <template #control>
                  <q-option-group
                    v-model="workDuration"
                    :options="listDurations"
                    type="checkbox"
                    color="primary"
                    name="workDuration"
                  >
                    <template #label-0="opt">
                      <span>{{ opt.label }}</span>
                    </template>

                    <template #label-1="opt">
                      <div style="width: 350px;">
                        <div class="row">
                          <div class="col-5" style="display: flex; align-items: center;">
                            <span>{{ opt.label }}</span>
                          </div>
                          <div
                            v-if="workDuration && workDuration.constructor.name === 'Array' && workDuration.includes('parttime')"
                            class="col-7"
                          >
                            <q-slider
                              v-model="partTimePercentage"
                              markers
                              :min="10"
                              :max="90"
                              :step="10"
                              label
                              :label-value="partTimePercentage + '%'"
                              label-always
                              @change="sliderChange"
                            />
                          </div>
                        </div>
                      </div>
                    </template>
                    <template #label-2="opt">
                      <div style="width: 350px;">
                        <div class="row">
                          <div class="col-5" style="display: flex; align-items: center;">
                            <span>{{ opt.label }}</span>
                          </div>
                          <div
                            v-if="workDuration && workDuration.constructor.name === 'Array' && workDuration.includes('shiftwork') || false"
                            class="col-7"
                          >
                            <q-slider
                              v-model="shiftWorkAmount"
                              markers
                              :min="2"
                              :max="5"
                              :step="1"
                              label
                              :label-value="shiftWorkAmount"
                              label-always
                              @change="sliderChange"
                            />
                          </div>
                        </div>
                      </div>
                    </template>
                  </q-option-group>
                </template>
              </q-field>
            </div>
          </div>
          <div class="q-col-gutter-sm row">
            <div class="col-12 column">
              <div class="q-pb-sm">{{ $t('label.salary') }}</div>
              <q-select v-model="salary" :options="options" name="salary" dense outlined />
            </div>
            <div class="col-12 column">
              <div class="q-pb-sm">{{ $t('label.visibility') }}</div>
              <q-checkbox v-model="salaryVisibility" :label="$t('help.visibility')" name="salaryVisibility" />
            </div>
          </div>
          <PublicationTime />
        </div>
      </template>
      <template #after>
        <div class="q-pa-md">
          <Preview />
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import mixinValidations from 'src/lib/validations';
import { mapGetters, mapMutations } from 'vuex';
import { GET_META, SET_META } from 'src/store/names';
import PublicationTime from 'src/components/form/PublicationTime.vue';
import { ref } from 'vue';
import Preview from 'components/Preview';

export default {
  name: 'StepThree',
  components: {
    Preview,
    PublicationTime
  },
  mixins: [mixinValidations],
  setup()
  {
    return {
      splitterModel: ref(40)
    };
  },

  data()
  {
    return {
      options: [
        {
          label: '<20.000€',
          value: '20|'
        },
        {
          label: '20.000€ - 40.000€',
          value: '20|40'
        },
        {
          label: '40.000€ - 60.000€',
          value: '40|60'
        },
        {
          label: '60.000€ - 80.000€',
          value: '60|80'
        },
        {
          label: '80.000€ - 100.000€',
          value: '80|100'
        },
        {
          label: '100.000€ - 120.000€',
          value: '100|120'
        },
        {
          label: '>120.000€',
          value: '|120'
        }
      ]
    };
  },
  computed:
      {
        ...mapGetters([GET_META]),
        workKind:
          {
            get()
            {
              return this[GET_META].workKind;
            },
            set(val)
            {
              this[SET_META]({ workKind: val });
            }
          },
        workDuration:
          {
            get()
            {
              return this[GET_META].workDuration;
            },
            set(val)
            {
              this[SET_META]({ workDuration: val });
            }
          },
        partTimePercentage:
          {
            get()
            {
              return this[GET_META].partTimePercentage;
            },
            set(val)
            {
              this[SET_META]({ partTimePercentage: val });
            }
          },
        shiftWorkAmount:
          {
            get()
            {
              const shiftWorkAmount = this[GET_META].shiftWorkAmount;
              return shiftWorkAmount === undefined ? 2 : shiftWorkAmount;
            },
            set(val)
            {
              this[SET_META]({ shiftWorkAmount: val });
            }
          },
        listKinds()
        {
          return [
            {
              value: 'contract',
              label: this.$t('label.contract')
            },
            {
              value: 'freelance',
              label: this.$t('label.freelance')
            },
            {
              value: 'internship',
              label: this.$t('label.internship')
            },
            {
              value: 'apprenticeship',
              label: this.$t('label.apprenticeship')
            },
          ];
        },
        listDurations()
        {
          return [
            {
              value: 'fulltime',
              label: this.$t('label.fulltime')
            },
            {
              value: 'parttime',
              label: this.$t('label.parttime')
            },
            {
              value: 'shiftwork',
              label: this.$t('label.shiftwork')
            },
            {
              value: 'minijob',
              label: this.$t('label.minijob')
            },

          ];
        },
        salary:
          {
            get()
            {
              return this[GET_META].salary;
            },
            set(val)
            {
              this[SET_META]({ salary: val });
            }
          },
        salaryVisibility:
          {
            get()
            {
              return this[GET_META].salaryVisibility;
            },
            set(val)
            {
              this[SET_META]({ salaryVisibility: val });
            }
          },

      },
  methods:
      {
        ...mapMutations([SET_META]),
        sliderChange()
        {
          const workDurationVal = this.workDuration;
          this.workDuration = workDurationVal;
          setTimeout(() =>
          {
            this.workDuration = workDurationVal;
          }, 10);
        }
      }
};
</script>
