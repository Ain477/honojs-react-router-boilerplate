import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import type { ReactNode } from "react";
import { DirectionProvider } from "@/context/direction-provider";
import { FontProvider } from "@/context/font-provider";
import { authClient } from "@/lib/auth-client";
import { Link as RouterLink, useNavigate } from "@/lib/router";
import { ThemeProvider } from "./theme-provider";

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

const Providers = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<AuthUIProvider authClient={authClient} navigate={navigate} Link={Link}>
				<DirectionProvider>
					<FontProvider>{children}</FontProvider>
				</DirectionProvider>
			</AuthUIProvider>
		</ThemeProvider>
	);
};

export default Providers;
