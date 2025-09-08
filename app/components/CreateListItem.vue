<script setup lang="ts">
const emit = defineEmits(["removeItem"]);
const props = defineProps<{
  item: string;
  index: number;
}>();

function removeItem() {
  emit("removeItem", props.index);
}
</script>

<template>
  <li class="flex items-center gap-2">
    <span
      class="flex items-center justify-center bg-dodgeroll-gold-500 w-6 h-6 rounded-full text-white text-sm"
    >
      {{ index + 1 }}
    </span>
    <span class="text-sm">
      {{ item }}
    </span>
    <UIcon
      @click="removeItem"
      name="i-mdi-close-circle"
      class="cursor-pointer ml-auto text-dodgeroll-gold-500 duration-300 hover:text-dodgeroll-gold-300 text-xl"
    />
  </li>
</template>
