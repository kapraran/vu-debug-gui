export function isValidNumber(raw: string): boolean {
  return raw.trim() !== "" && !isNaN(Number(raw));
}

export function stepDecimals(step: number): number {
  const s = String(step);
  return s.includes(".") ? s.split(".")[1].length : 0;
}

export function normalizeOptions(raw: Record<string, unknown> | unknown[]): Record<string, unknown> {
  if (Array.isArray(raw)) {
    return Object.fromEntries(raw.map((v) => [String(v), v]));
  }
  return raw;
}

export function findKeyByValue(options: Record<string, unknown>, value: unknown): string | undefined {
  for (const [k, v] of Object.entries(options)) {
    if (v === value) return k;
  }
  return undefined;
}
