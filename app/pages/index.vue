<script setup lang="ts">
interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  year: string
  link: string
  image: string
}

const { data: projects } = await useFetch<Project[]>('/api/projects')

const form = reactive({ name: '', email: '', message: '' })
const formState = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const formError = ref('')

async function submitContact () {
  formState.value = 'sending'
  formError.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    formState.value = 'sent'
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (err: unknown) {
    formState.value = 'error'
    formError.value = (err as { statusMessage?: string })?.statusMessage ?? 'Something went wrong. Try again.'
  }
}

const year = new Date().getFullYear()
</script>

<template>
  <main class="site">
    <!-- ============ HEADER ============ -->
    <header class="header">
      <a href="#top" class="header__logo">JB<sup>®</sup></a>
      <nav class="header__nav mono" aria-label="Main">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>
      <span class="header__meta mono">M1 — Web Dev</span>
    </header>

    <!-- ============ HERO ============ -->
    <section id="top" class="hero">
      <p class="hero__kicker mono mask-line" style="--mask-delay: 0.1s">
        <span>Portfolio — {{ year }}</span>
      </p>
      <h1 class="hero__title">
        <span class="mask-line" style="--mask-delay: 0.2s"><span>JULES</span></span>
        <span class="mask-line mask-line--outline" style="--mask-delay: 0.35s"><span>BESSON</span></span>
      </h1>
      <div class="hero__bottom">
        <p class="hero__sub mask-line" style="--mask-delay: 0.55s">
          <span>Web developer & M1 student.<br>I build sharp, fast, minimal interfaces.</span>
        </p>
        <a href="#work" class="hero__scroll mono mask-line" style="--mask-delay: 0.7s">
          <span>Scroll ↓</span>
        </a>
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
    <section id="about" class="about">
      <div class="section-head" v-reveal>
        <span class="section-index">01</span>
        <h2 class="mono">About</h2>
      </div>
      <div class="about__grid">
        <p class="about__statement" v-reveal>
          I'm a master's student in web development, obsessed with
          <em>clean code</em> and <em>cleaner interfaces</em>. I like white
          space, hard edges and software that feels instant.
        </p>
        <div class="about__meta" v-reveal="150">
          <div class="about__meta-row">
            <span class="mono">Based in</span>
            <span>France</span>
          </div>
          <div class="about__meta-row">
            <span class="mono">Currently</span>
            <span>M1 Web Development</span>
          </div>
          <div class="about__meta-row">
            <span class="mono">Stack</span>
            <span>Vue / Nuxt / Node / SQL / TypeScript</span>
          </div>
          <div class="about__meta-row">
            <span class="mono">Looking for</span>
            <span>Internship &amp; freelance</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ PROJECTS ============ -->
    <section id="work" class="work">
      <div class="section-head" v-reveal>
        <span class="section-index">02</span>
        <h2 class="mono">Selected work</h2>
        <span class="section-count mono">({{ projects?.length ?? 0 }})</span>
      </div>

      <ul class="work__list">
        <li v-for="(project, i) in projects" :key="project.id" v-reveal="i * 80">
          <component
            :is="project.link ? 'a' : 'div'"
            :href="project.link || undefined"
            :target="project.link ? '_blank' : undefined"
            :rel="project.link ? 'noopener' : undefined"
            class="project"
          >
            <span class="project__index mono">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="project__main">
              <h3 class="project__title">{{ project.title }}</h3>
              <p class="project__desc">{{ project.description }}</p>
              <ul class="project__tags" aria-label="Technologies">
                <li v-for="tag in project.tags" :key="tag" class="mono">{{ tag }}</li>
              </ul>
            </div>
            <span class="project__year mono">{{ project.year }}</span>
            <span class="project__arrow" aria-hidden="true">↗</span>
          </component>
        </li>
      </ul>
    </section>

    <!-- ============ CONTACT ============ -->
    <section id="contact" class="contact">
      <div class="section-head" v-reveal>
        <span class="section-index">03</span>
        <h2 class="mono">Contact</h2>
      </div>

      <h2 class="contact__title" v-reveal>
        Let's build<br><span class="outline">something.</span>
      </h2>

      <div class="contact__grid">
        <form class="contact__form" v-reveal @submit.prevent="submitContact">
          <div class="field">
            <label for="c-name">Name</label>
            <input id="c-name" v-model="form.name" type="text" required autocomplete="name">
          </div>
          <div class="field">
            <label for="c-email">Email</label>
            <input id="c-email" v-model="form.email" type="email" required autocomplete="email">
          </div>
          <div class="field">
            <label for="c-message">Message</label>
            <textarea id="c-message" v-model="form.message" required />
          </div>
          <button class="btn" type="submit" :disabled="formState === 'sending'">
            {{ formState === 'sending' ? 'Sending…' : 'Send message' }} →
          </button>
          <p v-if="formState === 'sent'" class="contact__feedback mono">Message sent. I'll get back to you soon.</p>
          <p v-if="formState === 'error'" class="contact__feedback contact__feedback--error mono">{{ formError }}</p>
        </form>

        <aside class="contact__aside" v-reveal="150">
          <div class="about__meta-row">
            <span class="mono">Email</span>
            <a class="contact__link" href="mailto:jules.besson74@gmail.com">jules.besson74@gmail.com</a>
          </div>
          <div class="about__meta-row">
            <span class="mono">GitHub</span>
            <a class="contact__link" href="https://github.com/CactusNormal7" target="_blank" rel="noopener">github.com/CactusNormal7</a>
          </div>
          <div class="about__meta-row">
            <span class="mono">LinkedIn</span>
            <a class="contact__link" href="https://linkedin.com" target="_blank" rel="noopener">/in/julesbesson</a>
          </div>
        </aside>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <footer class="footer">
      <span class="mono">© {{ year }} Jules Besson</span>
      <span class="mono">Designed &amp; built with too much coffee</span>
      <a href="https://thomaskauffmant.com/home" target="_blank" rel="noopener" class="mono">Reference — thomaskauffmant.com ↗</a>
      <a href="#top" class="mono">Back to top ↑</a>
    </footer>
  </main>
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
  content: '';
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

.header__nav a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
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

.hero__scroll {
  color: var(--grey);
  transition: color 0.2s;
}

.hero__scroll:hover {
  color: var(--ink);
}

/* ============ SECTIONS ============ */
.section-head {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  padding: 1.4rem var(--gutter);
  border-top: 1px solid var(--line);
}

.section-head h2 {
  font-weight: 500;
  color: var(--grey-dark);
}

.section-count {
  color: var(--grey);
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
  padding: 0 0.35em;
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
  transition: background 0.35s var(--ease-out), color 0.35s var(--ease-out);
}

.work__list li:first-child .project {
  border-top: none;
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
  transition: border-color 0.35s, color 0.35s;
}

.project__arrow {
  font-size: 1.6rem;
  padding-top: 0.2rem;
  transform: translate(-6px, 6px);
  opacity: 0;
  transition: transform 0.35s var(--ease-out), opacity 0.35s var(--ease-out);
}

.project:hover {
  background: var(--ink);
  color: var(--bg);
}

.project:hover .project__index,
.project:hover .project__year {
  color: var(--grey);
}

.project:hover .project__desc {
  color: var(--bg-soft);
}

.project:hover .project__tags li {
  border-color: var(--grey-dark);
  color: var(--bg-soft);
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

.contact__feedback {
  color: var(--grey-dark);
}

.contact__feedback--error {
  color: #b00020;
}

.contact__aside {
  align-self: start;
  display: flex;
  flex-direction: column;
}

.contact__link {
  position: relative;
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
}
</style>
