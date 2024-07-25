<script setup lang="ts">
import { type Recipe } from "../../../types/types";

const { id } = useRoute().params;
const { data } = await useFetch<Recipe>(`https://dummyjson.com/recipes/${id}`);

useSeoMeta({
  title: data.value?.name,
  ogImage: data.value?.image,
});
</script>

<template>
  <div class="flex flex-col max-w-screen-lg container py-20">
    <!-- Header -->
    <div class="flex flex-col mb-6">
      <h2 class="text-5xl mb-4 font-semibold">{{ data?.name }}</h2>
      <div class="flex gap-4 text-xl mb-6">
        <div class="flex items-center gap-1">
          <Icon
            name="mdi:clock-time-eight-outline"
            width="1.2em"
            height="1.2em"
            style="color: #f79f1a"
          />
          <span>{{ data?.cookTimeMinutes }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:fire" width="1.2em" height="1.2em" style="color: #f79f1a" />
          <span>{{ data?.caloriesPerServing }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:star" width="1.2em" height="1.2em" style="color: #f79f1a" />
          <span>{{ data?.rating }} ({{ data?.reviewCount }})</span>
        </div>
      </div>
      <hr />
    </div>

    <!-- Image -->
    <img
      :src="data?.image"
      class="w-full max-h-[400px] object-cover self-center rounded-md shadow-sm mb-12"
      alt=""
    />

    <!-- Ingredients -->
    <div class="mb-8">
      <h2 class="text-3xl font-semibold mb-4">Ingredients</h2>
      <ul class="grid grid-cols-2 gap-2 text-lg">
        <li v-for="ingredient in data?.ingredients">
          <label class="flex gap-2 items-center">
            <input class="hidden peer" type="checkbox" />
            <div
              class="relative w-6 h-6 rounded-full border-2 border-dodgeroll-gold flex items-center justify-center peer-checked:after:absolute peer-checked:after:w-4 peer-checked:after:h-4 peer-checked:after:bg-dodgeroll-gold peer-checked:after:rounded-full"
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
        <li v-for="(instruction, index) in data?.instructions" class="flex gap-2">
          <span
            class="flex items-center justify-center bg-dodgeroll-gold w-7 h-7 rounded-full text-white text-sm"
          >
            {{ index + 1 }}
          </span>
          <span>{{ instruction }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
