<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const user = useCookie("user");
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

type Schema = z.output<typeof schema>;

const formState = reactive({
  email: "",
  password: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  user.value = formState.email;

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
      :schema="schema"
      :state="formState"
      @submit.prevent="onSubmit"
      class="flex flex-col gap-3"
    >
      <div class="flex flex-col">
        <UFormGroup label="Email" name="email">
          <UInput v-model="formState.email" />
        </UFormGroup>
      </div>
      <div class="flex flex-col">
        <UFormGroup label="Password" name="password">
          <UInput v-model="formState.password" type="password" />
        </UFormGroup>
      </div>
      <UButton
        class="mt-3"
        type="submit"
        label="Sign in"
        block
        size="lg"
      />
    </UForm>
  </div>
</template>
