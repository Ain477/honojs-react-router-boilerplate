import { useAuthenticate } from "@daveyplate/better-auth-ui";
import { useEffect, useState } from "react";
import { Outlet, useMatches } from "react-router";
import { LoadingPage } from "@/components/ui/loading-page";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FontProvider } from "@/context/font-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { SearchProvider } from "@/context/search-provider";
import { authClient } from "@/lib/auth-client";
import { getCookie } from "@/lib/cookies";
import { cn } from "@/utils/cn";
import { ConfigDrawer } from "../components/config-drawer";
import { ProfileDropdown } from "../components/profile-dropdown";
import { ThemeSwitch } from "../components/theme-switch";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { Main } from "./main";
import { SkipToMain } from "./skip-to-main";

interface RouteHandle {
	header?: {
		customContent?: React.ReactNode;
		showDefault?: boolean;
		fixed?: boolean; // kept for types but will be overridden/ignored for now to enforce fixed
		mainFixed?: boolean;
	};
}

interface AuthenticatedLayoutProps {
	children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
	const { data: session, isPending } = authClient.useSession();
	useAuthenticate();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (isPending || !session) {
		return <LoadingPage />;
	}

	const defaultOpen = isMounted ? getCookie("sidebar_state") !== "false" : true;

	return (
		<FontProvider>
			<SearchProvider>
				<LayoutProvider>
					<SidebarProvider defaultOpen={defaultOpen}>
						<SkipToMain />
						<AppSidebar />
						<SidebarInset
							className={cn(
								// Set content container, so we can use container queries
								"@container/content",

								// Layout is always fixed now, set height to 100svh
								"h-svh",

								// If layout is fixed and sidebar is inset,
								// set the height to 100svh - spacing (total margins) to prevent overflow
								"peer-data-[variant=inset]:h-[calc(100svh-(var(--spacing)*4))]",
								"m-0!",
							)}
						>
							<LayoutHeader />
							<LayoutMain>{children ?? <Outlet />}</LayoutMain>
						</SidebarInset>
					</SidebarProvider>
				</LayoutProvider>
			</SearchProvider>
		</FontProvider>
	);
}

function useHeaderConfig() {
	const matches = useMatches();
	const activeHandle = matches.reduce(
		(acc, match) => {
			const handle = match.handle as RouteHandle;
			if (handle?.header) {
				Object.assign(acc, handle.header);
			}
			return acc;
		},
		{} as NonNullable<RouteHandle["header"]>,
	);

	return {
		customContent: activeHandle?.customContent ?? null,
		showDefault: activeHandle?.showDefault ?? true,
		fixed: true, // Always fixed
		mainFixed: activeHandle?.mainFixed ?? true,
	};
}

function LayoutMain({ children }: { children: React.ReactNode }) {
	const { mainFixed } = useHeaderConfig();

	return (
		<Main
			className="z-100"
			fixed={mainFixed}
			style={
				{
					viewTransitionName: "main-content",
				} as React.CSSProperties
			}
		>
			{children}
		</Main>
	);
}

function LayoutHeader() {
	const { fixed, customContent, showDefault } = useHeaderConfig();

	return (
		<Header fixed={fixed}>
			<div className="flex w-full items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					{customContent}
					<div id="header-dynamic-actions" />
				</div>

				{showDefault && (
					<div className="ms-auto flex items-center space-x-4">
						<ThemeSwitch />
						<ConfigDrawer />
						<ProfileDropdown />
					</div>
				)}
			</div>
		</Header>
	);
}
