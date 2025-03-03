<script setup lang="ts">
import type { DropdownItem } from "#ui/types";

const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const toast = useToast();

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
      icon: "i-mdi-logout",
      click: logout,
    },
  ],
];

async function logout() {
  try {
    const { error } = await auth.signOut();
    if (error) throw error;
    navigateTo("/login");
  } catch (error: any) {
    toast.add({
      color: "red",
      title: error.message,
    });
  }
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
          :popper="{ placement: 'bottom-start', arrow: true }"
        >
          <UAvatar size="md" :alt="user.email" />
          <template #account="{ item }">
            <div class="truncate text-left">
              <p>Signed in as</p>
              <p class="truncate font-medium">
                {{ item.label }}
              </p>
            </div>
          </template>
        </UDropdown>
      </ul>
    </nav>
  </header>
</template>
