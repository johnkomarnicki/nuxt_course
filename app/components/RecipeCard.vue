<script setup lang="ts">
import { type Recipe } from "../../types/types";

defineProps<{
  recipe: Recipe;
}>();
</script>

<template>
  <div class="shadow rounded-md">
    <img :src="recipe.image" alt="" class="rounded-t-md" />
    <div class="flex flex-col py-6 px-4">
      <p class="text-2xl font-semibold mb-2">{{ recipe.name }}</p>
      <div class="font-normal w-full bg-white/80 flex gap-8 text-xl mb-4">
        <div class="flex items-center gap-1">
          <Icon
            name="mdi:clock-time-eight-outline"
            width="1.2em"
            height="1.2em"
            style="color: #f79f1a"
          />
          <span>{{ recipe.cookTimeMinutes }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:fire" width="1.2em" height="1.2em" style="color: #f79f1a" />
          <span>{{ recipe.caloriesPerServing }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:star" width="1.2em" height="1.2em" style="color: #f79f1a" />
          <span>{{ recipe.rating }} ({{ recipe.reviewCount }})</span>
        </div>
      </div>
      <BaseBtn :to="`/recipe/${recipe.id}`" label="View" />
    </div>
  </div>
</template>
