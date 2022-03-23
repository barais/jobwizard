<template>
  <div />
</template>

<script>
import { useMeta } from 'quasar';

export default
{
  name: 'Home',
  setup()
  {
    useMeta({
      link: {
        material: {
          rel: 'canonical',
          href: 'https://jobwizard.yawik.org' + window.location.pathname
        }
      },
    });
  },
  created()
  {
    const lang = navigator.language.substring(0, 2);
    this.$router.replace(Object.keys(this.$root.$i18n.messages).includes(lang) ? `/${lang}` : '/en').catch(() => true);
  },
};
</script>
