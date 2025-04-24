<script setup>
// { RouterLink, RouterView } from "vue-router";
import Header from './layouts/Header.vue'
import Footer from './layouts/Footer.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Header />

    <main class="flex-grow-1">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>
