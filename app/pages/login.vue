<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  middleware: [
    (to, from) => {
      const user = useSupabaseUser();
      if (user) navigateTo("/");
    },
  ],
});

const { auth } = useSupabaseClient();
const toast = useToast();

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

type Schema = z.output<typeof formSchema>;

const formState = reactive({
  email: "",
});

async function formSubmission(event: FormSubmitEvent<Schema>) {
  try {
    const { error } = await auth.signInWithOtp({
      email: event.data.email,
      options: {
        emailRedirectTo: `${useRuntimeConfig().public.apiBase}/confirm`,
      },
    });
    if (error) throw error;
    formState.email = "";
    toast.add({
      color: "green",
      icon: "i-fluent-checkmark-circle-12-filled",
      title: "Please check your email for your magic link",
    });
  } catch (error: any) {
    toast.add({
      color: "red",
      icon: "i-fluent-checkmark-circle-12-filled",
      title: error.message,
    });
  }
}

async function loginWithOAuth() {
  try {
    const { error } = await auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${useRuntimeConfig().public.apiBase}/confirm`,
      },
    });
    if (error) throw error;
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
    <h1 class="text-xl sm:text-2xl">Login</h1>
    <UButton
      icon="logos:google-icon"
      label="Login With Google"
      color="white"
      block
      @click="loginWithOAuth"
    />
    <UDivider label="or" />
    <UForm
      :state="formState"
      :schema="formSchema"
      @submit="formSubmission"
      class="space-y-4"
    >
      <UFormGroup label="Email" name="email" size="lg">
        <UInput v-model="formState.email" />
      </UFormGroup>
      <UButton type="submit" label="Sign in" block />
    </UForm>
  </div>
</template>
