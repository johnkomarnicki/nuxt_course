<script setup lang="ts">
import type { DropdownItem } from "#ui/types";

const user = useSupabaseUser();

const items: DropdownItem[][] = [
  [
    {
      label: user.value?.email || "",
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Sign out",
      slot: "signout",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: logout,
    },
  ],
];

async function logout() {
  await useLogout();
}
</script>

<template>
  <header class="py-4 border-b">
    <nav class="flex container items-center">
      <NuxtLink to="/" class="flex gap-1 items-center">
        <NuxtImg width="56px" src="/icon-green.png" format="webp" alt="" />
        <span class="text-3xl font-bold">Nuxtcipes</span>
      </NuxtLink>
      <ul class="flex items-center gap-6 ml-auto text-xl font-bold capitalize">
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin">Admin</NuxtLink>
        </li>
        <li v-if="!user">
          <NuxtLink to="/login">Login</NuxtLink>
        </li>
        <UDropdown
          v-if="user"
          :items="items"
          :ui="{ item: { disabled: 'cursor-text select-text' } }"
          :popper="{ placement: 'bottom-start', arrow: true }"
          class="hidden md:flex"
        >
          <UAvatar
            :src="user?.user_metadata.avatar_url"
            :alt="user?.user_metadata.email"
            size="md"
          />
          <template #account="{ item }">
            <div class="truncate text-left">
              <p>Signed in as</p>
              <p class="truncate font-medium text-gray-900 dark:text-white">
                {{ item.label }}
              </p>
            </div>
          </template>
          <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>
            <UIcon
              :name="item.icon"
              class="ms-auto h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
            />
          </template>
        </UDropdown>
      </ul>
    </nav>
  </header>
</template>
