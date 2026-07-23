import type { InstallerSource } from './installer/types';

const allowedExtensions = [
  '.au2pkg.zip',
  '.anm2',
  '.obj2',
  '.tra2',
  '.scn2',
  '.cam2',
  '.aui2',
  '.auo2',
  '.auf2',
  '.aux2',
];

export function checkIsDirectDownloadSupported(item: { installer?: { source: InstallerSource } }): boolean {
  const source = item.installer?.source;
  if (!source) return false;
  if (source.type === 'directUrl') {
    return allowedExtensions.some((ext) => source.url.endsWith(ext));
  }
  if (source.type === 'githubRelease') {
    return allowedExtensions.some(
      (ext) =>
        source.pattern.endsWith(ext.replaceAll('.', '\\.') + '$') ||
        source.pattern.endsWith(ext.replaceAll('.', '\\.')),
    );
  }

  return false;
}
