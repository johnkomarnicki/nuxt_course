<script setup lang="ts">
const { userInfo } = useUserInfo();
const recipes = ref([]);

const showCreateRecipe = ref(false);
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
    <section class="flex flex-col py-8">
      <div class="flex items-center gap-2 mb-8">
        <h1 class="text-3xl">My recipes</h1>
        <UButton size="sm" class="ml-auto" to="/recipes/create">
          Create Recipe
        </UButton>
      </div>
      <div v-if="recipes.length === 0">
        <p>You don't currently have any recipes.</p>
      </div>
    </section>
  </main>
</template>
