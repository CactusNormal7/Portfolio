<script setup lang="ts">
import { gallery } from '~/data/gallery'

definePageMeta({ pageTransition: { name: 'page', mode: 'out-in' } })

useSeoMeta({
  title: 'Off the clock — Jules Besson',
  description: 'La CI et la CD — a DevOps fable, annotated. Plus a few photos from off the clock.',
  ogTitle: 'Off the clock — Jules Besson',
  ogType: 'article'
})

/* ============ POEM + ANNOTATIONS ============ */
// Genius-style: a line with a `note` is highlighted; hovering / focusing / tapping it
// shows that note. Lines sharing a note id highlight together.
// \u00A0 = non-breaking space, keeps French punctuation (« » : ; ?) glued to its word.

interface Line { text: string, note?: NoteId }

const NOTES = {
  intro: {
    quote: 'La CI et la CD',
    body: [
      'Un pastiche de « La Cigale et la Fourmi » de La Fontaine, transposé dans le monde du développement : la CI (intégration continue) joue la fourmi prudente, la CD (déploiement continu) la cigale insouciante.',
      'Survole un passage surligné pour lire son explication — ou touche-le sur mobile.'
    ]
  },
  ci: {
    quote: 'La CI, vive ouvrière',
    body: [
      'Comme la fourmi de La Fontaine, la CI est la travailleuse infatigable.',
      'L’intégration continue, c’est le robot qui, à chaque modification envoyée sur le dépôt, récupère le code, l’installe et lance toutes les vérifications — GitHub Actions, GitLab CI, Jenkins…'
    ]
  },
  matin: {
    quote: 'Chaque matin vérifiait',
    body: [
      'Beaucoup d’équipes programment un « nightly build » : une compilation complète lancée chaque nuit ou chaque matin, en plus des vérifications déclenchées à chaque push.',
      'Si quelque chose a cassé la veille, on le sait en arrivant.'
    ]
  },
  compile: {
    quote: 'Sans erreur se compilait',
    body: [
      'Première étape d’un pipeline : est-ce que ça compile ? Lint, vérification des types, build.',
      'Si l’étape échoue, le pipeline passe au rouge et la fusion du code est bloquée — c’est tout l’intérêt.'
    ]
  },
  cd: {
    quote: 'La CD, plus aventureuse',
    body: [
      'La CD prend le relais : livrer automatiquement ce qui a passé la CI.',
      'Nuance : en « Continuous Delivery », la version est prête et un humain appuie sur le bouton ; en « Continuous Deployment », elle part en production toute seule. Notre CD, « aventureuse », est clairement de la seconde école.'
    ]
  },
  clients: {
    quote: 'Chez les clients empressés',
    body: [
      'La pression du métier : utilisateurs et équipe produit veulent les nouveautés, vite.',
      'C’est précisément cette impatience qui pousse à brûler les étapes.'
    ]
  },
  paquets: {
    quote: 'Tes paquets sont-ils bien sûrs ?',
    body: [
      'Les « paquets », ce sont les artefacts livrés et les dépendances qu’ils embarquent (npm, images Docker…).',
      'Sont-ils sûrs ? Versions verrouillées, failles connues (npm audit), artefact construit depuis le bon commit… Une seule dépendance vérolée suffit à compromettre toute la chaîne.'
    ]
  },
  test: {
    quote: 'Un test manquant, une misère',
    body: [
      'Il suffit d’un seul chemin de code non testé pour qu’une régression passe entre les mailles.',
      'Le succès d’un déploiement non vérifié dure souvent… jusqu’au premier utilisateur qui tombe sur le bug.'
    ]
  },
  lanca: {
    quote: 'Lança tout sans plus tarder',
    body: [
      'Déployer sans attendre la fin du pipeline, contourner les vérifications avec un « --no-verify », ou mettre en prod un vendredi à 18 h : le grand classique des histoires d’horreur de développeurs.'
    ]
  },
  panne: {
    quote: 'Le serveur perdit la face',
    body: [
      'La panne : erreurs 500, page blanche, base de données qui ne répond plus.',
      'Dans le jargon, on « ouvre un incident » — et toute l’équipe lâche ce qu’elle faisait.'
    ]
  },
  crier: {
    quote: 'Les usagers, de crier',
    body: [
      'Tournure chère à La Fontaine : l’infinitif de narration. « Les usagers de crier » = les usagers se mirent à crier.',
      'Côté technique : tickets au support, messages furieux sur les réseaux, et le téléphone d’astreinte qui sonne.'
    ]
  },
  preuve: {
    quote: 'Qui court sans preuve et sans lumière',
    body: [
      'La « preuve », ce sont les tests : ils démontrent que le code fait ce qu’on attend de lui.',
      'La « lumière », c’est l’observabilité — logs, métriques, alertes — pour voir ce qui se passe réellement en production.',
      'Le vers fait aussi écho au « Rien ne sert de courir » du Lièvre et la Tortue.'
    ]
  },
  nuits: {
    quote: 'Épargne bien des nuits blanches',
    body: [
      'Les nuits blanches, ce sont les astreintes : rollback à 3 h du matin, correctif en urgence (« hotfix »).',
      'Écrire et lancer des tests coûte un peu de temps à chaque livraison, mais en fait gagner énormément le jour où ça casse.'
    ]
  },
  planche: {
    quote: 'Que déployer sur une planche',
    body: [
      '« Construire et vérifier » résume la CI : build, puis tests.',
      'Déployer « sur une planche », c’est livrer sur une base bancale plutôt que sur des fondations solides — une planche pourrie, ou savonnée.'
    ]
  }
} satisfies Record<string, { quote: string, body: string[] }>

type NoteId = keyof typeof NOTES

const stanzas: Line[][] = [
  [
    { text: 'La CI, vive ouvrière,', note: 'ci' },
    { text: 'Chaque matin vérifiait', note: 'matin' },
    { text: 'Que le code, en bonne manière,', note: 'compile' },
    { text: 'Sans erreur se compilait.', note: 'compile' }
  ],
  [
    { text: 'La CD, plus aventureuse,', note: 'cd' },
    { text: 'Promettait de déployer', note: 'cd' },
    { text: 'La version, fière et joyeuse,' },
    { text: 'Chez les clients empressés.', note: 'clients' }
  ],
  [
    { text: '«\u00A0Attends\u00A0», disait la première,' },
    { text: '«\u00A0Tes paquets sont-ils bien sûrs\u00A0?', note: 'paquets' },
    { text: 'Un test manquant, une misère,', note: 'test' },
    { text: 'Et tes succès seront courts.\u00A0»', note: 'test' }
  ],
  [
    { text: 'Mais CD, pleine d’audace,' },
    { text: 'Lança tout sans plus tarder\u00A0;', note: 'lanca' },
    { text: 'Le serveur perdit la face,', note: 'panne' },
    { text: 'Les usagers, de crier.', note: 'crier' }
  ],
  [
    { text: 'Le soir, humble et moins légère,' },
    { text: 'Elle revint vers sa sœur\u00A0:' },
    { text: '«\u00A0Qui court sans preuve et sans lumière', note: 'preuve' },
    { text: 'Met son produit en erreur.\u00A0»', note: 'preuve' }
  ]
]

const moral: Line[] = [
  { text: 'Qui teste avant de livrer', note: 'nuits' },
  { text: 'Épargne bien des nuits blanches\u00A0;', note: 'nuits' },
  { text: 'Mieux vaut construire et vérifier', note: 'planche' },
  { text: 'Que déployer sur une planche.', note: 'planche' }
]

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

// null = nothing selected → the panel shows the intro note
const activeNote = ref<NoteId | null>(null)
const shownNote = computed(() => NOTES[activeNote.value ?? 'intro'])

function showNote (id: NoteId) {
  activeNote.value = id
}

function closeNote () {
  activeNote.value = null
}

function onKeydown (e: KeyboardEvent) {
  // don't fight the photo lightbox, which handles Escape itself
  if (e.key === 'Escape' && activeNote.value && !dialogRef.value?.open) closeNote()
}

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

const pad = (n: number) => String(n).padStart(2, '0')

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
          <span>Off the clock</span>
        </p>
        <h1 id="page-title" class="intro__title" lang="fr">
          <span class="mask-line" style="--mask-delay: 0.2s"><span>La CI</span></span>
          <span class="mask-line intro__outline" style="--mask-delay: 0.35s"><span>et la CD</span></span>
        </h1>
        <p class="intro__sub mask-line" style="--mask-delay: 0.55s">
          <span>A DevOps fable in the style of La Fontaine — annotated, Genius-style.</span>
        </p>
        <!-- mobile only: on desktop this text lives in the annotation panel -->
        <div class="intro__hint" lang="fr">
          <p v-for="(paragraph, k) in NOTES.intro.body" :key="k">
            {{ paragraph }}
          </p>
        </div>
      </section>

      <!-- ============ POEM ============ -->
      <article class="poem" lang="fr" aria-labelledby="page-title">
        <div class="poem__body">
          <div
            v-for="(stanza, i) in stanzas"
            :key="i"
            v-reveal="80"
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
                  @mouseenter="showNote(line.note)"
                  @focus="showNote(line.note)"
                  @click="showNote(line.note)"
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
              <template v-for="(line, j) in moral" :key="j">
                <button
                  v-if="line.note"
                  type="button"
                  class="annot annot--on-ink"
                  :class="{ 'is-active': activeNote === line.note }"
                  :aria-expanded="activeNote === line.note"
                  aria-controls="annot-panel"
                  @mouseenter="showNote(line.note)"
                  @focus="showNote(line.note)"
                  @click="showNote(line.note)"
                >
                  {{ line.text }}
                </button>
                <br v-if="j < moral.length - 1">
              </template>
            </p>
          </aside>
        </div>

        <!-- annotation panel: sticky column on desktop, bottom sheet on mobile -->
        <div class="annot-col">
          <div
            id="annot-panel"
            class="annot-panel"
            :class="{ 'has-note': activeNote }"
            aria-live="polite"
          >
            <div class="annot-panel__top">
              <span class="mono annot-panel__label">{{ activeNote ? 'Annotation' : 'À propos' }}</span>
              <button
                v-if="activeNote"
                type="button"
                class="mono annot-panel__close"
                @click="closeNote"
              >
                Fermer <span aria-hidden="true">✕</span>
              </button>
            </div>
            <Transition name="note" mode="out-in">
              <div :key="activeNote ?? 'intro'" class="annot-panel__content">
                <p class="annot-panel__quote">
                  «&nbsp;{{ shownNote.quote }}&nbsp;»
                </p>
                <p v-for="(paragraph, k) in shownNote.body" :key="k" class="annot-panel__text">
                  {{ paragraph }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </article>

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
  position: relative;
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
  border-bottom: 1px solid var(--line);
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

.intro__hint {
  display: none;
  flex-direction: column;
  gap: 0.6rem;
  max-width: 50ch;
  padding-left: 1rem;
  border-left: 4px solid var(--ink);
  color: var(--grey-dark);
}

.intro__sub {
  max-width: 36ch;
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  line-height: 1.45;
  color: var(--grey-dark);
}

/* ============ POEM ============ */
.poem {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 6rem);
  padding: clamp(2.5rem, 7vh, 5rem) var(--gutter) clamp(3rem, 8vh, 6rem);
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
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  line-height: 1.6;
  letter-spacing: -0.01em;
}

/* ---- annotated fragments (Genius-style highlight) ---- */
.annot {
  display: inline;
  text-align: left;
  padding: 0 0.15em;
  margin: 0 -0.15em;
  background: color-mix(in srgb, var(--ink) 9%, transparent);
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  cursor: help;
  transition:
    background 0.25s var(--ease-out),
    color 0.25s var(--ease-out);
}

.annot:hover,
.annot.is-active {
  background: var(--ink);
  color: var(--bg);
}

.annot--on-ink {
  background: color-mix(in srgb, var(--bg) 16%, transparent);
}

.annot--on-ink:hover,
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
  font-size: clamp(1.4rem, 2.6vw, 2.2rem);
  line-height: 1.4;
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

.annot-panel {
  position: sticky;
  top: calc(var(--header-h) + 2rem);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border: 1px solid var(--line);
  border-left-width: 4px;
  background: var(--bg);
}

.annot-panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 2rem;
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

.annot-panel__content {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.annot-panel__quote {
  font-size: clamp(1.15rem, 1.8vw, 1.45rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.annot-panel__text {
  color: var(--grey-dark);
  line-height: 1.6;
}

.note-enter-active,
.note-leave-active {
  transition:
    opacity 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);
}

.note-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.note-leave-to {
  opacity: 0;
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
  .gallery__btn img,
  .gallery__caption,
  .note-enter-active,
  .note-leave-active {
    transition: none;
  }

  .gallery__btn:hover img,
  .gallery__btn:focus-visible img {
    transform: none;
  }

  .lightbox[open],
  .lightbox__img,
  .annot-panel.has-note {
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

  .intro__hint {
    display: flex;
  }

  /* no side column on mobile: the panel only appears, as a bottom sheet,
     once a passage is tapped — out of the flow so the poem never jumps */
  .annot-panel {
    display: none;
  }

  .annot-panel.has-note {
    display: flex;
    position: fixed;
    inset: auto 0 0;
    z-index: 30;
    max-height: 65svh;
    overflow-y: auto;
    border-width: 4px 0 0;
    box-shadow: 0 -12px 40px rgb(0 0 0 / 0.18);
    animation: sheet-up 0.35s var(--ease-out);
  }

  @keyframes sheet-up {
    from {
      transform: translateY(100%);
    }
  }
}

@media (max-width: 480px) {
  .header__back {
    margin-left: 0;
  }
}
</style>
