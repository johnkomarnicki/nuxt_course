<script setup lang="ts">
const { userInfo } = useUserInfo();
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
          :alt="`${userInfo?.name}`"
          :src="`${userInfo?.avatar}`"
        />
        <p class="text-3xl">{{ userInfo.name }}</p>
      </div>
      <ULink class="ml-auto" to="/profile/settings">
        <UIcon class="text-4xl" name="mdi-settings-outline" />
      </ULink>
    </section>
  </main>
</template>
