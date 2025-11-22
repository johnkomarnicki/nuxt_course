<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, FormError } from "#ui/types";
import type { Database } from "~~/types/database.types";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();

const recipeForm = ref();

const formSchema = z.object({
  image: z.string({ message: "Image is required" }),
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must contain more then one character(s)"),
  cookTimeMinutes: z.number({ message: "Cook time is required" }),
});

type Schema = z.output<typeof formSchema>;

function getInitialFormState() {
  return {
    image: undefined,
    name: undefined,
    cookTimeMinutes: undefined,
    ingredient: undefined,
    ingredientList: [] as string[],
    instruction: undefined,
    instructionList: [] as string[],
  };
}

const formState = reactive(getInitialFormState());

function resetForm() {
  recipeImageFile.value = undefined;
  recipeLocalUrl.value = undefined;
  Object.assign(formState, getInitialFormState());
}

function addIngredient() {
  if (formState.ingredient) {
    formState.ingredientList.push(formState.ingredient);
    formState.ingredient = undefined;
    recipeForm.value.clear("ingredients");
  }
}

function removeIngredient(index: number) {
  formState.ingredientList.splice(index, 1);
}

function addInstruction() {
  if (formState.instruction) {
    formState.instructionList.push(formState.instruction);
    formState.instruction = undefined;
    recipeForm.value.clear("instructions");
  }
}

function removeInstruction(index: number) {
  formState.instructionList.splice(index, 1);
}

const recipeImageFile = ref<File | undefined>(undefined);
const recipeLocalUrl = ref<string | undefined>(undefined);
function handleFileUpload(file: FileList) {
  if (file[0]) {
    recipeImageFile.value = file[0];
    recipeLocalUrl.value = URL.createObjectURL(recipeImageFile.value);
  }
}

function validate(state: any): FormError[] {
  const errors = [];
  if (state.ingredientList.length === 0) {
    errors.push({
      path: "ingredients",
      message: "You must have at least one ingredient",
    });
  }
  if (state.instructionList.length === 0) {
    errors.push({
      path: "instructions",
      message: "You must have at least one instruction",
    });
  }
  return errors;
}

const toast = useToast();
async function formSubmission(event: FormSubmitEvent<Schema>) {
  try {
    // Upload Image
    const { error: storageError } = await client.storage
      .from("recipes")
      .upload(
        `${user.value?.id}/${recipeImageFile.value?.name}`,
        recipeImageFile.value as File,
        {
          cacheControl: "3600",
        }
      );

    if (storageError) throw storageError;

    // Get public url
    const { data } = client.storage
      .from("recipes")
      .getPublicUrl(`${user.value?.id}/${recipeImageFile.value?.name}`);

    // Create Recipe
    const { error: recipeError } = await client.from("recipes").insert({
      image_url: data.publicUrl,
      name: event.data.name,
      cookTimeMinutes: event.data.cookTimeMinutes,
      ingredients: formState.ingredientList,
      instructions: formState.instructionList,
    });

    if (recipeError) throw recipeError;

    toast.add({
      title: "Recipe Created",
    });
    resetForm();
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
    class="bg-[#f1f1f1] max-w-screen-sm mx-auto mt-10 space-y-6 rounded-md p-8 text-xs shadow-md"
  >
    <h1 class="text-xl sm:text-2xl mb-4">Create Recipe</h1>
    <UForm
      ref="recipeForm"
      :state="formState"
      :schema="formSchema"
      :validate="validate"
      @submit="formSubmission"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col gap-3">
        <p class="font-medium text-base text-gray-700">Image</p>
        <div
          class="h-[250px] w-full flex items-center justify-center bg-white/50 rounded-md"
        >
          <img
            v-if="recipeLocalUrl"
            class="h-full w-full object-cover rounded-md shadow-sm"
            :src="`${recipeLocalUrl}`"
          />
          <UIcon v-else name="mdi-photo-library" class="text-black text-7xl" />
        </div>
        <UFormGroup name="image">
          <template #label>
            <div class="cursor-pointer">
              <UButton
                icon="mdi-cloud-upload"
                label="Upload Image"
                class="pointer-events-none"
                size="md"
              />
            </div>
          </template>
          <UInput
            class="hidden"
            v-model="formState.image"
            type="file"
            @change="handleFileUpload"
          />
        </UFormGroup>
      </div>
      <UFormGroup label="Name" name="name" size="xl">
        <UInput v-model="formState.name" />
      </UFormGroup>
      <UFormGroup label="Cook Time (Minutes)" name="cookTimeMinutes" size="xl">
        <UInput v-model="formState.cookTimeMinutes" type="number" />
      </UFormGroup>
      <UFormGroup label="Ingredients" name="ingredients" size="xl">
        <div class="flex gap-2">
          <UInput
            @keydown.enter.prevent="addIngredient"
            v-model="formState.ingredient"
            placeholder="Enter ingredient name"
            class="flex-1"
          />
          <UButton
            @click="addIngredient"
            icon="i-heroicons-plus"
            label="Add"
            :disabled="!formState.ingredient"
          />
        </div>
      </UFormGroup>
      <ul v-if="formState.ingredientList.length !== 0" class="space-y-2 py-2">
        <CreateListItem
          v-for="(ingredient, index) in formState.ingredientList"
          @removeItem="removeIngredient(index)"
          :key="index"
          :index="index"
          :item="ingredient"
        />
      </ul>
      <UFormGroup label="Instructions" name="instructions" size="xl">
        <div class="flex gap-2">
          <UInput
            @keydown.enter.prevent="addInstruction"
            v-model="formState.instruction"
            placeholder="Enter instruction step"
            class="flex-1"
          />
          <UButton
            @click="addInstruction"
            icon="i-heroicons-plus"
            label="Add"
            :disabled="!formState.instruction || !formState.instruction.trim()"
          />
        </div>
      </UFormGroup>
      <ul v-if="formState.instructionList.length > 0" class="space-y-2 py-2">
        <CreateListItem
          v-for="(instruction, index) in formState.instructionList"
          @removeItem="removeInstruction(index)"
          :key="index"
          :index="index"
          :item="instruction"
        />
      </ul>
      <UButton class="mt-5" label="Create" type="submit" block />
    </UForm>
  </div>
</template>
