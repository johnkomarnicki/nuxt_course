<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Database } from "~~/types/database.types";

const { userInfo, setUserInfo } = useUserInfo();
const client = useSupabaseClient<Database>();

const formSchema = z.object({
  avatar: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(1),
});

type Schema = z.output<typeof formSchema>;

const formState = reactive({
  avatar: userInfo.value?.avatar,
  email: userInfo.value?.email,
  name: userInfo.value?.name,
});

const avatarFile = ref<File | undefined>(undefined);
const avatarLocalUrl = ref<string | undefined>(undefined);
const avatarPublicUrl = ref<string | undefined>(undefined);
function handleFileUpload(file: FileList) {
  if (file[0]) {
    avatarFile.value = file[0];
    avatarLocalUrl.value = URL.createObjectURL(avatarFile.value);
  }
}

const updatingProfile = ref(false);
const toast = useToast();
async function formSubmission(event: FormSubmitEvent<Schema>) {
  try {
    updatingProfile.value = true;
    if (avatarFile.value) {
      const { error } = await client.storage
        .from("avatars")
        .upload(
          `${userInfo.value?.id}/${avatarFile.value.name}`,
          avatarFile.value,
          {
            upsert: true,
          }
        );

      if (error) throw error;

      const { data } = client.storage
        .from("avatars")
        .getPublicUrl(`${userInfo.value?.id}/${avatarFile.value.name}`);

      avatarPublicUrl.value = data.publicUrl;
    }

    const { error } = await client
      .from("profiles")
      .update({
        name: event.data.name,
        avatar: avatarPublicUrl.value,
      })
      .eq("id", userInfo.value?.id as string);

    if (error) throw error;
    setUserInfo(true);
    avatarFile.value = undefined;
    avatarPublicUrl.value = undefined;
    toast.add({
      title: "Profile Updated",
    });
  } catch (error: any) {
    toast.add({
      title: "Error updating profile",
      description: error.message,
    });
  } finally {
    updatingProfile.value = false;
  }
}

useSeoMeta({
  title: "Profile Settings",
  description: "Recipes for you to cook!",
  ogTitle: "Profile Settings",
  ogDescription: "Recipes for you to cook!",
  ogImage: "/nuxt-course-hero.png",
  ogUrl: `${useRuntimeConfig().public.apiBase}/profile/settings`,
  twitterTitle: "Profile Settings",
  twitterDescription: "Recipes for you to cook!",
  twitterImage: "/nuxt-course-hero.png",
  twitterCard: "summary",
});
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
      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-gray-700">Avatar</p>
        <UAvatar
          size="3xl"
          :ui="{ background: 'bg-primary', placeholder: 'text-white' }"
          :alt="userInfo?.name!"
          :src="avatarLocalUrl || userInfo?.avatar!"
        />
        <UFormGroup name="avatar" size="lg">
          <template #label>
            <div class="cursor-pointer">
              <UButton
                icon="mdi-cloud-upload"
                label="Upload Avatar"
                size="md"
                class="pointer-events-none"
              />
            </div>
          </template>
          <UInput
            class="hidden"
            type="file"
            accept=".png, .jpg"
            v-model="formState.avatar!"
            @change="handleFileUpload"
          />
        </UFormGroup>
      </div>
      <UFormGroup label="Email" name="email" size="lg">
        <UInput v-model="formState.email!" disabled />
      </UFormGroup>
      <UFormGroup label="Name" name="name" size="lg">
        <UInput v-model="formState.name!" />
      </UFormGroup>
      <UButton
        :loading="updatingProfile"
        class="mt-5"
        label="Update"
        block
        type="submit"
      />
    </UForm>
  </div>
</template>
