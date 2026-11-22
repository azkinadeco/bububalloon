import type { SiteConfig } from '../context/SiteConfigContext'

export const DEFAULT_GITHUB_REPO = 'azkinadeco/bububalloon'
export const DEFAULT_GITHUB_BRANCH = 'main'
const CONFIG_FILE_PATH = 'public/site-config.json'

/**
 * Fetch the latest published site-config.json directly from GitHub Raw
 * (updates within seconds after Admin publishes from PC, even before hosting redeploys!),
 * with fallback to local /site-config.json.
 */
export async function fetchLiveSiteConfig(
  repo: string = DEFAULT_GITHUB_REPO,
  branch: string = DEFAULT_GITHUB_BRANCH
): Promise<Partial<SiteConfig> | null> {
  const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
  const ts = Date.now()
  const urls = [
    `https://raw.githubusercontent.com/${cleanRepo}/${encodeURIComponent(branch)}/${CONFIG_FILE_PATH}?t=${ts}`,
    `/site-config.json?t=${ts}`,
  ]

  for (const url of urls) {
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

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
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
      }),
      fetch(`https://api.github.com/repos/${cleanRepo}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github+json',
        },
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

export async function publishSiteConfigToGithub(
  token: string,
  config: SiteConfig,
  repo: string = DEFAULT_GITHUB_REPO,
  branch: string = DEFAULT_GITHUB_BRANCH
): Promise<{ ok: boolean; commitUrl?: string; error?: string }> {
  const cleanToken = token.trim()
  const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')

  try {
    // 1. Get existing file SHA if present
    let sha: string | undefined
    const getRes = await fetch(
      `https://api.github.com/repos/${cleanRepo}/contents/${CONFIG_FILE_PATH}?ref=${encodeURIComponent(branch)}`,
      {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )
    if (getRes.ok) {
      const existing = (await getRes.json()) as { sha?: string }
      sha = existing.sha
    }

    // 2. Commit updated site-config.json
    const content = utf8ToBase64(JSON.stringify(config, null, 2) + '\n')
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

    if (!putRes.ok) {
      const errBody = (await putRes.json().catch(() => ({}))) as { message?: string }
      return {
        ok: false,
        error: errBody.message || 'Gagal menyimpan ke GitHub. Cek izin Contents (Read & Write).',
      }
    }

    const result = (await putRes.json()) as { commit?: { html_url?: string } }
    return { ok: true, commitUrl: result.commit?.html_url }
  } catch {
    return { ok: false, error: 'Koneksi ke GitHub terputus saat publish.' }
  }
}
