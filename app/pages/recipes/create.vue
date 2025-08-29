<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const recipeForm = ref();

const formSchema = z.object({
  image: z.string({ message: "Image is required" }),
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must contain more then one character(s)"),
  cookTimeMinutes: z.number({ message: "Cook time is required" }),
});

type Schema = z.output<typeof formSchema>;

const formState = reactive({
  image: undefined,
  name: undefined,
  cookTimeMinutes: undefined,
  ingredient: undefined,
  ingredientList: [] as string[],
  instruction: undefined,
  instructionList: [] as string[],
});

async function formSubmission(event: FormSubmitEvent<Schema>) {}
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
      @submit="formSubmission"
      class="flex flex-col gap-4"
    >
      <UButton class="mt-5" label="Create" type="submit" block />
    </UForm>
  </div>
</template>
