/**
 * TypeScript types for the useKeyboardShortcuts hook
 *
 * This module defines all the types needed for keyboard shortcut functionality
 * including modifier keys, shortcut configurations, and hook return types.
 */

/**
 * Supported modifier keys for keyboard shortcuts
 */
export type ModifierKey = "ctrl" | "alt" | "shift" | "meta";

/**
 * Keyboard event key values (subset of common keys)
 */
export type KeyboardKey =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12"
  | "Enter"
  | "Escape"
  | "Space"
  | "Tab"
  | "Backspace"
  | "Delete"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Home"
  | "End"
  | "PageUp"
  | "PageDown"
  | "Insert"
  | "PrintScreen"
  | "ScrollLock"
  | "Pause"
  | "/"
  | "?"
  | "."
  | ","
  | ";"
  | ":"
  | "'"
  | '"'
  | "["
  | "]"
  | "{"
  | "}"
  | "+"
  | "-"
  | "="
  | "_"
  | "("
  | ")"
  | "*"
  | "&"
  | "^"
  | "%"
  | "$"
  | "#"
  | "@"
  | "!"
  | "`"
  | "~"
  | "\\"
  | "|";

/**
 * Configuration for a single keyboard shortcut
 */
export interface KeyboardShortcutConfig {
  /** The main key to trigger the shortcut */
  key: KeyboardKey;
  /** Modifier keys that must be pressed with the main key */
  modifiers?: ModifierKey[];
  /** Callback function to execute when shortcut is triggered */
  callback: (event: KeyboardEvent) => void;
  /** Optional description for the shortcut */
  description?: string;
  /** Whether to prevent the default browser behavior */
  preventDefault?: boolean;
  /** Whether to stop event propagation */
  stopPropagation?: boolean;
  /** Whether the shortcut is enabled (default: true) */
  enabled?: boolean;
  /** Target element selector (default: document) */
  target?: string | HTMLElement;
}

/**
 * Shortcut registration options
 */
export interface ShortcutRegistrationOptions {
  /** Optional description for the shortcut */
  description?: string;
  /** Whether to prevent default browser behavior (default: true) */
  preventDefault?: boolean;
  /** Whether to stop event propagation (default: false) */
  stopPropagation?: boolean;
  /** Whether the shortcut is enabled (default: true) */
  enabled?: boolean;
  /** Target element for the shortcut (default: document) */
  target?: string | HTMLElement;
}

/**
 * Shortcut information for display/debugging
 */
export interface ShortcutInfo {
  /** Unique identifier for the shortcut */
  id: string;
  /** The key combination as a string */
  combination: string;
  /** Description of what the shortcut does */
  description?: string;
  /** Whether the shortcut is currently enabled */
  enabled: boolean;
  /** Target element for the shortcut */
  target: string | HTMLElement;
}

/**
 * Hook configuration options
 */
export interface UseKeyboardShortcutsConfig {
  /** Whether shortcuts are globally enabled (default: true) */
  enabled?: boolean;
  /** Whether to log shortcut registrations for debugging */
  debug?: boolean;
  /** Global preventDefault setting (can be overridden per shortcut) */
  preventDefault?: boolean;
  /** Global stopPropagation setting (can be overridden per shortcut) */
  stopPropagation?: boolean;
}

/**
 * Return type for the useKeyboardShortcuts hook
 */
export interface UseKeyboardShortcutsReturn {
  /** Register a new keyboard shortcut */
  register: (
    key: KeyboardKey,
    modifiers: ModifierKey[] | undefined,
    callback: (event: KeyboardEvent) => void,
    options?: ShortcutRegistrationOptions
  ) => string;

  /** Register a shortcut with full configuration */
  registerShortcut: (config: KeyboardShortcutConfig) => string;

  /** Unregister a shortcut by its ID */
  unregister: (id: string) => void;

  /** Unregister all shortcuts */
  unregisterAll: () => void;

  /** Enable or disable a specific shortcut */
  setEnabled: (id: string, enabled: boolean) => void;

  /** Enable or disable all shortcuts */
  setGlobalEnabled: (enabled: boolean) => void;

  /** Get information about all registered shortcuts */
  getShortcuts: () => ShortcutInfo[];

  /** Get information about a specific shortcut */
  getShortcut: (id: string) => ShortcutInfo | undefined;

  /** Check if a shortcut combination is already registered */
  isRegistered: (key: KeyboardKey, modifiers?: ModifierKey[]) => boolean;
}

/**
 * Internal shortcut data structure
 */
export interface InternalShortcut extends KeyboardShortcutConfig {
  /** Unique identifier for the shortcut */
  id: string;
  /** Normalized key combination string for matching */
  combination: string;
}

/**
 * Utility type for creating shortcut combinations
 */
export interface ShortcutCombination {
  key: KeyboardKey;
  modifiers?: ModifierKey[];
}

/**
 * Event handler type for keyboard events
 */
export type KeyboardEventHandler = (event: KeyboardEvent) => void;

/**
 * Predefined common shortcuts for convenience
 */
export const COMMON_SHORTCUTS = {
  COPY: {
    key: "c" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  PASTE: {
    key: "v" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  CUT: {
    key: "x" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  UNDO: {
    key: "z" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  REDO: {
    key: "y" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  SELECT_ALL: {
    key: "a" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  SAVE: {
    key: "s" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  FIND: {
    key: "f" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  NEW: {
    key: "n" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  OPEN: {
    key: "o" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  PRINT: {
    key: "p" as KeyboardKey,
    modifiers: ["ctrl" as ModifierKey],
  },
  REFRESH: { key: "F5" as KeyboardKey, modifiers: [] },
  ESCAPE: { key: "Escape" as KeyboardKey, modifiers: [] },
} as const;
