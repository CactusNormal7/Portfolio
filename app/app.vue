<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- @nuxtjs/svg-sprite registers a layout, so pages must render through NuxtLayout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
