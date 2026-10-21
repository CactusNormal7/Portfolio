<script setup lang="ts">
import { gallery } from '~/data/gallery'
import { fables } from '~/data/fables'

definePageMeta({ pageTransition: { name: 'page', mode: 'out-in' } })

/* ============ FABLE SELECTION (?fable=slug, shareable) ============ */
const route = useRoute()
const fable = computed(() => fables.find(f => f.slug === route.query.fable) ?? fables[0]!)
const fableIndex = computed(() => fables.indexOf(fable.value))
const prevFable = computed(() => fables[fableIndex.value - 1])
const nextFable = computed(() => fables[fableIndex.value + 1])

useSeoMeta({
  title: () => `${fable.value.title.join(' ')} — Jules Besson`,
  description: 'Tech fables in the style of La Fontaine, annotated — plus a few photos from off the clock.',
  ogTitle: () => `${fable.value.title.join(' ')} — Jules Besson`,
  ogType: 'article'
})

/* ============ ANNOTATIONS (shown only on click) ============ */
const activeNote = ref<string | null>(null)
const note = computed(() => (activeNote.value ? fable.value.notes[activeNote.value] : undefined))
const colRef = ref<HTMLElement | null>(null)
// vertical offset of the clicked line, so the desktop panel lines up with it (Genius-style)
const panelOffset = ref(0)

function toggleNote (id: string, e: MouseEvent) {
  if (activeNote.value === id) {
    closeNote()
    return
  }
  activeNote.value = id
  if (colRef.value) {
    const lineTop = (e.currentTarget as HTMLElement).getBoundingClientRect().top
    panelOffset.value = Math.max(0, lineTop - colRef.value.getBoundingClientRect().top)
  }
}

function closeNote () {
  activeNote.value = null
}

watch(() => fable.value.slug, closeNote)

function onKeydown (e: KeyboardEvent) {
  // the photo lightbox handles Escape itself
  if (e.key === 'Escape' && activeNote.value && !dialogRef.value?.open) closeNote()
}

const pad = (n: number) => String(n).padStart(2, '0')
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

/* ============ GALLERY + LIGHTBOX ============ */
// In dev, empty photo slots are shown so you can see where pictures will go.
const showPlaceholders = import.meta.dev && gallery.length === 0

const dialogRef = ref<HTMLDialogElement | null>(null)
const currentIndex = ref(0)
const current = computed(() => gallery[currentIndex.value])

function openPhoto (index: number) {
  currentIndex.value = index
  dialogRef.value?.showModal()
}

function closePhoto () {
  dialogRef.value?.close()
}

function step (delta: number) {
  currentIndex.value = (currentIndex.value + delta + gallery.length) % gallery.length
}

function onDialogKeydown (e: KeyboardEvent) {
  if (gallery.length < 2) return
  if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

// a click that lands on the dialog itself (not on the photo or a button) is a backdrop click
function onDialogClick (e: MouseEvent) {
  if (e.target === dialogRef.value) closePhoto()
}


onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

const year = new Date().getFullYear()
</script>

<template>
  <div class="page">
    <a href="#main" class="skip-link">Skip to content</a>

    <header class="header">
      <NuxtLink to="/" class="header__logo" aria-label="Jules Besson — home">JB<sup>®</sup></NuxtLink>
      <NuxtLink to="/" class="header__back mono">
        <span aria-hidden="true">←</span> Back to portfolio
      </NuxtLink>
      <ThemeToggle />
    </header>

    <main id="main" tabindex="-1">
      <!-- ============ INTRO ============ -->
      <section class="intro" aria-labelledby="page-title">
        <p class="mono intro__kicker mask-line" style="--mask-delay: 0.1s">
          <span>Jules Besson — after hours</span>
        </p>
        <h1 id="page-title" class="intro__title">
          <span class="mask-line" style="--mask-delay: 0.2s"><span>Off the</span></span>
          <span class="mask-line intro__outline" style="--mask-delay: 0.35s"><span>clock.</span></span>
        </h1>
        <p class="intro__sub mask-line" style="--mask-delay: 0.55s">
          <span>Tech fables in the style of La Fontaine — pick one, then click any highlighted line to read the story behind it.</span>
        </p>
      </section>

      <!-- ============ FABLES ============ -->
      <section id="fable" class="fables" aria-labelledby="fables-title">
        <div v-reveal class="section-head">
          <span class="section-index">01</span>
          <h2 id="fables-title" class="mono">
            Fables
          </h2>
          <span class="section-count mono">({{ fables.length }})</span>
        </div>

        <nav class="picker" aria-label="Choose a fable">
          <ul class="picker__list">
            <li v-for="(f, i) in fables" :key="f.slug" v-reveal="i * 70">
              <NuxtLink
                :to="{ query: { fable: f.slug } }"
                replace
                class="picker__item"
                :class="{ 'is-active': f.slug === fable.slug }"
                :aria-current="f.slug === fable.slug ? 'page' : undefined"
              >
                <span class="mono picker__num">{{ pad(i + 1) }}</span>
                <span class="picker__title" lang="fr">{{ f.title.join(' ') }}</span>
                <span class="mono picker__topic">{{ f.topic }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <Transition name="fable" mode="out-in">
          <article :key="fable.slug" class="fable" lang="fr" aria-labelledby="fable-title">
            <header class="fable__head">
              <p class="mono fable__kicker">
                Fable {{ pad(fableIndex + 1) }} — d’après « {{ fable.original }} »
              </p>
              <h2 id="fable-title" class="fable__title">
                <span>{{ fable.title[0] }}</span>
                <span class="fable__outline">{{ fable.title[1] }}</span>
              </h2>
              <p class="fable__intro">
                {{ fable.intro }}
              </p>
            </header>

            <div class="poem">
              <div class="poem__body">
                <div
                  v-for="(stanza, i) in fable.stanzas"
                  :key="i"
                  v-reveal="60"
                  class="stanza"
                >
                  <span class="stanza__num mono" aria-hidden="true">{{ ROMAN[i] }}.</span>
                  <p class="stanza__lines">
                    <template v-for="(line, j) in stanza" :key="j">
                      <button
                        v-if="line.note"
                        type="button"
                        class="annot"
                        :class="{ 'is-active': activeNote === line.note }"
                        :aria-expanded="activeNote === line.note"
                        aria-controls="annot-panel"
                        @click="toggleNote(line.note, $event)"
                      >
                        {{ line.text }}
                      </button>
                      <template v-else>
                        {{ line.text }}
                      </template>
                      <br v-if="j < stanza.length - 1">
                    </template>
                  </p>
                </div>

                <aside v-reveal class="moral" aria-label="Moralité">
                  <p class="moral__label mono">
                    Moralité
                  </p>
                  <p class="moral__lines">
                    <template v-for="(line, j) in fable.moral" :key="j">
                      <button
                        v-if="line.note"
                        type="button"
                        class="annot annot--on-ink"
                        :class="{ 'is-active': activeNote === line.note }"
                        :aria-expanded="activeNote === line.note"
                        aria-controls="annot-panel"
                        @click="toggleNote(line.note, $event)"
                      >
                        {{ line.text }}
                      </button>
                      <template v-else>
                        {{ line.text }}
                      </template>
                      <br v-if="j < fable.moral.length - 1">
                    </template>
                  </p>
                </aside>
              </div>

              <!-- annotation: lines up with the clicked line on desktop, bottom sheet on mobile -->
              <div ref="colRef" class="annot-col">
                <div
                  id="annot-panel"
                  class="annot-anchor"
                  :style="{ '--offset': `${panelOffset}px` }"
                  aria-live="polite"
                >
                  <Transition name="panel" mode="out-in">
                    <div v-if="note" :key="activeNote ?? ''" class="annot-panel">
                      <div class="annot-panel__top">
                        <span class="mono annot-panel__label">Annotation</span>
                        <button type="button" class="mono annot-panel__close" @click="closeNote">
                          Fermer <span aria-hidden="true">✕</span>
                        </button>
                      </div>
                      <p class="annot-panel__quote">
                        «&nbsp;{{ note.quote }}&nbsp;»
                      </p>
                      <p v-for="(paragraph, k) in note.body" :key="k" class="annot-panel__text">
                        {{ paragraph }}
                      </p>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <nav class="pager" aria-label="Other fables">
              <NuxtLink
                v-if="prevFable"
                :to="{ query: { fable: prevFable.slug }, hash: '#fable' }"
                replace
                class="pager__link"
              >
                <span class="mono pager__dir">← Fable précédente</span>
                <span class="pager__title">{{ prevFable.title.join(' ') }}</span>
              </NuxtLink>
              <NuxtLink
                v-if="nextFable"
                :to="{ query: { fable: nextFable.slug }, hash: '#fable' }"
                replace
                class="pager__link pager__link--next"
              >
                <span class="mono pager__dir">Fable suivante →</span>
                <span class="pager__title">{{ nextFable.title.join(' ') }}</span>
              </NuxtLink>
            </nav>
          </article>
        </Transition>
      </section>

      <!-- ============ GALLERY ============ -->
      <section v-if="gallery.length || showPlaceholders" class="gallery" aria-labelledby="gallery-title">
        <div v-reveal class="section-head">
          <span class="section-index">02</span>
          <h2 id="gallery-title" class="mono">
            Photos
          </h2>
          <span v-if="gallery.length" class="section-count mono">({{ gallery.length }})</span>
        </div>

        <ul v-if="gallery.length" class="gallery__grid">
          <li
            v-for="(item, i) in gallery"
            :key="item.src"
            v-reveal="(i % 4) * 80"
            class="gallery__item"
            :class="item.size && `gallery__item--${item.size}`"
          >
            <button
              type="button"
              class="gallery__btn"
              :aria-label="`Enlarge photo: ${item.alt}`"
              @click="openPhoto(i)"
            >
              <img :src="item.src" :alt="item.alt" loading="lazy" decoding="async">
              <span v-if="item.caption" class="gallery__caption mono" aria-hidden="true">{{ item.caption }}</span>
            </button>
          </li>
        </ul>

        <ul v-else class="gallery__grid" aria-hidden="true">
          <li class="gallery__item gallery__item--wide gallery__placeholder mono">
            Dev only — add photos to public/gallery/
          </li>
          <li class="gallery__item gallery__placeholder mono">
            then list them in app/data/gallery.ts
          </li>
          <li class="gallery__item gallery__placeholder mono">
            this box is hidden in production
          </li>
        </ul>
      </section>

      <dialog
        v-if="gallery.length"
        ref="dialogRef"
        class="lightbox"
        aria-label="Photo viewer"
        @keydown="onDialogKeydown"
        @click="onDialogClick"
      >
        <div class="lightbox__bar">
          <span class="mono lightbox__count">{{ pad(currentIndex + 1) }} / {{ pad(gallery.length) }}</span>
          <button type="button" class="mono lightbox__btn" @click="closePhoto">
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>

        <figure v-if="current" class="lightbox__figure">
          <img :key="current.src" :src="current.src" :alt="current.alt" class="lightbox__img">
          <figcaption v-if="current.caption" class="mono lightbox__caption">
            {{ current.caption }}
          </figcaption>
        </figure>

        <div v-if="gallery.length > 1" class="lightbox__bar">
          <button type="button" class="mono lightbox__btn" @click="step(-1)">
            <span aria-hidden="true">←</span> Previous
          </button>
          <button type="button" class="mono lightbox__btn" @click="step(1)">
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </dialog>
    </main>

    <footer class="footer">
      <span class="mono">© {{ year }} Jules Besson</span>
      <NuxtLink to="/" class="mono">← Back to portfolio</NuxtLink>
      <NuxtLink to="/#contact" class="mono">Get in touch →</NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
main:focus {
  outline: none;
}

/* ============ HEADER ============ */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem var(--gutter);
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}

.header__logo {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}

.header__back {
  padding: 0.2rem 0;
  margin-right: auto;
  margin-left: clamp(1rem, 4vw, 3rem);
  color: var(--grey-dark);
  transition: color 0.2s;
}

.header__back:hover {
  color: var(--ink);
}

/* ============ INTRO ============ */
.intro {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4vh, 2.5rem);
  padding: clamp(3rem, 10vh, 7rem) var(--gutter) clamp(2.5rem, 7vh, 5rem);
}

.intro__kicker {
  color: var(--grey-dark);
}

.intro__title {
  font-size: clamp(3.5rem, 13vw, 12rem);
  line-height: 0.92;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.intro__outline > span {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
}

.intro__sub {
  max-width: 44ch;
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  line-height: 1.45;
  color: var(--grey-dark);
}

/* ============ PICKER ============ */
.picker__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  border-top: 1px solid var(--line-soft);
}

.picker__list li + li .picker__item {
  border-left: 1px solid var(--line-soft);
}

.picker__item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  height: 100%;
  padding: 1.4rem var(--gutter) 1.6rem;
  transition:
    background 0.3s var(--ease-out),
    color 0.3s var(--ease-out);
}

/* active bar grows in from the left */
.picker__item::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s var(--ease-out);
}

.picker__item:hover {
  background: var(--bg-soft);
}

.picker__item.is-active::after {
  transform: scaleX(1);
}

.picker__item:focus-visible {
  outline-offset: -4px;
}

.picker__num,
.picker__topic {
  color: var(--grey);
}

.picker__title {
  font-size: clamp(1.1rem, 1.6vw, 1.35rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.picker__item.is-active .picker__num {
  color: var(--ink);
}

/* ============ FABLE ============ */
.fable {
  border-top: 1px solid var(--line);
}

.fable__head {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(2.5rem, 7vh, 5rem) var(--gutter) 0;
}

.fable__kicker {
  color: var(--grey);
}

.fable__title {
  display: flex;
  flex-direction: column;
  font-size: clamp(2.6rem, 8vw, 7rem);
  line-height: 0.95;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.fable__outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
}

.fable__intro {
  max-width: 52ch;
  font-size: clamp(1rem, 1.4vw, 1.2rem);
  line-height: 1.5;
  color: var(--grey-dark);
}

.fable-enter-active,
.fable-leave-active {
  transition:
    opacity 0.3s var(--ease-out),
    transform 0.3s var(--ease-out);
}

.fable-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fable-leave-to {
  opacity: 0;
}

/* ============ POEM ============ */
.poem {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 6rem);
  padding: clamp(2rem, 6vh, 4rem) var(--gutter) clamp(2.5rem, 7vh, 4rem);
}

.stanza {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  column-gap: 1rem;
  padding: clamp(1.25rem, 3vh, 2rem) 0;
  border-top: 1px solid var(--line-soft);
}

.stanza:first-child {
  border-top: none;
  padding-top: 0;
}

.stanza__num {
  color: var(--grey);
  padding-top: 0.5rem;
}

.stanza__lines {
  font-size: clamp(1.15rem, 1.9vw, 1.55rem);
  line-height: 1.6;
  letter-spacing: -0.01em;
}

/* ---- clickable annotated lines (Genius-style highlight) ---- */
.annot {
  display: inline;
  text-align: left;
  padding: 0 0.15em;
  margin: 0 -0.15em;
  background: color-mix(in srgb, var(--ink) 9%, transparent);
  cursor: pointer;
  transition:
    background 0.25s var(--ease-out),
    color 0.25s var(--ease-out);
}

.annot:hover {
  background: color-mix(in srgb, var(--ink) 18%, transparent);
}

.annot.is-active {
  background: var(--ink);
  color: var(--bg);
}

.annot--on-ink {
  background: color-mix(in srgb, var(--bg) 16%, transparent);
}

.annot--on-ink:hover {
  background: color-mix(in srgb, var(--bg) 28%, transparent);
}

.annot--on-ink.is-active {
  background: var(--bg);
  color: var(--ink);
}

.annot--on-ink:focus-visible {
  outline-color: var(--bg);
}

/* ---- moral ---- */
.moral {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: clamp(1.5rem, 4vh, 2.5rem);
  padding: clamp(2rem, 5vw, 3.5rem);
  background: var(--ink);
  color: var(--bg);
}

.moral__label {
  color: var(--on-ink-muted);
}

.moral__lines {
  font-size: clamp(1.3rem, 2.4vw, 2rem);
  line-height: 1.45;
  font-weight: 500;
  letter-spacing: -0.02em;
}

/* wipe in from the left instead of the default slide-up */
.moral.reveal {
  transform: none;
  clip-path: inset(0 100% 0 0);
  transition:
    opacity 0.9s var(--ease-out),
    clip-path 1.1s var(--ease-out);
}

.moral.reveal.is-visible {
  clip-path: inset(0 0 0 0);
}

/* ---- annotation panel ---- */
.annot-col {
  position: relative;
}

/* sits level with the clicked line, then sticks while scrolling */
.annot-anchor {
  position: sticky;
  top: calc(var(--header-h) + 1.5rem);
  margin-top: var(--offset, 0);
  transition: margin-top 0.45s var(--ease-out);
}

.annot-panel {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: clamp(1.4rem, 2.5vw, 2rem);
  border: 1px solid var(--line);
  border-left-width: 4px;
  background: var(--bg);
}

.annot-panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.annot-panel__label {
  color: var(--grey);
}

.annot-panel__close {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--line-soft);
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.annot-panel__close:hover {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--bg);
}

.annot-panel__quote {
  font-size: clamp(1.1rem, 1.6vw, 1.35rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.annot-panel__text {
  color: var(--grey-dark);
  line-height: 1.6;
}

.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.25s var(--ease-out),
    transform 0.25s var(--ease-out);
}

.panel-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.panel-leave-to {
  opacity: 0;
}

/* ============ PAGER ============ */
.pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--line-soft);
}

.pager__link {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.6rem var(--gutter);
  transition:
    background 0.3s var(--ease-out),
    color 0.3s var(--ease-out);
}

.pager__link--next {
  grid-column: 2;
  align-items: flex-end;
  text-align: right;
  border-left: 1px solid var(--line-soft);
}

.pager__link:hover {
  background: var(--ink);
  color: var(--bg);
}

.pager__dir {
  color: var(--grey);
}

.pager__link:hover .pager__dir {
  color: var(--on-ink-muted);
}

.pager__title {
  font-size: clamp(1.1rem, 1.8vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.pager__link:focus-visible {
  outline-offset: -4px;
}

/* ============ GALLERY ============ */
.gallery {
  padding-bottom: clamp(3rem, 8vh, 7rem);
}

.gallery__grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
  grid-auto-rows: clamp(14rem, 24vw, 20rem);
  grid-auto-flow: dense;
  gap: clamp(0.5rem, 1vw, 1rem);
  padding: clamp(1.5rem, 4vh, 2.5rem) var(--gutter) 0;
}

@media (min-width: 640px) {
  .gallery__item--wide {
    grid-column: span 2;
  }

  .gallery__item--tall {
    grid-row: span 2;
  }
}

.gallery__btn {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-soft);
  cursor: zoom-in;
}

.gallery__btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1);
  transition:
    filter 0.6s var(--ease-out),
    transform 0.9s var(--ease-out);
}

.gallery__btn:hover img,
.gallery__btn:focus-visible img {
  filter: grayscale(0);
  transform: scale(1.05);
}

.gallery__btn:focus-visible {
  outline-offset: -4px;
}

.gallery__caption {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0.6rem 0.9rem;
  background: var(--ink);
  color: var(--bg);
  transform: translateY(101%);
  transition: transform 0.45s var(--ease-out);
}

.gallery__btn:hover .gallery__caption,
.gallery__btn:focus-visible .gallery__caption {
  transform: none;
}

/* touch screens: no hover, so show photos in colour with their caption */
@media (hover: none) {
  .gallery__btn img {
    filter: none;
  }

  .gallery__caption {
    transform: none;
  }
}

.gallery__placeholder {
  display: grid;
  place-items: center;
  padding: 1.5rem;
  text-align: center;
  border: 1px dashed var(--grey);
  color: var(--grey);
}

/* ============ LIGHTBOX ============ */
.lightbox {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: clamp(1rem, 3vw, 2rem) var(--gutter);
  border: none;
  background: color-mix(in srgb, var(--bg) 96%, transparent);
  color: var(--ink);
}

.lightbox[open] {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 1rem;
  animation: lightbox-in 0.35s var(--ease-out);
}

.lightbox::backdrop {
  background: transparent;
}

@keyframes lightbox-in {
  from {
    opacity: 0;
  }
}

@keyframes photo-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
}

.lightbox__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.lightbox__count {
  color: var(--grey);
}

.lightbox__btn {
  padding: 0.6rem 1rem;
  border: 1px solid var(--line);
  transition:
    background 0.2s var(--ease-out),
    color 0.2s var(--ease-out);
}

.lightbox__btn:hover {
  background: var(--ink);
  color: var(--bg);
}

.lightbox__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  min-height: 0;
}

.lightbox__img {
  max-width: 100%;
  max-height: 100%;
  min-height: 0;
  object-fit: contain;
  animation: photo-in 0.45s var(--ease-out);
}

.lightbox__caption {
  color: var(--grey-dark);
}

/* ============ FOOTER ============ */
.footer {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.4rem var(--gutter);
  border-top: 1px solid var(--line);
  color: var(--grey-dark);
}

.footer a:hover {
  color: var(--ink);
}

/* ============ MOTION ============ */
@media (prefers-reduced-motion: reduce) {
  .moral.reveal {
    clip-path: none;
    transition: none;
  }

  .annot,
  .annot-anchor,
  .picker__item::after,
  .gallery__btn img,
  .gallery__caption,
  .fable-enter-active,
  .fable-leave-active,
  .panel-enter-active,
  .panel-leave-active {
    transition: none;
  }

  .gallery__btn:hover img,
  .gallery__btn:focus-visible img {
    transform: none;
  }

  .lightbox[open],
  .lightbox__img {
    animation: none;
  }
}

/* ============ RESPONSIVE ============ */
@media (max-width: 800px) {
  .poem {
    grid-template-columns: 1fr;
  }

  .stanza {
    grid-template-columns: 2.25rem minmax(0, 1fr);
  }

  .picker__list li + li .picker__item {
    border-left: none;
    border-top: 1px solid var(--line-soft);
  }

  .picker__item {
    flex-direction: row;
    align-items: baseline;
    gap: 1rem;
    padding: 1rem var(--gutter);
  }

  .picker__topic {
    margin-left: auto;
  }

  /* the opened annotation becomes a bottom sheet, out of the flow so the poem never jumps */
  .annot-col {
    display: contents;
  }

  .annot-anchor {
    position: fixed;
    inset: auto 0 0;
    z-index: 30;
    margin-top: 0;
  }

  .annot-panel {
    max-height: 65svh;
    overflow-y: auto;
    border-width: 4px 0 0;
    box-shadow: 0 -12px 40px rgb(0 0 0 / 0.18);
  }

  .panel-enter-from,
  .panel-leave-to {
    opacity: 1;
    transform: translateY(100%);
  }

  .panel-enter-active,
  .panel-leave-active {
    transition: transform 0.35s var(--ease-out);
  }

  .pager {
    grid-template-columns: 1fr;
  }

  .pager__link--next {
    grid-column: 1;
    border-left: none;
    border-top: 1px solid var(--line-soft);
  }
}

@media (max-width: 480px) {
  .header__back {
    margin-left: 0;
  }
}
</style>
