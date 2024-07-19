<script setup lang="ts">
import { type RecipeResponse } from "../types/types";

const { data } = await useFetch<RecipeResponse>("https://dummyjson.com/recipes?limit=12");
</script>

<template>
  <main>
    <section class="bg-[#f1f1f1]">
      <div class="container flex items-center py-20">
        <div class="flex-1">
          <h1 class="text-6xl font-extrabold mb-6 text-balance">
            Master the Kitchen with Ease: Unleash Your Inner Chef Today!
          </h1>
          <p class="text-2xl mb-8 text-balance">
            Discover recipes helping you to find the easiest way to cook.
          </p>
          <BaseBtn label="Browse Recipes" />
        </div>
        <div class="flex-1">
          <img src="@/assets/nuxt-course-hero.png" alt="" />
        </div>
      </div>
    </section>
    <section class="py-20 container">
      <h2 class="text-5xl mb-2">Discover, Create, Share</h2>
      <p class="text-xl mb-8">Check out our most popular recipes!</p>
      <div class="grid grid-cols-3 gap-x-4 gap-y-8">
        <div v-for="recipe in data?.recipes" class="shadow rounded-md">
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
      </div>
    </section>
  </main>
</template>

<style scoped></style>
