<script lang="ts" setup>
const { setUserInfo } = useUserInfo();
const user = useSupabaseUser();

await callOnce(async () => {
  if (user.value) {
    await setUserInfo();
  }
});
</script>

<template>
  <div class="font-Montserrat">
    <NuxtLayout>
      <NuxtPage />
      <UNotifications
        :ui="{
          wrapper: 'font-Montserrat',
        }"
      />
    </NuxtLayout>
  </div>
</template>
