import { AuthView } from "@daveyplate/better-auth-ui";
import { useParams } from "react-router";
import { Logo } from "@/components/logo";
import { GuestGuard } from "./guest-guard";

export default function AuthPage() {
	const { pathname } = useParams();
	return (
		<GuestGuard>
			<div className="container grid h-svh max-w-none items-center justify-center">
				<div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-120 sm:p-8">
					<div className="mb-4 flex items-center justify-center">
						<Logo className="me-2" />
						<h1 className="text-xl font-medium">AI Hub - {pathname}</h1>
					</div>
					<main className="flex grow flex-col items-center justify-center gap-3">
						<AuthView pathname={pathname} />
					</main>
				</div>
			</div>
		</GuestGuard>
	);
}
