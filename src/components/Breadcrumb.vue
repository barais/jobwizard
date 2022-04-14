<template>
  <div class="q-pa-md">
    <q-toolbar>
      <q-breadcrumbs active-color="secondary" style="font-size: 16px;">
        <q-breadcrumbs-el label="Home" icon="home" :to="home" />
        <q-breadcrumbs-el
          v-if="!($route.name === 'landing')"
          :label="$t($route.name === 'jobs' ? 'ad_management' : $route.name )"
          :icon="icon"
          :to="$route.path"
        />
        <q-breadcrumbs-el
          v-if="route == 'job'"
          :label="$t('job')"
          icon="mdi-star"
        />
      </q-breadcrumbs>
    </q-toolbar>
  </div>
</template>

<script>
export default
{
  name: 'Breadcrumb',
  computed: {
    route()
    {
      return this.$route.name;
    },
    home()
    {
      return process.env.VUE_ROUTER_BASE + this.$root.$i18n.locale + '/';
    },
    icon()
    {
      let mdi = 'cog';
      switch (this.route)
      {
        case 'job':
          mdi = 'mdi-pencil';
          break;
        case 'jobs':
          mdi = 'mdi-view-list';
          break;
        case 'create-job':
          mdi = 'mdi-plus';
          break;
        case 'jobboard':
          mdi = 'mdi-earth';
          break;
        case 'templates':
          mdi = 'mdi-content-copy';
          break;
        case 'nav.organizations':
          mdi = 'domain';
          break;
        case 'nav.applications':
          mdi = 'people';
          break;
        case 'nav.statistics':
          mdi = 'poll';
          break;
        case 'nav.dashboard':
          mdi = 'dashboard';
          break;
        case 'nav.demo':
          mdi = 'play_lesson';
          break;
        default:
          mdi = 'mdi-cog';
      }
      return mdi;
    },
  }
};
</script>
