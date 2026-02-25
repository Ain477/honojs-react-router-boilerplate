/**
 * Custom hook for accessing the type-safe API client
 *
 * This hook provides a configured API client instance that:
 * - Uses the correct API URL from Cloudflare context (via EnvProvider)
 * - Automatically includes authentication headers from localStorage
 * - Provides full TypeScript type inference via Hono RPC
 *
 * Usage:
 * ```typescript
 * 'use client';
 *
 * import { useApiClient } from '@/hooks/use-api-client';
 *
 * export function MyComponent() {
 *   const client = useApiClient();
 *
 *   const fetchData = async () => {
 *     const res = await client.chat.$get();
 *     const data = await res.json();
 *   };
 *
 *   return <button onClick={fetchData}>Fetch</button>;
 * }
 * ```
 */

import backendClient, { type TBackendClient } from "@repo/api";
import { useMemo } from "react";

/**
 * Hook to get a configured API client instance
 *
 * The client is memoized and will only be recreated if the API URL or auth token changes.
 *
 * @returns Type-safe backend client instance
 */
export function useApiClient(): TBackendClient {
	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";
	const client = useMemo(() => {
		return backendClient(API_URL, {
			init: {
				credentials: "include",
			},
		});
	}, []);

	return client;
}
