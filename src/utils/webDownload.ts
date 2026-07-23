import type { InstallerSource } from './installer/types';
import type { InstallerRunnableItem } from './installer/types';
import { resolveInstallableCatalogItem } from './catalogInstallItem';
import { formatUnknownError } from './errors';

type GitHubAsset = {
  name?: string;
  browser_download_url?: string;
};

type GitHubRelease = {
  assets?: GitHubAsset[];
  published_at?: string;
  created_at?: string;
};

function pickAssetFromRelease(release: unknown, regex: RegExp): GitHubAsset | null {
  const releaseLike = release as GitHubRelease | null;
  if (!releaseLike || !Array.isArray(releaseLike.assets)) return null;
  return releaseLike.assets.find((asset) => regex.test(asset.name || '')) || null;
}

function findLatestRelease(releases: unknown): GitHubRelease | null {
  if (!Array.isArray(releases) || !releases.length) return null;
  let best: GitHubRelease | null = null;
  let bestTs = -Infinity;
  for (const rel of releases) {
    const releaseLike = rel as GitHubRelease;
    const ts = Date.parse(releaseLike?.published_at || releaseLike?.created_at || '') || 0;
    if (ts > bestTs) {
      best = releaseLike;
      bestTs = ts;
    }
  }
  return best;
}

async function fetchLatestRelease(owner: string, repo: string): Promise<GitHubRelease | null> {
  try {
    const res = await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`[webDownload] fetch latest failed: HTTP ${res.status} repo=${owner}/${repo}`);
      }
      return null;
    }
    return (await res.json().catch(() => null)) as GitHubRelease | null;
  } catch (e: unknown) {
    console.error(`[webDownload] fetch latest failed: ${formatUnknownError(e)}`);
    return null;
  }
}

async function fetchNewestRelease(owner: string, repo: string): Promise<GitHubRelease | null> {
  const res = await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=30`);
  if (!res.ok) {
    throw new Error(`GitHub releases API returned HTTP ${res.status}`);
  }
  const list = await res.json().catch(() => []);
  return findLatestRelease(list);
}

export async function resolveWebDownloadUrl(source: InstallerSource): Promise<string> {
  if (source.type === 'directUrl') {
    return source.url;
  }
  if (source.type === 'githubRelease') {
    const { owner, repo, pattern } = source;
    let regex: RegExp;
    try {
      regex = new RegExp(pattern);
    } catch (e: unknown) {
      throw new Error(`GitHub asset pattern is invalid: ${formatUnknownError(e)}`, { cause: e });
    }

    const latestRelease = await fetchLatestRelease(owner, repo);
    const targetRelease = latestRelease ?? (await fetchNewestRelease(owner, repo));
    if (!targetRelease) {
      throw new Error(`GitHub release not found: ${owner}/${repo}`);
    }

    const asset = pickAssetFromRelease(targetRelease, regex);
    if (!asset?.browser_download_url) {
      throw new Error(`GitHub release asset not found for pattern "${pattern}" in ${owner}/${repo}`);
    }
    return asset.browser_download_url;
  }
  throw new Error('Unsupported source type for web download');
}

export function triggerBrowserDownload(url: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function webDownloadPackage(item: InstallerRunnableItem): Promise<void> {
  const installableItem = await resolveInstallableCatalogItem(item);
  if (!installableItem) throw new Error('No installer source');
  const url = await resolveWebDownloadUrl(installableItem.installer.source);
  triggerBrowserDownload(url);
}
