import type { ReactNode } from "react";

/**
 * Toast types for different styling and behavior
 */
export type ToastType =
	| "success"
	| "error"
	| "info"
	| "warning"
	| "loading"
	| "default";

/**
 * Sound configuration for toast notifications
 */
export interface ToastSoundConfig {
	/** Whether sound is enabled globally */
	enabled: boolean;
	/** Volume level (0-1) */
	volume: number;
}

/**
 * Toast position options
 */
export type ToastPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

/**
 * Toast action button configuration
 */
export interface ToastAction {
	/** Button text */
	label: string;
	/** Button click handler */
	onClick: () => void | Promise<void>;
	/** Button variant */
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
}

/**
 * Toast configuration options
 */
export interface ToastConfig {
	/** Toast type for styling and icon */
	type?: ToastType;
	/** Toast title */
	title?: string;
	/** Toast description/message */
	description?: string;
	/** Custom React content (overrides title and description if provided) */
	content?: ReactNode;
	/** Duration in milliseconds (0 for persistent) */
	duration?: number;
	/** Whether toast can be dismissed manually */
	dismissible?: boolean;
	/** Toast position */
	position?: ToastPosition;
	/** Action button */
	action?: ToastAction;
	/** Custom CSS class */
	className?: string;
	/** Whether to show close button */
	closeButton?: boolean;
	/** Rich colors for better visual distinction */
	richColors?: boolean;
	/** Custom icon */
	icon?: ReactNode;
	/** Whether to invert colors */
	invert?: boolean;
	/** Important toast (higher z-index) */
	important?: boolean;
	/** Custom ID for the toast */
	id?: string | number;
	/** Callback when toast is dismissed */
	onDismiss?: (id: string | number) => void;
	/** Callback when action is clicked */
	onAction?: () => void;
	/** Whether to play sound effect for this toast */
	playSound?: boolean;
}

/**
 * Toast response when creating a toast
 */
export interface ToastResponse {
	/** Unique toast ID */
	id: string | number;
	/** Dismiss the toast programmatically */
	dismiss: () => void;
	/** Update the toast content */
	update: (config: Partial<ToastConfig>) => void;
}

/**
 * Predefined toast configurations for common use cases
 */
export interface ToastPresets {
	/** Success toast with checkmark icon */
	success: (
		title?: string,
		description?: string,
		options?: Partial<ToastConfig>,
	) => ToastResponse;
	/** Error toast with X icon */
	error: (
		title?: string,
		description?: string,
		options?: Partial<ToastConfig>,
	) => ToastResponse;
	/** Info toast with info icon */
	info: (
		title?: string,
		description?: string,
		options?: Partial<ToastConfig>,
	) => ToastResponse;
	/** Warning toast with warning icon */
	warning: (
		title?: string,
		description?: string,
		options?: Partial<ToastConfig>,
	) => ToastResponse;
	/** Loading toast with spinner */
	loading: (
		title?: string,
		description?: string,
		options?: Partial<ToastConfig>,
	) => ToastResponse;
	/** Promise-based toast that updates based on promise state */
	promise: <T>(
		promise: Promise<T>,
		config: {
			loading: string | ToastConfig;
			success: string | ToastConfig | ((data: T) => string | ToastConfig);
			error: string | ToastConfig | ((error: Error) => string | ToastConfig);
		},
	) => Promise<T>;
}

/**
 * Toast hook configuration options
 */
export interface UseToastConfig {
	/** Default position for all toasts from this hook instance */
	defaultPosition?: ToastPosition;
	/** Default duration for all toasts from this hook instance */
	defaultDuration?: number;
	/** Default close button setting for all toasts from this hook instance */
	defaultCloseButton?: boolean;
	/** Default rich colors setting for all toasts from this hook instance */
	defaultRichColors?: boolean;
	/** Default sound setting for all toasts from this hook instance */
	defaultPlaySound?: boolean;
	/** Sound configuration */
	soundConfig?: Partial<ToastSoundConfig>;
}

/**
 * Toast hook return type
 */
export interface UseToastReturn {
	/** Show a toast with custom configuration */
	toast: (config: ToastConfig) => ToastResponse;
	/** Dismiss a specific toast by ID */
	dismiss: (id?: string | number) => void;
	/** Dismiss all toasts */
	dismissAll: () => void;
	/** Predefined toast methods */
	success: ToastPresets["success"];
	error: ToastPresets["error"];
	info: ToastPresets["info"];
	warning: ToastPresets["warning"];
	loading: ToastPresets["loading"];
	promise: ToastPresets["promise"];
	/** Get all active toast IDs */
	getActiveToasts: () => Array<string | number>;
	/** Update default configuration for this hook instance */
	setDefaults: (config: Partial<UseToastConfig>) => void;
	/** Get current default configuration */
	getDefaults: () => UseToastConfig;
}

/**
 * Toast context configuration
 */
export interface ToastContextConfig {
	/** Default toast position */
	position?: ToastPosition;
	/** Default toast duration */
	duration?: number;
	/** Maximum number of toasts to show */
	limit?: number;
	/** Whether to show close button by default */
	closeButton?: boolean;
	/** Whether to use rich colors by default */
	richColors?: boolean;
	/** Default toast gap */
	gap?: number;
	/** Whether to expand toasts on hover */
	expand?: boolean;
	/** Offset from screen edges */
	offset?: string | number;
	/** Theme for toasts */
	theme?: "light" | "dark" | "system";
}
