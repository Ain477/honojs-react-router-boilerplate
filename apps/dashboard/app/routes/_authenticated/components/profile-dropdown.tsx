import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDialogState from "@/hooks/use-dialog-state";
import { Link } from "@/lib/router";
import { SignOutDialog } from "@/routes/_authenticated/layout/sign-out-dialog";

export function ProfileDropdown() {
	const [open, setOpen] = useDialogState();

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src="/avatars/01.png" alt="User" />
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col gap-1.5">
							<p className="text-sm leading-none font-medium">User</p>
							<p className="text-xs leading-none text-muted-foreground">
								user@example.com
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link to="/settings">
								Profile
								<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/settings/account">
								Billing
								<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/settings">
								Settings
								<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>New Team</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
						Sign out
						<DropdownMenuShortcut className="text-current">
							⇧⌘Q
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<SignOutDialog open={!!open} onOpenChange={setOpen} />
		</>
	);
}
