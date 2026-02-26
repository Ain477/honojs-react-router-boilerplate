import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { metaHelper } from "@/utils/meta";
import type { Route } from "./+types/500";

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
	minimal?: boolean;
};

export const meta: Route.MetaFunction = () => {
	return metaHelper({
		title: "Error 500",
		description: "Internal server error",
	});
};

export default function GeneralError({
	className,
	minimal = false,
}: GeneralErrorProps) {
	const navigate = useNavigate();
	return (
		<div className={cn("h-svh w-full", className)}>
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				{!minimal && (
					<h1 className="text-[7rem] leading-tight font-bold">500</h1>
				)}
				<span className="font-medium">Oops! Something went wrong {`:')`}</span>
				<p className="text-center text-muted-foreground">
					We apologize for the inconvenience. <br /> Please try again later.
				</p>
				{!minimal && (
					<div className="mt-6 flex gap-4">
						<Button variant="outline" onClick={() => navigate(-1)}>
							Go Back
						</Button>
						<Button onClick={() => navigate("/")}>Back to Home</Button>
					</div>
				)}
			</div>
		</div>
	);
}
