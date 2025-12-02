<script setup lang="ts">
import { type Database, type Tables } from "~~/types/database.types";
import type { RecipeFormState } from "~~/types/types";

import type { Database } from "~~/types/database.types";

const { id } = useRoute().params;
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();
const isUserProfile = id === user.value?.id;

const { data: profileData, error } = await useAsyncData(async () => {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", id as string)
    .single();

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Profile Not Found",
    });
  }

  const { data: recipes, error: recipesError } = await client
    .from("recipes")
    .select()
    .eq("user_id", id as string);

  return { data, error, recipes, recipesError };
});

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
  });
}

useSeoMeta({
  title: `Profile - ${
    profileData.value?.data.name || profileData.value?.data.email
  }`,
  description: "Recipes for you to cook!",
  ogTitle: `Profile - ${
    profileData.value?.data.name || profileData.value?.data.email
  }`,
  ogDescription: "Recipes for you to cook!",
  ogImage: `${profileData.value?.data.avatar || "/nuxt-course-hero.png"}`,
  ogUrl: `${useRuntimeConfig().public.apiBase}/profile/${
    profileData.value?.data.id
  }`,
  twitterTitle: `Profile - ${
    profileData.value?.data.name || profileData.value?.data.email
  }`,
  twitterDescription: "Recipes for you to cook!",
  twitterImage: `${profileData.value?.data.avatar || "/nuxt-course-hero.png"}`,
  twitterCard: "summary",
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
        .upload(`${userInfo.value?.id}/${imageFile.name}`, imageFile);

      if (storageError) throw storageError;

      // Get public url
      const { data } = supabase.storage
        .from("recipes")
        .getPublicUrl(`${userInfo.value?.id}/${imageFile.name}`);

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

async function handleDeleteRecipe(recipe: Tables<"recipes">) {
  try {
    // Delete recipe from database
    const { error: recipeError } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipe.id);

    if (recipeError) throw recipeError;

    // Optionally delete the image from storage
    if (recipe.image) {
      const imagePath = recipe.image.split("/").slice(-2).join("/");
      await supabase.storage.from("recipes").remove([imagePath]);
    }

    toast.add({
      title: "Recipe Deleted",
    });

    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Error deleting recipe",
      description: error.message,
      color: "red",
    });
  }
}
</script>

<template>
  <main class="flex flex-col gap-8 container py-20">
    <section class="flex items-center bg-[#f1f1f1] p-8 rounded-md shadow-md">
      <div class="flex items-center gap-2">
        <UAvatar
          :ui="{
            background: 'bg-primary',
            placeholder: 'text-white',
          }"
          size="3xl"
          :alt="`${profileData?.data?.name}`"
          :src="`${profileData?.data?.avatar}`"
        />
        <p class="text-3xl">{{ profileData?.data.name }}</p>
      </div>
      <ULink class="ml-auto" to="/profile/settings">
        <UIcon class="text-4xl" name="mdi-settings-outline" />
      </ULink>
    </section>
    <section class="flex flex-col py-8">
      <div class="flex items-center gap-2 mb-8">
        <h1 class="text-3xl">My recipes</h1>
        <UButton size="sm" class="ml-auto" to="/recipes/create">
          Create Recipe
        </UButton>
      </div>
      <div v-if="!profileData?.recipes || profileData?.recipes.length === 0">
        <p>You don't currently have any recipes.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <RecipeCard
          v-for="recipe in profileData?.recipes"
          :recipe="recipe"
          @edit="handleEdit"
          @delete="handleDeleteRecipe"
        />
      </div>
    </section>

    <UModal v-model="isEditModalOpen">
      <div class="p-6">
        <h2 class="text-xl sm:text-2xl mb-4">Edit Recipe</h2>
        <RecipeForm :recipe="selectedRecipe" @submit="handleUpdateRecipe" />
      </div>
    </UModal>
  </main>
</template>
