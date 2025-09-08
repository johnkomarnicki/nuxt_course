<script lang="ts" setup>
const { setUserInfo } = useUserInfo();

await callOnce(async () => {
  await setUserInfo();
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
