<script setup>
// { RouterLink, RouterView } from "vue-router";
import Header from './layouts/Header.vue'
import Footer from './layouts/Footer.vue'
</script>

<template>
  <div class="app-container d-flex flex-column min-vh-100">
    <Header />
    <main class="flex-grow-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
/* 全站最外層保險網 */
.app-container {
  overflow-x: hidden;
  max-width: 100vw;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
</style>