import type { ReactNode } from "react";

/**
 * Alert dialog types for different styling and behavior
 */
export type AlertDialogType = "info" | "warning" | "error" | "confirmation";

/**
 * Button click context for enhanced button interactions
 */
export interface AlertDialogButtonClickContext {
	/** Index of the button that was clicked */
	buttonIndex: number;
	/** Current button configuration */
	button: AlertDialogButton;
	/** Function to update button text dynamically */
	updateButtonText: (newText: string) => void;
	/** Function to set button loading state */
	setButtonLoading: (loading: boolean) => void;
	/** Function to set button disabled state */
	setButtonDisabled: (disabled: boolean) => void;
	/** Function to close the dialog programmatically */
	closeDialog: () => void;
	/** Function to prevent default dialog closing behavior */
	preventDefault: () => void;
}

/**
 * Enhanced button configuration for alert dialog actions
 */
export interface AlertDialogButton {
	/** Button text (can be updated dynamically) */
	text: string;
	/** Button variant following shadcn/ui button variants */
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	/** Whether this button should be auto-focused */
	autoFocus?: boolean;
	/** Whether button is in loading state */
	loading?: boolean;
	/** Whether button is disabled */
	disabled?: boolean;
	/** Unique identifier for the button (auto-generated if not provided) */
	id?: string;
	/**
	 * Enhanced callback when button is clicked
	 * @param context - Enhanced context with button control methods
	 * @returns Promise<void> or void. If Promise rejects, dialog won't close automatically
	 */
	onClick?: (context: AlertDialogButtonClickContext) => void | Promise<void>;
	/**
	 * Legacy callback for backward compatibility
	 * @deprecated Use onClick with context parameter instead
	 */
	onClickLegacy?: () => void | Promise<void>;
}

/**
 * Alert dialog configuration options
 */
export interface AlertDialogConfig {
	/** Dialog type for styling and icon */
	type?: AlertDialogType;
	/** Dialog title (optional) */
	title?: string;
	/** Dialog description/content */
	description?: string;
	/** Custom React content (overrides description if provided) */
	content?: ReactNode;
	/** Custom action buttons */
	buttons?: AlertDialogButton[];
	/** Whether dialog can be dismissed by clicking outside or pressing escape */
	dismissible?: boolean;
	/** Custom CSS class for dialog content */
	className?: string;
	/** Maximum width of the dialog */
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
	/** Whether to show the type icon (defaults to false) */
	showIcon?: boolean;
}

/**
 * Predefined alert dialog configurations for common use cases
 */
export interface AlertDialogPresets {
	/** Simple info dialog with OK button */
	info: (title?: string, description?: string) => AlertDialogConfig;
	/** Warning dialog with OK button */
	warning: (title?: string, description?: string) => AlertDialogConfig;
	/** Error dialog with OK button */
	error: (title?: string, description?: string) => AlertDialogConfig;
	/** Confirmation dialog with Cancel and Confirm buttons */
	confirmation: (
		title?: string,
		description?: string,
		confirmText?: string,
		cancelText?: string,
	) => AlertDialogConfig;
	/** Destructive confirmation dialog (for delete actions, etc.) */
	destructiveConfirmation: (
		title?: string,
		description?: string,
		confirmText?: string,
		cancelText?: string,
	) => AlertDialogConfig;
}

/**
 * Button interaction metadata for tracking and analytics
 */
export interface AlertDialogButtonMetadata {
	/** Button index */
	index: number;
	/** Button ID */
	id: string;
	/** Button text at time of click */
	text: string;
	/** Button variant */
	variant: AlertDialogButton["variant"];
	/** Whether button was in loading state when clicked */
	wasLoading: boolean;
	/** Whether button was disabled when clicked */
	wasDisabled: boolean;
	/** Timestamp of button click */
	timestamp: number;
	/** Time taken from dialog open to button click (in milliseconds) */
	interactionTime: number;
}

/**
 * Enhanced alert dialog response when using promise-based API
 */
export interface AlertDialogResponse {
	/** Whether the dialog was confirmed (true) or cancelled/dismissed (false) */
	confirmed: boolean;
	/** Index of the button that was clicked (-1 if dismissed) */
	buttonIndex: number;
	/** Text of the button that was clicked (null if dismissed) */
	buttonText: string | null;
	/** Enhanced button metadata for tracking and analytics */
	buttonMetadata: AlertDialogButtonMetadata | null;
	/** Whether the dialog was dismissed (ESC, click outside, etc.) */
	wasDismissed: boolean;
}

/**
 * Callback-based alert dialog options
 */
export interface AlertDialogCallbacks {
	/** Called when dialog is confirmed */
	onConfirm?: () => void | Promise<void>;
	/** Called when dialog is cancelled or dismissed */
	onCancel?: () => void | Promise<void>;
	/** Called when any button is clicked */
	onButtonClick?: (
		buttonIndex: number,
		buttonText: string,
	) => void | Promise<void>;
	/** Called when dialog is closed (regardless of how) */
	onClose?: () => void | Promise<void>;
}

/**
 * Dynamic button state for runtime updates
 */
export interface AlertDialogButtonState {
	/** Button ID */
	id: string;
	/** Current button text */
	text: string;
	/** Current loading state */
	loading: boolean;
	/** Current disabled state */
	disabled: boolean;
	/** Original button configuration */
	originalButton: AlertDialogButton;
}

/**
 * Enhanced internal alert dialog state
 */
export interface AlertDialogState {
	/** Whether dialog is currently open */
	isOpen: boolean;
	/** Current dialog configuration */
	config: AlertDialogConfig | null;
	/** Promise resolve function for promise-based API */
	resolve: ((response: AlertDialogResponse) => void) | null;
	/** Callback functions for callback-based API */
	callbacks: AlertDialogCallbacks | null;
	/** Dynamic button states for runtime updates */
	buttonStates: Map<string, AlertDialogButtonState>;
	/** Timestamp when dialog was opened (for interaction time tracking) */
	openedAt: number | null;
	/** Unique dialog instance ID for tracking */
	dialogId: string | null;
}

/**
 * Enhanced alert dialog context type
 */
export interface AlertDialogContextType {
	/** Current dialog state */
	state: AlertDialogState;
	/** Show dialog with promise-based API */
	showDialog: (config: AlertDialogConfig) => Promise<AlertDialogResponse>;
	/** Show dialog with callback-based API */
	showDialogWithCallbacks: (
		config: AlertDialogConfig,
		callbacks: AlertDialogCallbacks,
	) => void;
	/** Hide/close the current dialog */
	hideDialog: () => void;
	/** Update button text dynamically */
	updateButtonText: (buttonId: string, newText: string) => void;
	/** Set button loading state */
	setButtonLoading: (buttonId: string, loading: boolean) => void;
	/** Set button disabled state */
	setButtonDisabled: (buttonId: string, disabled: boolean) => void;
	/** Get current button state */
	getButtonState: (buttonId: string) => AlertDialogButtonState | null;
	/** Predefined dialog configurations */
	presets: AlertDialogPresets;
	/** Internal method for dialog component to handle button clicks */
	_handleButtonClick: (
		buttonIndex: number,
		button: AlertDialogButton,
	) => Promise<void>;
}
