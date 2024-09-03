<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

type Schema = z.output<typeof formSchema>;
const formSchema = z.object({
  email: z.string().email("Invalid email"),
});
const formState = reactive({
  email: "",
});
const formStatusModal = ref(false);
const formError = ref(false);
const formTitle = ref("");
const formMsg = ref("");

async function formSubmission(event: FormSubmitEvent<Schema>) {
  try {
    const res = await $fetch("/api/subscription", {
      method: "POST",
      body: {
        email: event.data.email,
      },
    });

    formTitle.value = res.title;
    formMsg.value = res.message;
    formStatusModal.value = true;
  } catch {
    formError.value = true;
  }
}
</script>

<template>
  <UModal
    v-model="formStatusModal"
    :ui="{
      width: 'sm:max-w-screen-sm',
    }"
  >
    <div class="flex flex-col p-8">
      <h1 class="text-3xl mb-2 font-semibold">{{ formTitle }}</h1>
      <p class="text-xl mb-4">{{ formMsg }}</p>
      <UButton label="Close" size="xl" class="self-start" @click="formStatusModal = false" />
    </div>
  </UModal>
  <div class="container max-w-screen-md mx-auto p-10">
    <h1 class="text-4xl lg:text-5xl mb-4 text-balance text-center font-extrabold">
      Recipes Straight To Your Inbox
    </h1>

    <p class="text-xl lg:text-2xl mb-8 text-balance text-center">
      Discover tasty new recipes in our weekly newsletter!
    </p>

    <UForm
      :state="formState"
      :schema="formSchema"
      @submit="formSubmission"
      class="flex flex-col gap-4"
    >
      <UFormGroup label="Email" name="email" size="xl">
        <UInput v-model="formState.email" />
      </UFormGroup>
      <UButton color="dodgeroll-gold" size="xl" label="Join" type="submit" block />
    </UForm>

    <p v-if="formError" class="mt-4 text-red-500">Something went wrong, please try again later.</p>
  </div>
</template>

<style scoped></style>
