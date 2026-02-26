import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { Link as RouterLink, useNavigate } from "@/lib/router";

const Link = ({
	href,
	className,
	children,
}: {
	href: string;
	className?: string;
	children: ReactNode;
}) => {
	return (
		<RouterLink to={href} className={className}>
			{children}
		</RouterLink>
	);
};

export function Providers({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();

	return (
		<AuthUIProvider authClient={authClient} navigate={navigate} Link={Link}>
			{children}
		</AuthUIProvider>
	);
}
