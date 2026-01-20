<script setup lang="ts">
import type { Database, Tables } from "~~/types/database.types";
import type { RecipeFormState } from "~~/types/types";

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
    .select("*")
    .eq("user_id", id as string);

  return { data, error, recipes, recipesError };
});

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
  });
}

const isEditModalOpen = ref(false);
const selectedRecipe = ref<Tables<"recipes"> | undefined>(undefined);

function handleEdit(recipe: Tables<"recipes">) {
  selectedRecipe.value = recipe;
  isEditModalOpen.value = true;
}

const toast = useToast();

async function handleUpdateRecipe(
  formState: RecipeFormState,
  imageFile: File | undefined
) {
  try {
    let imageUrl = selectedRecipe.value?.image;

    if (imageFile) {
      const { error: storageError } = await client.storage
        .from("recipes")
        .upload(`${user.value?.id}/${imageFile?.name}`, imageFile as File);

      if (storageError) throw storageError;

      // Get public url
      const { data } = client.storage
        .from("recipes")
        .getPublicUrl(`${user.value?.id}/${imageFile?.name}`);

      imageUrl = data.publicUrl;
    }

    const { data, error: recipeError } = await client
      .from("recipes")
      .update({
        image: imageUrl,
        name: formState.name,
        cookTimeMinutes: formState.cookTimeMinutes,
        caloriesPerServing: formState.caloriesPerServing,
        ingredients: formState.ingredientList,
        instructions: formState.instructionList,
      })
      .eq("id", selectedRecipe.value?.id!)
      .select("*")
      .single();

    if (recipeError) throw recipeError;

    if (profileData.value?.recipes && data) {
      const recipeIndex = profileData.value.recipes.findIndex(
        (r: Tables<"recipes">) => r.id === data.id
      );

      if (recipeIndex !== -1) {
        profileData.value.recipes[recipeIndex] = data;
      }
    }

    toast.add({
      title: "Recipe Updated",
    });

    isEditModalOpen.value = false;
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
    const { error } = await client.from("recipes").delete().eq("id", recipe.id);

    if (error) throw error;

    if (recipe.image) {
      const imagePath = recipe.image.split("/").slice(-2).join("/");
      await client.storage.from("recipes").remove([imagePath]);
    }

    // Remove the deleted recipe from the local array
    if (profileData.value?.recipes) {
      profileData.value.recipes = profileData.value.recipes.filter(
        (r: Tables<"recipes">) => r.id !== recipe.id
      );
    }

    toast.add({
      title: "Recipe Deleted",
    });
  } catch (error: any) {
    toast.add({
      title: "Error deleting recipe",
      description: error.message,
      color: "red",
    });
  }
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
</script>

<template>
  <UModal v-model="isEditModalOpen">
    <div class="p-6">
      <h2 class="text-xl sm:text-2xl mb-4">Edit Recipe</h2>
      <RecipeForm :recipe="selectedRecipe" @submit="handleUpdateRecipe" />
    </div>
  </UModal>
  <main class="flex flex-col gap-8 container py-20">
    <section class="flex items-center bg-[#f1f1f1] p-8 rounded-md shadow-md">
      <div class="flex items-center gap-2">
        <UAvatar
          :ui="{
            background: 'bg-primary',
            placeholder: 'text-white',
          }"
          size="3xl"
          :alt="profileData?.data?.name!"
          :src="profileData?.data?.avatar!"
        />
        <p class="text-3xl">{{ profileData?.data?.name }}</p>
      </div>
      <ULink v-if="isUserProfile" to="/profile/settings" class="ml-auto">
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
      <div v-if="profileData?.recipes?.length === 0">
        <p>You don't currently have any recipes.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeCard
          v-for="recipe in profileData?.recipes"
          :key="recipe.id"
          :recipe="recipe"
          @edit="handleEdit"
          @delete="handleDeleteRecipe"
        />
      </div>
    </section>
  </main>
</template>
