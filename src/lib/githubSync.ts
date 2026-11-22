import type { SiteConfig } from '../context/SiteConfigContext'

export const DEFAULT_GITHUB_REPO = 'azkinadeco/bububalloon'
export const DEFAULT_GITHUB_BRANCH = 'main'
const CONFIG_FILE_PATH = 'public/site-config.json'

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

function base64ToUtf8(b64: string): string {
  const clean = b64.replace(/\s/g, '')
  const binary = atob(clean)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

/**
 * Fetch the latest published site-config.json instantaneously:
 * 1) GitHub Contents API (0-second delay right after Admin publishes on PC!)
 * 2) GitHub Raw (fallback if API rate-limited)
 * 3) Local /site-config.json (offline/build fallback)
 */
export async function fetchLiveSiteConfig(
  repo: string = DEFAULT_GITHUB_REPO,
  branch: string = DEFAULT_GITHUB_BRANCH,
  token?: string
): Promise<Partial<SiteConfig> | null> {
  const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
  const ts = Date.now()

  // 1. Instant live GitHub Contents API (zero CDN delay!)
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    }
    if (token?.trim()) {
      headers.Authorization = `Bearer ${token.trim()}`
    }
    const apiRes = await fetch(
      `https://api.github.com/repos/${cleanRepo}/contents/${CONFIG_FILE_PATH}?ref=${encodeURIComponent(branch)}&t=${ts}`,
      { headers, cache: 'no-store' }
    )
    if (apiRes.ok) {
      const payload = (await apiRes.json()) as { content?: string; encoding?: string }
      if (payload.content) {
        const parsed = JSON.parse(base64ToUtf8(payload.content)) as Partial<SiteConfig>
        if (parsed && parsed.brand) return parsed
      }
    }
  } catch {
    // Fall through to Raw / local
  }

  // 2 & 3. Raw GitHub + Local fallback
  const fallbackUrls = [
    `https://raw.githubusercontent.com/${cleanRepo}/${encodeURIComponent(branch)}/${CONFIG_FILE_PATH}?t=${ts}`,
    `/site-config.json?t=${ts}`,
  ]

  for (const url of fallbackUrls) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) continue
      const data = (await res.json()) as Partial<SiteConfig>
      if (data && data.brand) {
        return data
      }
    } catch {
      // Try next fallback URL
    }
  }
  return null
}

export async function verifyGithubAdminToken(
  token: string,
  repo: string = DEFAULT_GITHUB_REPO
): Promise<{ ok: boolean; username?: string; error?: string }> {
  const cleanToken = token.trim()
  const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
  if (!cleanToken) {
    return { ok: false, error: 'Masukkan GitHub Personal Access Token terlebih dahulu.' }
  }

  try {
    const [userRes, repoRes] = await Promise.all([
      fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github+json',
        },
        cache: 'no-store',
      }),
      fetch(`https://api.github.com/repos/${cleanRepo}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github+json',
        },
        cache: 'no-store',
      }),
    ])

    if (!userRes.ok) {
      return { ok: false, error: 'Token GitHub tidak valid atau sudah kedaluwarsa.' }
    }
    const userData = (await userRes.json()) as { login?: string }

    if (!repoRes.ok) {
      return {
        ok: false,
        error: `Tidak bisa mengakses repo "${cleanRepo}". Pastikan nama repo & izin token benar.`,
      }
    }
    const repoData = (await repoRes.json()) as { permissions?: { push?: boolean; admin?: boolean } }
    if (!repoData.permissions?.push && !repoData.permissions?.admin) {
      return {
        ok: false,
        error: 'Token ini tidak memiliki izin tulis (push) ke repository Bubu Balloon.',
      }
    }

    return { ok: true, username: userData.login || 'Admin' }
  } catch {
    return { ok: false, error: 'Gagal terhubung ke GitHub. Periksa koneksi internet kamu.' }
  }
}

async function fetchCurrentFileSha(
  cleanToken: string,
  cleanRepo: string,
  branch: string
): Promise<string | undefined> {
  const getRes = await fetch(
    `https://api.github.com/repos/${cleanRepo}/contents/${CONFIG_FILE_PATH}?ref=${encodeURIComponent(branch)}&t=${Date.now()}`,
    {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
    }
  )
  if (getRes.ok) {
    const existing = (await getRes.json()) as { sha?: string }
    return existing.sha
  }
  return undefined
}

export async function publishSiteConfigToGithub(
  token: string,
  config: SiteConfig,
  repo: string = DEFAULT_GITHUB_REPO,
  branch: string = DEFAULT_GITHUB_BRANCH
): Promise<{ ok: boolean; commitUrl?: string; error?: string }> {
  const cleanToken = token.trim()
  const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')

  try {
    const content = utf8ToBase64(JSON.stringify(config, null, 2) + '\n')

    // Try up to 2 attempts in case of 409 SHA conflict from rapid saves
    for (let attempt = 0; attempt < 2; attempt++) {
      const sha = await fetchCurrentFileSha(cleanToken, cleanRepo, branch)
      const putRes = await fetch(
        `https://api.github.com/repos/${cleanRepo}/contents/${CONFIG_FILE_PATH}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'chore(cms): update Bubu Balloon website content via Admin Gear',
            content,
            branch,
            ...(sha ? { sha } : {}),
          }),
        }
      )

      if (putRes.ok) {
        const result = (await putRes.json()) as { commit?: { html_url?: string } }
        return { ok: true, commitUrl: result.commit?.html_url }
      }

      if (putRes.status === 409 && attempt === 0) {
        // Stale SHA conflict -> retry immediately with fresh SHA
        continue
      }

      const errBody = (await putRes.json().catch(() => ({}))) as { message?: string }
      return {
        ok: false,
        error: errBody.message || 'Gagal menyimpan ke GitHub. Cek izin Contents (Read & Write).',
      }
    }

    return { ok: false, error: 'Gagal menyimpan karena konflik versi. Coba klik Publish lagi.' }
  } catch {
    return { ok: false, error: 'Koneksi ke GitHub terputus saat publish.' }
  }
}
