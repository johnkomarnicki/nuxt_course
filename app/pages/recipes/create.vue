<script setup lang="ts">
import { type Database } from "~~/types/database.types";
import type { RecipeFormState } from "~~/types/types";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const toast = useToast();
const createRecipeRef = ref();

async function formSubmission(
  formState: RecipeFormState,
  imageFile: File | undefined
) {
  try {
    if (!imageFile) {
      throw new Error("Image file is required");
    }

    // Upload Recipe Image
    const { error: storageError } = await client.storage
      .from("recipes")
      .upload(`${user.value?.id}/${imageFile.name}`, imageFile);

    if (storageError) throw storageError;

    // Get public url
    const { data } = client.storage
      .from("recipes")
      .getPublicUrl(`${user.value?.id}/${imageFile.name}`);

    // Create Recipe
    const { error: recipeError } = await client.from("recipes").insert({
      user_id: user.value?.id as string,
      image: data.publicUrl,
      name: formState.name,
      cookTimeMinutes: formState.cookTimeMinutes,
      caloriesPerServing: formState.calories,
      rating: 0,
      ingredients: formState.ingredientList,
      instructions: formState.instructionList,
    });

    if (recipeError) throw recipeError;
    toast.add({
      title: "Recipe Created",
    });

    createRecipeRef.value?.resetForm();
  } catch (error: any) {
    toast.add({
      title: "Error creating recipe",
      description: error.message,
    });
  }
}
</script>

<template>
  <div
    class="bg-[#f1f1f1] max-w-screen-sm mx-auto my-10 space-y-6 rounded-md p-8 text-xs shadow-md"
  >
    <h1 class="text-xl sm:text-2xl mb-4">Create Recipe</h1>
    <CreateRecipe ref="createRecipeRef" @submit="formSubmission" />
  </div>
</template>
