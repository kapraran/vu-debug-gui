/// <reference types="vite/client" />

declare const __ICONS__: boolean;

declare module "#icons" {
  import type { IconData } from "./app/core/tweakpane-shim/types";
  export const ICON_REGISTRY: Record<string, IconData>;
}
