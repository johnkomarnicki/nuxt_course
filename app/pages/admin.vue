<script setup lang="ts">
const user = useCookie("user");
</script>

<template>
  <main>
    <section class="container py-20">
      <h1 class="text-3xl mb-6 text-balance">
        Welcome back, {{ user }}
      </h1>
    </section>
  </main>
</template>
