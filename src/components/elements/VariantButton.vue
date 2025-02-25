<script setup>
import {defineEmits, defineProps} from "vue";

/*const props = */
defineProps({
  selected: {
    type: Boolean,
    required: false
  },
  text: {
    type: String,
    required: true
  },
  variantClass: {
    type: String,
    required: true
  }
})

defineEmits(['clicked'])
</script>

<template>
  <b-button :variant="(selected ? '' : 'outline-') + variantClass"
            @click="$emit('clicked')">
    {{ text }}
  </b-button>
</template>

<style scoped>
button {
  margin: 5px;
}
</style>