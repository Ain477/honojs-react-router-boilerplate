import type { RoutersType } from "@modules";
import { hc } from "hono/client";

const clientInstance = hc<RoutersType>("");

export type TBackendClient = typeof clientInstance;

/**
 * Type-safe client factory function
 * Use this to create clients with full type inference
 *
 * @example
 * const client = backendClient('http://localhost:8787');
 * const response = await client.index.$get(); // Fully typed
 */
const backendClient = (...args: Parameters<typeof hc>): TBackendClient =>
	hc<RoutersType>(...args);

export default backendClient;
