import * as z from 'zod';

export const detectResultSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('missing') }),
  z.object({ kind: z.literal('unknown') }),
  z.object({
    kind: z.literal('detected'),
    version: z.string().trim().min(1),
  }),
]);

export type DetectResult = z.infer<typeof detectResultSchema>;
export type DetectResultMap = Record<string, DetectResult>;

export const MISSING_DETECT_RESULT: DetectResult = Object.freeze({ kind: 'missing' });

export function normalizeDetectResult(value: unknown): DetectResult {
  const parsed = detectResultSchema.safeParse(value);
  return parsed.success ? parsed.data : MISSING_DETECT_RESULT;
}

export function normalizeDetectResultMap(value: unknown): DetectResultMap {
  if (!value || typeof value !== 'object') return {};
  const normalized: DetectResultMap = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, raw]) => {
    normalized[key] = normalizeDetectResult(raw);
  });
  return normalized;
}

export function isDetectedResult(
  result: DetectResult | null | undefined,
): result is Extract<DetectResult, { kind: 'detected' }> {
  return result?.kind === 'detected';
}

export function isUnknownDetectResult(result: DetectResult | null | undefined): boolean {
  return result?.kind === 'unknown';
}

export function isInstalledDetectResult(result: DetectResult | null | undefined): boolean {
  return result?.kind === 'detected' || result?.kind === 'unknown';
}

export function getDetectedVersion(result: DetectResult | null | undefined): string {
  return isDetectedResult(result) ? result.version : '';
}

export function getInstalledVersionLabel(
  installedVersion: string | null | undefined,
  result: DetectResult | null | undefined,
  unknownLabel = '',
): string {
  const normalizedInstalledVersion = typeof installedVersion === 'string' ? installedVersion.trim() : '';
  if (normalizedInstalledVersion) return normalizedInstalledVersion;
  return isUnknownDetectResult(result) ? unknownLabel : '';
}
