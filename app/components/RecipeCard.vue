<script setup lang="ts">
import { type Recipe } from "../../types/types";

defineProps<{
  recipe: Recipe;
}>();
</script>

<template>
  <div class="flex flex-col shadow rounded-md">
    <NuxtImg
      :src="recipe.image"
      sizes="xs:100vw sm:50vw lg:400px"
      format="webp"
      densities="x1"
      alt=""
      class="rounded-t-md"
    />
    <div class="flex flex-col py-6 px-4 flex-1">
      <p class="text-xl lg:text-2xl font-semibold mb-2">{{ recipe.name }}</p>
      <div class="font-normal w-full bg-white/80 flex gap-8 text-lg lg:text-xl mb-4 mt-auto">
        <div class="flex items-center gap-1">
          <UIcon name="i-mdi-clock-time-eight-outline" class="text-dodgeroll-gold-500" />
          <span>{{ recipe.cookTimeMinutes }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-mdi-fire" class="text-dodgeroll-gold-500" />
          <span>{{ recipe.caloriesPerServing }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-mdi-star" class="text-dodgeroll-gold-500" />
          <span>{{ recipe.rating }} ({{ recipe.reviewCount }})</span>
        </div>
      </div>
      <UButton
        :ui="{
          base: 'self-start',
        }"
        :to="`/recipes/${recipe.id}`"
        label="View"
      />
    </div>
  </div>
</template>
