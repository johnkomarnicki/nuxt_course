<script setup lang="ts">
import type { Database } from "~~/types/database.types";

const { id } = useRoute().params;
const client = useSupabaseClient<Database>();

const { data: profileData, error } = await useAsyncData(async () => {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", id as string)
    .single();

  return { data, error };
});

// Handle Error
if (profileData.value?.error || error.value) {
  const statusCode = profileData.value?.error ? 400 : error.value?.statusCode;
  const statusMessage = profileData.value?.error
    ? "Profile Not Found"
    : error.value?.statusMessage;

  throw createError({
    statusCode: statusCode,
    statusMessage: statusMessage,
  });
}
</script>

<template>
  <main class="flex flex-col gap-8 container py-20">
    <section class="flex items-center bg-[#f1f1f1] p-8 rounded-md shadow-md">
      <div class="flex items-center gap-2">
        <UAvatar
          :ui="{
            background: 'bg-primary',
            placeholder: 'text-white',
          }"
          size="3xl"
          :alt="profileData?.data?.name!"
          :src="profileData?.data?.avatar!"
        />
        <p class="text-3xl">{{ profileData?.data?.name }}</p>
      </div>
      <ULink class="ml-auto">
        <UIcon class="text-4xl" name="mdi-settings-outline" />
      </ULink>
    </section>
  </main>
</template>
