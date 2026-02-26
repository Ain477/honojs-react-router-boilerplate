import { useTranslation } from "react-i18next";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import { Toaster } from "sonner";
import { NavigationProgress } from "@/components/navigation-progress";

import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";

import type { Route } from "./+types/root";
import Providers from "./components/providers";
import "./app.css";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Manrope:wght@200..800&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	const { i18n } = useTranslation();

	const locale = i18n.language ?? "en";
	const dir = typeof i18n.dir === "function" ? i18n.dir() : "ltr";

	return (
		<html lang={locale} dir={dir} suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#fff" />
				<Meta />
				<Links />
			</head>
			<body>
				<Providers>
					<NavigationProgress />
					{children}
					<Toaster richColors closeButton />
				</Providers>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return <NotFoundError />;
		}
	}

	return <GeneralError />;
}
