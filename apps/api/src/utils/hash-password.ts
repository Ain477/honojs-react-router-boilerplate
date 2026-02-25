/**
 * Secure password hashing utility using Web Crypto API
 * Implements a custom algorithm with salt generation and multiple rounds of hashing
 */

// Configuration constants for the hashing algorithm
const HASH_CONFIG = {
	SALT_LENGTH: 32, // 32 bytes = 256 bits
	ITERATIONS: 100_000, // Number of PBKDF2 iterations
	KEY_LENGTH: 64, // 64 bytes = 512 bits for the derived key
	HASH_ALGORITHM: "SHA-256" as const,
	PBKDF2_ALGORITHM: "PBKDF2" as const,
} as const;

/**
 * Converts an ArrayBuffer to a hexadecimal string
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
	const byteArray = new Uint8Array(buffer);
	return Array.from(byteArray)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

/**
 * Converts a hexadecimal string to an ArrayBuffer
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
	if (hex.length % 2 !== 0) {
		throw new Error("Invalid hex string length");
	}

	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16);
	}
	return bytes.buffer;
}

/**
 * Generates a cryptographically secure random salt
 */
function generateSalt(): ArrayBuffer {
	const salt = new Uint8Array(HASH_CONFIG.SALT_LENGTH);
	crypto.getRandomValues(salt);
	return salt.buffer;
}

/**
 * Derives a key from password and salt using PBKDF2
 */
async function deriveKey(
	password: string,
	salt: ArrayBuffer,
	iterations: number = HASH_CONFIG.ITERATIONS,
): Promise<ArrayBuffer> {
	// Convert password to ArrayBuffer
	const passwordBuffer = new TextEncoder().encode(password);

	// Import the password as a key for PBKDF2
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		passwordBuffer,
		{ name: HASH_CONFIG.PBKDF2_ALGORITHM },
		false,
		["deriveBits"],
	);

	// Derive the key using PBKDF2
	const derivedKey = await crypto.subtle.deriveBits(
		{
			name: HASH_CONFIG.PBKDF2_ALGORITHM,
			salt,
			iterations,
			hash: HASH_CONFIG.HASH_ALGORITHM,
		},
		keyMaterial,
		HASH_CONFIG.KEY_LENGTH * 8, // Convert bytes to bits
	);

	return derivedKey;
}

/**
 * Performs additional rounds of SHA-256 hashing for extra security
 */
async function performAdditionalHashing(
	data: ArrayBuffer,
	rounds = 5,
): Promise<ArrayBuffer> {
	let result = data;

	for (let i = 0; i < rounds; i++) {
		result = await crypto.subtle.digest(HASH_CONFIG.HASH_ALGORITHM, result);
	}

	return result;
}

/**
 * Hashes a password using a secure custom algorithm
 *
 * Algorithm steps:
 * 1. Generate a cryptographically secure random salt
 * 2. Use PBKDF2 with SHA-256 to derive a key from password + salt
 * 3. Perform additional rounds of SHA-256 hashing
 * 4. Combine salt and final hash for storage
 *
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password in format: salt:hash (both hex encoded)
 * @throws Error if password is empty or hashing fails
 */
export async function hashPassword(password: string): Promise<string> {
	if (!password || password.trim().length === 0) {
		throw new Error("Password cannot be empty");
	}

	try {
		// Step 1: Generate a random salt
		const salt = generateSalt();

		// Step 2: Derive key using PBKDF2
		const derivedKey = await deriveKey(password, salt);

		// Step 3: Perform additional hashing rounds
		const finalHash = await performAdditionalHashing(derivedKey);

		// Step 4: Convert to hex and combine salt:hash
		const saltHex = arrayBufferToHex(salt);
		const hashHex = arrayBufferToHex(finalHash);

		return `${saltHex}:${hashHex}`;
	} catch (error) {
		throw new Error(
			`Password hashing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Verifies a password against a stored hash
 *
 * @param password - The plain text password to verify
 * @param storedHash - The stored hash in format: salt:hash (both hex encoded)
 * @returns Promise<boolean> - True if password matches, false otherwise
 * @throws Error if inputs are invalid or verification fails
 */
export async function verifyPassword(
	password: string,
	storedHash: string,
): Promise<boolean> {
	if (!password || password.trim().length === 0) {
		throw new Error("Password cannot be empty");
	}

	if (!storedHash?.includes(":")) {
		throw new Error("Invalid stored hash format. Expected format: salt:hash");
	}

	try {
		// Parse the stored hash
		const [saltHex, expectedHashHex] = storedHash.split(":");

		if (!(saltHex && expectedHashHex)) {
			throw new Error("Invalid stored hash format");
		}

		// Convert salt from hex to ArrayBuffer
		const salt = hexToArrayBuffer(saltHex);

		// Derive key using the same algorithm
		const derivedKey = await deriveKey(password, salt);

		// Perform the same additional hashing
		const computedHash = await performAdditionalHashing(derivedKey);

		// Convert to hex for comparison
		const computedHashHex = arrayBufferToHex(computedHash);

		// Constant-time comparison to prevent timing attacks
		return constantTimeCompare(computedHashHex, expectedHashHex);
	} catch {
		// Don't throw on verification failure, just return false
		// This prevents information leakage about the stored hash format
		return false;
	}
}

/**
 * Performs constant-time string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}

	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}

	return result === 0;
}

/**
 * Utility function to get information about the hashing configuration
 * Useful for debugging or configuration validation
 */
export function getHashConfig() {
	return {
		saltLength: HASH_CONFIG.SALT_LENGTH,
		iterations: HASH_CONFIG.ITERATIONS,
		keyLength: HASH_CONFIG.KEY_LENGTH,
		hashAlgorithm: HASH_CONFIG.HASH_ALGORITHM,
		pbkdf2Algorithm: HASH_CONFIG.PBKDF2_ALGORITHM,
	};
}
