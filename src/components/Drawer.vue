<template>
  <q-drawer
    v-model="value"
    side="right"
    overlay
    bordered
    no-swipe-open
    no-swipe-close
    no-swipe-backdrop
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item v-ripple clickable :to="menuItem.to" :active="index===selectedIndex" @click="selectedIndex=index">
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" color="secondary" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator v-if="menuItem.separator" :key="'sep' + index" />
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { HAS_AUTH } from 'src/store/names';
import { mapGetters } from 'vuex';
import eventBus, { TOGGLE_LOGIN } from 'src/lib/eventBus';

export default
{
  name: 'Drawer',
  props:
    {
      modelValue:
        {
          type: Boolean,
          default: false
        },
    },
  data()
  {
    return {
      selectedIndex: 0
    };
  },
  emits: ['update:modelValue'],
  computed:
    {
      ...mapGetters([HAS_AUTH]),
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
        },
      menuList()
      {
        console.error(this.$yawik.lang());
        return [
          {
            icon: 'mdi-earth',
            label: this.$t('jobboard'),
            to: '/' + this.$yawik.lang() + '/jobboard',
            separator: true
          },
          {
            icon: 'mdi-view-list',
            label: this.$t('ad_management'),
            to: '/' + this.$yawik.lang() + '/jobs',
            separator: true
          },
          {
            icon: 'people',
            label: this.$t('nav.applications'),
            to: '/' + this.$yawik.lang() + '/applications',
            separator: true
          },
          {
            icon: 'domain',
            label: this.$t('nav.organizations'),
            to: '/' + this.$yawik.lang() + '/organizations',
            separator: true
          },
          /*{
            icon: 'mdi-content-copy',
            label: this.$t('templates'),
            to: '/' + this.$yawik.lang() + '/templates',
            separator: true
          },*/
          /*
          {
            icon: 'poll',
            label: this.$t('nav.statistics'),
            to: '/' + this.$yawik.lang() + '/statistics',
            separator: true
          },
          */
          {
            icon: 'settings',
            label: this.$t('settings'),
            to: '/' + this.$yawik.lang() + '/settings',
            separator: false
          }
        ];
      }
    },
  methods:
    {
      toggleLogin()
      {
        eventBus.emit(TOGGLE_LOGIN);
      },
    }
};
</script>
