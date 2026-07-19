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

export function applyFormat(value: number, fmt: string): string {
  let result = "";
  let i = 0;
  while (i < fmt.length) {
    if (fmt[i] === "%" && i + 1 < fmt.length) {
      const spec = fmt[i + 1];
      if (spec === "%") {
        result += "%";
        i += 2;
        continue;
      }
      const end = fmt.indexOf(spec, i + 1);
      const raw = end !== -1 ? fmt.substring(i, end + 1) : fmt.substring(i);
      const precMatch = raw.match(/^%\.?(\d*)([fds])$/);
      if (precMatch) {
        const prec = precMatch[1] ? parseInt(precMatch[1], 10) : undefined;
        const type = precMatch[2];
        if (type === "f") {
          result += prec != null ? value.toFixed(prec) : String(value);
        } else if (type === "d") {
          result += String(Math.round(value));
        } else {
          result += String(value);
        }
        i += raw.length;
        continue;
      }
      result += fmt[i];
      i++;
    } else {
      result += fmt[i];
      i++;
    }
  }
  return result;
}
