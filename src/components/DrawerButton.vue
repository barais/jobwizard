<template>
  <q-btn
    flat
    color="primary"
    class="full-width"
    align="right"
    :icon-right="icon"
    v-bind="$attrs"
  >
    <slot />
  </q-btn>
</template>

<script>
export default
{
  name: 'DrawerButton',
  inheritAttrs: false,
  props:
  {
    icon:
    {
      type: String,
      default: undefined
    },
  },
};
</script>
