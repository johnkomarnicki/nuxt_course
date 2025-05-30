<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const formSchema = z.object({
  avatar: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(1),
});

type Schema = z.output<typeof formSchema>;

const formState = reactive({
  avatar: undefined,
  email: undefined,
  name: undefined,
});

async function formSubmission(event: FormSubmitEvent<Schema>) {}
</script>

<template>
  <div
    class="bg-[#f1f1f1] max-w-screen-sm mx-auto mt-10 space-y-6 rounded-md p-8 text-xs shadow-md"
  >
    <h1 class="text-xl sm:text-2xl">Profile Settings</h1>
    <UForm
      :state="formState"
      :schema="formSchema"
      @submit="formSubmission"
      class="flex flex-col gap-4"
    >
    </UForm>
  </div>
</template>
