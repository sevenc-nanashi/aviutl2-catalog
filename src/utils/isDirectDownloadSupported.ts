import { InstallerSource } from './catalogSchema';

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
  if ('direct' in source) {
    return allowedExtensions.some((ext) => source.direct.endsWith(ext));
  }
  if ('github' in source) {
    return allowedExtensions.some(
      (ext) =>
        source.github.pattern.endsWith(ext.replaceAll('.', '\\.') + '$') ||
        source.github.pattern.endsWith(ext.replaceAll('.', '\\.')),
    );
  }

  return false;
}
