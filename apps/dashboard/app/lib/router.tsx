import { useCallback } from "react";
import type {
	LinkProps,
	NavigateOptions,
	NavLinkProps,
	To,
} from "react-router";
import {
	Link as RouterLink,
	NavLink as RouterNavLink,
	useLocation as useRouterLocation,
	useNavigate as useRouterNavigate,
	useSearchParams as useRouterSearchParams,
} from "react-router";

const useLocation = useRouterLocation;
const useSearchParams = useRouterSearchParams;

export { useLocation, useSearchParams };

/**
 * Custom Link component with viewTransition enabled by default
 * This automatically applies smooth view transitions to all navigation
 */
export function Link(props: LinkProps) {
	return <RouterLink viewTransition {...props} />;
}

/**
 * Custom NavLink component with viewTransition enabled by default
 * This automatically applies smooth view transitions to all navigation
 */
export function NavLink(props: NavLinkProps) {
	return <RouterNavLink viewTransition {...props} />;
}

/**
 * Custom useNavigate hook that includes viewTransition by default
 * All programmatic navigation will automatically use view transitions
 */
export function useNavigate() {
	const navigate = useRouterNavigate();

	return useCallback(
		(to: To | number, options?: NavigateOptions) => {
			// For history navigation (back/forward), use as-is
			if (typeof to === "number") {
				return navigate(to);
			}

			// For route navigation, include viewTransition by default
			return navigate(to, {
				viewTransition: true,
				...options,
			});
		},
		[navigate],
	);
}
