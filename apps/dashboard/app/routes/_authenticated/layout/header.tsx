import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/utils/cn";

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
	fixed?: boolean;
	ref?: React.Ref<HTMLElement>;
};

export function Header({ className, fixed, children, ...props }: HeaderProps) {
	const [offset, setOffset] = useState(0);

	useEffect(() => {
		const onScroll = () => {
			setOffset(document.body.scrollTop || document.documentElement.scrollTop);
		};

		// Add scroll listener to the body
		document.addEventListener("scroll", onScroll, { passive: true });

		// Clean up the event listener on unmount
		return () => document.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={cn(
				"z-101 h-16 transition-[box-shadow,background-color,backdrop-filter]",
				fixed && "header-fixed peer/header sticky top-0 w-[inherit]",
				fixed && "bg-background/70 backdrop-blur-md",
				offset > 10 && fixed ? "shadow" : "shadow-none",
				className,
			)}
			{...props}
		>
			<div
				className={cn("relative flex h-full items-center gap-3 p-4 sm:gap-4")}
			>
				<SidebarTrigger variant="outline" className="max-md:scale-125" />
				<Separator orientation="vertical" className="h-6" />
				{children}
			</div>
		</header>
	);
}
