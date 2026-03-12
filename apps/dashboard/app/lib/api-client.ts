import backendClient, { type TBackendClient } from "@repo/api";

function trimTrailingSlash(url: string): string {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

function normalizeBaseUrl(url: string | undefined): string {
	if (!url) {
		return "";
	}

	return trimTrailingSlash(url);
}

export function getApiBaseUrl(): string {
	return normalizeBaseUrl(import.meta.env.VITE_API_URL);
}

export const apiClient: TBackendClient = backendClient(getApiBaseUrl(), {
	init: {
		credentials: "include",
	},
});
