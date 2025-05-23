<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Database } from "~~/types/database.types";

const { userInfo, setUserInfo } = useUserInfo();
const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const toast = useToast();

console.log(userInfo.value);

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

type Schema = z.output<typeof formSchema>;

const formState = reactive({
  email: userInfo.value.email || "",
  name: userInfo.value.name || "",
});

const avatarFile = ref<File | undefined>(undefined);
const avatarPublicUrl = ref<string>();
const avatarLocalUrl = ref<string>();
function handleFileUpload(file: FileList) {
  if (file[0]) {
    avatarFile.value = file[0];
    avatarLocalUrl.value = URL.createObjectURL(avatarFile.value);
  }
}

const updatingProfile = ref(false);
async function formSubmission(event: FormSubmitEvent<Schema>) {
  try {
    updatingProfile.value = true;

    if (avatarFile.value) {
      const { error: storageError } = await client.storage
        .from("avatars")
        .upload(
          `${user.value?.id}/${avatarFile.value?.name}`,
          avatarFile.value as File,
          {
            cacheControl: "3600",
            upsert: true,
          }
        );

      if (storageError) throw storageError;

      // Get public url
      const { data } = client.storage
        .from("avatars")
        .getPublicUrl(`${user.value?.id}/${avatarFile.value?.name}`);

      avatarPublicUrl.value = data.publicUrl;
    }

    await client
      .from("profiles")
      .update({
        name: event.data.name,
        avatar: avatarPublicUrl.value || formState.avatar,
      })
      .eq("id", user.value?.id as string);

    setUserInfo(true);
    toast.add({
      title: "Profile Updated",
    });
  } catch (error: any) {
    toast.add({
      title: "Error creating recipe",
      description: error.message,
    });
  } finally {
    updatingProfile.value = false;
  }
}
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
          :src="`${avatarLocalUrl || userInfo?.avatar}`"
          :alt="`${userInfo?.name}`"
        />
        <UFormGroup name="avatar" size="lg">
          <template #label>
            <div class="cursor-pointer">
              <UButton
                icon="mdi-cloud-upload"
                label="Upload Avatar"
                class="pointer-events-none"
                size="md"
              />
            </div>
          </template>
          <UInput class="hidden" type="file" @change="handleFileUpload" />
        </UFormGroup>
      </div>
      <UFormGroup label="Email" name="email" size="xl">
        <UInput disabled v-model="formState.email" />
      </UFormGroup>
      <UFormGroup label="Name" name="name" size="xl">
        <UInput v-model="formState.name" />
      </UFormGroup>
      <UButton
        :loading="updatingProfile"
        class="mt-5"
        type="submit"
        block
        label="Update"
      />
    </UForm>
  </div>
</template>
