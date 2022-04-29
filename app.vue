<template>
  <div class="container max-w-xl mx-auto px-4 pt-32">
    <NuxtPage />

    <hr class="mt-24" />
    <PokyLogo class="w-64 mx-auto" />
  </div>
</template>

<script lang="ts" setup>
  import 'charts.css'
  import PokyLogo from '~/components/poky-logo.vue'
</script>
