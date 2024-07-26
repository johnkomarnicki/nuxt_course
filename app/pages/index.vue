<script setup lang="ts">
import { type RecipeResponse } from "../../types/types";

const { data } = await useFetch<RecipeResponse>("https://dummyjson.com/recipes?limit=12");
</script>

<template>
  <main>
    <section class="bg-[#f1f1f1]">
      <div class="container flex flex-col lg:flex-row items-center py-20 gap-10">
        <div class="flex-1 order-2 lg:order-1 text-center lg:text-left">
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 text-balance">
            Master the Kitchen with Ease: Unleash Your Inner Chef Today!
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-balance">
            Discover recipes helping you to find the easiest way to cook.
          </p>
          <button
            class="px-4 py-2 text-white self-start bg-dodgeroll-gold rounded-md text-lg cursor-pointer"
          >
            Browse Recipes
          </button>
        </div>
        <div class="flex-1 order-1 lg:order-2">
          <img src="/nuxt-course-hero.png" alt="" />
        </div>
      </div>
    </section>
    <section class="py-20 container">
      <h2 class="text-3xl lg:text-5xl mb-2">Discover, Create, Share</h2>
      <p class="text-lg lg:text-xl mb-8">Check out our most popular recipes!</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
        <RecipeCard v-for="recipe in data?.recipes" :recipe="recipe" />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
