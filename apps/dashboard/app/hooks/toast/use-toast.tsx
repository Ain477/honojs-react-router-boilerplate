import type React from "react";
import { useCallback, useState } from "react";
import { toast as sonnerToast } from "sonner";
import { playToastSound } from "./toast-sounds";
import type {
  ToastConfig,
  ToastPresets,
  ToastResponse,
  UseToastConfig,
  UseToastReturn,
} from "./use-toast.types";

/**
 * Custom React hook for managing toast notifications using Sonner
 *
 * This hook provides a clean API for triggering different types of toast notifications
 * throughout the VibeMira application. It follows the same patterns established in the
 * VibeMira project with comprehensive TypeScript support and consistent styling.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { success, error, info, warning } = useToast()
 *
 * // Simple success toast
 * success("Success!", "Your changes have been saved.")
 *
 * // Error toast with action
 * error("Error occurred", "Failed to save changes.", {
 *   action: {
 *     label: "Retry",
 *     onClick: () => handleRetry()
 *   }
 * })
 *
 * // Custom toast with positioning
 * const { toast } = useToast()
 * toast({
 *   type: "info",
 *   title: "Custom Toast",
 *   description: "This is a custom toast message",
 *   duration: 5000,
 *   position: "top-right",
 *   action: {
 *     label: "View Details",
 *     onClick: () => console.log("Action clicked")
 *   }
 * })
 * ```
 *
 * @example
 * ```tsx
 * // Hook with global positioning defaults
 * const { toast, success, setDefaults } = useToast({ defaultPosition: "bottom-right" })
 *
 * // This will appear in bottom-right (using default)
 * success("Success!", "Using default position")
 *
 * // This will override the default and appear in top-left
 * toast({
 *   type: "info",
 *   title: "Override Position",
 *   position: "top-left"
 * })
 * ```
 *
 * @example
 * ```tsx
 * // Promise-based toast
 * const { promise } = useToast()
 *
 * const saveData = async () => {
 *   return promise(
 *     fetch('/api/save'),
 *     {
 *       loading: "Saving...",
 *       success: "Data saved successfully!",
 *       error: "Failed to save data"
 *     }
 *   )
 * }
 * ```
 */
export function useToast(hookConfig?: UseToastConfig): UseToastReturn {
  // State for managing default configuration
  const [defaults, setDefaultsState] = useState<UseToastConfig>({
    defaultPosition: "top-center",
    defaultDuration: undefined,
    defaultCloseButton: false,
    defaultRichColors: false,
    defaultPlaySound: true,
    soundConfig: {
      enabled: false,
      volume: 0.5,
    },
    ...hookConfig,
  });

  // Helper function to convert our config to Sonner format
  const convertToSonnerConfig = useCallback(
    (config: ToastConfig) => {
      const {
        title,
        description,
        content,
        duration = defaults.defaultDuration,
        dismissible = true,
        position = defaults.defaultPosition,
        action,
        className,
        closeButton = defaults.defaultCloseButton,
        richColors = defaults.defaultRichColors,
        icon,
        invert,
        id,
        onDismiss,
        onAction,
      } = config;

      // Build the message content
      let message: string | React.ReactNode = "";
      if (content) {
        message = content;
      } else if (title && description) {
        message = (
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-sm opacity-90">{description}</div>
          </div>
        );
      } else if (title) {
        message = title;
      } else if (description) {
        message = description;
      }

      // Build Sonner options
      const sonnerOptions: Parameters<typeof sonnerToast>[1] = {
        id,
        duration: duration === 0 ? Number.POSITIVE_INFINITY : duration,
        dismissible,
        position,
        className,
        closeButton,
        richColors,
        icon,
        invert,
        onDismiss: onDismiss ? () => onDismiss(id || "") : undefined,
      };

      // Add action if provided
      if (action && sonnerOptions) {
        sonnerOptions.action = {
          label: action.label,
          onClick: () => {
            action.onClick();
            if (onAction) {
              onAction();
            }
          },
        };
      }

      return { message, sonnerOptions };
    },
    [defaults]
  );

  // Main toast function
  // biome-ignore lint/correctness/useExhaustiveDependencies: defaults is complex
  const toast = useCallback(
    (config: ToastConfig): ToastResponse => {
      const { message, sonnerOptions } = convertToSonnerConfig(config);

      // Play sound if enabled
      const shouldPlaySound = config.playSound ?? defaults.defaultPlaySound;
      if (shouldPlaySound && defaults.soundConfig?.enabled && config.type) {
        try {
          playToastSound(config.type, {
            volume: defaults.soundConfig.volume,
            respectReducedMotion: true,
          });
        } catch (error) {
          console.warn("Failed to play toast sound:", error);
        }
      }

      let toastId: string | number;

      // Call appropriate Sonner method based on type
      switch (config.type) {
        case "success":
          toastId = sonnerToast.success(message, sonnerOptions);
          break;
        case "error":
          toastId = sonnerToast.error(message, sonnerOptions);
          break;
        case "info":
          toastId = sonnerToast.info(message, sonnerOptions);
          break;
        case "warning":
          toastId = sonnerToast.warning(message, sonnerOptions);
          break;
        case "loading":
          toastId = sonnerToast.loading(message, sonnerOptions);
          break;
        default:
          toastId = sonnerToast(message, sonnerOptions);
          break;
      }

      return {
        id: toastId,
        dismiss: () => sonnerToast.dismiss(toastId),
        update: (updateConfig: Partial<ToastConfig>) => {
          const mergedConfig = {
            ...config,
            ...updateConfig,
          };
          const { message: newMessage, sonnerOptions: newOptions } =
            convertToSonnerConfig(mergedConfig);

          // Dismiss old toast and create new one for updates
          sonnerToast.dismiss(toastId);
          const newToastId = sonnerToast(newMessage, {
            ...newOptions,
            id: toastId,
          });
          toastId = newToastId;
        },
      };
    },
    [convertToSonnerConfig, defaults.defaultPlaySound]
  );

  // Predefined toast methods
  const success: ToastPresets["success"] = useCallback(
    (
      title?: string,
      description?: string,
      options: Partial<ToastConfig> = {}
    ) => {
      return toast({
        type: "success",
        title,
        description,
        ...options,
      });
    },
    [toast]
  );

  const error: ToastPresets["error"] = useCallback(
    (
      title?: string,
      description?: string,
      options: Partial<ToastConfig> = {}
    ) => {
      return toast({
        type: "error",
        title,
        description,
        ...options,
      });
    },
    [toast]
  );

  const info: ToastPresets["info"] = useCallback(
    (
      title?: string,
      description?: string,
      options: Partial<ToastConfig> = {}
    ) => {
      return toast({
        type: "info",
        title,
        description,
        ...options,
      });
    },
    [toast]
  );

  const warning: ToastPresets["warning"] = useCallback(
    (
      title?: string,
      description?: string,
      options: Partial<ToastConfig> = {}
    ) => {
      return toast({
        type: "warning",
        title,
        description,
        ...options,
      });
    },
    [toast]
  );

  const loading: ToastPresets["loading"] = useCallback(
    (
      title?: string,
      description?: string,
      options: Partial<ToastConfig> = {}
    ) => {
      return toast({
        type: "loading",
        title,
        description,
        duration: 0, // Loading toasts should persist by default
        ...options,
      });
    },
    [toast]
  );

  const promise: ToastPresets["promise"] = useCallback(
    async <T,>(
      promiseToResolve: Promise<T>,
      config: {
        loading: string | ToastConfig;
        success: string | ToastConfig | ((data: T) => string | ToastConfig);
        error: string | ToastConfig | ((error: Error) => string | ToastConfig);
      }
    ): Promise<T> => {
      // Show loading toast
      const loadingConfig =
        typeof config.loading === "string"
          ? {
              type: "loading" as const,
              title: config.loading,
            }
          : { type: "loading" as const, ...config.loading };

      const loadingToast = toast(loadingConfig);

      try {
        const result = await promiseToResolve;

        // Dismiss loading toast
        loadingToast.dismiss();

        // Show success toast
        let successConfig: ToastConfig;
        if (typeof config.success === "string") {
          successConfig = {
            type: "success" as const,
            title: config.success,
          };
        } else if (typeof config.success === "function") {
          const successResult = config.success(result);
          successConfig =
            typeof successResult === "string"
              ? {
                  type: "success" as const,
                  title: successResult,
                }
              : {
                  type: "success" as const,
                  ...successResult,
                };
        } else {
          successConfig = {
            type: "success" as const,
            ...config.success,
          };
        }

        toast(successConfig);

        return result;
      } catch (error) {
        // Dismiss loading toast
        loadingToast.dismiss();

        // Show error toast
        let errorConfig: ToastConfig;
        if (typeof config.error === "string") {
          errorConfig = {
            type: "error" as const,
            title: config.error,
          };
        } else if (typeof config.error === "function") {
          const result = config.error(error as Error);
          errorConfig =
            typeof result === "string"
              ? { type: "error" as const, title: result }
              : { type: "error" as const, ...result };
        } else {
          errorConfig = {
            type: "error" as const,
            ...config.error,
          };
        }

        toast(errorConfig);

        throw error;
      }
    },
    [toast]
  );

  // Utility functions
  const dismiss = useCallback((id?: string | number) => {
    sonnerToast.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    sonnerToast.dismiss();
  }, []);

  const getActiveToasts = useCallback((): Array<string | number> => {
    // Sonner doesn't expose active toasts, so we return empty array
    // This could be enhanced with a custom toast manager if needed
    return [];
  }, []);

  // Configuration management functions
  const setDefaults = useCallback((newDefaults: Partial<UseToastConfig>) => {
    setDefaultsState((prev) => ({
      ...prev,
      ...newDefaults,
    }));
  }, []);

  const getDefaults = useCallback((): UseToastConfig => {
    return { ...defaults };
  }, [defaults]);

  return {
    toast,
    dismiss,
    dismissAll,
    success,
    error,
    info,
    warning,
    loading,
    promise,
    getActiveToasts,
    setDefaults,
    getDefaults,
  };
}
