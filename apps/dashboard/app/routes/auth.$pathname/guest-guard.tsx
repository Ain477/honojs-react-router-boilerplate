import { Navigate, Outlet } from "react-router";
import { LoadingPage } from "@/components/ui/loading-page";
import { authClient } from "@/lib/auth-client";

export function GuestGuard({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <LoadingPage />;
	}

	if (session) {
		return <Navigate to="/" replace />;
	}

	return children || <Outlet />;
}
