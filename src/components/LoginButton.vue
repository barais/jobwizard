<template>
  <q-btn v-if="!$yawik.isAuth()" outline type="a" :href="$yawik.loginUrl()" no-caps>
    {{ $t('btn.login') }}
  </q-btn>
</template>

<script>
export default {
  name: 'LoginButton'
};
</script>
