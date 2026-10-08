<script setup lang="ts">
// The current theme lives on <html data-theme>, set before paint by the
// inline head script (nuxt.config). Labels are toggled in pure CSS to keep
// SSR output identical in both modes.
function toggle () {
  const root = document.documentElement
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
  root.dataset.theme = next
  localStorage.setItem('theme', next)
}
</script>

<template>
  <button type="button" class="theme-toggle" @click="toggle">
    <span class="visually-hidden">Switch to </span>
    <span class="theme-toggle__to-dark">Dark<span class="visually-hidden"> mode</span><span aria-hidden="true"> ●</span></span>
    <span class="theme-toggle__to-light">Light<span class="visually-hidden"> mode</span><span aria-hidden="true"> ○</span></span>
  </button>
</template>
