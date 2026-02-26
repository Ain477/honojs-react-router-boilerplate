import { useCallback, useEffect, useRef, useState } from "react";
import type {
  InternalShortcut,
  KeyboardKey,
  KeyboardShortcutConfig,
  ModifierKey,
  ShortcutInfo,
  ShortcutRegistrationOptions,
  UseKeyboardShortcutsConfig,
  UseKeyboardShortcutsReturn,
} from "./use-keyboard-shortcuts.types";

/**
 * Custom React hook for managing keyboard shortcuts throughout the application
 *
 * This hook provides a comprehensive API for registering, managing, and handling
 * keyboard shortcuts with proper cleanup and TypeScript support. It handles
 * modifier keys, prevents conflicts with browser shortcuts, and provides
 * debugging capabilities.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { register, unregister } = useKeyboardShortcuts()
 *
 * // Register a simple shortcut
 * const shortcutId = register("s", ["ctrl"], () => {
 *   console.log("Save shortcut triggered!")
 * })
 *
 * // Register with options
 * register("Escape", [], handleEscape, {
 *   preventDefault: false,
 *   target: "#modal"
 * })
 *
 * // Cleanup
 * unregister(shortcutId)
 * ```
 *
 * @example
 * ```tsx
 * // Advanced usage with configuration
 * const shortcuts = useKeyboardShortcuts({
 *   enabled: true,
 *   debug: true,
 *   preventDefault: true
 * })
 *
 * // Register multiple shortcuts
 * shortcuts.registerShortcut({
 *   key: "n",
 *   modifiers: ["ctrl", "shift"],
 *   callback: createNewItem,
 *   description: "Create new item",
 *   preventDefault: true
 * })
 * ```
 */
export function useKeyboardShortcuts(
  config: UseKeyboardShortcutsConfig = {}
): UseKeyboardShortcutsReturn {
  const {
    enabled: globalEnabled = true,
    debug = false,
    preventDefault: globalPreventDefault = true,
    stopPropagation: globalStopPropagation = false,
  } = config;

  // State for managing shortcuts
  const [shortcuts, setShortcuts] = useState<Map<string, InternalShortcut>>(
    new Map()
  );
  const [isGlobalEnabled, setIsGlobalEnabled] = useState(globalEnabled);

  // Ref to track the current shortcuts for event handlers
  const shortcutsRef = useRef<Map<string, InternalShortcut>>(new Map());
  const globalEnabledRef = useRef(isGlobalEnabled);

  // Update refs when state changes
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    globalEnabledRef.current = isGlobalEnabled;
  }, [isGlobalEnabled]);

  /**
   * Generate a unique ID for a shortcut
   */
  const generateShortcutId = useCallback((): string => {
    return `shortcut_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Normalize a key combination into a string for matching
   */
  const normalizeCombination = useCallback(
    (key: KeyboardKey, modifiers: ModifierKey[] = []): string => {
      const sortedModifiers = [...modifiers].sort();
      return `${sortedModifiers.join("+")}_${key.toLowerCase()}`;
    },
    []
  );

  /**
   * Check if the current event matches a shortcut combination
   */
  const matchesShortcut = useCallback(
    (event: KeyboardEvent, shortcut: InternalShortcut): boolean => {
      // Check if the main key matches
      if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
        return false;
      }

      // Check modifier keys
      const requiredModifiers = shortcut.modifiers || [];
      const hasCtrl = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
      const hasAlt = event.altKey;
      const hasShift = event.shiftKey;
      const hasMeta = event.metaKey;

      // Count required modifiers
      const requiredCtrl =
        requiredModifiers.includes("ctrl") ||
        requiredModifiers.includes("meta");
      const requiredAlt = requiredModifiers.includes("alt");
      const requiredShift = requiredModifiers.includes("shift");
      const requiredMeta = requiredModifiers.includes("meta");

      // Check if all required modifiers are present and no extra ones
      return (
        hasCtrl === requiredCtrl &&
        hasAlt === requiredAlt &&
        hasShift === requiredShift &&
        (!requiredMeta || hasMeta === requiredMeta)
      );
    },
    []
  );

  /**
   * Execute a shortcut callback and handle event prevention
   */
  const executeShortcut = useCallback(
    (event: KeyboardEvent, shortcut: InternalShortcut, id: string) => {
      const shouldPreventDefault =
        shortcut.preventDefault ?? globalPreventDefault;
      if (shouldPreventDefault) {
        event.preventDefault();
      }

      const shouldStopPropagation =
        shortcut.stopPropagation ?? globalStopPropagation;
      if (shouldStopPropagation) {
        event.stopPropagation();
      }

      try {
        shortcut.callback(event);

        if (debug) {
          console.log(`Keyboard shortcut executed: ${shortcut.combination}`, {
            id,
            description: shortcut.description,
            event,
          });
        }
      } catch (error) {
        console.error(
          `Error executing keyboard shortcut ${shortcut.combination}:`,
          error
        );
      }
    },
    [debug, globalPreventDefault, globalStopPropagation]
  );

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!globalEnabledRef.current) {
        return;
      }

      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true";

      // Check each registered shortcut
      for (const [id, shortcut] of shortcutsRef.current) {
        const canExecute =
          shortcut.enabled !== false && (!isInput || !!shortcut.target);

        if (canExecute && matchesShortcut(event, shortcut)) {
          executeShortcut(event, shortcut, id);
          break;
        }
      }
    },
    [matchesShortcut, executeShortcut]
  );

  /**
   * Set up event listeners
   */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Register a new keyboard shortcut
   */
  const register = useCallback(
    (
      key: KeyboardKey,
      modifiers: ModifierKey[] | undefined,
      callback: (event: KeyboardEvent) => void,
      options: ShortcutRegistrationOptions = {}
    ): string => {
      const id = generateShortcutId();
      const combination = normalizeCombination(key, modifiers);

      const shortcut: InternalShortcut = {
        id,
        key,
        modifiers,
        callback,
        combination,
        description: options.description,
        preventDefault: options.preventDefault,
        stopPropagation: options.stopPropagation,
        enabled: options.enabled ?? true,
        target: options.target,
      };

      setShortcuts((prev) => new Map(prev).set(id, shortcut));

      if (debug) {
        console.log(`Registered keyboard shortcut: ${combination}`, {
          id,
          shortcut,
        });
      }

      return id;
    },
    [generateShortcutId, normalizeCombination, debug]
  );

  /**
   * Register a shortcut with full configuration
   */
  const registerShortcut = useCallback(
    (config: KeyboardShortcutConfig): string => {
      return register(config.key, config.modifiers, config.callback, {
        description: config.description,
        preventDefault: config.preventDefault,
        stopPropagation: config.stopPropagation,
        enabled: config.enabled,
        target: config.target,
      });
    },
    [register]
  );

  /**
   * Unregister a shortcut by its ID
   */
  const unregister = useCallback(
    (id: string): void => {
      setShortcuts((prev) => {
        const newMap = new Map(prev);
        const removed = newMap.delete(id);

        if (debug && removed) {
          console.log(`Unregistered keyboard shortcut: ${id}`);
        }

        return newMap;
      });
    },
    [debug]
  );

  /**
   * Unregister all shortcuts
   */
  const unregisterAll = useCallback((): void => {
    setShortcuts(new Map());

    if (debug) {
      console.log("Unregistered all keyboard shortcuts");
    }
  }, [debug]);

  /**
   * Enable or disable a specific shortcut
   */
  const setEnabled = useCallback(
    (id: string, enabled: boolean): void => {
      setShortcuts((prev) => {
        const newMap = new Map(prev);
        const shortcut = newMap.get(id);

        if (shortcut) {
          newMap.set(id, { ...shortcut, enabled });

          if (debug) {
            console.log(
              `${enabled ? "Enabled" : "Disabled"} keyboard shortcut: ${shortcut.combination}`
            );
          }
        }

        return newMap;
      });
    },
    [debug]
  );

  /**
   * Enable or disable all shortcuts
   */
  const setGlobalEnabled = useCallback(
    (enabled: boolean): void => {
      setIsGlobalEnabled(enabled);

      if (debug) {
        console.log(
          `${enabled ? "Enabled" : "Disabled"} all keyboard shortcuts`
        );
      }
    },
    [debug]
  );

  /**
   * Get information about all registered shortcuts
   */
  const getShortcuts = useCallback((): ShortcutInfo[] => {
    return Array.from(shortcuts.values()).map((shortcut) => ({
      id: shortcut.id,
      combination: shortcut.combination,
      description: shortcut.description,
      enabled: shortcut.enabled ?? true,
      target: shortcut.target || "document",
    }));
  }, [shortcuts]);

  /**
   * Get information about a specific shortcut
   */
  const getShortcut = useCallback(
    (id: string): ShortcutInfo | undefined => {
      const shortcut = shortcuts.get(id);
      if (!shortcut) {
        return undefined;
      }

      return {
        id: shortcut.id,
        combination: shortcut.combination,
        description: shortcut.description,
        enabled: shortcut.enabled ?? true,
        target: shortcut.target || "document",
      };
    },
    [shortcuts]
  );

  /**
   * Check if a shortcut combination is already registered
   */
  const isRegistered = useCallback(
    (key: KeyboardKey, modifiers: ModifierKey[] = []): boolean => {
      const combination = normalizeCombination(key, modifiers);
      return Array.from(shortcuts.values()).some(
        (shortcut) => shortcut.combination === combination
      );
    },
    [shortcuts, normalizeCombination]
  );

  return {
    register,
    registerShortcut,
    unregister,
    unregisterAll,
    setEnabled,
    setGlobalEnabled,
    getShortcuts,
    getShortcut,
    isRegistered,
  };
}
