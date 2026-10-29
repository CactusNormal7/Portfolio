import { ofetch } from 'ofetch'

export const GITHUB_USER = 'CactusNormal7'

interface GithubRepo {
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  fork: boolean
  archived: boolean
  created_at: string
  pushed_at: string
}

export interface RepoDraft {
  fullName: string
  title: string
  description: string
  tags: string
  year: string
  link: string
  repoUrl: string
  image: string
  stars: number
  fork: boolean
  archived: boolean
  pushedAt: string
}

// Optional: set GITHUB_TOKEN in .env to lift the 60 req/h anonymous rate limit
function githubFetch<T> (path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN
  return ofetch<T>(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-backoffice',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }).catch((err: { statusCode?: number }) => {
    const status = err?.statusCode ?? 502
    throw createError({
      statusCode: status === 404 ? 404 : 502,
      statusMessage: status === 404
        ? 'GitHub repository or user not found'
        : status === 403 || status === 429
          ? 'GitHub rate limit reached — try again later or set GITHUB_TOKEN'
          : 'GitHub request failed'
    })
  })
}

// "my-cool_repo" → "My Cool Repo"
function prettifyName (name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim()
}

function toDraft (repo: GithubRepo): RepoDraft {
  const tags = [repo.language, ...(repo.topics ?? [])].filter((t): t is string => Boolean(t))
  return {
    fullName: repo.full_name,
    title: prettifyName(repo.name),
    description: repo.description ?? '',
    tags: [...new Set(tags)].join(', '),
    year: repo.created_at.slice(0, 4),
    // prefer the live site when the repo declares one
    link: repo.homepage?.trim() || repo.html_url,
    repoUrl: repo.html_url,
    // GitHub's auto-generated card is left out: the site draws its own fallback
    image: '',
    stars: repo.stargazers_count,
    fork: repo.fork,
    archived: repo.archived,
    pushedAt: repo.pushed_at
  }
}

// Accepts "https://github.com/owner/repo(.git)(/…)", "github.com/owner/repo" or "owner/repo"
export function parseRepoUrl (input: string): { owner: string, repo: string } | null {
  const cleaned = input.trim().replace(/^https?:\/\//, '').replace(/^(www\.)?github\.com\//, '')
  const match = cleaned.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#].*)?$/)
  return match ? { owner: match[1]!, repo: match[2]! } : null
}

// opengraph.githubassets.com serves the generic card GitHub builds for every repo
export function isGenericRepoCard (url: string): boolean {
  return /^https?:\/\/opengraph\.githubassets\.com\//.test(url)
}

// The REST API doesn't expose a repo's custom social preview, so read the og:image
// of its page; only keep it when it's an uploaded one, not the generic card
async function fetchSocialPreview (fullName: string): Promise<string> {
  try {
    const html = await ofetch<string>(`https://github.com/${fullName}`, {
      responseType: 'text',
      headers: { 'User-Agent': 'portfolio-backoffice' }
    })
    const url = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1] ?? ''
    return url && !isGenericRepoCard(url) ? url.replace(/&amp;/g, '&') : ''
  } catch {
    return ''
  }
}

export async function fetchRepo (owner: string, repo: string): Promise<RepoDraft> {
  const draft = toDraft(await githubFetch<GithubRepo>(`/repos/${owner}/${repo}`))
  draft.image = await fetchSocialPreview(draft.fullName)
  return draft
}

export async function fetchUserRepos (user: string): Promise<RepoDraft[]> {
  const repos: GithubRepo[] = []
  // 100 per page is GitHub's max; stop at 5 pages to stay well within rate limits
  for (let page = 1; page <= 5; page++) {
    const batch = await githubFetch<GithubRepo[]>(
      `/users/${encodeURIComponent(user)}/repos?per_page=100&page=${page}&sort=pushed&type=owner`
    )
    repos.push(...batch)
    if (batch.length < 100) break
  }
  return repos.map(toDraft)
}
