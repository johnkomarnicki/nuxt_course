<script setup lang="ts">
definePageMeta({
  layout: "no-header",
});

const user = useSupabaseUser();
const { setUserInfo } = useUserInfo();

watch(
  user,
  async () => {
    if (user.value) {
      // Redirect to protected page
      await setUserInfo();
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-screen grid place-items-center">
    <div class="flex flex-col items-center gap-2">
      <UIcon
        name="i-mdi-loading"
        class="text-dodgeroll-gold-500 text-5xl animate-spin"
      />
      <h1 class="text-5xl">Verifying...</h1>
    </div>
  </div>
</template>
