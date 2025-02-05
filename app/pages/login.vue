<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const userCookie = useCookie("user");
const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(5),
});

type Schema = z.output<typeof formSchema>;

const formState = reactive({
  email: "",
  password: "",
});

async function formSubmission(event: FormSubmitEvent<Schema>) {
  userCookie.value = event.data.email;
  formState.email = "";
  formState.password = "";
}
</script>

<template>
  <div
    class="bg-[#f1f1f1] max-w-screen-sm mx-auto mt-10 flex flex-col gap-6 rounded-md p-8 text-xs shadow-md sm:p-12 sm:text-sm"
  >
    <h1 class="text-xl sm:text-2xl">Login</h1>
    <UForm
      :state="formState"
      :schema="formSchema"
      @submit="formSubmission"
      class="space-y-4"
    >
      <UFormGroup label="Email" name="email" size="lg">
        <UInput v-model="formState.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password" size="lg">
        <UInput type="password" v-model="formState.password" />
      </UFormGroup>
      <UButton type="submit" label="Sign in" block />
    </UForm>
  </div>
</template>
