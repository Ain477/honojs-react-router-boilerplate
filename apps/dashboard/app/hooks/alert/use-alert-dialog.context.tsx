import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import type {
  AlertDialogButton,
  AlertDialogButtonClickContext,
  AlertDialogButtonMetadata,
  AlertDialogButtonState,
  AlertDialogCallbacks,
  AlertDialogConfig,
  AlertDialogContextType,
  AlertDialogPresets,
  AlertDialogResponse,
  AlertDialogState,
} from "./use-alert-dialog.types";

/**
 * Alert dialog context
 */
const AlertDialogContext = createContext<AlertDialogContextType | undefined>(
  undefined
);

/**
 * Generate unique ID for buttons and dialogs
 */
const generateId = () =>
  `alert-dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Initial alert dialog state
 */
const initialState: AlertDialogState = {
  isOpen: false,
  config: null,
  resolve: null,
  callbacks: null,
  buttonStates: new Map(),
  openedAt: null,
  dialogId: null,
};

/**
 * Predefined alert dialog configurations
 */
const createPresets = (): AlertDialogPresets => ({
  info: (title?: string, description?: string) => ({
    type: "info",
    title,
    description,
    buttons: [{ text: "OK", variant: "default", autoFocus: true }],
    dismissible: true,
  }),

  warning: (title?: string, description?: string) => ({
    type: "warning",
    title,
    description,
    buttons: [{ text: "OK", variant: "default", autoFocus: true }],
    dismissible: true,
  }),

  error: (title?: string, description?: string) => ({
    type: "error",
    title,
    description,
    buttons: [{ text: "OK", variant: "default", autoFocus: true }],
    dismissible: true,
  }),

  confirmation: (
    title?: string,
    description?: string,
    confirmText = "Confirm",
    cancelText = "Cancel"
  ) => ({
    type: "confirmation",
    title,
    description,
    buttons: [
      { text: cancelText, variant: "outline" },
      {
        text: confirmText,
        variant: "default",
        autoFocus: true,
      },
    ],
    dismissible: true,
  }),

  destructiveConfirmation: (
    title?: string,
    description?: string,
    confirmText = "Delete",
    cancelText = "Cancel"
  ) => ({
    type: "confirmation",
    title,
    description,
    buttons: [
      { text: cancelText, variant: "outline" },
      {
        text: confirmText,
        variant: "destructive",
        autoFocus: true,
      },
    ],
    dismissible: true,
  }),
});

/**
 * Alert dialog provider props
 */
interface AlertDialogProviderProps {
  children: ReactNode;
}

/**
 * Alert dialog provider component
 */
export function AlertDialogProvider({ children }: AlertDialogProviderProps) {
  const [state, setState] = useState<AlertDialogState>(initialState);

  /**
   * Initialize button states from config
   */
  const initializeButtonStates = useCallback(
    (config: AlertDialogConfig): Map<string, AlertDialogButtonState> => {
      const buttonStates = new Map<string, AlertDialogButtonState>();

      config.buttons?.forEach((button, index) => {
        const buttonId = button.id || `button-${index}`;
        buttonStates.set(buttonId, {
          id: buttonId,
          text: button.text,
          loading: button.loading ?? false,
          disabled: button.disabled ?? false,
          originalButton: { ...button, id: buttonId },
        });
      });

      return buttonStates;
    },
    []
  );

  /**
   * Show dialog with promise-based API
   */
  const showDialog = useCallback(
    (config: AlertDialogConfig): Promise<AlertDialogResponse> => {
      return new Promise((resolve) => {
        const dialogId = generateId();
        const buttonStates = initializeButtonStates(config);

        setState({
          isOpen: true,
          config: {
            ...config,
            buttons: config.buttons?.map((button, index) => ({
              ...button,
              id: button.id || `button-${index}`,
            })),
          },
          resolve,
          callbacks: null,
          buttonStates,
          openedAt: Date.now(),
          dialogId,
        });
      });
    },
    [initializeButtonStates]
  );

  /**
   * Show dialog with callback-based API
   */
  const showDialogWithCallbacks = useCallback(
    (config: AlertDialogConfig, callbacks: AlertDialogCallbacks) => {
      const dialogId = generateId();
      const buttonStates = initializeButtonStates(config);

      setState({
        isOpen: true,
        config: {
          ...config,
          buttons: config.buttons?.map((button, index) => ({
            ...button,
            id: button.id || `button-${index}`,
          })),
        },
        resolve: null,
        callbacks,
        buttonStates,
        openedAt: Date.now(),
        dialogId,
      });
    },
    [initializeButtonStates]
  );

  /**
   * Hide/close the current dialog
   */
  const hideDialog = useCallback(() => {
    const currentState = state;

    setState(initialState);

    // Handle promise-based API
    if (currentState.resolve) {
      currentState.resolve({
        confirmed: false,
        buttonIndex: -1,
        buttonText: null,
        buttonMetadata: null,
        wasDismissed: true,
      });
    }

    // Handle callback-based API
    if (currentState.callbacks?.onCancel) {
      currentState.callbacks.onCancel();
    }
    if (currentState.callbacks?.onClose) {
      currentState.callbacks.onClose();
    }
  }, [state]);

  /**
   * Update button text dynamically
   */
  const updateButtonText = useCallback((buttonId: string, newText: string) => {
    setState((prevState) => {
      const newButtonStates = new Map(prevState.buttonStates);
      const buttonState = newButtonStates.get(buttonId);
      if (buttonState) {
        newButtonStates.set(buttonId, {
          ...buttonState,
          text: newText,
        });
      }
      return {
        ...prevState,
        buttonStates: newButtonStates,
      };
    });
  }, []);

  /**
   * Set button loading state
   */
  const setButtonLoading = useCallback((buttonId: string, loading: boolean) => {
    setState((prevState) => {
      const newButtonStates = new Map(prevState.buttonStates);
      const buttonState = newButtonStates.get(buttonId);
      if (buttonState) {
        newButtonStates.set(buttonId, {
          ...buttonState,
          loading,
        });
      }
      return {
        ...prevState,
        buttonStates: newButtonStates,
      };
    });
  }, []);

  /**
   * Set button disabled state
   */
  const setButtonDisabled = useCallback(
    (buttonId: string, disabled: boolean) => {
      setState((prevState) => {
        const newButtonStates = new Map(prevState.buttonStates);
        const buttonState = newButtonStates.get(buttonId);
        if (buttonState) {
          newButtonStates.set(buttonId, {
            ...buttonState,
            disabled,
          });
        }
        return {
          ...prevState,
          buttonStates: newButtonStates,
        };
      });
    },
    []
  );

  /**
   * Get current button state
   */
  const getButtonState = useCallback(
    (buttonId: string): AlertDialogButtonState | null => {
      return state.buttonStates.get(buttonId) || null;
    },
    [state.buttonStates]
  );

  /**
   * Create button metadata for tracking
   */
  const createButtonMetadata = useCallback(
    (
      buttonIndex: number,
      button: AlertDialogButton,
      buttonState: AlertDialogButtonState,
      openedAt: number
    ): AlertDialogButtonMetadata => {
      return {
        index: buttonIndex,
        id: button.id || `button-${buttonIndex}`,
        text: buttonState.text,
        variant: button.variant,
        wasLoading: buttonState.loading,
        wasDisabled: buttonState.disabled,
        timestamp: Date.now(),
        interactionTime: Date.now() - openedAt,
      };
    },
    []
  );

  /**
   * Finalize button click and update state
   */
  const finalizeButtonClick = useCallback(
    (
      buttonIndex: number,
      button: AlertDialogButton,
      buttonState: AlertDialogButtonState,
      currentState: AlertDialogState
    ) => {
      const isConfirmed = buttonIndex > 0;
      const buttonMetadata = createButtonMetadata(
        buttonIndex,
        button,
        buttonState,
        currentState.openedAt || Date.now()
      );

      setState(initialState);

      if (currentState.resolve) {
        currentState.resolve({
          confirmed: isConfirmed,
          buttonIndex,
          buttonText: buttonState.text,
          buttonMetadata,
          wasDismissed: false,
        });
      }

      if (currentState.callbacks) {
        const cb = currentState.callbacks;
        if (cb.onButtonClick) {
          cb.onButtonClick(buttonIndex, buttonState.text);
        }
        if (isConfirmed && cb.onConfirm) {
          cb.onConfirm();
        } else if (!isConfirmed && cb.onCancel) {
          cb.onCancel();
        }
        if (cb.onClose) {
          cb.onClose();
        }
      }
    },
    [createButtonMetadata]
  );

  /**
   * Enhanced button click handler
   */
  const handleEnhancedButtonClick = useCallback(
    async (buttonIndex: number, button: AlertDialogButton) => {
      const currentState = state;
      const buttonId = button.id || `button-${buttonIndex}`;
      const buttonState = currentState.buttonStates.get(buttonId);

      if (!buttonState || buttonState.disabled) {
        return;
      }

      let shouldCloseDialog = true;
      const clickContext: AlertDialogButtonClickContext = {
        buttonIndex,
        button,
        updateButtonText: (newText: string) =>
          updateButtonText(buttonId, newText),
        setButtonLoading: (loading: boolean) =>
          setButtonLoading(buttonId, loading),
        setButtonDisabled: (disabled: boolean) =>
          setButtonDisabled(buttonId, disabled),
        closeDialog: () => {
          shouldCloseDialog = true;
        },
        preventDefault: () => {
          shouldCloseDialog = false;
        },
      };

      try {
        if (button.onClick) {
          await button.onClick(clickContext);
        }
        if (button.onClickLegacy) {
          await button.onClickLegacy();
        }
      } catch (error) {
        console.error("Button click failed:", error);
        return;
      }

      if (shouldCloseDialog) {
        finalizeButtonClick(buttonIndex, button, buttonState, currentState);
      }
    },
    [
      state,
      updateButtonText,
      setButtonLoading,
      setButtonDisabled,
      finalizeButtonClick,
    ]
  );

  const contextValue: AlertDialogContextType = {
    state,
    showDialog,
    showDialogWithCallbacks,
    hideDialog,
    updateButtonText,
    setButtonLoading,
    setButtonDisabled,
    getButtonState,
    presets: createPresets(),
    // Internal method for dialog component
    _handleButtonClick: handleEnhancedButtonClick,
  };

  return React.createElement(
    AlertDialogContext.Provider,
    { value: contextValue },
    children
  );
}

/**
 * Custom hook to use the alert dialog context
 */
export function useAlertDialogContext() {
  const context = useContext(AlertDialogContext);
  if (context === undefined) {
    throw new Error(
      "useAlertDialogContext must be used within an AlertDialogProvider"
    );
  }
  return context;
}
