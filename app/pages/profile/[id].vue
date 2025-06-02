<script setup lang="ts">
import type { Database } from "~~/types/database.types";

const { id } = useRoute().params;
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();
const isUserProfile = id === user.value?.id;

const { data: profileData, error } = await useAsyncData(async () => {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", id as string)
    .single();

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Profile Not Found",
    });
  }

  return { data, error };
});

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
  });
}

useSeoMeta({
  title: `Profile - ${
    profileData.value?.data.name || profileData.value?.data.email
  }`,
  description: "Recipes for you to cook!",
  ogTitle: `Profile - ${
    profileData.value?.data.name || profileData.value?.data.email
  }`,
  ogDescription: "Recipes for you to cook!",
  ogImage: `${profileData.value?.data.avatar || "/nuxt-course-hero.png"}`,
  ogUrl: `${useRuntimeConfig().public.apiBase}/profile/${
    profileData.value?.data.id
  }`,
  twitterTitle: `Profile - ${
    profileData.value?.data.name || profileData.value?.data.email
  }`,
  twitterDescription: "Recipes for you to cook!",
  twitterImage: `${profileData.value?.data.avatar || "/nuxt-course-hero.png"}`,
  twitterCard: "summary",
});
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
      <ULink v-if="isUserProfile" to="/profile/settings" class="ml-auto">
        <UIcon class="text-4xl" name="mdi-settings-outline" />
      </ULink>
    </section>
  </main>
</template>
