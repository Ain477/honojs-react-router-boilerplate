import { Spinner } from "@/components/ui/spinner";

export function LoadingPage() {
	return (
		<div className="flex h-dvh w-full items-center justify-center bg-background">
			<Spinner className="text-muted-foreground" />
		</div>
	);
}
