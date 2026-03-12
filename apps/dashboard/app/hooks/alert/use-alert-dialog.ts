import { useCallback } from "react";
import { useAlertDialogContext } from "./use-alert-dialog.context";
import type {
	AlertDialogButtonState,
	AlertDialogCallbacks,
	AlertDialogConfig,
	AlertDialogPresets,
	AlertDialogResponse,
} from "./use-alert-dialog.types";

/**
 * Enhanced return type for the useAlertDialog hook
 */
export interface UseAlertDialogReturn {
	/** Whether a dialog is currently open */
	isOpen: boolean;
	/** Show dialog with promise-based API - returns a promise that resolves with user's choice */
	showDialog: (config: AlertDialogConfig) => Promise<AlertDialogResponse>;
	/** Show dialog with callback-based API - uses callbacks for handling user actions */
	showDialogWithCallbacks: (
		config: AlertDialogConfig,
		callbacks: AlertDialogCallbacks,
	) => void;
	/** Hide/close the current dialog */
	hideDialog: () => void;
	/** Update button text dynamically while dialog is open */
	updateButtonText: (buttonId: string, newText: string) => void;
	/** Set button loading state while dialog is open */
	setButtonLoading: (buttonId: string, loading: boolean) => void;
	/** Set button disabled state while dialog is open */
	setButtonDisabled: (buttonId: string, disabled: boolean) => void;
	/** Get current button state */
	getButtonState: (buttonId: string) => AlertDialogButtonState | null;
	/** Predefined dialog configurations for common use cases */
	presets: AlertDialogPresets;
	/** Convenience methods for common dialog types */
	alert: {
		/** Show info dialog */
		info: (
			title?: string,
			description?: string,
		) => Promise<AlertDialogResponse>;
		/** Show warning dialog */
		warning: (
			title?: string,
			description?: string,
		) => Promise<AlertDialogResponse>;
		/** Show error dialog */
		error: (
			title?: string,
			description?: string,
		) => Promise<AlertDialogResponse>;
		/** Show confirmation dialog */
		confirm: (
			title?: string,
			description?: string,
			confirmText?: string,
			cancelText?: string,
		) => Promise<boolean>;
		/** Show destructive confirmation dialog (for delete actions, etc.) */
		confirmDestructive: (
			title?: string,
			description?: string,
			confirmText?: string,
			cancelText?: string,
		) => Promise<boolean>;
	};
	/** Enhanced methods for advanced button control */
	buttons: {
		/** Update multiple button states at once */
		updateMultiple: (
			updates: Array<{
				buttonId: string;
				text?: string;
				loading?: boolean;
				disabled?: boolean;
			}>,
		) => void;
		/** Reset all buttons to their original state */
		resetAll: () => void;
		/** Get all current button states */
		getAllStates: () => Map<string, AlertDialogButtonState>;
	};
}

/**
 * Custom React hook for managing alert dialogs
 *
 * This hook provides a global alert dialog system that can be triggered from any component
 * or page in the VibeMira application. It supports both promise-based and callback-based
 * usage patterns for maximum flexibility.
 *
 * @example
 * ```tsx
 * // Promise-based usage
 * const { showDialog, alert } = useAlertDialog()
 *
 * // Simple info dialog
 * await alert.info("Success", "Your changes have been saved.")
 *
 * // Confirmation dialog
 * const confirmed = await alert.confirm("Delete Item", "Are you sure you want to delete this item?")
 * if (confirmed) {
 *   // User confirmed
 * }
 *
 * // Custom dialog with promise
 * const response = await showDialog({
 *   type: "warning",
 *   title: "Unsaved Changes",
 *   description: "You have unsaved changes. What would you like to do?",
 *   buttons: [
 *     { text: "Discard", variant: "outline" },
 *     { text: "Save", variant: "default" },
 *     { text: "Cancel", variant: "ghost" }
 *   ]
 * })
 *
 * if (response.buttonIndex === 1) {
 *   // User clicked "Save"
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Callback-based usage
 * const { showDialogWithCallbacks } = useAlertDialog()
 *
 * showDialogWithCallbacks(
 *   {
 *     type: "confirmation",
 *     title: "Delete Account",
 *     description: "This action cannot be undone."
 *   },
 *   {
 *     onConfirm: () => {
 *       // Handle confirmation
 *     },
 *     onCancel: () => {
 *       // Handle cancellation
 *     }
 *   }
 * )
 * ```
 */
export function useAlertDialog(): UseAlertDialogReturn {
	const context = useAlertDialogContext();

	// Convenience methods for common dialog types
	const alert = {
		info: useCallback(
			(title?: string, description?: string): Promise<AlertDialogResponse> => {
				return context.showDialog(context.presets.info(title, description));
			},
			[context],
		),

		warning: useCallback(
			(title?: string, description?: string): Promise<AlertDialogResponse> => {
				return context.showDialog(context.presets.warning(title, description));
			},
			[context],
		),

		error: useCallback(
			(title?: string, description?: string): Promise<AlertDialogResponse> => {
				return context.showDialog(context.presets.error(title, description));
			},
			[context],
		),

		confirm: useCallback(
			async (
				title?: string,
				description?: string,
				confirmText?: string,
				cancelText?: string,
			): Promise<boolean> => {
				const response = await context.showDialog(
					context.presets.confirmation(
						title,
						description,
						confirmText,
						cancelText,
					),
				);
				return response.confirmed;
			},
			[context],
		),

		confirmDestructive: useCallback(
			async (
				title?: string,
				description?: string,
				confirmText?: string,
				cancelText?: string,
			): Promise<boolean> => {
				const response = await context.showDialog(
					context.presets.destructiveConfirmation(
						title,
						description,
						confirmText,
						cancelText,
					),
				);
				return response.confirmed;
			},
			[context],
		),
	};

	// Enhanced button control methods
	const buttons = {
		updateMultiple: useCallback(
			(
				updates: Array<{
					buttonId: string;
					text?: string;
					loading?: boolean;
					disabled?: boolean;
				}>,
			) => {
				for (const { buttonId, text, loading, disabled } of updates) {
					if (text !== undefined) {
						context.updateButtonText(buttonId, text);
					}
					if (loading !== undefined) {
						context.setButtonLoading(buttonId, loading);
					}
					if (disabled !== undefined) {
						context.setButtonDisabled(buttonId, disabled);
					}
				}
			},
			[context],
		),

		resetAll: useCallback(() => {
			for (const [buttonId, buttonState] of context.state.buttonStates) {
				const original = buttonState.originalButton;
				context.updateButtonText(buttonId, original.text);
				context.setButtonLoading(buttonId, original.loading ?? false);
				context.setButtonDisabled(buttonId, original.disabled ?? false);
			}
		}, [context]),

		getAllStates: useCallback(() => {
			return new Map(context.state.buttonStates);
		}, [context.state.buttonStates]),
	};

	return {
		isOpen: context.state.isOpen,
		showDialog: context.showDialog,
		showDialogWithCallbacks: context.showDialogWithCallbacks,
		hideDialog: context.hideDialog,
		updateButtonText: context.updateButtonText,
		setButtonLoading: context.setButtonLoading,
		setButtonDisabled: context.setButtonDisabled,
		getButtonState: context.getButtonState,
		presets: context.presets,
		alert,
		buttons,
	};
}
