/**
 * Toast sound utilities for generating and playing notification sounds
 *
 * This module provides programmatic sound generation for toast notifications
 * using the Web Audio API. It creates simple, pleasant tones for different
 * toast types without requiring external audio files.
 *
 * @example
 * ```tsx
 * import { playToastSound, createToastSoundManager } from "@/utils/toast-sounds"
 *
 * // Play a success sound
 * playToastSound("success")
 *
 * // Create a sound manager with custom settings
 * const soundManager = createToastSoundManager({ volume: 0.3 })
 * soundManager.play("error")
 * ```
 */

import type { ToastType } from "./use-toast.types";

/**
 * Sound configuration for toast notifications
 */
export interface SoundConfig {
	/** Volume level (0-1) */
	volume: number;
	/** Duration of the sound in milliseconds */
	duration: number;
	/** Whether to respect user's reduced motion preference */
	respectReducedMotion: boolean;
}

/**
 * Default sound configuration
 */
const DEFAULT_SOUND_CONFIG: SoundConfig = {
	volume: 0.2,
	duration: 600,
	respectReducedMotion: true,
};

/**
 * Sound frequencies for different toast types
 */
const TOAST_SOUND_FREQUENCIES = {
	success: [523.25, 659.25, 783.99], // C5, E5, G5 - Major chord (pleasant, uplifting)
	error: [220, 185, 165], // A3, F#3, E3 - Descending (attention-grabbing)
	warning: [440, 554.37], // A4, C#5 - Alert tone (noticeable but not harsh)
	info: [523.25, 698.46], // C5, F5 - Simple notification (gentle)
	loading: [440], // A4 - Single tone (subtle)
	default: [440], // A4 - Single tone (neutral)
} as const;

/**
 * Check if the user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") {
		return false;
	}
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if Web Audio API is supported
 */
function isWebAudioSupported(): boolean {
	return typeof window !== "undefined" && "AudioContext" in window;
}

/**
 * Create an audio context with proper browser compatibility
 */
function createAudioContext(): AudioContext | null {
	if (!isWebAudioSupported()) {
		return null;
	}

	try {
		// Handle webkit prefix for older browsers
		const AudioContextClass =
			window.AudioContext ||
			(
				window as typeof window & {
					webkitAudioContext?: typeof AudioContext;
				}
			).webkitAudioContext;
		return new AudioContextClass();
	} catch (error) {
		console.warn("Failed to create AudioContext:", error);
		return null;
	}
}

/**
 * Play a tone with specified frequency and duration
 */
function playTone(
	audioContext: AudioContext,
	frequency: number,
	duration: number,
	volume: number,
	delay = 0,
): void {
	try {
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.frequency.setValueAtTime(
			frequency,
			audioContext.currentTime + delay,
		);
		oscillator.type = "sine";

		// Create a smooth envelope to avoid clicks
		const startTime = audioContext.currentTime + delay;
		const endTime = startTime + duration / 1000;

		gainNode.gain.setValueAtTime(0, startTime);
		gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
		gainNode.gain.exponentialRampToValueAtTime(0.001, endTime - 0.01);
		gainNode.gain.setValueAtTime(0, endTime);

		oscillator.start(startTime);
		oscillator.stop(endTime);
	} catch (error) {
		console.warn("Failed to play tone:", error);
	}
}

/**
 * Play a sound for a specific toast type
 */
export function playToastSound(
	type: ToastType,
	config: Partial<SoundConfig> = {},
): void {
	const finalConfig = {
		...DEFAULT_SOUND_CONFIG,
		...config,
	};

	// Respect user's reduced motion preference
	if (finalConfig.respectReducedMotion && prefersReducedMotion()) {
		return;
	}

	const audioContext = createAudioContext();
	if (!audioContext) {
		console.warn("Web Audio API not supported");
		return;
	}

	// Resume audio context if it's suspended (required by some browsers)
	if (audioContext.state === "suspended") {
		audioContext.resume().catch((error) => {
			console.warn("Failed to resume audio context:", error);
		});
	}

	const frequencies =
		TOAST_SOUND_FREQUENCIES[type] || TOAST_SOUND_FREQUENCIES.default;

	// Play each frequency in the chord with slight delays for harmony
	frequencies.forEach((frequency, index) => {
		const delay = index * 0.05; // 50ms delay between notes
		playTone(
			audioContext,
			frequency,
			finalConfig.duration,
			finalConfig.volume,
			delay,
		);
	});
}

/**
 * Toast sound manager class for more advanced usage
 */
export class ToastSoundManager {
	private config: SoundConfig;
	private audioContext: AudioContext | null;

	constructor(config: Partial<SoundConfig> = {}) {
		this.config = { ...DEFAULT_SOUND_CONFIG, ...config };
		this.audioContext = createAudioContext();
	}

	/**
	 * Play a sound for a specific toast type
	 */
	play(type: ToastType): void {
		playToastSound(type, this.config);
	}

	/**
	 * Update the sound configuration
	 */
	updateConfig(config: Partial<SoundConfig>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * Get the current configuration
	 */
	getConfig(): SoundConfig {
		return { ...this.config };
	}

	/**
	 * Check if sound is available
	 */
	isAvailable(): boolean {
		return this.audioContext !== null;
	}

	/**
	 * Dispose of the audio context
	 */
	dispose(): void {
		if (this.audioContext) {
			this.audioContext.close().catch((error) => {
				console.warn("Failed to close audio context:", error);
			});
			this.audioContext = null;
		}
	}
}

/**
 * Create a new toast sound manager instance
 */
export function createToastSoundManager(
	config: Partial<SoundConfig> = {},
): ToastSoundManager {
	return new ToastSoundManager(config);
}

/**
 * Test if toast sounds are supported in the current environment
 */
export function isToastSoundSupported(): boolean {
	return isWebAudioSupported() && !prefersReducedMotion();
}
