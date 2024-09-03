<script setup lang="ts">
defineProps({
  label: String,
  to: String,
});
</script>

<template>
  <NuxtLink
    :to="to"
    class="px-4 py-2 text-white self-start bg-dodgeroll-gold-400 rounded-md text-lg cursor-pointer"
  >
    <slot>{{ label }}</slot>
  </NuxtLink>
</template>
