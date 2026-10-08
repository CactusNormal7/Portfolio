<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

useHead({
  title: `${is404.value ? 'Page not found' : 'Error'} — Jules Besson`,
  meta: [{ name: 'robots', content: 'noindex' }]
})

function goHome () {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main class="error">
    <header class="error__header">
      <button type="button" class="error__logo" aria-label="Jules Besson — home" @click="goHome">
        JB<sup>®</sup>
      </button>
      <ThemeToggle />
    </header>

    <section class="error__body" aria-labelledby="error-title">
      <p class="mono error__kicker mask-line" style="--mask-delay: 0.1s">
        <span>Error — {{ error.statusCode }}</span>
      </p>
      <h1 id="error-title" class="error__title">
        <span class="mask-line" style="--mask-delay: 0.2s"><span>{{ is404 ? 'Lost' : 'Broken' }}</span></span>
        <span class="mask-line error__outline" style="--mask-delay: 0.35s"><span>page.</span></span>
      </h1>
      <p class="mask-line error__text" style="--mask-delay: 0.55s">
        <span>{{ is404 ? "This page doesn't exist — or doesn't anymore." : 'Something went wrong on my side. Please try again.' }}</span>
      </p>
      <div class="mask-line error__cta" style="--mask-delay: 0.7s">
        <span>
          <button type="button" class="btn" @click="goHome">
            <span>Back to home</span>
            <span aria-hidden="true">→</span>
          </button>
        </span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.error {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.error__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem var(--gutter);
  border-bottom: 1px solid var(--line);
}

.error__logo {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}

.error__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: clamp(2rem, 6vh, 5rem) var(--gutter);
}

.error__kicker {
  color: var(--grey-dark);
}

.error__title {
  font-size: clamp(4rem, 15vw, 13rem);
  line-height: 0.92;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.error__outline > span {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
}

/* padding keeps the button focus ring from being clipped by the mask */
.error__cta {
  padding: 6px;
  margin: -6px;
}

.error__text {
  max-width: 34ch;
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  color: var(--grey-dark);
}
</style>
