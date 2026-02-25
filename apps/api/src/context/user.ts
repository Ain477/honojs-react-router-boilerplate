import { getContext } from "./index";

/**
 * Get the authenticated user's ID from context.
 * Throws an error if the user is not authenticated.
 */
export function getUserId(): string {
	const user = getContext().get("user");
	if (!user?.id) {
		throw new Error("User not authenticated");
	}
	return user.id;
}
