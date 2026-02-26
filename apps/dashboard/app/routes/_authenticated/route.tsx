import { Outlet } from "react-router";
import { AuthGuard } from "./auth-guard";
import { AuthenticatedLayout } from "./layout/authenticated-layout";

export default function Layout() {
	return (
		<AuthGuard>
			<AuthenticatedLayout>
				<Outlet />
			</AuthenticatedLayout>
		</AuthGuard>
	);
}
