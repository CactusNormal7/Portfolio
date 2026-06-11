<script setup lang="ts">
interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  year: string
  link: string
  image: string
  position: number
}

interface Message {
  id: number
  name: string
  email: string
  body: string
  created_at: string
}

useHead({ title: 'Backoffice — Jules Besson' })

const { data: session, refresh: refreshSession } = await useFetch('/api/auth/me')
const authenticated = computed(() => session.value?.authenticated ?? false)

/* ---------- login ---------- */
const password = ref('')
const loginError = ref('')

async function login () {
  loginError.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { password: password.value } })
    password.value = ''
    await Promise.all([refreshSession(), refreshProjects(), refreshMessages()])
  } catch {
    loginError.value = 'Wrong password.'
  }
}

async function logout () {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await refreshSession()
}

/* ---------- data ---------- */
const { data: projects, refresh: refreshProjects } = await useFetch<Project[]>('/api/projects')
const { data: messages, refresh: refreshMessages } = await useFetch<Message[]>('/api/messages', {
  immediate: authenticated.value,
  // unauthenticated visitors simply get an empty inbox instead of an error
  default: () => [] as Message[],
  ignoreResponseError: true
})

const tab = ref<'projects' | 'messages'>('projects')

/* ---------- project form ---------- */
const emptyForm = { title: '', description: '', tags: '', year: '', link: '', image: '', position: 0 }
const form = reactive({ ...emptyForm })
const editingId = ref<number | null>(null)
const saving = ref(false)
const formMessage = ref('')

function startEdit (project: Project) {
  editingId.value = project.id
  form.title = project.title
  form.description = project.description
  form.tags = project.tags.join(', ')
  form.year = project.year
  form.link = project.link
  form.image = project.image
  form.position = project.position
  formMessage.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetForm () {
  Object.assign(form, emptyForm)
  editingId.value = null
  formMessage.value = ''
}

async function saveProject () {
  saving.value = true
  formMessage.value = ''
  try {
    if (editingId.value) {
      await $fetch(`/api/projects/${editingId.value}`, { method: 'PUT', body: { ...form } })
      formMessage.value = 'Project updated.'
    } else {
      await $fetch('/api/projects', { method: 'POST', body: { ...form } })
      formMessage.value = 'Project created.'
    }
    resetForm()
    await refreshProjects()
  } catch (err: unknown) {
    formMessage.value = (err as { statusMessage?: string })?.statusMessage ?? 'Save failed.'
  } finally {
    saving.value = false
  }
}

async function deleteProject (project: Project) {
  if (!window.confirm(`Delete “${project.title}”?`)) return
  await $fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
  if (editingId.value === project.id) resetForm()
  await refreshProjects()
}

async function deleteMessage (message: Message) {
  if (!window.confirm(`Delete message from ${message.name}?`)) return
  await $fetch(`/api/messages/${message.id}`, { method: 'DELETE' })
  await refreshMessages()
}
</script>

<template>
  <main class="admin">
    <!-- ============ LOGIN ============ -->
    <div v-if="!authenticated" class="login">
      <form class="login__box" @submit.prevent="login">
        <p class="mono login__kicker">Jules Besson — Backoffice</p>
        <h1 class="login__title">Restricted<br>area.</h1>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required autofocus>
        </div>
        <button class="btn" type="submit">Enter →</button>
        <p v-if="loginError" class="mono login__error">{{ loginError }}</p>
        <NuxtLink to="/" class="mono login__back">← Back to site</NuxtLink>
      </form>
    </div>

    <!-- ============ DASHBOARD ============ -->
    <template v-else>
      <header class="admin__header">
        <NuxtLink to="/" class="admin__logo">JB<sup>®</sup> <span class="mono">/ Backoffice</span></NuxtLink>
        <nav class="admin__tabs mono">
          <button :class="{ active: tab === 'projects' }" @click="tab = 'projects'">
            Projects ({{ projects?.length ?? 0 }})
          </button>
          <button :class="{ active: tab === 'messages' }" @click="tab = 'messages'; refreshMessages()">
            Inbox ({{ messages?.length ?? 0 }})
          </button>
        </nav>
        <div class="admin__actions">
          <ThemeToggle />
          <button class="btn btn--ghost" @click="logout">Log out</button>
        </div>
      </header>

      <!-- ---------- PROJECTS TAB ---------- -->
      <section v-if="tab === 'projects'" class="admin__body">
        <form class="panel" @submit.prevent="saveProject">
          <h2 class="panel__title mono">{{ editingId ? `Edit project #${editingId}` : 'New project' }}</h2>
          <div class="panel__grid">
            <div class="field">
              <label for="p-title">Title *</label>
              <input id="p-title" v-model="form.title" type="text" required>
            </div>
            <div class="field">
              <label for="p-year">Year</label>
              <input id="p-year" v-model="form.year" type="text" placeholder="2026">
            </div>
            <div class="field">
              <label for="p-tags">Tags (comma separated)</label>
              <input id="p-tags" v-model="form.tags" type="text" placeholder="Vue, Node.js, SQLite">
            </div>
            <div class="field">
              <label for="p-position">Position (sort order)</label>
              <input id="p-position" v-model.number="form.position" type="number">
            </div>
            <div class="field">
              <label for="p-link">Link</label>
              <input id="p-link" v-model="form.link" type="url" placeholder="https://…">
            </div>
            <div class="field">
              <label for="p-image">Image URL</label>
              <input id="p-image" v-model="form.image" type="url" placeholder="https://…">
            </div>
            <div class="field field--full">
              <label for="p-desc">Description</label>
              <textarea id="p-desc" v-model="form.description" />
            </div>
          </div>
          <div class="panel__actions">
            <button class="btn" type="submit" :disabled="saving">
              {{ saving ? 'Saving…' : editingId ? 'Update project' : 'Add project' }}
            </button>
            <button v-if="editingId" class="btn btn--ghost" type="button" @click="resetForm">Cancel</button>
            <span v-if="formMessage" class="mono panel__feedback">{{ formMessage }}</span>
          </div>
        </form>

        <ul class="rows">
          <li v-for="project in projects" :key="project.id" class="row">
            <span class="row__index mono">#{{ project.id }}</span>
            <div class="row__main">
              <strong class="row__title">{{ project.title }}</strong>
              <span class="mono row__sub">{{ project.year }} — {{ project.tags.join(', ') || 'no tags' }}</span>
            </div>
            <div class="row__actions">
              <button class="mono row__btn" @click="startEdit(project)">Edit</button>
              <button class="mono row__btn row__btn--danger" @click="deleteProject(project)">Delete</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- ---------- MESSAGES TAB ---------- -->
      <section v-else class="admin__body">
        <p v-if="!messages?.length" class="empty mono">Inbox is empty.</p>
        <ul class="rows">
          <li v-for="message in messages" :key="message.id" class="row row--message">
            <span class="row__index mono">#{{ message.id }}</span>
            <div class="row__main">
              <strong class="row__title">{{ message.name }}</strong>
              <a class="mono row__sub" :href="`mailto:${message.email}`">{{ message.email }}</a>
              <p class="row__body">{{ message.body }}</p>
              <span class="mono row__date">{{ message.created_at }} UTC</span>
            </div>
            <div class="row__actions">
              <button class="mono row__btn row__btn--danger" @click="deleteMessage(message)">Delete</button>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </main>
</template>

<style scoped>
.admin {
  min-height: 100svh;
  background: var(--bg);
}

/* ---------- login ---------- */
.login {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: var(--gutter);
}

.login__box {
  width: min(26rem, 100%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1px solid var(--line);
  padding: 2.5rem;
  background: var(--bg);
}

.login__kicker {
  color: var(--grey);
}

.login__title {
  font-size: 2.6rem;
  line-height: 1;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.login__error {
  color: #b00020;
}

.login__back {
  color: var(--grey);
}

.login__back:hover {
  color: var(--ink);
}

/* ---------- header ---------- */
.admin__header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem var(--gutter);
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}

.admin__logo {
  font-weight: 700;
  font-size: 1.1rem;
}

.admin__logo .mono {
  color: var(--grey);
  font-weight: 400;
}

.admin__tabs {
  display: flex;
  gap: 0;
  border: 1px solid var(--line);
}

.admin__tabs button {
  padding: 0.7rem 1.4rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-family: var(--font-mono);
}

.admin__tabs button.active {
  background: var(--ink);
  color: var(--bg);
}

.admin__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ---------- body ---------- */
.admin__body {
  padding: clamp(1.5rem, 4vh, 3rem) var(--gutter) 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 70rem;
}

.panel {
  border: 1px solid var(--line);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel__title {
  color: var(--grey-dark);
}

.panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field--full {
  grid-column: 1 / -1;
}

.panel__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.panel__feedback {
  color: var(--grey-dark);
}

/* ---------- rows ---------- */
.rows {
  list-style: none;
  border: 1px solid var(--line);
}

.row {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--line-soft);
  transition: background 0.2s;
}

.row:last-child {
  border-bottom: none;
}

.row:hover {
  background: var(--bg-soft);
}

.row__index {
  color: var(--grey);
  padding-top: 0.2rem;
  min-width: 2.5rem;
}

.row__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.row__title {
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}

.row__sub {
  color: var(--grey-dark);
}

.row__body {
  margin-top: 0.4rem;
  white-space: pre-wrap;
}

.row__date {
  color: var(--grey);
  margin-top: 0.4rem;
}

.row__actions {
  display: flex;
  gap: 1rem;
}

.row__btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--line-soft);
  transition: all 0.2s;
}

.row__btn:hover {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--bg);
}

.row__btn--danger:hover {
  background: #b00020;
  border-color: #b00020;
}

.empty {
  color: var(--grey);
}

@media (max-width: 700px) {
  .panel__grid {
    grid-template-columns: 1fr;
  }

  .row {
    flex-wrap: wrap;
  }
}
</style>
