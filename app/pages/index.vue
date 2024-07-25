<script setup lang="ts">
import { type RecipeResponse } from "../../types/types";

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
          <NuxtImg sizes="sm:50vw" src="/nuxt-course-hero.png" alt="" />
        </div>
      </div>
    </section>
    <section class="py-20 container">
      <h2 class="text-5xl mb-2">Discover, Create, Share</h2>
      <p class="text-xl mb-8">Check out our most popular recipes!</p>
      <div class="grid grid-cols-3 gap-x-4 gap-y-8">
        <RecipeCard v-for="recipe in data?.recipes" :recipe="recipe" />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
