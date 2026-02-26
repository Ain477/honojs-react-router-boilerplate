import { cn } from "@/utils/cn";

type MainProps = React.HTMLAttributes<HTMLElement> & {
	fixed?: boolean;
	fluid?: boolean;
	ref?: React.Ref<HTMLElement>;
};

export function Main({ fixed, className, fluid, ...props }: MainProps) {
	return (
		<main
			data-layout={fixed ? "fixed" : "auto"}
			className={cn(
				fixed
					? "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl px-4 py-6"
					: "flex grow flex-col p-4",
				"min-h-[calc(100svh-4rem)]",
				className,
			)}
			{...props}
		/>
	);
}
