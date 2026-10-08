<template>
  <div>
    <!-- thin bar at the top during client-side navigation -->
    <NuxtLoadingIndicator color="var(--ink)" :height="2" />
    <NuxtRouteAnnouncer />
    <!-- @nuxtjs/svg-sprite registers a layout, so pages must render through NuxtLayout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
