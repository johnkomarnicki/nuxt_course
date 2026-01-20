<script setup lang="ts">
import { type Database, type Tables } from "~~/types/database.types";

import type { RecipeFormState } from "~~/types/types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const toast = useToast();

const {
  data: recipes,
  error,
  refresh,
} = await useAsyncData(async () => {
  const { data } = await supabase.from("recipes").select().is("user_id", null);
  return data;
});

const isEditModalOpen = ref(false);
const selectedRecipe = ref<Tables<"recipes"> | undefined>(undefined);

function handleEdit(recipe: Tables<"recipes">) {
  selectedRecipe.value = recipe;
  isEditModalOpen.value = true;
}

async function handleUpdateRecipe(
  formState: RecipeFormState,
  imageFile: File | undefined
) {
  try {
    if (!selectedRecipe.value) return;

    let imageUrl = selectedRecipe.value.image;

    // Upload new image if provided
    if (imageFile) {
      const { error: storageError } = await supabase.storage
        .from("recipes")
        .upload(`${user.value?.id}/${imageFile.name}`, imageFile);

      if (storageError) throw storageError;

      // Get public url
      const { data } = supabase.storage
        .from("recipes")
        .getPublicUrl(`${user.value?.id}/${imageFile.name}`);

      imageUrl = data.publicUrl;
    }

    // Update Recipe
    const { error: recipeError } = await supabase
      .from("recipes")
      .update({
        image: imageUrl,
        name: formState.name,
        cookTimeMinutes: formState.cookTimeMinutes,
        caloriesPerServing: formState.calories,
        ingredients: formState.ingredientList,
        instructions: formState.instructionList,
      })
      .eq("id", selectedRecipe.value.id);

    if (recipeError) throw recipeError;

    toast.add({
      title: "Recipe Updated",
    });

    isEditModalOpen.value = false;
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Error updating recipe",
      description: error.message,
      color: "red",
    });
  }
}

useSeoMeta({
  title: "Nuxtcipes",
  description: "Recipes for you to cook!",
  ogTitle: "Nuxtcipes",
  ogDescription: "Recipes for you to cook!",
  ogImage: "/nuxt-course-hero.png",
  ogUrl: `http:localhost:3000`,
  twitterTitle: "Nuxtcipes",
  twitterDescription: "Recipes for you to cook!",
  twitterImage: "/nuxt-course-hero.png",
  twitterCard: "summary",
});
</script>

<template>
  <main>
    <section class="bg-[#f1f1f1]">
      <div
        class="container flex flex-col lg:flex-row items-center py-20 gap-10"
      >
        <div class="flex-1 order-2 lg:order-1 text-center lg:text-left">
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 text-balance">
            Master the Kitchen with Ease: Unleash Your Inner Chef Today!
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-balance">
            Discover recipes helping you to find the easiest way to cook.
          </p>
          <UButton to="#recipes" label="Browse Recipes" />
        </div>
        <div class="flex-1 order-1 lg:order-2">
          <NuxtImg
            sizes="xs:100vw sm:667px"
            src="/nuxt-course-hero.png"
            format="webp"
            densities="x1"
            alt=""
          />
        </div>
      </div>
    </section>
    <section id="recipes" class="py-20 container">
      <h2 class="text-3xl lg:text-5xl mb-2">Discover, Create, Share</h2>
      <p class="text-lg lg:text-xl mb-8">Check out our most popular recipes!</p>
      <div
        v-if="!error"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8"
      >
        <RecipeCard
          v-for="recipe in recipes"
          :recipe="recipe"
          @edit="handleEdit"
        />
      </div>
      <p v-else class="text-xl">
        Opps, something went wrong. Please try again later
      </p>
    </section>
    <section class="bg-[#f1f1f1] py-20">
      <SignupForm />
    </section>

    <UModal v-model="isEditModalOpen">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Edit Recipe</h2>
        <RecipeForm
          v-if="selectedRecipe"
          :recipe="selectedRecipe"
          @submit="handleUpdateRecipe"
        />
      </div>
    </UModal>
  </main>
</template>
