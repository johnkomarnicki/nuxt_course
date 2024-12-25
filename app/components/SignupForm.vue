<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

type Schema = z.output<typeof formSchema>;

const formState = reactive({
  email: "",
});

const toast = useToast();
async function formSubmission(event: FormSubmitEvent<Schema>) {
  try {
    const res = await $fetch("/api/subscription", {
      method: "POST",
      body: {
        email: event.data.email,
      },
    });
    toast.add({ title: res.title, description: res.message });
  } catch {
    toast.add({
      title: "oops",
      description:
        "Something went wrong on our end. Try again later!",
    });
  }
}
</script>

<template>
  <div class="container max-w-screen-md mx-auto p-10">
    <h1
      class="text-4xl lg:text-5xl mb-4 text-balance text-center font-extrabold"
    >
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
      <UButton label="Join" type="submit" block />
    </UForm>
  </div>
</template>
