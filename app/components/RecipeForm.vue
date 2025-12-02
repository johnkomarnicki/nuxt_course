<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, FormError } from "#ui/types";
import type { RecipeFormState } from "~~/types/types";
import type { Tables } from "~~/types/database.types";

const props = defineProps<{
  recipe?: Tables<"recipes">;
}>();

const emit = defineEmits<{
  submit: [formState: RecipeFormState, imageFile: File | undefined];
}>();

const recipeForm = ref();

const formSchema = z.object({
  image: z.string({ message: "Image is required" }),
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must contain more then one character(s)"),
  cookTimeMinutes: z.number({ message: "Cook time is required" }),
  calories: z.number({ message: "Calories are required" }),
});

type Schema = z.output<typeof formSchema>;

function getInitialFormState(): RecipeFormState {
  if (props.recipe) {
    return {
      image: props.recipe.image || undefined,
      name: props.recipe.name || undefined,
      cookTimeMinutes: props.recipe.cookTimeMinutes || undefined,
      calories: props.recipe.caloriesPerServing || undefined,
      ingredient: undefined,
      ingredientList: props.recipe.ingredients || [],
      instruction: undefined,
      instructionList: props.recipe.instructions || [],
    };
  }

  return {
    image: undefined,
    name: undefined,
    cookTimeMinutes: undefined,
    calories: undefined,
    ingredient: undefined,
    ingredientList: [],
    instruction: undefined,
    instructionList: [],
  };
}

const formState = reactive(getInitialFormState());

const recipeImageFile = ref<File | undefined>(undefined);
const recipeLocalUrl = ref<string | undefined>(props.recipe?.image || undefined);

function handleFileUpload(file: FileList) {
  if (file[0]) {
    recipeImageFile.value = file[0];
    recipeLocalUrl.value = URL.createObjectURL(recipeImageFile.value);
  }
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

function resetForm() {
  recipeImageFile.value = undefined;
  recipeLocalUrl.value = undefined;
  Object.assign(formState, getInitialFormState());
}

function handleSubmit(event: FormSubmitEvent<Schema>) {
  emit("submit", formState, recipeImageFile.value);
}

defineExpose({
  resetForm,
});
</script>

<template>
  <UForm
    ref="recipeForm"
    :state="formState"
    :schema="formSchema"
    :validate="validate"
    @submit="handleSubmit"
    class="flex flex-col gap-4"
  >
    <div class="flex flex-col gap-3">
      <p class="font-medium text-sm text-gray-700">Image</p>
      <div
        class="h-[250px] w-full flex items-center justify-center bg-white/50 rounded-md"
      >
        <img
          v-if="recipeLocalUrl"
          :src="`${recipeLocalUrl}`"
          class="h-full w-full object-cover rounded-md shadow-sm"
          alt=""
        />
        <UIcon v-else name="mdi-photo-library" class="text-black text-7xl" />
      </div>
      <UFormGroup name="image" size="lg">
        <template #label>
          <div class="cursor-pointer">
            <UButton
              icon="mdi-cloud-upload"
              label="Upload Image"
              size="md"
              class="pointer-events-none"
            />
          </div>
        </template>
        <UInput
          class="hidden"
          type="file"
          accept=".png, .jpg"
          v-model="formState.image"
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
    <UFormGroup label="Calories" name="calories" size="xl">
      <UInput v-model="formState.calories" type="number" />
    </UFormGroup>
    <UFormGroup label="Ingredients" name="ingredients" size="xl">
      <div class="flex gap-2">
        <UInput
          v-model="formState.ingredient"
          @keydown.enter.prevent="addIngredient"
          placeholder="Enter ingredient name"
          class="flex-1"
        />
        <UButton @click="addIngredient" icon="i-heroicons-plus" label="Add" />
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
          v-model="formState.instruction"
          @keydown.enter.prevent="addInstruction"
          placeholder="Enter instruction name"
          class="flex-1"
        />
        <UButton @click="addInstruction" icon="i-heroicons-plus" label="Add" />
      </div>
    </UFormGroup>
    <ul v-if="formState.instructionList.length !== 0" class="space-y-2 py-2">
      <CreateListItem
        v-for="(instruction, index) in formState.instructionList"
        @removeItem="removeInstruction(index)"
        :key="index"
        :index="index"
        :item="instruction"
      />
    </ul>
    <UButton
      class="mt-5"
      :label="recipe ? 'Save' : 'Create'"
      type="submit"
      block
    />
  </UForm>
</template>
