<template>
  <q-page padding>
    {{ selectedApplication }}
  </q-page>
</template>

<script>
export default {
  name: 'Application',
  props: {
    selectedApplication: {
      type: [Object, null],
      required: true,
      default: null
    }
  },

};
</script>
