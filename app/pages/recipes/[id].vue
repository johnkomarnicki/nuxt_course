<script setup lang="ts">
import { type Database } from "~~/types/database.types";
const supabase = useSupabaseClient<Database>();
const { id } = useRoute().params;

const { data: recipes, error } = await useAsyncData(async () => {
  const { data } = await supabase
    .from("recipes")
    .select()
    .eq("id", Number(id))
    .single();
  return data;
});

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
  });
}

useSeoMeta({
  title: recipes.value?.name,
  description: "Recipes for you to cook!",
  ogTitle: recipes.value?.name,
  ogDescription: "Recipes for you to cook!",
  ogImage: recipes.value?.image,
  ogUrl: `http:localhost:3000/recipes/${recipes.value?.id}`,
  twitterTitle: recipes.value?.name,
  twitterDescription: "Recipes for you to cook!",
  twitterImage: recipes.value?.image,
  twitterCard: "summary",
});
</script>

<template>
  <div class="flex flex-col max-w-screen-lg container py-20">
    <!-- Header -->
    <div class="flex flex-col mb-6">
      <h2 class="text-5xl mb-4 font-semibold">{{ recipes?.name }}</h2>
      <div class="flex gap-4 text-xl mb-6">
        <div class="flex items-center gap-1">
          <UIcon
            name="i-mdi-clock-time-eight-outline"
            class="text-dodgeroll-gold-500"
          />
          <span>{{ recipes?.cookTimeMinutes }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-mdi-fire" class="text-dodgeroll-gold-500" />
          <span>{{ recipes?.caloriesPerServing }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-mdi-star" class="text-dodgeroll-gold-500" />
          <span>{{ recipes?.rating }} ({{ recipes?.reviewCount }})</span>
        </div>
      </div>
      <hr />
    </div>

    <!-- Image -->
    <NuxtImg
      :src="recipes?.image"
      densities="x1"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw"
      class="w-full max-h-[500px] object-cover rounded-md shadow-sm mb-12"
      alt=""
    />

    <!-- Ingredients -->
    <div class="mb-8">
      <h2 class="text-3xl font-semibold mb-4">Ingredients</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-lg">
        <li v-for="ingredient in recipes?.ingredients">
          <label class="flex gap-2 items-center">
            <input class="hidden peer" type="checkbox" />
            <div
              class="relative w-6 h-6 rounded-full border-2 border-dodgeroll-gold-500 flex items-center justify-center peer-checked:after:absolute peer-checked:after:w-4 peer-checked:after:h-4 peer-checked:after:bg-dodgeroll-gold-500 peer-checked:after:rounded-full"
            ></div>
            <span class="peer-checked:line-through">
              {{ ingredient }}
            </span>
          </label>
        </li>
      </ul>
    </div>

    <!-- Instructions -->
    <div>
      <h2 class="text-3xl font-medium mb-4">Instructions</h2>
      <ul class="flex flex-col text-lg gap-4">
        <li
          v-for="(instruction, index) in recipes?.instructions"
          class="flex gap-2"
        >
          <span
            class="flex items-center justify-center bg-dodgeroll-gold-500 w-7 h-7 rounded-full text-white text-sm"
          >
            {{ index + 1 }}
          </span>
          <span class="flex-1">{{ instruction }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
