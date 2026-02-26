import { toast } from "sonner";

export function showSubmittedData(
	data: unknown,
	message = "You submitted the following values:",
) {
	toast.message(message, {
		description: (
			<pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
				<code className="text-white">{JSON.stringify(data, null, 2)}</code>
			</pre>
		),
	});
}
