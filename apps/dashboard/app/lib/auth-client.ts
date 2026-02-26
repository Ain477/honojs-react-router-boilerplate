import { passkeyClient } from "@better-auth/passkey/client";
import {
	adminClient,
	apiKeyClient,
	emailOTPClient,
	jwtClient,
	lastLoginMethodClient,
	magicLinkClient,
	oneTimeTokenClient,
	organizationClient,
	phoneNumberClient,
	twoFactorClient,
	usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: "http://api.localhost:1355",
	basePath: "/auth",
	plugins: [
		oneTimeTokenClient(),
		passkeyClient(),
		usernameClient(),
		twoFactorClient(),
		lastLoginMethodClient(),
		phoneNumberClient(),
		magicLinkClient(),
		emailOTPClient(),
		organizationClient(),
		apiKeyClient(),
		adminClient(),
		jwtClient(),
	],
	advanced: {
		cookiePrefix: "aihub",
		headers: {
			credentials: "include",
		},
	},
});
