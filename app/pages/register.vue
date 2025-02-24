<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { auth } = useSupabaseClient();
const toast = useToast();

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
  try {
    const { data, error } = await auth.signUp({
      email: event.data.email,
      password: event.data.password,
    });
    if (error) throw error;
    formState.email = "";
    formState.password = "";
    toast.add({
      color: "green",
      icon: "i-fluent-checkmark-circle-12-filled",
      title: "Check your email to confirm your account.",
    });
  } catch (error: any) {
    toast.add({
      color: "red",
      icon: "i-fluent-checkmark-circle-12-filled",
      title: error.message,
    });
  }
}
</script>

<template>
  <div
    class="bg-[#f1f1f1] max-w-screen-sm mx-auto mt-10 flex flex-col gap-6 rounded-md p-8 text-xs shadow-md sm:p-12 sm:text-sm"
  >
    <h1 class="text-xl sm:text-2xl">Signup</h1>

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
      <UButton type="submit" label="Sign up" block />
    </UForm>
    <p class="text-center">
      Already have an account?
      <ULink class="underline" to="/register">Login</ULink>
    </p>
  </div>
</template>
