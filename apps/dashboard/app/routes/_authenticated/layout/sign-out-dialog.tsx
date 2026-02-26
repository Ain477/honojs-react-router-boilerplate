import { ConfirmDialog } from "@/components/confirm-dialog";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@/lib/router";

interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await authClient.signOut();
		// Redirect to sign in, potentially preserving current location
		navigate("/auth/sign-in", { replace: true });
	};

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Sign out"
			desc="Are you sure you want to sign out? You will need to sign in again to access your account."
			confirmText="Sign out"
			destructive
			handleConfirm={handleSignOut}
			className="sm:max-w-sm"
		/>
	);
}
