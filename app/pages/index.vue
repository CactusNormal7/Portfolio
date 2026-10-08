<script setup lang="ts">
interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  year: string;
  link: string;
  image: string;
}

definePageMeta({ pageTransition: { name: "page", mode: "out-in" } });

const description =
  "Jules Besson — M2 web development student. Selected works, about & contact.";
useSeoMeta({
  description,
  ogTitle: "Jules Besson — Web Developer",
  ogDescription: description,
  ogType: "website",
  twitterCard: "summary",
});

// lazy: still rendered server-side on first load, but client-side navigation
// back to this page doesn't wait for the API (skeleton rows show meanwhile)
const {
  data: projects,
  error: projectsError,
  status: projectsStatus,
} = useFetch<Project[]>("/api/projects", { lazy: true });

/* ---------- contact form ---------- */
const MESSAGE_MAX = 5000;
// `website` is a honeypot: hidden from humans, bots tend to fill it
const form = reactive({ name: "", email: "", message: "", website: "" });
const formState = ref<"idle" | "sending" | "sent" | "error">("idle");
const formError = ref("");
const sentRef = ref<HTMLElement | null>(null);
const nameInput = ref<HTMLInputElement | null>(null);

async function submitContact() {
  if (formState.value === "sending") return;
  formState.value = "sending";
  formError.value = "";
  try {
    await $fetch("/api/contact", { method: "POST", body: { ...form } });
    formState.value = "sent";
    Object.assign(form, { name: "", email: "", message: "", website: "" });
    // move focus to the confirmation so keyboard / screen reader users land on it
    await nextTick();
    sentRef.value?.focus();
  } catch (err: unknown) {
    formState.value = "error";
    const { statusCode, statusMessage } = err as {
      statusCode?: number;
      statusMessage?: string;
    };
    // validation errors are worth showing; server errors are not the visitor's business
    formError.value =
      statusCode === 400 && statusMessage
        ? `${statusMessage}.`
        : "Something went wrong — please try again, or email me directly.";
  }
}

async function sendAnother() {
  formState.value = "idle";
  await nextTick();
  nameInput.value?.focus();
}

/* ---------- active section in the nav ---------- */
const sections = ["about", "work", "contact"] as const;
const activeSection = ref<(typeof sections)[number] | null>(null);

/* ---------- project image preview (follows the cursor) ---------- */
const hoveredProject = ref<number | null>(null);
const previewRef = ref<HTMLElement | null>(null);
const hasImages = computed(() => projects.value?.some((p) => p.image) ?? false);
const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
let rafId = 0;

function placePreview() {
  if (previewRef.value) {
    previewRef.value.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
  }
}

function animatePreview() {
  // ease the preview towards the cursor for a smooth, slightly lagging follow
  current.x += (target.x - current.x) * 0.18;
  current.y += (target.y - current.y) * 0.18;
  placePreview();
  rafId = requestAnimationFrame(animatePreview);
}

function onProjectMove(e: MouseEvent) {
  target.x = e.clientX;
  target.y = e.clientY;
  // reduced motion: no easing loop, snap to the cursor
  if (!rafId) {
    current.x = target.x;
    current.y = target.y;
    placePreview();
  }
}

function onProjectEnter(project: Project, e: MouseEvent) {
  if (!project.image) return;
  // jump straight to the cursor when nothing was showing, then follow it
  if (hoveredProject.value === null) {
    current.x = target.x = e.clientX;
    current.y = target.y = e.clientY;
    placePreview();
  }
  hoveredProject.value = project.id;
}

let sectionObserver: IntersectionObserver | null = null;

onMounted(() => {
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id as (typeof sections)[number];
        } else if (activeSection.value === entry.target.id) {
          activeSection.value = null;
        }
      }
    },
    // a section is "active" while it crosses the middle band of the viewport
    { rootMargin: "-45% 0px -50% 0px" },
  );
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  }

  startPreviewLoop();
});

// projects may arrive after mount (lazy fetch), so start the loop when they do
watch(hasImages, startPreviewLoop);

function startPreviewLoop() {
  if (
    !rafId &&
    hasImages.value &&
    matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    rafId = requestAnimationFrame(animatePreview);
  }
}

onBeforeUnmount(() => {
  sectionObserver?.disconnect();
  cancelAnimationFrame(rafId);
});

const year = new Date().getFullYear();
</script>

<template>
  <div class="site">
    <a href="#main" class="skip-link">Skip to content</a>
    <div class="scroll-progress" aria-hidden="true" />

    <!-- ============ HEADER ============ -->
    <header class="header">
      <a
        href="#top"
        class="header__logo"
        aria-label="Jules Besson — back to top"
        >JB<sup>®</sup></a
      >
      <nav class="header__nav mono" aria-label="Main">
        <a
          v-for="id in sections"
          :key="id"
          :href="`#${id}`"
          :class="{ 'is-active': activeSection === id }"
          :aria-current="activeSection === id ? 'location' : undefined"
          >{{ id }}</a
        >
        <NuxtLink to="/life">Life</NuxtLink>
      </nav>
      <div class="header__right">
        <span class="header__meta mono">M2 — Web Dev</span>
        <ThemeToggle />
      </div>
    </header>

    <main id="main" tabindex="-1">
      <!-- ============ HERO ============ -->
      <section id="top" class="hero" aria-labelledby="hero-title">
        <p class="hero__kicker mono mask-line" style="--mask-delay: 0.1s">
          <span
            ><span class="hero__dot" aria-hidden="true" />Portfolio —
            {{ year }}</span
          >
        </p>
        <h1 id="hero-title" class="hero__title">
          <span class="mask-line" style="--mask-delay: 0.2s"
            ><span>JULES</span></span
          >
          <span class="mask-line mask-line--outline" style="--mask-delay: 0.35s"
            ><span>BESSON</span></span
          >
        </h1>
        <div class="hero__bottom">
          <p class="hero__sub mask-line" style="--mask-delay: 0.55s">
            <span
              >Web developer &amp; M2 student.<br />I build sharp, fast, minimal
              interfaces.</span
            >
          </p>
          <div class="hero__ctas mask-line" style="--mask-delay: 0.7s">
            <span>
              <a href="#work" class="btn">
                <span>See my work</span>
                <span class="btn__arrow" aria-hidden="true">↓</span>
              </a>
              <a href="#contact" class="btn btn--ghost">Get in touch</a>
            </span>
          </div>
        </div>
      </section>

      <!-- ============ MARQUEE ============ -->
      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">
          <template v-for="n in 2" :key="n">
            <span>Available for internship</span>
            <span>—</span>
            <span>Front-end</span>
            <span>—</span>
            <span>Back-end</span>
            <span>—</span>
            <span>UI Engineering</span>
            <span>—</span>
          </template>
        </div>
      </div>

      <!-- ============ ABOUT ============ -->
      <section id="about" class="about" aria-labelledby="about-title">
        <div v-reveal class="section-head">
          <span class="section-index">01</span>
          <h2 id="about-title" class="mono">About</h2>
        </div>
        <div class="about__grid">
          <p v-reveal class="about__statement">
            I'm a master's student in web development, obsessed with
            <em>clean code</em> and <em>cleaner interfaces</em>. I like white
            space, hard edges and software that feels instant.
          </p>
          <dl v-reveal="150" class="about__meta">
            <div class="about__meta-row">
              <dt class="mono">Based in</dt>
              <dd>France</dd>
            </div>
            <div class="about__meta-row">
              <dt class="mono">Currently</dt>
              <dd>M2 Web Development</dd>
            </div>
            <div class="about__meta-row">
              <dt class="mono">Stack</dt>
              <dd>Vue / Nuxt / React / Node / SQL / TypeScript</dd>
            </div>
            <div class="about__meta-row">
              <dt class="mono">Looking for</dt>
              <dd>Internship &amp; freelance</dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- ============ PROJECTS ============ -->
      <section id="work" class="work" aria-labelledby="work-title">
        <div v-reveal class="section-head">
          <span class="section-index">02</span>
          <h2 id="work-title" class="mono">Selected work</h2>
          <span v-if="projects?.length" class="section-count mono"
            >({{ projects.length }})</span
          >
        </div>

        <ul
          v-if="projects?.length"
          class="work__list"
          @mouseleave="hoveredProject = null"
        >
          <li
            v-for="(project, i) in projects"
            :key="project.id"
            v-reveal="i * 80"
          >
            <component
              :is="project.link ? 'a' : 'div'"
              :href="project.link || undefined"
              :target="project.link ? '_blank' : undefined"
              :rel="project.link ? 'noopener noreferrer' : undefined"
              class="project"
              :class="{ 'project--static': !project.link }"
              @mouseenter="onProjectEnter(project, $event)"
              @mousemove="onProjectMove"
              @focus="hoveredProject = null"
            >
              <span class="project__index mono" aria-hidden="true">{{
                String(i + 1).padStart(2, "0")
              }}</span>
              <div class="project__main">
                <h3 class="project__title">
                  {{ project.title }}
                  <span v-if="project.link" class="visually-hidden"
                    >(opens in a new tab)</span
                  >
                </h3>
                <p v-if="project.description" class="project__desc">
                  {{ project.description }}
                </p>
                <ul
                  v-if="project.tags.length"
                  class="project__tags"
                  aria-label="Technologies"
                >
                  <li v-for="tag in project.tags" :key="tag" class="mono">
                    {{ tag }}
                  </li>
                </ul>
                <img
                  v-if="project.image"
                  class="project__thumb"
                  :src="project.image"
                  :alt="`${project.title} — preview`"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span class="project__year mono">{{ project.year }}</span>
              <span
                v-if="project.link"
                class="project__arrow"
                aria-hidden="true"
                >↗</span
              >
            </component>
          </li>
        </ul>

        <ul
          v-else-if="projectsStatus === 'pending'"
          class="work__list"
          aria-busy="true"
          aria-label="Loading projects"
        >
          <li v-for="n in 3" :key="n" class="project project--skeleton">
            <span class="skeleton skeleton--index" />
            <div class="project__main">
              <span class="skeleton skeleton--title" />
              <span class="skeleton skeleton--text" />
            </div>
          </li>
        </ul>

        <p v-else v-reveal class="work__empty mono" role="status">
          {{
            projectsError
              ? "Projects can't be loaded right now — please try again later."
              : "New projects are on their way."
          }}
        </p>

        <!-- floating preview, desktop pointers only (see CSS) -->
        <div
          v-if="hasImages"
          ref="previewRef"
          class="preview"
          :class="{ 'is-visible': hoveredProject !== null }"
          aria-hidden="true"
        >
          <div class="preview__frame">
            <template v-for="project in projects" :key="project.id">
              <img
                v-if="project.image"
                :src="project.image"
                alt=""
                class="preview__img"
                :class="{ 'is-active': hoveredProject === project.id }"
                decoding="async"
              />
            </template>
          </div>
        </div>
      </section>

      <!-- ============ CONTACT ============ -->
      <section id="contact" class="contact" aria-labelledby="contact-title">
        <div v-reveal class="section-head">
          <span class="section-index">03</span>
          <h2 id="contact-title" class="mono">Contact</h2>
        </div>

        <p v-reveal class="contact__title" aria-hidden="true">
          Let's build<br /><span class="outline">something.</span>
        </p>

        <div class="contact__grid">
          <div v-reveal class="contact__form-zone">
            <form
              v-if="formState !== 'sent'"
              class="contact__form"
              :aria-busy="formState === 'sending'"
              @submit.prevent="submitContact"
            >
              <div class="field">
                <label for="c-name">Name</label>
                <input
                  id="c-name"
                  ref="nameInput"
                  v-model="form.name"
                  type="text"
                  required
                  maxlength="100"
                  autocomplete="name"
                />
              </div>
              <div class="field">
                <label for="c-email">Email</label>
                <input
                  id="c-email"
                  v-model="form.email"
                  type="email"
                  required
                  maxlength="200"
                  autocomplete="email"
                  inputmode="email"
                  spellcheck="false"
                />
              </div>
              <div class="field">
                <label for="c-message">Message</label>
                <textarea
                  id="c-message"
                  v-model="form.message"
                  required
                  :maxlength="MESSAGE_MAX"
                  aria-describedby="c-message-count"
                />
                <span id="c-message-count" class="field__hint"
                  >{{ form.message.length }} / {{ MESSAGE_MAX }}</span
                >
              </div>
              <!-- honeypot: invisible to people, left empty by them -->
              <div class="visually-hidden" aria-hidden="true">
                <label for="c-website">Website</label>
                <input
                  id="c-website"
                  v-model="form.website"
                  type="text"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>
              <button
                class="btn"
                type="submit"
                :disabled="formState === 'sending'"
              >
                <span>{{
                  formState === "sending" ? "Sending…" : "Send message"
                }}</span>
                <span
                  class="btn__arrow"
                  :class="{ 'btn__arrow--sending': formState === 'sending' }"
                  aria-hidden="true"
                  >→</span
                >
              </button>
              <p
                v-if="formState === 'error'"
                class="contact__feedback contact__feedback--error mono"
                role="alert"
              >
                {{ formError }}
              </p>
            </form>

            <div
              v-else
              ref="sentRef"
              class="contact__sent"
              role="status"
              tabindex="-1"
            >
              <span class="contact__sent-check" aria-hidden="true">✓</span>
              <p class="contact__sent-title">Message<br />sent.</p>
              <p class="contact__sent-sub mono">
                Thanks — I'll get back to you soon.
              </p>
              <button
                type="button"
                class="contact__sent-again mono"
                @click="sendAnother"
              >
                Send another →
              </button>
            </div>
          </div>

          <aside v-reveal="150" class="contact__aside" aria-label="Elsewhere">
            <div class="about__meta-row">
              <span class="mono">Email</span>
              <a class="contact__link" href="mailto:jules.besson74@gmail.com"
                >jules.besson74@gmail.com</a
              >
            </div>
            <div class="about__meta-row">
              <span class="mono">GitHub</span>
              <a
                class="contact__link"
                href="https://github.com/CactusNormal7"
                target="_blank"
                rel="noopener noreferrer"
                >github.com/CactusNormal7 ↗</a
              >
            </div>
            <div class="about__meta-row">
              <span class="mono">LinkedIn</span>
              <a
                class="contact__link"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                >/in/julesbesson ↗</a
              >
            </div>
          </aside>
        </div>
      </section>
    </main>

    <!-- ============ FOOTER ============ -->
    <footer class="footer">
      <span class="mono">© {{ year }} Jules Besson</span>
      <span class="mono">Designed &amp; built with too much coffee</span>
      <NuxtLink to="/life" class="mono">Off the clock →</NuxtLink>
      <a href="#top" class="mono footer__top">Back to top ↑</a>
    </footer>
  </div>
</template>

<style scoped>
.site {
  display: flex;
  flex-direction: column;
}

/* ============ HEADER ============ */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem var(--gutter);
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}

.header__logo {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}

.header__nav {
  display: flex;
  gap: 2.5rem;
}

.header__nav a {
  position: relative;
  padding: 0.2rem 0;
}

.header__nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s var(--ease-out);
}

.header__nav a:hover::after,
.header__nav a.is-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.header__nav a.is-active {
  font-weight: 700;
}

main:focus {
  outline: none;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header__meta {
  color: var(--grey);
}

/* ============ HERO ============ */
.hero {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100svh - 3.6rem);
  padding: clamp(2rem, 6vh, 5rem) var(--gutter) clamp(2rem, 5vh, 4rem);
}

.hero__kicker {
  color: var(--grey-dark);
}

/* "available" indicator */
.hero__dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.75rem;
  background: var(--ink);
  vertical-align: 0.05em;
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  50% {
    opacity: 0.2;
  }
}

.hero__title {
  font-size: clamp(4rem, 17vw, 15rem);
  line-height: 0.92;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.mask-line--outline > span {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
}

.hero__bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
}

.hero__sub {
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  line-height: 1.45;
  color: var(--grey-dark);
  max-width: 30ch;
}

/* padding keeps button focus rings from being clipped by the mask */
.hero__ctas {
  padding: 6px;
  margin: -6px;
}

.hero__ctas > span {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero__ctas .btn:hover .btn__arrow {
  transform: translateY(4px);
}

/* ============ ABOUT ============ */
.about__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 6rem);
  padding: clamp(2rem, 6vh, 5rem) var(--gutter) clamp(3rem, 8vh, 7rem);
}

.about__statement {
  font-size: clamp(1.5rem, 3vw, 2.6rem);
  line-height: 1.25;
  letter-spacing: -0.02em;
  font-weight: 500;
  text-wrap: balance;
}

.about__statement em {
  font-style: normal;
  background: var(--ink);
  color: var(--bg);
  padding: 0 0.08em;
  /* repeat the padding on each line fragment when the highlight wraps */
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

.about__meta {
  display: flex;
  flex-direction: column;
  align-self: end;
}

.about__meta-row {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: baseline;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--line-soft);
}

.about__meta-row .mono {
  color: var(--grey);
}

/* ============ WORK ============ */
.work__list {
  list-style: none;
}

.project {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr) 5rem 3rem;
  align-items: start;
  gap: 1.5rem;
  padding: clamp(1.75rem, 4vh, 3rem) var(--gutter);
  border-top: 1px solid var(--line-soft);
  transition:
    background 0.35s var(--ease-out),
    color 0.35s var(--ease-out);
}

.work__list li:first-child .project {
  border-top: none;
}

.project--static {
  cursor: default;
}

.project__index,
.project__year {
  color: var(--grey);
  padding-top: 0.6rem;
  transition: color 0.35s var(--ease-out);
}

.project__title {
  font-size: clamp(1.6rem, 3.4vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
  text-transform: uppercase;
  transition: transform 0.45s var(--ease-out);
}

/* inline thumbnail: only on touch screens, where there is no hover preview */
.project__thumb {
  display: none;
  width: 100%;
  max-width: 32rem;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  margin-top: 1.25rem;
  border: 1px solid var(--line-soft);
}

@media (hover: none), (pointer: coarse) {
  .project__thumb {
    display: block;
  }
}

.project__desc {
  margin-top: 0.6rem;
  max-width: 60ch;
  color: var(--grey-dark);
  transition: color 0.35s var(--ease-out);
}

.project__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin-top: 1rem;
}

.project__tags li {
  border: 1px solid var(--line-soft);
  padding: 0.3rem 0.7rem;
  color: var(--grey-dark);
  transition:
    border-color 0.35s,
    color 0.35s;
}

.project__arrow {
  font-size: 1.6rem;
  padding-top: 0.2rem;
  transform: translate(-6px, 6px);
  opacity: 0;
  transition:
    transform 0.35s var(--ease-out),
    opacity 0.35s var(--ease-out);
}

.project:hover {
  background: var(--ink);
  color: var(--bg);
}

.project:hover .project__title {
  transform: translateX(0.6rem);
}

.project:hover .project__index,
.project:hover .project__year {
  color: var(--on-ink-muted);
}

.project:hover .project__desc {
  color: var(--bg-soft);
}

.project:hover .project__tags li {
  border-color: var(--on-ink-muted);
  color: var(--bg-soft);
}

.project:focus-visible {
  outline-offset: -4px;
}

/* ---- loading skeleton ---- */
.project--skeleton {
  cursor: default;
}

.project--skeleton:hover {
  background: none;
  color: inherit;
}

.skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    var(--bg-soft) 0%,
    var(--line-soft) 50%,
    var(--bg-soft) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

.skeleton--index {
  width: 1.5rem;
  height: 0.8rem;
  margin-top: 0.6rem;
}

.skeleton--title {
  width: min(22rem, 70%);
  height: clamp(1.6rem, 3.4vw, 3rem);
}

.skeleton--text {
  width: min(36rem, 90%);
  height: 1rem;
  margin-top: 0.9rem;
}

@keyframes skeleton-shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}

.work__empty {
  padding: clamp(2rem, 6vh, 4rem) var(--gutter);
  border-top: 1px solid var(--line-soft);
  color: var(--grey);
}

/* ---- floating cursor preview ---- */
.preview {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 15;
  pointer-events: none;
  will-change: transform;
}

.preview__frame {
  position: relative;
  width: clamp(14rem, 22vw, 22rem);
  aspect-ratio: 4 / 3;
  /* sit above-right of the cursor, never under it */
  translate: 1.5rem -50%;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--bg-soft);
  clip-path: inset(50% 50% 50% 50%);
  transition: clip-path 0.5s var(--ease-out);
}

.preview.is-visible .preview__frame {
  clip-path: inset(0 0 0 0);
}

.preview__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  scale: 1.12;
  transition:
    opacity 0.35s var(--ease-out),
    scale 0.7s var(--ease-out);
}

.preview__img.is-active {
  opacity: 1;
  scale: 1;
}

@media (hover: none), (pointer: coarse) {
  .preview {
    display: none;
  }
}

.project:hover .project__arrow {
  transform: translate(0, 0);
  opacity: 1;
}

/* ============ CONTACT ============ */
.contact__title {
  font-size: clamp(3rem, 9vw, 8rem);
  line-height: 0.95;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  padding: clamp(2rem, 6vh, 4rem) var(--gutter) 0;
}

.contact__title .outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--ink);
}

.contact__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 6rem);
  padding: clamp(2.5rem, 7vh, 5rem) var(--gutter) clamp(3rem, 8vh, 7rem);
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
}

.contact__form .field {
  width: 100%;
}

.contact__feedback--error {
  color: var(--danger);
}

/* ---- send animation ---- */

.btn__arrow {
  display: inline-block;
  transition: transform 0.3s var(--ease-out);
}

.contact__form .btn:hover .btn__arrow {
  transform: translateX(5px);
}

@keyframes arrow-fly {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  45% {
    transform: translateX(16px);
    opacity: 0;
  }
  55% {
    transform: translateX(-12px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.btn__arrow--sending {
  animation: arrow-fly 0.9s var(--ease-out) infinite;
}

@keyframes sent-wipe {
  from {
    transform: scaleY(0);
  }
}

@keyframes sent-item {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}

.contact__sent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  padding: clamp(2rem, 5vw, 3.5rem);
  background: var(--ink);
  color: var(--bg);
  transform-origin: top;
  animation: sent-wipe 0.55s var(--ease-out);
}

.contact__sent > * {
  animation: sent-item 0.6s var(--ease-out) both;
}

.contact__sent > *:nth-child(1) {
  animation-delay: 0.3s;
}
.contact__sent > *:nth-child(2) {
  animation-delay: 0.4s;
}
.contact__sent > *:nth-child(3) {
  animation-delay: 0.5s;
}
.contact__sent > *:nth-child(4) {
  animation-delay: 0.6s;
}

.contact__sent-check {
  font-size: 2.5rem;
  line-height: 1;
}

.contact__sent-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 0.95;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.contact__sent-sub {
  color: var(--on-ink-muted);
}

.contact__sent:focus {
  outline: none;
}

.contact__sent :focus-visible {
  outline-color: var(--bg);
}

.contact__sent-again {
  margin-top: 0.5rem;
  padding: 0.8rem 1.4rem;
  border: 1px solid var(--bg);
  transition:
    background 0.25s var(--ease-out),
    color 0.25s var(--ease-out);
}

.contact__sent-again:hover {
  background: var(--bg);
  color: var(--ink);
}

@media (prefers-reduced-motion: reduce) {
  .btn__arrow--sending,
  .contact__sent,
  .contact__sent > *,
  .hero__dot {
    animation: none;
  }
  .project__title,
  .preview__frame,
  .preview__img {
    transition: none;
  }
  .project:hover .project__title {
    transform: none;
  }
}

.contact__aside {
  align-self: start;
  display: flex;
  flex-direction: column;
}

.contact__link {
  position: relative;
  text-decoration: underline;
  text-decoration-color: var(--line-soft);
  text-underline-offset: 4px;
  transition:
    background 0.2s var(--ease-out),
    color 0.2s var(--ease-out);
  overflow-wrap: anywhere;
}

.contact__link:hover {
  background: var(--ink);
  color: var(--bg);
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

/* ============ RESPONSIVE ============ */
@media (max-width: 800px) {
  .header__meta {
    display: none;
  }

  .header__nav {
    gap: 1.25rem;
  }

  .hero__bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .about__grid,
  .contact__grid {
    grid-template-columns: 1fr;
  }

  .project {
    grid-template-columns: 2.5rem minmax(0, 1fr);
  }

  .project__year {
    grid-column: 2;
    padding-top: 0;
  }

  .project__arrow {
    display: none;
  }

  .about__meta-row {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 420px) {
  .header {
    gap: 0.75rem;
  }

  .header__nav {
    gap: 0.7rem;
    font-size: 0.66rem;
  }
}
</style>
